import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getDb } from '$lib/server/db';
import { seedData } from '$lib/server/db/seed-data';
import { canAccessPortal } from '$lib/server/auth/rbac';
import { isDemoMode } from '$lib/server/auth/demo';
import { redactSurveyToken } from '$lib/server/survey/token';

export const load: PageServerLoad = async ({ locals, platform, url }) => {
	if (!locals.user || !canAccessPortal(locals.user.role)) {
		throw redirect(303, `/login?redirectTo=${encodeURIComponent(url.pathname)}`);
	}

	const demoMode = isDemoMode(platform?.env);

	const role = locals.user.role;
	const error = url.searchParams.get('error');
	const required = url.searchParams.get('required');

	let projects: any[] = [];
	let surveys: any[] = [];
	let reserves: any[] = [];
	let auditLogs: any[] = [];

	if (platform?.env?.DB) {
		const db = getDb(platform.env.DB);
		const [pList, sList, rList, aList] = await Promise.all([
			db.query.projects.findMany({
				with: {
					association: true,
					capitalReserves: true,
					memberSurveys: true
				}
			}),
			db.query.memberSurveys.findMany({
				with: {
					project: true,
					member: true
				}
			}),
			db.query.capitalReserves.findMany({
				with: {
					project: true
				}
			}),
			db.query.auditLogs.findMany({
				limit: 10
			})
		]);

		projects = pList.map((project) => ({
			...project,
			memberSurveys: (project.memberSurveys ?? []).map((survey) => redactSurveyToken(survey, demoMode))
		}));
		surveys = sList.map((survey) => redactSurveyToken(survey, demoMode));
		reserves = rList;
		auditLogs = aList;
	} else {
		// Dev fallback
		projects = seedData.projects.map((p) => ({
			...p,
			association: seedData.associations.find((a) => a.id === p.associationId),
			capitalReserves: seedData.capitalReserves.filter((r) => r.projectId === p.id),
			memberSurveys: seedData.memberSurveys
				.filter((s) => s.projectId === p.id)
				.map((survey) => redactSurveyToken(survey, demoMode))
		}));
		surveys = seedData.memberSurveys.map((s) =>
			redactSurveyToken(
				{
					...s,
					payload: JSON.parse(s.payload),
					project: seedData.projects.find((p) => p.id === s.projectId),
					member: seedData.users.find((u) => u.id === s.memberId)
				},
				demoMode
			)
		);
		reserves = seedData.capitalReserves;
		auditLogs = seedData.auditLogs.map((a) => ({
			...a,
			details: JSON.parse(a.details)
		}));
	}

	return {
		user: locals.user,
		role,
		error,
		required,
		projects,
		surveys,
		reserves,
		auditLogs
	};
};
