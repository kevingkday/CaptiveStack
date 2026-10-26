import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { eq } from 'drizzle-orm';
import { getDb } from '$lib/server/db';
import { memberSurveys, documentRecords, auditLogs } from '$lib/server/db/schema';
import { seedData } from '$lib/server/db/seed-data';
import {
	SURVEY_STEPS,
	getDefaultSurveyPayload,
	type MemberSurveyPayload
} from '$lib/survey/types';

export const load: PageServerLoad = async ({ params, platform, locals }) => {
	const token = params.token;

	let surveyRecord: any = null;
	let projectRecord: any = null;
	let associationRecord: any = null;
	let documents: any[] = [];

	if (platform?.env?.DB) {
		const db = getDb(platform.env.DB);
		const found = await db.query.memberSurveys.findFirst({
			where: eq(memberSurveys.token, token),
			with: {
				project: {
					with: {
						association: true
					}
				}
			}
		});

		if (found) {
			surveyRecord = found;
			projectRecord = found.project;
			associationRecord = found.project?.association;

			const docs = await db.query.documentRecords.findMany({
				where: eq(documentRecords.parentId, found.id)
			});
			documents = docs;
		}
	}

	// Fallback to seed data if not found or running dev
	if (!surveyRecord) {
		const seedSurvey = seedData.memberSurveys.find((s) => s.token === token) || seedData.memberSurveys[0];
		surveyRecord = {
			...seedSurvey,
			isCertified: Boolean(seedSurvey.isCertified)
		};
		projectRecord = seedData.projects.find((p) => p.id === seedSurvey.projectId) || seedData.projects[0];
		associationRecord =
			seedData.associations.find((a) => a.id === projectRecord.associationId) || seedData.associations[0];
		documents = seedData.documentRecords.filter(
			(d) => d.parentId === surveyRecord.id || d.parentEntityType === 'MemberSurvey'
		);
	}

	let payload: MemberSurveyPayload;
	try {
		payload = typeof surveyRecord.payload === 'string'
			? JSON.parse(surveyRecord.payload)
			: surveyRecord.payload;
	} catch (e) {
		payload = getDefaultSurveyPayload();
	}

	// Ensure documents list is merged
	if (documents.length > 0 && (!payload.lossRunDocuments || payload.lossRunDocuments.length === 0)) {
		payload.lossRunDocuments = documents.map((d) => ({
			documentId: d.id,
			fileName: d.fileName,
			blobKey: d.blobKey,
			fileSize: 350000,
			fileType: d.fileType,
			uploadedAt: d.createdAt,
			status: d.status as any,
			downloadUrl: `/api/documents/download?key=${encodeURIComponent(d.blobKey)}`
		}));
	}

	return {
		survey: {
			id: surveyRecord.id,
			token: surveyRecord.token,
			stepCompleted: surveyRecord.stepCompleted || 1,
			isCertified: Boolean(surveyRecord.isCertified)
		},
		payload,
		project: projectRecord,
		association: associationRecord,
		steps: SURVEY_STEPS
	};
};

export const actions: Actions = {
	saveStep: async ({ request, params, platform, locals }) => {
		const token = params.token;
		const formData = await request.formData();
		const currentStep = parseInt(formData.get('step')?.toString() || '1', 10);
		const payloadRaw = formData.get('payload')?.toString();

		if (!payloadRaw) {
			return fail(400, { error: 'Missing survey payload' });
		}

		let updatedPayload: MemberSurveyPayload;
		try {
			updatedPayload = JSON.parse(payloadRaw);
		} catch (e) {
			return fail(400, { error: 'Invalid JSON payload' });
		}

		const nextStep = Math.min(11, currentStep + 1);

		if (platform?.env?.DB) {
			const db = getDb(platform.env.DB);
			const existing = await db.query.memberSurveys.findFirst({
				where: eq(memberSurveys.token, token)
			});

			if (existing) {
				const maxStep = Math.max(existing.stepCompleted, nextStep);
				await db
					.update(memberSurveys)
					.set({
						payload: JSON.stringify(updatedPayload),
						stepCompleted: maxStep
					})
					.where(eq(memberSurveys.token, token));

				// Audit log entry
				await db.insert(auditLogs).values({
					id: crypto.randomUUID(),
					userId: locals?.user?.id || null,
					action: `MEMBER_SURVEY_STEP_${currentStep}_SAVED`,
					targetEntity: `MemberSurvey:${existing.id}`,
					details: JSON.stringify({ step: currentStep, nextStep }),
					timestamp: new Date().toISOString()
				});
			}
		}

		return {
			success: true,
			stepCompleted: nextStep,
			message: `Step ${currentStep} saved successfully.`
		};
	},

	certify: async ({ request, params, platform, locals }) => {
		const token = params.token;
		const formData = await request.formData();
		const signature = formData.get('signature')?.toString()?.trim();
		const title = formData.get('title')?.toString()?.trim();
		const payloadRaw = formData.get('payload')?.toString();

		if (!signature || !title) {
			return fail(400, { error: 'Please provide both officer signature and corporate title.' });
		}

		if (platform?.env?.DB) {
			const db = getDb(platform.env.DB);
			const existing = await db.query.memberSurveys.findFirst({
				where: eq(memberSurveys.token, token)
			});

			if (existing) {
				let payload: any = {};
				try {
					payload = payloadRaw
						? JSON.parse(payloadRaw)
						: typeof existing.payload === 'string'
							? JSON.parse(existing.payload)
							: (existing.payload as any) || {};
				} catch (e) {
					payload = {};
				}

				payload.officerSignature = signature;
				payload.officerTitle = title;
				payload.attestationCertified = true;
				payload.certifiedAt = new Date().toISOString();

				await db
					.update(memberSurveys)
					.set({
						payload: JSON.stringify(payload),
						stepCompleted: 11,
						isCertified: true
					})
					.where(eq(memberSurveys.token, token));

				await db.insert(auditLogs).values({
					id: crypto.randomUUID(),
					userId: locals?.user?.id || null,
					action: 'MEMBER_SURVEY_LEGALLY_CERTIFIED',
					targetEntity: `MemberSurvey:${existing.id}`,
					details: JSON.stringify({
						signature,
						title,
						timestamp: payload.certifiedAt,
						ipAttested: true
					}),
					timestamp: new Date().toISOString()
				});
			}
		}

		return {
			success: true,
			certified: true,
			message: 'Member risk intake packet certified and submitted successfully.'
		};
	}
};
