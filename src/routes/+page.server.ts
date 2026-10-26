import type { PageServerLoad } from './$types';
import { getDb } from '$lib/server/db';
import { seedData } from '$lib/server/db/seed-data';

export const load: PageServerLoad = async ({ platform }) => {
	// Attempt query against Cloudflare D1 if edge platform binding is present
	if (platform?.env?.DB) {
		try {
			const db = getDb(platform.env.DB);
			const [projectsList, usersList, feasibilityList, capitalReservesList, associationsList] = await Promise.all([
				db.query.projects.findMany({
					with: {
						association: true,
						capitalReserves: true,
						memberSurveys: true
					}
				}),
				db.query.users.findMany(),
				db.query.feasibilityAssessments.findMany(),
				db.query.capitalReserves.findMany(),
				db.query.associations.findMany()
			]);

			return {
				isD1EdgeConnected: true,
				source: 'Cloudflare D1 (Live Edge Database)',
				projects: projectsList,
				users: usersList,
				feasibilityAssessments: feasibilityList,
				capitalReserves: capitalReservesList,
				associations: associationsList
			};
		} catch (err) {
			console.warn('[D1 Query Fallback]', err);
		}
	}

	// Local development fallback to verified seed data
	return {
		isD1EdgeConnected: false,
		source: 'Seeded Data Layer (Local Development)',
		projects: seedData.projects.map((p) => ({
			...p,
			association: seedData.associations.find((a) => a.id === p.associationId),
			capitalReserves: seedData.capitalReserves.filter((r) => r.projectId === p.id),
			memberSurveys: seedData.memberSurveys.filter((s) => s.projectId === p.id)
		})),
		users: seedData.users,
		feasibilityAssessments: seedData.feasibilityAssessments,
		capitalReserves: seedData.capitalReserves,
		associations: seedData.associations
	};
};
