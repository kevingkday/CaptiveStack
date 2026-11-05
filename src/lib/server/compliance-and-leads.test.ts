import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import { DOMICILES } from '../data/domiciles';
import { leads } from './db/schema';
import { notifyLeadToKevin } from './notifications/lead';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');

function readRepo(relativePath: string): string {
	return readFileSync(path.join(root, relativePath), 'utf8');
}

describe('compliance marketing copy', () => {
	const home = readRepo('src/routes/+page.svelte');
	const capital = readRepo('src/routes/capital/+page.svelte');

	it('does not contain prohibited overpromising claims on the homepage', () => {
		const prohibited = [
			'complete freedom to insure any risk',
			'freedom to insure any risk your association chooses',
			'zero carrier restrictions',
			'complete coverage availability',
			'transparent, prompt claim settlement',
			'direct dividend distributions'
		];

		for (const phrase of prohibited) {
			assert.equal(
				home.toLowerCase().includes(phrase.toLowerCase()),
				false,
				`Homepage contains prohibited overpromising copy: "${phrase}"`
			);
		}
	});

	it('softens LOC replacement claims in capital page', () => {
		assert.equal(
			capital.includes('CaptiveStack replaces trapped bank LOCs'),
			false,
			'Capital page contains unqualified LOC replacement claim'
		);
		assert.equal(
			capital.includes('Replaces Traditional Bank LOC'),
			false,
			'Capital stat card contains absolute LOC replacement label'
		);
	});
});

describe('disclaimers and regulatory notices', () => {
	it('includes the comprehensive regulatory disclaimer in the layout footer', () => {
		const layout = readRepo('src/routes/+layout.svelte');
		assert.match(
			layout,
			/Regulatory &amp; Professional Services Disclaimer/,
			'Missing disclaimer header in layout'
		);
		assert.match(
			layout,
			/CaptiveStack is not an insurance company and does not solicit, underwrite, issue, or offer insurance policies/,
			'Missing non-insurer statement'
		);
		assert.match(
			layout,
			/subject to formal regulatory review and statutory approval/,
			'Missing regulatory approval notice'
		);
	});

	it('includes short illustrative disclaimers on calculator results', () => {
		const feasibility = readRepo('src/routes/feasibility/+page.svelte');
		const capital = readRepo('src/routes/capital/+page.svelte');

		assert.match(
			feasibility,
			/Illustrative estimates, not an actuarial opinion or offer/i,
			'Missing disclaimer on feasibility calculator'
		);
		assert.match(
			capital,
			/Illustrative estimates, not an actuarial opinion or offer/i,
			'Missing disclaimer on capital calculator'
		);
	});
});

describe('domiciles data module', () => {
	it('supports all 8 required jurisdictions with valid structure', () => {
		const domicileIds = DOMICILES.map((d) => d.id);
		const required = [
			'vermont',
			'utah',
			'delaware',
			'cayman',
			'bermuda',
			'barbados',
			'british-columbia',
			'alberta'
		];

		for (const id of required) {
			assert.ok(domicileIds.includes(id), `Missing required domicile: ${id}`);
		}

		for (const d of DOMICILES) {
			assert.ok(d.name && d.name.length > 0);
			assert.ok(d.minimumCapital && d.minimumCapital.length > 0);
			assert.ok(d.regulatoryBody && d.regulatoryBody.length > 0);
			assert.ok(d.keyNotes && d.keyNotes.length > 0);
			assert.ok(d.canadianCaptiveUrl.includes('canadiancaptive.com'));
		}
	});
});

describe('lead capture and notification', () => {
	it('defines all required fields in the leads database schema', () => {
		const colNames = Object.keys(leads);
		const expected = [
			'id',
			'name',
			'associationName',
			'memberCount',
			'lineOfCoverage',
			'annualPremiumSize',
			'email',
			'phone',
			'notes',
			'status',
			'createdAt'
		];

		for (const col of expected) {
			assert.ok(colNames.includes(col), `Missing column ${col} in leads table`);
		}
	});

	it('notifies Kevin Day upon new lead receipt without throwing', async () => {
		const result = await notifyLeadToKevin({
			id: 'lead-test-1234',
			name: 'Test Association Exec',
			associationName: 'National Trade Group',
			memberCount: 50,
			lineOfCoverage: 'General Liability & Property',
			annualPremiumSize: '$2,500,000',
			email: 'exec@nationaltradegroup.test',
			phone: '555-0199',
			notes: 'Testing lead flow'
		});

		assert.equal(result.targetEmail, 'kevin@oceanfallsblockchain.com');
		assert.equal(result.leadId, 'lead-test-1234');
	});
});

describe('seo and static assets', () => {
	it('points robots.txt to sitemap.xml and disallows internal paths', () => {
		const robots = readRepo('static/robots.txt');
		assert.match(robots, /Sitemap: https:\/\/www\.captivestack\.com\/sitemap\.xml/);
		assert.match(robots, /Disallow: \/portal/);
		assert.match(robots, /Disallow: \/review/);
		assert.match(robots, /Disallow: \/survey\//);
	});

	it('generates compliant sitemap.xml covering public platform pages', async () => {
		const { GET } = await import('../../routes/sitemap.xml/+server');
		const res = await (GET as any)({} as any);
		assert.equal(res.status, 200);
		assert.equal(res.headers.get('Content-Type'), 'application/xml');
		const xml = await res.text();
		assert.match(xml, /<loc>https:\/\/www\.captivestack\.com\/<\/loc>/);
		assert.match(xml, /<loc>https:\/\/www\.captivestack\.com\/feasibility<\/loc>/);
		assert.match(xml, /<loc>https:\/\/www\.captivestack\.com\/capital<\/loc>/);
		assert.match(xml, /<loc>https:\/\/www\.captivestack\.com\/domiciles<\/loc>/);
		assert.match(xml, /<loc>https:\/\/www\.captivestack\.com\/about<\/loc>/);
		assert.match(xml, /<loc>https:\/\/www\.captivestack\.com\/login<\/loc>/);
	});

	it('has static favicon and og-image assets', () => {
		assert.ok(existsSync(path.join(root, 'static/favicon.svg')), 'favicon.svg missing');
		assert.ok(existsSync(path.join(root, 'static/og-image.svg')), 'og-image.svg missing');
	});

	it('links favicon and open graph tags in layout', () => {
		const layout = readRepo('src/routes/+layout.svelte');
		assert.match(layout, /rel="icon"/);
		assert.match(layout, /og:image/);
		assert.match(layout, /twitter:card/);
	});
});

describe('sample data labeling', () => {
	it('labels presets and sample archives as Sample data on public pages', () => {
		const feasibility = readRepo('src/routes/feasibility/+page.svelte');
		const capital = readRepo('src/routes/capital/+page.svelte');

		assert.match(feasibility, /Sample data/);
		assert.match(capital, /Sample data/);
	});
});
