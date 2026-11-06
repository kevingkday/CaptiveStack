import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDb } from '$lib/server/db';
import { leads, funnelEvents, auditLogs } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { calculateReadinessScore } from '$lib/readiness/scoring';
import { notifyLeadToKevin } from '$lib/server/notifications/lead';

export const POST: RequestHandler = async ({ request, platform, cookies, getClientAddress }) => {
	let body: any = {};
	try {
		body = await request.json();
	} catch (e) {
		return json({ error: 'Invalid JSON request' }, { status: 400 });
	}

	let leadId = body.leadId || cookies.get('cs_lead_id') || crypto.randomUUID();
	cookies.set('cs_lead_id', leadId, {
		path: '/',
		httpOnly: true,
		secure: true,
		sameSite: 'lax',
		maxAge: 60 * 60 * 24 * 30 // 30 days
	});

	const sessionId = cookies.get('cs_session_id') || crypto.randomUUID();
	cookies.set('cs_session_id', sessionId, {
		path: '/',
		httpOnly: true,
		secure: true,
		sameSite: 'lax',
		maxAge: 60 * 60 * 24 * 30
	});

	const step = typeof body.step === 'number' ? body.step : 1;
	const timestamp = new Date().toISOString();

	// Calculate score if enough parameters present
	const scoreResult = calculateReadinessScore({
		role: body.role,
		industry: body.industry,
		size: typeof body.size === 'number' ? body.size : undefined,
		annualPremiumBand: body.annualPremiumBand,
		linesOfCoverage: Array.isArray(body.linesOfCoverage) ? body.linesOfCoverage : [],
		lossHistory: body.lossHistory,
		renewalDate: body.renewalDate,
		region: body.region
	});

	if (platform?.env?.DB) {
		const db = getDb(platform.env.DB);

		// Ensure schema tables exist on edge D1
		try {
			await platform.env.DB.prepare(`
				CREATE TABLE IF NOT EXISTS leads (
					id TEXT PRIMARY KEY,
					lead_type TEXT NOT NULL DEFAULT 'association',
					name TEXT NOT NULL DEFAULT '',
					email TEXT NOT NULL DEFAULT '',
					phone TEXT,
					company_name TEXT,
					association_name TEXT NOT NULL DEFAULT '',
					member_count INTEGER NOT NULL DEFAULT 0,
					size INTEGER DEFAULT 0,
					line_of_coverage TEXT NOT NULL DEFAULT '',
					annual_premium_size TEXT NOT NULL DEFAULT '',
					industry TEXT,
					loss_history TEXT,
					renewal_date TEXT,
					region TEXT,
					source_utm TEXT,
					score INTEGER DEFAULT 0,
					stage TEXT NOT NULL DEFAULT 'QuizStarted',
					second_opinion_requested INTEGER NOT NULL DEFAULT 0,
					current_carrier TEXT,
					notes TEXT,
					status TEXT NOT NULL DEFAULT 'New',
					created_at TEXT NOT NULL,
					updated_at TEXT NOT NULL
				);
			`).run();

			await platform.env.DB.prepare(`
				CREATE TABLE IF NOT EXISTS funnel_events (
					id TEXT PRIMARY KEY,
					lead_id TEXT,
					session_id TEXT NOT NULL,
					event_name TEXT NOT NULL,
					step_number INTEGER,
					metadata TEXT,
					created_at TEXT NOT NULL
				);
			`).run();

			await platform.env.DB.prepare(`
				CREATE TABLE IF NOT EXISTS member_prospects (
					id TEXT PRIMARY KEY,
					association_lead_id TEXT,
					survey_token TEXT UNIQUE,
					company_name TEXT NOT NULL,
					contact_name TEXT,
					contact_email TEXT NOT NULL,
					annual_premium REAL,
					lines TEXT,
					loss_ratio REAL,
					status TEXT NOT NULL DEFAULT 'Invited',
					created_at TEXT NOT NULL
				);
			`).run();
		} catch (dbInitErr) {
			console.error('[D1 Funnel Tables Init Error]', dbInitErr);
		}

		// Check if lead already exists
		try {
			const existing = await db.query.leads.findFirst({
				where: eq(leads.id, leadId)
			});

			const stage = body.isGatedSubmit
				? 'ReportGated'
				: body.secondOpinionRequested
					? 'SecondOpinionRequested'
					: step >= 8
						? 'ScoreGenerated'
						: 'Partial';

			const leadData: any = {
				updatedAt: timestamp,
				score: scoreResult.score,
				stage
			};

			if (body.role) leadData.leadType = body.role;
			if (body.name) leadData.name = body.name.trim();
			if (body.email) leadData.email = body.email.trim();
			if (body.phone) leadData.phone = body.phone.trim();
			if (body.companyName) leadData.companyName = body.companyName.trim();
			if (body.associationName) leadData.associationName = body.associationName.trim();
			if (typeof body.size === 'number') {
				leadData.size = body.size;
				leadData.memberCount = body.role === 'association' ? body.size : 0;
			}
			if (body.annualPremiumBand) leadData.annualPremiumSize = body.annualPremiumBand;
			if (Array.isArray(body.linesOfCoverage)) {
				leadData.lineOfCoverage = body.linesOfCoverage.join(', ');
			}
			if (body.industry) leadData.industry = body.industry;
			if (body.lossHistory) leadData.lossHistory = body.lossHistory;
			if (body.renewalDate) leadData.renewalDate = body.renewalDate;
			if (body.region) leadData.region = body.region;
			if (body.sourceUtm) {
				leadData.sourceUtm = typeof body.sourceUtm === 'string' ? body.sourceUtm : JSON.stringify(body.sourceUtm);
			}
			if (body.secondOpinionRequested !== undefined) {
				leadData.secondOpinionRequested = Boolean(body.secondOpinionRequested);
			}
			if (body.currentCarrier) leadData.currentCarrier = body.currentCarrier.trim();
			if (body.notes) leadData.notes = body.notes.trim();

			if (existing) {
				await db.update(leads).set(leadData).where(eq(leads.id, leadId));
			} else {
				await db.insert(leads).values({
					id: leadId,
					leadType: body.role || 'association',
					name: body.name?.trim() || '',
					email: body.email?.trim() || '',
					phone: body.phone?.trim() || null,
					companyName: body.companyName?.trim() || null,
					associationName: body.associationName?.trim() || '',
					memberCount: body.role === 'association' ? (body.size || 0) : 0,
					size: body.size || 0,
					lineOfCoverage: Array.isArray(body.linesOfCoverage) ? body.linesOfCoverage.join(', ') : '',
					annualPremiumSize: body.annualPremiumBand || '',
					industry: body.industry || null,
					lossHistory: body.lossHistory || null,
					renewalDate: body.renewalDate || null,
					region: body.region || null,
					sourceUtm: body.sourceUtm ? JSON.stringify(body.sourceUtm) : null,
					score: scoreResult.score,
					stage: leadData.stage,
					secondOpinionRequested: Boolean(body.secondOpinionRequested),
					currentCarrier: body.currentCarrier?.trim() || null,
					notes: body.notes?.trim() || null,
					status: 'New',
					createdAt: timestamp,
					updatedAt: timestamp
				});
			}

			// Record funnel analytics event
			const eventName = body.isGatedSubmit
				? 'report_unlocked'
				: body.secondOpinionRequested
					? 'second_opinion_requested'
					: step === 1
						? 'funnel_start'
						: step >= 8
							? 'score_calculated'
							: 'step_completed';

			await db.insert(funnelEvents).values({
				id: crypto.randomUUID(),
				leadId,
				sessionId,
				eventName,
				stepNumber: step,
				metadata: JSON.stringify({
					role: body.role,
					industry: body.industry,
					score: scoreResult.score,
					tier: scoreResult.tier,
					stage
				}),
				createdAt: timestamp
			});

			// If full contact details were just submitted or second opinion requested, notify Kevin
			if (body.isGatedSubmit || body.secondOpinionRequested) {
				await notifyLeadToKevin(
					{
						id: leadId,
						name: body.name || 'Anonymous Lead',
						associationName: body.associationName || body.companyName || 'Unspecified Org',
						memberCount: body.size || 0,
						lineOfCoverage: Array.isArray(body.linesOfCoverage) ? body.linesOfCoverage.join(', ') : 'Commercial Lines',
						annualPremiumSize: body.annualPremiumBand || 'Illustrative',
						email: body.email || 'pending@captivestack.com',
						phone: body.phone,
						notes: `[Funnel Lead: ${body.role || 'association'}] Industry: ${body.industry || 'N/A'}, Renewal: ${body.renewalDate || 'N/A'}, Score: ${scoreResult.score}/100. ${body.notes ? 'Notes: ' + body.notes : ''}`
					},
					platform?.env as any
				);
			}
		} catch (err) {
			console.error('[Save Lead Step Error]', err);
		}
	}

	return json({
		success: true,
		leadId,
		scoreResult
	});
};
