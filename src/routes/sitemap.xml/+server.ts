import type { RequestHandler } from './$types';

export const prerender = false;

export const GET: RequestHandler = async () => {
	const siteUrl = 'https://www.captivestack.com';
	const pages = [
		{ loc: `${siteUrl}/`, changefreq: 'weekly', priority: '1.0' },
		{ loc: `${siteUrl}/feasibility`, changefreq: 'weekly', priority: '0.9' },
		{ loc: `${siteUrl}/capital`, changefreq: 'weekly', priority: '0.8' },
		{ loc: `${siteUrl}/domiciles`, changefreq: 'monthly', priority: '0.8' },
		{ loc: `${siteUrl}/about`, changefreq: 'monthly', priority: '0.7' },
		{ loc: `${siteUrl}/login`, changefreq: 'monthly', priority: '0.5' }
	];

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
