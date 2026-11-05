import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import { KNOWN_DEMO_PASSWORDS } from './auth/demo';
import { PREDICTABLE_SURVEY_TOKENS } from './survey/token';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');

function walk(dir: string): string[] {
	const entries = readdirSync(dir);
	const files: string[] = [];
	for (const entry of entries) {
		const full = path.join(dir, entry);
		if (statSync(full).isDirectory()) files.push(...walk(full));
		else files.push(full);
	}
	return files;
}

function readRepo(relativePath: string): string {
	return readFileSync(path.join(root, relativePath), 'utf8');
}

describe('production surface', () => {
	it('does not ship demo passwords or the published intake token in client views', () => {
		const secrets = [...KNOWN_DEMO_PASSWORDS, ...PREDICTABLE_SURVEY_TOKENS];
		const svelteFiles = walk(path.join(root, 'src/routes')).filter((file) => file.endsWith('.svelte'));
		assert.ok(svelteFiles.length > 0);
		for (const file of svelteFiles) {
			const text = readFileSync(file, 'utf8');
			for (const secret of secrets) {
				assert.equal(text.includes(secret), false, `${path.relative(root, file)} contains ${secret}`);
			}
		}
	});

	it('gates the persona endpoint and keeps review certification behind the role check', () => {
		const login = readRepo('src/routes/login/+page.server.ts');
		const review = readRepo('src/routes/review/+page.server.ts');
		const portal = readRepo('src/routes/portal/+page.server.ts');
		const hooks = readRepo('src/hooks.server.ts');
		const home = readRepo('src/routes/+page.server.ts');
		const survey = readRepo('src/routes/survey/[token]/+page.server.ts');
		const layout = readRepo('src/routes/+layout.svelte');

		assert.ok(login.indexOf('decideDemoLogin') !== -1);
		assert.ok(login.indexOf('decideDemoLogin') < login.indexOf('insert(users)'));
		assert.match(login, /fail\(403/);
		assert.match(login, /demoPasswordHint: demoMode \? DEMO_PASSWORD_LABEL : null/);
		assert.match(login, /demoRoles: demoMode \? demoPersonas : \[\]/);

		assert.ok(review.indexOf('canPerformReviewAction') !== -1);
		assert.ok(review.indexOf('canPerformReviewAction') < review.indexOf('update(projects)'));
		assert.match(review, /fail\(403/);

		assert.match(portal, /canAccessPortal/);
		assert.match(hooks, /isDemoMode/);
		assert.match(hooks, /demo_/);
		assert.match(home, /stripPublicSecrets/);
		assert.equal(survey.includes('memberSurveys[0]'), false);
		assert.match(survey, /resolveSurveyAccess/);
		assert.equal(layout.includes('tk_eagle1_intake_verified_2026'), false);
	});

	it('leaves demo mode off in the pages config', () => {
		const wrangler = readRepo('wrangler.toml');
		assert.match(wrangler, /DEMO_MODE = "false"/);
		assert.equal(wrangler.includes('DEMO_MODE = "true"'), false);
	});
});
