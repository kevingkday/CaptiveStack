import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDb } from '$lib/server/db';
import { createPresignedDocumentUpload } from '$lib/server/storage';

export const POST: RequestHandler = async ({ request, platform, locals }) => {
	try {
		const body = await request.json();
		const { parentEntityType, parentId, fileName, fileType, fileSize } = body;

		if (!parentEntityType || !parentId || !fileName || !fileType) {
			return json(
				{ error: 'Missing required parameters: parentEntityType, parentId, fileName, fileType' },
				{ status: 400 }
			);
		}

		const db = platform?.env?.DB ? getDb(platform.env.DB) : null;
		const result = await createPresignedDocumentUpload(db, {
			parentEntityType,
			parentId,
			fileName,
			fileType,
			fileSize
		});

		return json(result);
	} catch (err: any) {
		console.error('[Presigned URL Generation Error]', err);
		return json({ error: err.message || 'Failed to generate upload URL' }, { status: 500 });
	}
};
