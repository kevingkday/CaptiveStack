import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { getDb } from '$lib/server/db';
import { leads, funnelEvents, auditLogs } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';

export interface AdminLeadItem {
	id: string;
	leadType: 'association' | 'business' | string;
	name: string;
	email: string;
	phone?: string | null;
	companyName?: string | null;
	associationName: string;
	memberCount: number;
	size?: number | null;
	lineOfCoverage: string;
	annualPremiumSize: string;
	industry?: string | null;
	lossHistory?: string | null;
	renewalDate?: string | null;
	region?: string | null;
	sourceUtm?: string | null;
	score: number;
	stage: string;
	secondOpinionRequested: boolean;
	currentCarrier?: string | null;
	notes?: string | null;
	status: string;
	createdAt: string;
	updatedAt: string;
	daysUntilRenewal?: number | null;
}

// Sample fallback leads for development / demo preview when database has zero leads
const SAMPLE_ADMIN_LEADS: AdminLeadItem[] = [
	{
		id: 'lead_sample_01',
		leadType: 'association',
		name: 'Marcus Vance',
		email: 'm.vance@bccontractors-assoc.org',
		phone: '(604) 555-0192',
		companyName: 'BC Heavy Construction Association',
		associationName: 'BC Heavy Construction Association',
		memberCount: 140,
		size: 140,
		lineOfCoverage: 'General Liability, Commercial Auto / Fleet, Excess Liability',
		annualPremiumSize: '$10M - $25M',
		industry: 'contractors',
		lossHistory: 'Good',
		renewalDate: new Date(Date.now() + 18 * 86400000).toISOString().slice(0, 10), // in 18 days
		region: 'British Columbia, Canada',
		sourceUtm: JSON.stringify({ utm_source: 'google', utm_campaign: 'construction_captive_2026' }),
		score: 92,
		stage: 'ReportGated',
		secondOpinionRequested: false,
		currentCarrier: 'Intact / Aviva Consortium',
		notes: 'Association board eager to review feasibility. Current commercial broker delivered 24% rate increase on fleet.',
		status: 'New',
		createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
		updatedAt: new Date(Date.now() - 1 * 86400000).toISOString()
	},
	{
		id: 'lead_sample_02',
		leadType: 'business',
		name: 'Elena Rostova',
		email: 'erostova@pacificlogisticsfreight.com',
		phone: '(206) 555-8321',
		companyName: 'Pacific Cross-Border Freight Ltd.',
		associationName: 'Western Trucking Alliance',
		memberCount: 0,
		size: 65,
		lineOfCoverage: 'Commercial Auto / Fleet, Cargo & Inland Marine',
		annualPremiumSize: '$2.5M - $5M',
		industry: 'transportation',
		lossHistory: 'Good',
		renewalDate: new Date(Date.now() + 38 * 86400000).toISOString().slice(0, 10), // in 38 days
		region: 'Washington / BC Corridor',
		sourceUtm: JSON.stringify({ utm_source: 'linkedin', utm_campaign: 'trucking_savings' }),
		score: 84,
		stage: 'SecondOpinionRequested',
		secondOpinionRequested: true,
		currentCarrier: 'Northbridge / Travelers',
		notes: 'Requested immediate second opinion from Ocean Falls Insurance. Facing non-renewal on primary auto liability tier.',
		status: 'New',
		createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
		updatedAt: new Date(Date.now() - 2 * 86400000).toISOString()
	},
	{
		id: 'lead_sample_03',
		leadType: 'association',
		name: 'Dr. Arthur Pendelton',
		email: 'president@cadentalexecutives.org',
		phone: '(415) 555-7744',
		companyName: 'Pacific Dental Group Network',
		associationName: 'Pacific Dental Practitioners Alliance',
		memberCount: 85,
		size: 85,
		lineOfCoverage: 'Professional Liability (E&O / Malpractice), Cyber & Regulatory Defense',
		annualPremiumSize: '$5M - $10M',
		industry: 'healthcare',
		lossHistory: 'Good',
		renewalDate: new Date(Date.now() + 75 * 86400000).toISOString().slice(0, 10), // in 75 days
		region: 'California, USA',
		sourceUtm: JSON.stringify({ utm_source: 'direct', referrer: 'canadiancaptive.com' }),
		score: 88,
		stage: 'ReportGated',
		secondOpinionRequested: false,
		currentCarrier: 'MedPro / CNA',
		notes: 'Seeking member benefit non-dues revenue. 85 clinics in group.',
		status: 'Contacted',
		createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
		updatedAt: new Date(Date.now() - 4 * 86400000).toISOString()
	},
	{
		id: 'lead_sample_04',
		leadType: 'business',
		name: 'David Zhao',
		email: 'dzhao@apexcloudnetworks.io',
		phone: '(403) 555-9102',
		companyName: 'Apex Cloud & Managed Services Inc.',
		associationName: 'Canadian IT Providers Guild',
		memberCount: 0,
		size: 40,
		lineOfCoverage: 'Technology E&O / Cyber Risk, Directors & Officers',
		annualPremiumSize: '$500k - $1M',
		industry: 'it-services',
		lossHistory: 'Good',
		renewalDate: new Date(Date.now() + 22 * 86400000).toISOString().slice(0, 10), // in 22 days
		region: 'Alberta, Canada',
		sourceUtm: JSON.stringify({ utm_source: 'google', utm_medium: 'cpc', utm_campaign: 'cyber_msp' }),
		score: 74,
		stage: 'SecondOpinionRequested',
		secondOpinionRequested: true,
		currentCarrier: 'Chubb',
		notes: 'Cyber premium tripled at last renewal. Requesting Ocean Falls Insurance market benchmarking.',
		status: 'New',
		createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
		updatedAt: new Date(Date.now() - 1 * 86400000).toISOString()
	},
	{
		id: 'lead_sample_05',
		leadType: 'association',
		name: 'Julianne Hall',
		email: 'jhall@innkeepersguild.org',
		phone: '(802) 555-3319',
		companyName: 'New England Boutique Hospitality Association',
		associationName: 'New England Boutique Hospitality Association',
		memberCount: 110,
		size: 110,
		lineOfCoverage: 'Commercial Property & Business Interruption, General Liability',
		annualPremiumSize: '$10M - $25M',
		industry: 'hospitality',
		lossHistory: 'Average',
		renewalDate: new Date(Date.now() + 110 * 86400000).toISOString().slice(0, 10), // in 110 days
		region: 'Vermont / New England',
		sourceUtm: JSON.stringify({ utm_source: 'organic', utm_campaign: 'vermont_domicile' }),
		score: 81,
		stage: 'ScoreGenerated',
		secondOpinionRequested: false,
		currentCarrier: 'Liberty Mutual',
		notes: 'Exploring Vermont association captive domicile options.',
		status: 'New',
		createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
		updatedAt: new Date(Date.now() - 6 * 86400000).toISOString()
	},
	{
		id: 'lead_sample_06',
		leadType: 'business',
		name: 'Gregory Scott',
		email: 'gscott@highlandproperties.ca',
		phone: '(604) 555-4488',
		companyName: 'Highland Property Management Corp.',
		associationName: 'None / Seeking Group',
		memberCount: 0,
		size: 25,
		lineOfCoverage: 'Commercial Property, General Liability, Environmental / Pollution',
		annualPremiumSize: '$1M - $2.5M',
		industry: 'property-managers',
		lossHistory: 'High',
		renewalDate: new Date(Date.now() + 55 * 86400000).toISOString().slice(0, 10), // in 55 days
		region: 'British Columbia, Canada',
		sourceUtm: JSON.stringify({ utm_source: 'direct' }),
		score: 58,
		stage: 'Partial',
		secondOpinionRequested: false,
		currentCarrier: 'Wawanesa',
		notes: 'Water damage loss history causing broker grief. Wants to join forming real estate group.',
		status: 'New',
		createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
		updatedAt: new Date(Date.now() - 7 * 86400000).toISOString()
	}
];

function computeDaysUntilRenewal(dateStr?: string | null): number | null {
	if (!dateStr) return null;
	const parsed = new Date(dateStr);
	if (isNaN(parsed.getTime())) return null;
	const diff = Math.round((parsed.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
	return diff;
}

export const load: PageServerLoad = async ({ locals, platform, url }) => {
	// Guard: Admin & CaptiveStackAdministrator only
	if (!locals.user) {
		throw redirect(303, `/login?redirectTo=${encodeURIComponent(url.pathname)}`);
	}

	const allowedRoles = ['Admin', 'CaptiveStackAdministrator'];
	if (!allowedRoles.includes(locals.user.role)) {
		throw redirect(303, '/portal?error=unauthorized_admin');
	}

	let leadList: AdminLeadItem[] = [];
	let funnelAnalytics: any[] = [];
	let isUsingSampleFallback = false;

	if (platform?.env?.DB) {
		try {
			const db = getDb(platform.env.DB);
			const rawLeads = await db.query.leads.findMany({
				orderBy: [desc(leads.createdAt)]
			});

			if (rawLeads && rawLeads.length > 0) {
				leadList = rawLeads.map((l) => ({
					...l,
					score: l.score ?? 0,
					daysUntilRenewal: computeDaysUntilRenewal(l.renewalDate)
				}));
			} else {
				// If database table is empty, show sample leads with explicit indication
				leadList = SAMPLE_ADMIN_LEADS.map((l) => ({
					...l,
					daysUntilRenewal: computeDaysUntilRenewal(l.renewalDate)
				}));
				isUsingSampleFallback = true;
			}

			const rawEvents = await db.query.funnelEvents.findMany({
				orderBy: [desc(funnelEvents.createdAt)],
				limit: 300
			});
			funnelAnalytics = rawEvents;
		} catch (err) {
			console.error('[Admin Leads DB Query Error]', err);
			leadList = SAMPLE_ADMIN_LEADS.map((l) => ({
				...l,
				daysUntilRenewal: computeDaysUntilRenewal(l.renewalDate)
			}));
			isUsingSampleFallback = true;
		}
	} else {
		leadList = SAMPLE_ADMIN_LEADS.map((l) => ({
			...l,
			daysUntilRenewal: computeDaysUntilRenewal(l.renewalDate)
		}));
		isUsingSampleFallback = true;
	}

	// Compute Key Summary Metrics
	const totalLeads = leadList.length;
	const associationLeads = leadList.filter((l) => l.leadType === 'association').length;
	const businessLeads = leadList.filter((l) => l.leadType === 'business').length;
	const secondOpinions = leadList.filter((l) => l.secondOpinionRequested).length;

	// Renewal windows (&le; 30d, 60d, 90d, 120d)
	const renewals30 = leadList.filter(
		(l) => typeof l.daysUntilRenewal === 'number' && l.daysUntilRenewal >= 0 && l.daysUntilRenewal <= 30
	).length;
	const renewals60 = leadList.filter(
		(l) => typeof l.daysUntilRenewal === 'number' && l.daysUntilRenewal >= 0 && l.daysUntilRenewal <= 60
	).length;
	const renewals90 = leadList.filter(
		(l) => typeof l.daysUntilRenewal === 'number' && l.daysUntilRenewal >= 0 && l.daysUntilRenewal <= 90
	).length;
	const renewals120 = leadList.filter(
		(l) => typeof l.daysUntilRenewal === 'number' && l.daysUntilRenewal >= 0 && l.daysUntilRenewal <= 120
	).length;

	const avgScore = totalLeads > 0
		? Math.round(leadList.reduce((acc, l) => acc + (l.score || 0), 0) / totalLeads)
		: 0;

	// Compute Funnel Stage Breakdown
	const stageCounts = {
		QuizStarted: leadList.filter((l) => l.stage === 'QuizStarted').length,
		Partial: leadList.filter((l) => l.stage === 'Partial').length,
		ScoreGenerated: leadList.filter((l) => l.stage === 'ScoreGenerated').length,
		ReportGated: leadList.filter((l) => l.stage === 'ReportGated').length,
		SecondOpinionRequested: leadList.filter((l) => l.stage === 'SecondOpinionRequested').length,
		ReviewBooked: leadList.filter((l) => l.stage === 'ReviewBooked').length
	};

	return {
		leads: leadList,
		isUsingSampleFallback,
		metrics: {
			totalLeads,
			associationLeads,
			businessLeads,
			secondOpinions,
			renewals30,
			renewals60,
			renewals90,
			renewals120,
			avgScore,
			stageCounts
		},
		funnelAnalyticsCount: funnelAnalytics.length
	};
};

export const actions: Actions = {
	updateStatus: async ({ request, platform, locals }) => {
		if (!locals.user || !['Admin', 'CaptiveStackAdministrator'].includes(locals.user.role)) {
			return fail(403, { error: 'Unauthorized' });
		}

		const formData = await request.formData();
		const leadId = formData.get('leadId')?.toString();
		const newStatus = formData.get('status')?.toString();

		if (!leadId || !newStatus) {
			return fail(400, { error: 'Missing required parameters' });
		}

		if (platform?.env?.DB) {
			try {
				const db = getDb(platform.env.DB);
				await db.update(leads).set({
					status: newStatus,
					updatedAt: new Date().toISOString()
				}).where(eq(leads.id, leadId));

				await db.insert(auditLogs).values({
					id: crypto.randomUUID(),
					userId: locals.user.id,
					action: 'LEAD_STATUS_UPDATED',
					targetEntity: 'Lead',
					details: JSON.stringify({ leadId, newStatus }),
					timestamp: new Date().toISOString()
				});

				return { success: true };
			} catch (err: any) {
				return fail(500, { error: err.message || 'Database update failed' });
			}
		}

		return { success: true, message: 'Updated in-memory / simulated' };
	}
};
