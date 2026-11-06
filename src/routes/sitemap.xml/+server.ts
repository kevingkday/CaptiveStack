import type { RequestHandler } from './$types';
import { INDUSTRIES } from '$lib/data/industries';

export const prerender = false;

export const GET: RequestHandler = async () => {
	const siteUrl = 'https://www.captivestack.com';
	const basePages = [
		{ loc: `${siteUrl}/`, changefreq: 'weekly', priority: '1.0' },
		{ loc: `${siteUrl}/for-associations`, changefreq: 'weekly', priority: '0.9' },
		{ loc: `${siteUrl}/for-business-owners`, changefreq: 'weekly', priority: '0.9' },
		{ loc: `${siteUrl}/readiness`, changefreq: 'weekly', priority: '0.9' },
		{ loc: `${siteUrl}/feasibility`, changefreq: 'weekly', priority: '0.9' },
		{ loc: `${siteUrl}/capital`, changefreq: 'weekly', priority: '0.8' },
		{ loc: `${siteUrl}/domiciles`, changefreq: 'monthly', priority: '0.8' },
		{ loc: `${siteUrl}/industries`, changefreq: 'weekly', priority: '0.8' },
		{ loc: `${siteUrl}/about`, changefreq: 'monthly', priority: '0.7' },
		{ loc: `${siteUrl}/login`, changefreq: 'monthly', priority: '0.5' }
	];

	const industryPages = INDUSTRIES.map((ind) => ({
		loc: `${siteUrl}/industries/${ind.slug}`,
		changefreq: 'weekly',
		priority: '0.8'
	}));

	const pages = [...basePages, ...industryPages];

	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
	.map(
		(p) => `  <url>
    <loc>${p.loc}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
	)
	.join('\n')}
</urlset>`;

	return new Response(sitemap.trim(), {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'public, max-age=3600, s-maxage=86400'
		}
	});
};
