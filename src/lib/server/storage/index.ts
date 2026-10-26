import type { Database } from '$lib/server/db';
import { documentRecords, type DocumentRecord, type NewDocumentRecord } from '$lib/server/db/schema';

export interface PresignedUploadResult {
	uploadUrl: string;
	downloadUrl: string;
	blobKey: string;
	documentId: string;
	method: 'PUT' | 'POST';
	headers: Record<string, string>;
}

function sanitizeFileName(name: string): string {
	return name.replace(/[^a-zA-Z0-9._-]/g, '_');
}

/**
 * Generates an edge-compatible upload destination and records the pending document in D1.
 * Zero local disk storage: files route directly to Cloudflare R2 / Azure Blob storage.
 */
export async function createPresignedDocumentUpload(
	db: Database | null,
	options: {
		parentEntityType: 'Project' | 'MemberSurvey' | 'Association' | 'FeasibilityAssessment';
		parentId: string;
		fileName: string;
		fileType: string;
		fileSize?: number;
		r2Endpoint?: string;
	}
): Promise<PresignedUploadResult> {
	const documentId = crypto.randomUUID();
	const safeName = sanitizeFileName(options.fileName);
	const blobKey = `${options.parentEntityType.toLowerCase()}s/${options.parentId}/${documentId}_${safeName}`;

	// When running on Cloudflare Pages / Workers, upload routes through the serverless edge endpoint
	// or directly to R2 S3-compatible storage.
	const uploadUrl = `/api/documents/upload?key=${encodeURIComponent(blobKey)}&docId=${documentId}&type=${encodeURIComponent(options.fileType)}`;
	const downloadUrl = `/api/documents/download?key=${encodeURIComponent(blobKey)}`;

	// Insert pending document record in D1 SQLite if database is provided
	if (db) {
		await db.insert(documentRecords).values({
			id: documentId,
			parentEntityType: options.parentEntityType,
			parentId: options.parentId,
			fileName: options.fileName,
			blobKey,
			fileType: options.fileType,
			status: 'PendingUpload',
			createdAt: new Date().toISOString()
		});
	}

	return {
		uploadUrl,
		downloadUrl,
		blobKey,
		documentId,
		method: 'PUT',
		headers: {
			'Content-Type': options.fileType
		}
	};
}
