import assert from 'node:assert/strict';
import { afterEach, describe, it } from 'node:test';
import { seedData } from '../db/seed-data';
import { hashPassword, verifyPassword } from './password';
import {
	SEEDED_PLACEHOLDER_HASH,
	decideDemoLogin,
	decidePasswordLogin,
	isDemoMode,
	isKnownDemoPassword
} from './demo';

const previousDemoMode = process.env.DEMO_MODE;

afterEach(() => {
	if (previousDemoMode === undefined) delete process.env.DEMO_MODE;
	else process.env.DEMO_MODE = previousDemoMode;
});

describe('DEMO_MODE', () => {
	it('is off unless the flag is exactly true', () => {
		delete process.env.DEMO_MODE;
		assert.equal(isDemoMode(undefined), false);
		assert.equal(isDemoMode(null), false);
		assert.equal(isDemoMode({ DEMO_MODE: 'false' }), false);
		assert.equal(isDemoMode({ DEMO_MODE: 'TRUE' }), false);
		assert.equal(isDemoMode({ DEMO_MODE: '1' }), false);
		assert.equal(isDemoMode({ DEMO_MODE: '' }), false);
		assert.equal(isDemoMode({ DEMO_MODE: 'true' }), true);
	});

	it('does not inherit the process environment when the binding is present', () => {
		process.env.DEMO_MODE = 'true';
		assert.equal(isDemoMode({ DEMO_MODE: 'false' }), false);
	});
});

describe('seeded demo credentials', () => {
	it('flags the published passwords', () => {
		assert.equal(isKnownDemoPassword('CaptiveStack2026!'), true);
		assert.equal(isKnownDemoPassword('admin123'), true);
		assert.equal(isKnownDemoPassword('demo123'), true);
		assert.equal(isKnownDemoPassword('a-real-password'), false);
	});

	it('does not treat published passwords as valid hashes', async () => {
		assert.equal(await verifyPassword('CaptiveStack2026!', SEEDED_PLACEHOLDER_HASH), false);
		assert.equal(await verifyPassword('admin123', SEEDED_PLACEHOLDER_HASH), false);
		assert.equal(await verifyPassword('demo123', 'not-a-hash'), false);
	});

	it('disables every seeded account in production', async () => {
		assert.ok(seedData.users.length >= 5);
		for (const user of seedData.users) {
			assert.equal(user.passwordHash, SEEDED_PLACEHOLDER_HASH);
			assert.equal(
				await decidePasswordLogin({
					demoMode: false,
					password: 'CaptiveStack2026!',
					passwordHash: user.passwordHash
				}),
				'disabled'
			);
			assert.equal(
				await decidePasswordLogin({
					demoMode: false,
					password: 'some-other-password',
					passwordHash: user.passwordHash
				}),
				'disabled'
			);
		}
	});

	it('allows the placeholder only while demo mode is on', async () => {
		assert.equal(
			await decidePasswordLogin({
				demoMode: true,
				password: 'CaptiveStack2026!',
				passwordHash: SEEDED_PLACEHOLDER_HASH
			}),
			'ok'
		);
		assert.equal(
			await decidePasswordLogin({
				demoMode: true,
				password: 'not-the-demo-password',
				passwordHash: SEEDED_PLACEHOLDER_HASH
			}),
			'invalid'
		);
	});

	it('rejects published passwords against a real hash in production', async () => {
		const hash = await hashPassword('correct horse battery');
		assert.equal(
			await decidePasswordLogin({
				demoMode: false,
				password: 'correct horse battery',
				passwordHash: hash
			}),
			'ok'
		);
		assert.equal(
			await decidePasswordLogin({
				demoMode: false,
				password: 'CaptiveStack2026!',
				passwordHash: hash
			}),
			'invalid'
		);
		assert.equal(await verifyPassword('CaptiveStack2026!', hash), false);
	});
});

describe('persona switcher endpoint', () => {
	it('is disabled unless demo mode is on', () => {
		assert.deepEqual(decideDemoLogin(false), { ok: false });
		assert.deepEqual(decideDemoLogin(true), { ok: true });
	});
});
