import * as fs from 'node:fs';
import * as path from 'node:path';
import { seedData, type SeedData } from './seed-data';

export { seedData, type SeedData };

export function generateSeedSql(data: SeedData = seedData): string {
	const statements: string[] = [];

	// Users
	for (const u of data.users) {
		statements.push(
			`INSERT OR REPLACE INTO users (id, email, name, role, password_hash, created_at) VALUES ('${u.id}', '${u.email}', '${u.name.replace(/'/g, "''")}', '${u.role}', '${u.passwordHash}', '${u.createdAt}');`
		);
	}

	// Associations
	for (const a of data.associations) {
		statements.push(
			`INSERT OR REPLACE INTO associations (id, name, legal_entity_type, industry_slug, contact_email, created_at) VALUES ('${a.id}', '${a.name.replace(/'/g, "''")}', '${a.legalEntityType.replace(/'/g, "''")}', '${a.industrySlug}', '${a.contactEmail}', '${a.createdAt}');`
		);
	}

	// Projects
	for (const p of data.projects) {
		statements.push(
			`INSERT OR REPLACE INTO projects (id, association_id, name, stage, combined_ratio_target, created_at) VALUES ('${p.id}', '${p.associationId}', '${p.name.replace(/'/g, "''")}', '${p.stage}', ${p.combinedRatioTarget}, '${p.createdAt}');`
		);
	}

	// Feasibility Assessments
	for (const f of data.feasibilityAssessments) {
		statements.push(
			`INSERT OR REPLACE INTO feasibility_assessments (id, email, organization_type, primary_concern, annual_premium, "5yr_losses", loss_ratio, fit_score, status, created_at) VALUES ('${f.id}', '${f.email}', '${f.organizationType.replace(/'/g, "''")}', '${f.primaryConcern.replace(/'/g, "''")}', ${f.annualPremium}, ${f.fiveYearLosses}, ${f.lossRatio}, ${f.fitScore}, '${f.status}', '${f.createdAt}');`
		);
	}

	// Member Surveys
	for (const s of data.memberSurveys) {
		statements.push(
			`INSERT OR REPLACE INTO member_surveys (id, project_id, member_id, token, step_completed, payload, is_certified, created_at) VALUES ('${s.id}', '${s.projectId}', '${s.memberId}', '${s.token}', ${s.stepCompleted}, '${s.payload.replace(/'/g, "''")}', ${s.isCertified}, '${s.createdAt}');`
		);
	}

	// Capital Reserves
	for (const r of data.capitalReserves) {
		statements.push(
			`INSERT OR REPLACE INTO capital_reserves (id, project_id, reserve_type, required_amount, allocated_amount, interest_rate, status, created_at) VALUES ('${r.id}', '${r.projectId}', '${r.reserveType}', ${r.requiredAmount}, ${r.allocatedAmount}, ${r.interestRate}, '${r.status}', '${r.createdAt}');`
		);
	}

	// Document Records
	for (const d of data.documentRecords) {
		statements.push(
			`INSERT OR REPLACE INTO document_records (id, parent_entity_type, parent_id, file_name, blob_key, file_type, status, created_at) VALUES ('${d.id}', '${d.parentEntityType}', '${d.parentId}', '${d.fileName.replace(/'/g, "''")}', '${d.blobKey}', '${d.fileType}', '${d.status}', '${d.createdAt}');`
		);
	}

	// Audit Logs
	for (const l of data.auditLogs) {
		statements.push(
			`INSERT OR REPLACE INTO audit_logs (id, user_id, action, target_entity, details, timestamp) VALUES ('${l.id}', '${l.userId}', '${l.action}', '${l.targetEntity}', '${l.details.replace(/'/g, "''")}', '${l.timestamp}');`
		);
	}

	return statements.join('\n');
}

// Generate the seed.sql file when executed directly
const sql = generateSeedSql();
const outPath = path.resolve(process.cwd(), 'src/lib/server/db/seed.sql');
fs.writeFileSync(outPath, sql, 'utf8');
console.log(`[✓] Seed SQL generated successfully at ${outPath}`);
