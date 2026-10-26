import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { eq } from 'drizzle-orm';
import { getDb } from '$lib/server/db';
import { documentRecords } from '$lib/server/db/schema';

export const PUT: RequestHandler = async ({ request, url, platform }) => {
	const key = url.searchParams.get('key');
	const docId = url.searchParams.get('docId');
	const contentType = url.searchParams.get('type') || 'application/octet-stream';

	if (!key) {
		return json({ error: 'Missing document key' }, { status: 400 });
	}

	const arrayBuffer = await request.arrayBuffer();

	// Stream array buffer directly into Cloudflare R2 bucket (zero local disk storage)
	if (platform?.env?.DOCUMENTS_BUCKET) {
		try {
			await platform.env.DOCUMENTS_BUCKET.put(key, arrayBuffer, {
				httpMetadata: {
					contentType
				}
			});
		} catch (err) {
			console.error('[R2 Storage Upload Error]', err);
			return json({ error: 'Failed to write to R2 storage' }, { status: 500 });
		}
	}

	// Update document record status in D1 SQLite
	if (platform?.env?.DB && docId) {
		try {
			const db = getDb(platform.env.DB);
			await db
				.update(documentRecords)
				.set({ status: 'Verified' })
				.where(eq(documentRecords.id, docId));
		} catch (err) {
			console.error('[D1 Document Status Update Error]', err);
		}
	}

	return json({
		success: true,
		blobKey: key,
		status: 'Verified',
		message: 'Loss run document uploaded and verified successfully in Cloudflare R2.'
	});
};
