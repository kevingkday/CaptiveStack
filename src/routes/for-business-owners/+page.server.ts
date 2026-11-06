import type { PageServerLoad } from './$types';
import { getDb } from '$lib/server/db';
import { seedData } from '$lib/server/db/seed-data';

export const load: PageServerLoad = async ({ platform }) => {
	let knownAssociations: string[] = [
		'GlassCo Association',
		'American Hole-in-One Association',
		'National Specialty Trade Contractors Assoc.',
		'Midwest Motor Carriers Alliance',
		'Regional Dental Surgeons Society',
		'National Cloud MSP Consortium'
	];

	if (platform?.env?.DB) {
		const db = getDb(platform.env.DB);
		try {
			const assocList = await db.query.associations.findMany({
				columns: { name: true }
			});
			if (assocList && assocList.length > 0) {
				const names = assocList.map((a) => a.name).filter(Boolean);
				knownAssociations = Array.from(new Set([...knownAssociations, ...names]));
			}
		} catch (e) {
			console.error('[Load Associations Error]', e);
		}
	} else {
		const names = seedData.associations.map((a) => a.name);
		knownAssociations = Array.from(new Set([...knownAssociations, ...names]));
	}

	const bookingUrl =
		(platform?.env as any)?.BOOKING_URL ||
		(platform?.env as any)?.PUBLIC_BOOKING_URL ||
		'https://calendly.com/kevinday-captivestack/feasibility-review';

	return {
		knownAssociations,
		bookingUrl
	};
};
