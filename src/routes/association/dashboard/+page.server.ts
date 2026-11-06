import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getDb } from '$lib/server/db';
import { memberProspects, memberSurveys, leads } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import { seedData } from '$lib/server/db/seed-data';

export interface CampaignProspect {
	id: string;
	companyName: string;
	contactName?: string | null;
	contactEmail: string;
	annualPremium?: number | null;
	lines?: string | null;
	lossRatio?: number | null;
	status: 'Invited' | 'InProgress' | 'Completed' | 'Certified' | string;
	createdAt: string;
}

// Sample fallback prospects for demo preview
const SAMPLE_CAMPAIGN_PROSPECTS: CampaignProspect[] = [
	{
		id: 'mp_01',
		companyName: 'Apex Industrial Services Ltd.',
		contactName: 'Robert Vance',
		contactEmail: 'rvance@apexindustrial.example.com',
		annualPremium: 420000,
		lines: 'Commercial Auto, General Liability',
		lossRatio: 38.5,
		status: 'Certified',
		createdAt: new Date(Date.now() - 3 * 86400000).toISOString()
	},
	{
		id: 'mp_02',
		companyName: 'Kootenay Mechanical Contractors Corp.',
		contactName: 'Sarah Jenkins',
		contactEmail: 'sjenkins@kootenaymech.example.com',
		annualPremium: 310000,
		lines: 'Commercial Property, General Liability',
		lossRatio: 42.0,
		status: 'Completed',
		createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
	},
	{
		id: 'mp_03',
		companyName: 'Cascade Foundation Systems Inc.',
		contactName: 'Donald Miller',
		contactEmail: 'dmiller@cascadefoundations.example.com',
		annualPremium: 580000,
		lines: 'Workers Comp / CGL, Fleet',
		lossRatio: 45.2,
		status: 'InProgress',
		createdAt: new Date(Date.now() - 1 * 86400000).toISOString()
	},
	{
		id: 'mp_04',
		companyName: 'West Coast Rigging & Crane Ltd.',
		contactName: 'Thomas Wright',
		contactEmail: 'twright@westcoastrigging.example.com',
		annualPremium: 650000,
		lines: 'Inland Marine, Auto Liability',
		lossRatio: 34.0,
		status: 'Invited',
		createdAt: new Date(Date.now() - 4 * 86400000).toISOString()
	}
];

export const load: PageServerLoad = async ({ url, locals, platform }) => {
	const token = url.searchParams.get('token');

	// If no token, require authenticated session
	if (!token) {
		if (!locals.user) {
			throw redirect(303, `/login?redirectTo=${encodeURIComponent(url.pathname)}`);
		}
		const allowed = ['AssociationAdministrator', 'Admin', 'CaptiveStackAdministrator'];
		if (!allowed.includes(locals.user.role)) {
			throw redirect(303, '/portal?error=unauthorized_association');
		}
	}

	let prospects: CampaignProspect[] = [];
	let associationName = 'Member Association';
	let isSample = false;

	if (platform?.env?.DB) {
		try {
			const db = getDb(platform.env.DB);

			if (token) {
				const dbProspects = await db.query.memberProspects.findMany({
					where: eq(memberProspects.surveyToken, token),
					orderBy: [desc(memberProspects.createdAt)]
				});

				if (dbProspects && dbProspects.length > 0) {
					prospects = dbProspects;
				} else {
					prospects = SAMPLE_CAMPAIGN_PROSPECTS;
					isSample = true;
				}
			} else {
				// Query all prospects for logged in association administrator
				const dbProspects = await db.query.memberProspects.findMany({
					limit: 50,
					orderBy: [desc(memberProspects.createdAt)]
				});
				prospects = dbProspects.length > 0 ? dbProspects : SAMPLE_CAMPAIGN_PROSPECTS;
				isSample = dbProspects.length === 0;
			}
		} catch (e) {
			console.error('[Association Dashboard Load Error]', e);
			prospects = SAMPLE_CAMPAIGN_PROSPECTS;
			isSample = true;
		}
	} else {
		prospects = SAMPLE_CAMPAIGN_PROSPECTS;
		isSample = true;
	}

	// Calculate Aggregate Metrics
	const totalInvited = prospects.length;
	const activeResponses = prospects.filter((p) => p.status === 'Completed' || p.status === 'Certified').length;
	const inProgressResponses = prospects.filter((p) => p.status === 'InProgress').length;

	const validPremiums = prospects.filter((p) => typeof p.annualPremium === 'number' && p.annualPremium > 0);
	const aggregatePremium = validPremiums.reduce((acc, p) => acc + (p.annualPremium || 0), 0);

	const validLossRatios = prospects.filter((p) => typeof p.lossRatio === 'number' && p.lossRatio > 0);
	const weightedAvgLossRatio = validLossRatios.length > 0
		? Math.round(validLossRatios.reduce((acc, p) => acc + (p.lossRatio || 0), 0) / validLossRatios.length)
		: 40;

	// Illustrative estimated retained surplus (30% to 45% of underwriting premium at 40% loss ratio)
	const estimatedMinSurplus = Math.round(aggregatePremium * 0.25 * 5);
	const estimatedMaxSurplus = Math.round(aggregatePremium * 0.45 * 5);

	// Potential non-dues revenue (1% to 2.5% program management fee)
	const potentialNonDuesRevenueMin = Math.round(aggregatePremium * 0.015);
	const potentialNonDuesRevenueMax = Math.round(aggregatePremium * 0.025);

	const activeToken = token || 'eagle1_holeinone_token';

	return {
		token: activeToken,
		associationName,
		isSample,
		metrics: {
			totalInvited,
			activeResponses,
			inProgressResponses,
			aggregatePremium,
			weightedAvgLossRatio,
			estimatedMinSurplus,
			estimatedMaxSurplus,
			potentialNonDuesRevenueMin,
			potentialNonDuesRevenueMax
		},
		prospects
	};
};
