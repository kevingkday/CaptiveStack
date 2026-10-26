import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { getDb } from '$lib/server/db';
import { projects, auditLogs, documentRecords } from '$lib/server/db/schema';
import { seedData } from '$lib/server/db/seed-data';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ platform, locals }) => {
	if (!locals.user) {
		throw redirect(303, '/login?redirectTo=/review');
	}

	let projectList: any[] = [];
	let surveyList: any[] = [];
	let docList: any[] = [];
	let logs: any[] = [];

	if (platform?.env?.DB) {
		const db = getDb(platform.env.DB);
		const [p, s, d, a] = await Promise.all([
			db.query.projects.findMany({
				with: {
					association: true,
					capitalReserves: true,
					memberSurveys: {
						with: {
							member: true
						}
					}
				}
			}),
			db.query.memberSurveys.findMany({
				with: {
					member: true,
					project: true
				}
			}),
			db.query.documentRecords.findMany({
				limit: 20,
				orderBy: (table, { desc }) => [desc(table.createdAt)]
			}),
			db.query.auditLogs.findMany({
				limit: 15,
				orderBy: (table, { desc }) => [desc(table.timestamp)]
			})
		]);
		projectList = p;
		surveyList = s;
		docList = d;
		logs = a;
	} else {
		projectList = seedData.projects.map((p) => ({
			...p,
			association: seedData.associations.find((a) => a.id === p.associationId),
			capitalReserves: seedData.capitalReserves.filter((r) => r.projectId === p.id),
			memberSurveys: seedData.memberSurveys.filter((s) => s.projectId === p.id)
		}));
		surveyList = seedData.memberSurveys.map((s) => ({
			...s,
			payload: JSON.parse(s.payload),
			project: seedData.projects.find((p) => p.id === s.projectId),
			member: seedData.users.find((u) => u.id === s.memberId)
		}));
		docList = seedData.documentRecords;
		logs = seedData.auditLogs.map((a) => ({
			...a,
			details: JSON.parse(a.details)
		}));
	}

	return {
		user: locals.user,
		projects: projectList,
		surveys: surveyList,
		documents: docList,
		auditLogs: logs
	};
};

export const actions: Actions = {
	certifyStudy: async ({ request, platform, locals }) => {
		const formData = await request.formData();
		const projectId = (formData.get('projectId') as string)?.trim();
		const combinedRatioTarget = parseFloat(formData.get('combinedRatioTarget') as string) || 0.78;
		const actuaryNotes = (formData.get('actuaryNotes') as string)?.trim() || 'Actuarial feasibility model certified.';
		const nextStage = (formData.get('nextStage') as string) || 'CapitalFormation';

		if (!projectId) {
			return fail(400, { error: 'Project ID required.' });
		}

		if (platform?.env?.DB) {
			const db = getDb(platform.env.DB);

			await db
				.update(projects)
				.set({
					stage: nextStage as any,
					combinedRatioTarget
				})
				.where(eq(projects.id, projectId));

			await db.insert(auditLogs).values({
				id: crypto.randomUUID(),
				userId: locals.user?.id ?? null,
				action: 'ACTUARIAL_FEASIBILITY_CERTIFIED',
				targetEntity: `Project:${projectId}`,
				details: JSON.stringify({
					combinedRatioTarget,
					nextStage,
					actuaryNotes,
					certifier: locals.user?.name,
					role: locals.user?.role
				}),
				timestamp: new Date().toISOString()
			});

			return {
				success: true,
				projectId,
				nextStage,
				combinedRatioTarget
			};
		}

		return {
			success: true,
			projectId,
			nextStage,
			combinedRatioTarget
		};
	}
};
