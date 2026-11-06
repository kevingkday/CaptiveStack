import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getIndustryBySlug } from '$lib/data/industries';

export const load: PageServerLoad = async ({ params, platform }) => {
	const industry = getIndustryBySlug(params.slug);
	if (!industry) {
		throw error(404, `Industry '${params.slug}' not found`);
	}

	const bookingUrl =
		(platform?.env as any)?.BOOKING_URL ||
		(platform?.env as any)?.PUBLIC_BOOKING_URL ||
		'https://calendly.com/kevinday-captivestack/feasibility-review';

	return {
		industry,
		bookingUrl
	};
};
