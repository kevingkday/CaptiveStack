import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { eq } from 'drizzle-orm';
import { getDb } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { createSession, setSessionCookie } from '$lib/server/auth';
import { verifyPassword } from '$lib/server/auth/password';
import { seedData } from '$lib/server/db/seed-data';

export const load: PageServerLoad = async ({ locals, url }) => {
	// If already authenticated, redirect to portal
	if (locals.user) {
		const redirectTo = url.searchParams.get('redirectTo') || '/portal';
		throw redirect(303, redirectTo);
	}

	return {
		redirectTo: url.searchParams.get('redirectTo') || '/portal'
	};
};

export const actions: Actions = {
	login: async ({ request, cookies, platform, url }) => {
		const formData = await request.formData();
		const email = formData.get('email')?.toString().trim().toLowerCase();
		const password = formData.get('password')?.toString() || '';
		const redirectTo = url.searchParams.get('redirectTo') || '/portal';

		if (!email || !password) {
			return fail(400, {
				error: 'Please enter both your email address and password.',
				email
			});
		}

		let matchedUser: any = null;

		if (platform?.env?.DB) {
			const db = getDb(platform.env.DB);
			const userRecord = await db
				.select()
				.from(users)
				.where(eq(users.email, email))
				.get();

			if (userRecord) {
				const isValid = await verifyPassword(password, userRecord.passwordHash);
				if (isValid) {
					matchedUser = userRecord;
					const session = await createSession(db, userRecord.id);
					setSessionCookie(cookies, session.id, session.expiresAt);
				}
			}
		} else {
			// Dev fallback without D1 binding
			const seedUser = seedData.users.find((u) => u.email.toLowerCase() === email);
			if (seedUser) {
				const isValid = await verifyPassword(password, seedUser.passwordHash);
				if (isValid) {
					matchedUser = seedUser;
					setSessionCookie(
						cookies,
						`demo_${seedUser.id}`,
						new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
					);
				}
			}
		}

		if (!matchedUser) {
			return fail(401, {
				error: 'Invalid credentials. For test accounts, use password "CaptiveStack2026!" or one-click Demo Sign-In below.',
				email
			});
		}

		throw redirect(303, redirectTo);
	},

	demoLogin: async ({ request, cookies, platform, url }) => {
		const formData = await request.formData();
		const role = formData.get('role')?.toString();
		const redirectTo = url.searchParams.get('redirectTo') || '/portal';

		const targetSeed = seedData.users.find((u) => u.role === role) || seedData.users[0];

		if (platform?.env?.DB) {
			const db = getDb(platform.env.DB);
			// Find or upsert user
			let user = await db
				.select()
				.from(users)
				.where(eq(users.email, targetSeed.email))
				.get();

			if (!user) {
				const [created] = await db
					.insert(users)
					.values({
						id: targetSeed.id,
						email: targetSeed.email,
						name: targetSeed.name,
						role: targetSeed.role,
						passwordHash: targetSeed.passwordHash,
						createdAt: new Date().toISOString()
					})
					.returning();
				user = created;
			}

			const session = await createSession(db, user.id);
			setSessionCookie(cookies, session.id, session.expiresAt);
		} else {
			setSessionCookie(
				cookies,
				`demo_${targetSeed.id}`,
				new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
			);
		}

		throw redirect(303, redirectTo);
	}
};
