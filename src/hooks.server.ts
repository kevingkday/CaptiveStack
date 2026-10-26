import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { getDb } from '$lib/server/db';
import { validateSession, SESSION_COOKIE_NAME, deleteSessionCookie } from '$lib/server/auth';
import { isRouteAllowed } from '$lib/server/auth/rbac';
import { seedData } from '$lib/server/db/seed-data';

export const handle: Handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get(SESSION_COOKIE_NAME);

	event.locals.user = null;
	event.locals.session = null;

	if (sessionId) {
		if (event.platform?.env?.DB) {
			try {
				const db = getDb(event.platform.env.DB);
				const auth = await validateSession(db, sessionId);
				if (auth) {
					event.locals.user = auth.user;
					event.locals.session = auth.session;
				} else {
					deleteSessionCookie(event.cookies);
				}
			} catch (err) {
				console.error('[Auth Hook Error]', err);
			}
		} else {
			// Local development seed fallback when running pure Vite dev
			const matchedUser = seedData.users.find(
				(u) => sessionId === `demo_${u.id}` || sessionId === u.id
			);
			if (matchedUser) {
				event.locals.user = {
					...matchedUser,
					createdAt: matchedUser.createdAt
				};
				event.locals.session = {
					id: sessionId,
					userId: matchedUser.id,
					expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
					createdAt: new Date().toISOString()
				};
			}
		}
	}

	// RBAC Route Protection Guards
	const pathname = event.url.pathname;
	const protectedPrefixes = ['/portal', '/admin', '/association', '/review'];
	const isProtected = protectedPrefixes.some((p) => pathname.startsWith(p));

	if (isProtected) {
		if (!event.locals.user) {
			throw redirect(303, `/login?redirectTo=${encodeURIComponent(pathname)}`);
		}

		if (!isRouteAllowed(event.locals.user.role, pathname)) {
			throw redirect(303, `/portal?error=unauthorized_role&required=${encodeURIComponent(pathname)}`);
		}
	}

	return resolve(event);
};
