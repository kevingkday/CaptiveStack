/**
 * Intake links are bearer credentials. Published and human-readable tokens
 * (for example tk_eagle1_intake_verified_2026) are predictable and must not
 * be served in production. New tokens are 32 random bytes, hex-encoded.
 */
export const PREDICTABLE_SURVEY_TOKENS = ['tk_eagle1_intake_verified_2026'] as const;

const UNGUESSABLE_TOKEN = /^[0-9a-f]{64}$/;

export function createSurveyToken(): string {
	const bytes = crypto.getRandomValues(new Uint8Array(32));
	return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export function isPredictableSurveyToken(token: string | null | undefined): boolean {
	if (!token) return true;
	if ((PREDICTABLE_SURVEY_TOKENS as readonly string[]).includes(token)) return true;
	return !UNGUESSABLE_TOKEN.test(token);
}

/** A token may be served only when it is unguessable, or demo mode is explicitly on. */
export function canServeSurveyToken(token: string | null | undefined, demoMode: boolean): boolean {
	if (!token) return false;
	if (isPredictableSurveyToken(token)) return demoMode;
	return true;
}

export function resolveSurveyAccess(input: {
	token: string;
	demoMode: boolean;
	hasExactRecord: boolean;
}): 'allow' | 'deny' {
	if (!canServeSurveyToken(input.token, input.demoMode)) return 'deny';
	if (!input.hasExactRecord) return 'deny';
	return 'allow';
}

type SurveyLike = { token?: string | null };

export function redactSurveyToken<T extends SurveyLike>(survey: T, demoMode: boolean): T {
	if (!survey || typeof survey.token !== 'string') return survey;
	if (canServeSurveyToken(survey.token, demoMode)) return survey;
	return { ...survey, token: '' };
}
