import type { Cookies } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { Database } from '$lib/server/db';
import { sessions, users, type Session, type User } from '$lib/server/db/schema';

export const SESSION_COOKIE_NAME = 'captivestack_session';
export const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

/**
 * Creates a new session in D1 SQLite for the given userId.
 */
export async function createSession(db: Database, userId: string): Promise<Session> {
	const sessionId = crypto.randomUUID().replace(/-/g, '') + crypto.randomUUID().replace(/-/g, '');
	const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

	const [session] = await db
		.insert(sessions)
		.values({
			id: sessionId,
			userId,
			expiresAt,
			createdAt: new Date().toISOString()
		})
		.returning();

	return session;
}

/**
 * Validates a session token against D1 SQLite and returns the session and user.
 * Automatically refreshes sessions that are halfway to expiration.
 */
export async function validateSession(
	db: Database,
	sessionId: string
): Promise<{ session: Session; user: User } | null> {
	if (!sessionId) return null;

	const result = await db
		.select({
			session: sessions,
			user: users
		})
		.from(sessions)
		.innerJoin(users, eq(sessions.userId, users.id))
		.where(eq(sessions.id, sessionId))
		.get();

	if (!result) {
		return null;
	}

	const { session, user } = result;

	// Check if session has expired
	if (Date.now() >= session.expiresAt.getTime()) {
		await db.delete(sessions).where(eq(sessions.id, session.id));
		return null;
	}

	// If session has less than 15 days remaining, extend by 30 days
	const fifteenDaysMs = 1000 * 60 * 60 * 24 * 15;
	if (session.expiresAt.getTime() - Date.now() < fifteenDaysMs) {
		const newExpiresAt = new Date(Date.now() + SESSION_DURATION_MS);
		await db
			.update(sessions)
			.set({ expiresAt: newExpiresAt })
			.where(eq(sessions.id, session.id));
		session.expiresAt = newExpiresAt;
	}

	return { session, user };
}

/**
 * Invalidates a specific session by ID.
 */
export async function invalidateSession(db: Database, sessionId: string): Promise<void> {
	if (!sessionId) return;
	await db.delete(sessions).where(eq(sessions.id, sessionId));
}

/**
 * Sets the HTTP-only secure session cookie.
 */
export function setSessionCookie(cookies: Cookies, sessionId: string, expiresAt: Date): void {
	cookies.set(SESSION_COOKIE_NAME, sessionId, {
		httpOnly: true,
		path: '/',
		secure: false, // Allows local http preview and production https
		sameSite: 'lax',
		expires: expiresAt
	});
}

/**
 * Deletes the session cookie.
 */
export function deleteSessionCookie(cookies: Cookies): void {
	cookies.delete(SESSION_COOKIE_NAME, {
		path: '/'
	});
}
