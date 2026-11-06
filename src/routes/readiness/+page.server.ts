import type { PageServerLoad } from './$types';
import { getDb } from '$lib/server/db';
import { associations, leads } from '$lib/server/db/schema';
import { seedData } from '$lib/server/db/seed-data';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ url, cookies, platform }) => {
	const roleParam = url.searchParams.get('role'); // 'association' | 'business'
	const industryParam = url.searchParams.get('industry');
	const prefillLeadId = url.searchParams.get('leadId') || cookies.get('cs_lead_id');

	let knownAssociations: string[] = [
		'GlassCo Association',
		'American Hole-in-One Association',
		'National Specialty Trade Contractors Assoc.',
		'Midwest Motor Carriers Alliance',
		'Regional Dental Surgeons Society',
		'National Cloud MSP Consortium'
	];

	let existingLead: any = null;

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

			if (prefillLeadId) {
				existingLead = await db.query.leads.findFirst({
					where: eq(leads.id, prefillLeadId)
				});
			}
		} catch (e) {
			console.error('[Readiness Load Error]', e);
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
		roleParam,
		industryParam,
		knownAssociations,
		existingLead,
		bookingUrl,
		utm: {
			source: url.searchParams.get('utm_source') || '',
			medium: url.searchParams.get('utm_medium') || '',
			campaign: url.searchParams.get('utm_campaign') || '',
			term: url.searchParams.get('utm_term') || '',
			content: url.searchParams.get('utm_content') || ''
		}
	};
};
