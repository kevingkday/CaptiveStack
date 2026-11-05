const SECRET_KEYS = new Set(['passwordHash', 'password_hash', 'token']);

/**
 * Homepage load data is serialized to anonymous visitors. Drop password
 * digests and intake tokens before that payload leaves the server.
 */
export function stripPublicSecrets<T>(value: T): T {
	if (Array.isArray(value)) {
		return value.map((entry) => stripPublicSecrets(entry)) as T;
	}
	if (value && typeof value === 'object') {
		const source = value as Record<string, unknown>;
		const redacted: Record<string, unknown> = {};
		for (const [key, child] of Object.entries(source)) {
			if (SECRET_KEYS.has(key)) continue;
			redacted[key] = stripPublicSecrets(child);
		}
		return redacted as T;
	}
	return value;
}
