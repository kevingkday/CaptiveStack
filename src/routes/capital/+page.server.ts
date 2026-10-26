import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { getDb } from '$lib/server/db';
import { capitalReserves, auditLogs } from '$lib/server/db/schema';
import { seedData } from '$lib/server/db/seed-data';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ platform, locals }) => {
	let projects: any[] = [];
	let reserves: any[] = [];

	if (platform?.env?.DB) {
		const db = getDb(platform.env.DB);
		const [pList, rList] = await Promise.all([
			db.query.projects.findMany({
				with: {
					association: true,
					capitalReserves: true,
					memberSurveys: true
				}
			}),
			db.query.capitalReserves.findMany({
				with: {
					project: {
						with: {
							association: true
						}
					}
				}
			})
		]);
		projects = pList;
		reserves = rList;
	} else {
		projects = seedData.projects.map((p) => ({
			...p,
			association: seedData.associations.find((a) => a.id === p.associationId),
			capitalReserves: seedData.capitalReserves.filter((r) => r.projectId === p.id),
			memberSurveys: seedData.memberSurveys.filter((s) => s.projectId === p.id)
		}));
		reserves = seedData.capitalReserves.map((r) => ({
			...r,
			project: seedData.projects.find((p) => p.id === r.projectId)
		}));
	}

	return {
		user: locals.user,
		projects,
		reserves
	};
};

export const actions: Actions = {
	pledgeReserve: async ({ request, platform, locals }) => {
		const formData = await request.formData();
		const reserveId = (formData.get('reserveId') as string)?.trim();
		const pledgeAmount = parseFloat(formData.get('amount') as string) || 50000;
		const memberName = (formData.get('memberName') as string)?.trim() || locals.user?.name || 'Authorized Member';

		if (!reserveId) {
			return fail(400, { error: 'Missing reserve facility ID.' });
		}

		if (platform?.env?.DB) {
			const db = getDb(platform.env.DB);
			const target = await db.query.capitalReserves.findFirst({
				where: (t, { eq }) => eq(t.id, reserveId)
			});

			if (!target) {
				return fail(404, { error: 'Target capital facility not found in D1.' });
			}

			const newAllocated = target.allocatedAmount + pledgeAmount;
			const newStatus = newAllocated >= target.requiredAmount ? 'Funded' : 'Pledged';

			await db
				.update(capitalReserves)
				.set({
					allocatedAmount: newAllocated,
					status: newStatus
				})
				.where(eq(capitalReserves.id, reserveId));

			await db.insert(auditLogs).values({
				id: crypto.randomUUID(),
				userId: locals.user?.id ?? null,
				action: 'CAPITAL_RESERVE_PLEDGED',
				targetEntity: `CapitalReserve:${reserveId}`,
				details: JSON.stringify({
					pledgeAmount,
					previousAllocated: target.allocatedAmount,
					newAllocated,
					newStatus,
					memberName
				}),
				timestamp: new Date().toISOString()
			});

			return {
				success: true,
				reserveId,
				allocatedAmount: newAllocated,
				status: newStatus,
				pledgeAmount
			};
		}

		return {
			success: true,
			reserveId,
			allocatedAmount: 1200000 + pledgeAmount,
			status: 'Pledged',
			pledgeAmount
		};
	}
};
