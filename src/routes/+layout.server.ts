import type { LayoutServerLoad } from './$types';
import { isDemoMode } from '$lib/server/auth/demo';

export const load: LayoutServerLoad = async ({ locals, platform }) => {
	return {
		demoMode: isDemoMode(platform?.env),
		currentUser: locals.user
			? {
					id: locals.user.id,
					email: locals.user.email,
					name: locals.user.name,
					role: locals.user.role
				}
			: null
	};
};
