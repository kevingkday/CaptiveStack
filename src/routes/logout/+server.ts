import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDb } from '$lib/server/db';
import { invalidateSession, deleteSessionCookie } from '$lib/server/auth';

export const POST: RequestHandler = async ({ cookies, platform, locals }) => {
	if (locals.session && platform?.env?.DB) {
		const db = getDb(platform.env.DB);
		await invalidateSession(db, locals.session.id);
	}

	deleteSessionCookie(cookies);
	throw redirect(303, '/login?loggedOut=true');
};

export const GET: RequestHandler = async ({ cookies, platform, locals }) => {
	if (locals.session && platform?.env?.DB) {
		const db = getDb(platform.env.DB);
		await invalidateSession(db, locals.session.id);
	}

	deleteSessionCookie(cookies);
	throw redirect(303, '/login?loggedOut=true');
};
