import { verifyPassword } from './password';

/**
 * Demo persona switcher and seeded passwords stay off unless DEMO_MODE is
 * exactly "true" (Cloudflare Pages var or process env). Any other value,
 * including "false", "1", and an unset variable, is production behavior.
 *
 * The strings below are a denylist of credentials that shipped in the client.
 * They must never authenticate a production session.
 */
export const KNOWN_DEMO_PASSWORDS = ['CaptiveStack2026!', 'admin123', 'demo123'] as const;

/** Password shown on the login screen only when demo mode is on. */
export const DEMO_PASSWORD_LABEL = KNOWN_DEMO_PASSWORDS[0];

/**
 * Shared placeholder stored for every seeded user. It is not a PBKDF2 digest
 * and it is not a real bcrypt hash of a secret. Accounts still on this value
 * cannot sign in until the hash is replaced.
 */
export const SEEDED_PLACEHOLDER_HASH =
	'$2a$12$e9qO2qS4.K9Xw3fJ1O/1MeFp5KxR4zW1V8P6C0H7B2M4D5F8A1G2H';

export const demoPersonas = [
	{
		role: 'Admin',
		email: 'admin@captivestack.com',
		name: 'System Admin',
		title: 'Full Platform Access & Settings'
	},
	{
		role: 'CaptiveStackAdministrator',
		email: 'csa@captivestack.com',
		name: 'Sarah Lin',
		title: 'Chief Underwriting & Capital Gatekeeper'
	},
	{
		role: 'AssociationAdministrator',
		email: 'admin@glassco.org',
		name: 'David Vance',
		title: 'GlassCo Exec Director & Group Lead'
	},
	{
		role: 'AssociationMember',
		email: 'marcus@autoglasspro.com',
		name: 'Marcus Miller',
		title: 'AutoGlass Pro (11-Step Survey Intake)'
	},
	{
		role: 'AdviserReviewer',
		email: 'elena@actuarialrisk.com',
		name: 'Dr. Elena Rostova',
		title: 'Lead Actuary & Independent Auditor'
	}
] as const;

type DemoEnv = { DEMO_MODE?: string } | null | undefined;

export function isDemoMode(env?: DemoEnv): boolean {
	if (env && Object.prototype.hasOwnProperty.call(env, 'DEMO_MODE')) {
		return env.DEMO_MODE === 'true';
	}
	const fromProcess = typeof process !== 'undefined' ? process.env.DEMO_MODE : undefined;
	return fromProcess === 'true';
}

export function isKnownDemoPassword(password: string): boolean {
	return (KNOWN_DEMO_PASSWORDS as readonly string[]).includes(password);
}

export function isSeededPlaceholderHash(passwordHash: string | null | undefined): boolean {
	return passwordHash === SEEDED_PLACEHOLDER_HASH;
}

export type PasswordLoginDecision = 'ok' | 'disabled' | 'invalid';

/**
 * Production rejects the seeded placeholder hash (password reset required)
 * and rejects the published demo passwords even if some other hash would match.
 * Demo mode allows those passwords only against the placeholder hash.
 */
export async function decidePasswordLogin(input: {
	demoMode: boolean;
	password: string;
	passwordHash: string;
}): Promise<PasswordLoginDecision> {
	const { demoMode, password, passwordHash } = input;
	const placeholder = isSeededPlaceholderHash(passwordHash);
	const knownPassword = isKnownDemoPassword(password);

	if (!demoMode) {
		if (placeholder) return 'disabled';
		if (knownPassword) return 'invalid';
		return (await verifyPassword(password, passwordHash)) ? 'ok' : 'invalid';
	}

	if (placeholder) {
		return knownPassword ? 'ok' : 'invalid';
	}

	return (await verifyPassword(password, passwordHash)) ? 'ok' : 'invalid';
}

export function decideDemoLogin(demoMode: boolean): { ok: true } | { ok: false } {
	return demoMode ? { ok: true } : { ok: false };
}
