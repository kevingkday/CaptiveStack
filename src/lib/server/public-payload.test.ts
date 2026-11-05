import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { seedData } from './db/seed-data';
import { SEEDED_PLACEHOLDER_HASH } from './auth/demo';
import { stripPublicSecrets } from './public-payload';

describe('public homepage payload', () => {
	it('removes password hashes and intake tokens', () => {
		const payload = {
			users: seedData.users,
			projects: seedData.projects.map((project) => ({
				...project,
				memberSurveys: seedData.memberSurveys.filter((survey) => survey.projectId === project.id)
			}))
		};

		const redacted = stripPublicSecrets(payload);
		const serialized = JSON.stringify(redacted);

		assert.equal(serialized.includes(SEEDED_PLACEHOLDER_HASH), false);
		assert.equal(serialized.includes('passwordHash'), false);
		assert.equal(serialized.includes('tk_eagle1_intake_verified_2026'), false);
		assert.equal(serialized.includes('Eagle1 Hole-in-One Prize Indemnity Captive'), true);
		assert.equal(redacted.users[0].email, 'admin@captivestack.com');
	});
});
