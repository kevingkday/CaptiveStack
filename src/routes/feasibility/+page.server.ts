import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { getDb } from '$lib/server/db';
import { feasibilityAssessments, auditLogs } from '$lib/server/db/schema';
import { seedData } from '$lib/server/db/seed-data';

export const load: PageServerLoad = async ({ platform, locals }) => {
	let assessments: any[] = [];
	let projects: any[] = [];

	if (platform?.env?.DB) {
		const db = getDb(platform.env.DB);
		const [aList, pList] = await Promise.all([
			db.query.feasibilityAssessments.findMany({
				orderBy: (table, { desc }) => [desc(table.createdAt)]
			}),
			db.query.projects.findMany({
				with: {
					association: true,
					capitalReserves: true
				}
			})
		]);
		assessments = aList;
		projects = pList;
	} else {
		assessments = seedData.feasibilityAssessments;
		projects = seedData.projects.map((p) => ({
			...p,
			association: seedData.associations.find((a) => a.id === p.associationId),
			capitalReserves: seedData.capitalReserves.filter((r) => r.projectId === p.id)
		}));
	}

	return {
		user: locals.user,
		assessments,
		projects
	};
};

export const actions: Actions = {
	submitAssessment: async ({ request, platform, locals }) => {
		const formData = await request.formData();
		const organizationType = (formData.get('organizationType') as string)?.trim() || 'Trade Association';
		const email = (formData.get('email') as string)?.trim() || (locals.user?.email ?? 'intake@captivestack.ai');
		const primaryConcern = (formData.get('primaryConcern') as string)?.trim() || 'Replacing Commercial Bank LOC';
		const annualPremium = parseFloat(formData.get('annualPremium') as string) || 1200000;
		const fiveYearLosses = parseFloat(formData.get('fiveYearLosses') as string) || 2000000;
		const memberCount = parseInt(formData.get('memberCount') as string, 10) || 25;
		const riskCategory = (formData.get('riskCategory') as string) || 'PrizeIndemnity';

		// 5-Year Loss Ratio = 5-year losses / (annual premium * 5)
		const total5YearPremium = annualPremium * 5;
		const lossRatio = Math.max(0.01, Math.min(2.0, fiveYearLosses / total5YearPremium));

		// Algorithmic Fit Score (0 - 100)
		let score = 0;

		// 1. Premium Volume Scale (max 30 pts)
		if (annualPremium >= 3000000) score += 30;
		else if (annualPremium >= 1500000) score += 25;
		else if (annualPremium >= 750000) score += 20;
		else if (annualPremium >= 400000) score += 14;
		else score += 8;

		// 2. Loss Ratio Stability (max 35 pts)
		if (lossRatio <= 0.35) score += 35;
		else if (lossRatio <= 0.50) score += 30;
		else if (lossRatio <= 0.65) score += 22;
		else if (lossRatio <= 0.80) score += 12;
		else score += 4;

		// 3. Member Density (max 20 pts)
		if (memberCount >= 40) score += 20;
		else if (memberCount >= 20) score += 16;
		else if (memberCount >= 10) score += 12;
		else score += 7;

		// 4. Risk Predictability & Homogeneity (max 15 pts)
		if (riskCategory === 'PrizeIndemnity' || riskCategory === 'GlassReplacement') score += 15;
		else if (riskCategory === 'TradeContractor') score += 12;
		else score += 9;

		const fitScore = Math.min(100, Math.max(10, score));
		const status = fitScore >= 75 ? 'Approved' : fitScore >= 60 ? 'Submitted' : 'UnderReview';

		const newAssessmentId = crypto.randomUUID();

		if (platform?.env?.DB) {
			const db = getDb(platform.env.DB);
			await db.insert(feasibilityAssessments).values({
				id: newAssessmentId,
				email,
				organizationType,
				primaryConcern,
				annualPremium,
				fiveYearLosses,
				lossRatio,
				fitScore,
				status,
				createdAt: new Date().toISOString()
			});

			await db.insert(auditLogs).values({
				id: crypto.randomUUID(),
				userId: locals.user?.id ?? null,
				action: 'FEASIBILITY_EVALUATION_COMPLETED',
				targetEntity: `FeasibilityAssessment:${newAssessmentId}`,
				details: JSON.stringify({
					organizationType,
					annualPremium,
					fiveYearLosses,
					lossRatio: (lossRatio * 100).toFixed(1) + '%',
					fitScore,
					status
				}),
				timestamp: new Date().toISOString()
			});
		}

		return {
			success: true,
			assessment: {
				id: newAssessmentId,
				organizationType,
				email,
				primaryConcern,
				annualPremium,
				fiveYearLosses,
				lossRatio,
				fitScore,
				status,
				createdAt: new Date().toISOString()
			}
		};
	}
};
