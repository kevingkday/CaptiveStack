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


describe('lead generation funnel & scoring engine', () => {
	it('calculates consistent readiness scores across volume, loss history and density tiers', async () => {
		const { calculateReadinessScore } = await import('../readiness/scoring');

		// High Fit Association: >$10M, Good loss history, 50+ members
		const highFit = calculateReadinessScore({
			role: 'association',
			industry: 'contractors',
			size: 75,
			annualPremiumBand: '$10M - $25M',
			linesOfCoverage: ['Commercial General Liability', 'Commercial Auto / Fleet'],
			lossHistory: 'Good',
			renewalDate: '2026-12-01',
			region: 'British Columbia'
		});

		assert.ok(highFit.score >= 80, `Expected score >= 80 for high fit, got ${highFit.score}`);
		assert.equal(highFit.tier, 'Optimal');
		assert.ok(highFit.illustrative5YrSurplusMin > 500000);
		assert.ok(highFit.illustrative5YrSurplusMax > highFit.illustrative5YrSurplusMin);
		assert.ok(highFit.illustrativeAnnualLocSavings > 0);

		// Developing Fit Business Owner: small premium, high loss history
		const buildingFit = calculateReadinessScore({
			role: 'business',
			industry: 'hospitality',
			size: 8,
			annualPremiumBand: '$100k - $250k',
			linesOfCoverage: ['Commercial Property'],
			lossHistory: 'High',
			renewalDate: '2026-11-15'
		});

		assert.ok(buildingFit.score < 60, `Expected score < 60 for high-loss small operator, got ${buildingFit.score}`);
		assert.equal(buildingFit.tier, 'Developing');
	});

	it('configures all 6 target industries with pain points and labeled examples', async () => {
		const { INDUSTRIES } = await import('../data/industries');
		assert.equal(INDUSTRIES.length, 6);

		const expectedSlugs = [
			'contractors',
			'transportation',
			'healthcare',
			'it-services',
			'hospitality',
			'property-managers'
		];

		for (const slug of expectedSlugs) {
			const ind = INDUSTRIES.find((i) => i.slug === slug);
			assert.ok(ind, `Missing target industry configuration: ${slug}`);
			assert.ok(ind.name && ind.heroHeadline && ind.marketCrisis);
			assert.equal(ind.coveragePainPoints.length, 3);
			assert.ok(ind.keyBenefits.length >= 3);
			assert.ok(ind.illustrativeExample, `Missing illustrative example for ${slug}`);
			assert.ok(
				ind.illustrativeExample.disclaimerNotice.includes('Illustrative') && ind.illustrativeExample.disclaimerNotice.includes('not an actuarial opinion'),
				'Example must include illustrative disclaimer'
			);
		}
	});

	it('includes all funnel pages and industry landing pages in sitemap.xml', async () => {
		const { GET } = await import('../../routes/sitemap.xml/+server');
		const res = await (GET as any)({} as any);
		const xml = await res.text();

		assert.match(xml, /<loc>https:\/\/www\.captivestack\.com\/for-associations<\/loc>/);
		assert.match(xml, /<loc>https:\/\/www\.captivestack\.com\/for-business-owners<\/loc>/);
		assert.match(xml, /<loc>https:\/\/www\.captivestack\.com\/readiness<\/loc>/);
		assert.match(xml, /<loc>https:\/\/www\.captivestack\.com\/industries<\/loc>/);
		assert.match(xml, /<loc>https:\/\/www\.captivestack\.com\/industries\/contractors<\/loc>/);
		assert.match(xml, /<loc>https:\/\/www\.captivestack\.com\/industries\/transportation<\/loc>/);
		assert.match(xml, /<loc>https:\/\/www\.captivestack\.com\/industries\/healthcare<\/loc>/);
		assert.match(xml, /<loc>https:\/\/www\.captivestack\.com\/industries\/it-services<\/loc>/);
		assert.match(xml, /<loc>https:\/\/www\.captivestack\.com\/industries\/hospitality<\/loc>/);
		assert.match(xml, /<loc>https:\/\/www\.captivestack\.com\/industries\/property-managers<\/loc>/);
	});

	it('enforces RBAC permissions: /admin/leads restricted to Admin & CSA, /association/dashboard allowed for AssociationAdmin', async () => {
		const { isRouteAllowed } = await import('../auth/rbac');

		// Admin & CSA can access /admin and /association
		assert.equal(isRouteAllowed('Admin', '/admin/leads'), true);
		assert.equal(isRouteAllowed('CaptiveStackAdministrator', '/admin/leads'), true);
		assert.equal(isRouteAllowed('Admin', '/association/dashboard'), true);

		// AssociationAdmin can access /association/dashboard but NOT /admin/leads
		assert.equal(isRouteAllowed('AssociationAdministrator', '/association/dashboard'), true);
		assert.equal(isRouteAllowed('AssociationAdministrator', '/admin/leads'), false);

		// AssociationMember cannot access /admin/leads or /association/dashboard
		assert.equal(isRouteAllowed('AssociationMember', '/admin/leads'), false);
		assert.equal(isRouteAllowed('AssociationMember', '/association/dashboard'), false);

		// Anonymous / undefined role has zero access
		assert.equal(isRouteAllowed(null, '/admin/leads'), false);
	});

	it('defines member_prospects and funnel_events in database schema', async () => {
		const { memberProspects, funnelEvents } = await import('./db/schema');
		assert.ok(memberProspects, 'memberProspects table missing');
		assert.ok(funnelEvents, 'funnelEvents table missing');

		const prospectCols = Object.keys(memberProspects);
		assert.ok(prospectCols.includes('surveyToken'));
		assert.ok(prospectCols.includes('companyName'));
		assert.ok(prospectCols.includes('contactEmail'));

		const eventCols = Object.keys(funnelEvents);
		assert.ok(eventCols.includes('sessionId'));
		assert.ok(eventCols.includes('eventName'));
		assert.ok(eventCols.includes('metadata'));
	});
});
