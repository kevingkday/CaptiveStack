import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

// Role-Based Access Control (RBAC) Enums
export const USER_ROLES = [
	'Admin',
	'CaptiveStackAdministrator',
	'AssociationAdministrator',
	'AssociationMember',
	'AdviserReviewer'
] as const;
export type UserRole = (typeof USER_ROLES)[number];

// Project Stages
export const PROJECT_STAGES = [
	'Intake',
	'Outreach',
	'DataCollection',
	'Review',
	'Feasibility',
	'ActuarialReview',
	'CapitalFormation',
	'Domicile',
	'Bound'
] as const;
export type ProjectStage = (typeof PROJECT_STAGES)[number];

// Capital Reserve Types
export const RESERVE_TYPES = ['LOC_Replacement', 'Cash_Reserve'] as const;
export type ReserveType = (typeof RESERVE_TYPES)[number];

// Capital Reserve Status
export const RESERVE_STATUSES = ['Pending', 'Pledged', 'Funded', 'Released'] as const;
export type ReserveStatus = (typeof RESERVE_STATUSES)[number];

// Document Statuses
export const DOCUMENT_STATUSES = ['PendingUpload', 'Verified', 'Archived', 'Rejected'] as const;
export type DocumentStatus = (typeof DOCUMENT_STATUSES)[number];

// Feasibility Statuses
export const FEASIBILITY_STATUSES = ['Draft', 'Submitted', 'UnderReview', 'Approved', 'Rejected'] as const;
export type FeasibilityStatus = (typeof FEASIBILITY_STATUSES)[number];

// ==========================================
// 1. Users Table
// ==========================================
export const users = sqliteTable('users', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	email: text('email').notNull().unique(),
	name: text('name').notNull(),
	role: text('role', { enum: USER_ROLES }).notNull().default('AssociationMember'),
	passwordHash: text('password_hash').notNull(),
	createdAt: text('created_at')
		.notNull()
		.$defaultFn(() => new Date().toISOString())
});

// ==========================================
// 2. Sessions Table
// ==========================================
export const sessions = sqliteTable('sessions', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
	createdAt: text('created_at')
		.notNull()
		.$defaultFn(() => new Date().toISOString())
});

// ==========================================
// 3. Associations Table
// ==========================================
export const associations = sqliteTable('associations', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text('name').notNull(),
	legalEntityType: text('legal_entity_type').notNull(),
	industrySlug: text('industry_slug').notNull().unique(),
	contactEmail: text('contact_email').notNull(),
	createdAt: text('created_at')
		.notNull()
		.$defaultFn(() => new Date().toISOString())
});

// ==========================================
// 4. Projects Table
// ==========================================
export const projects = sqliteTable('projects', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	associationId: text('association_id')
		.notNull()
		.references(() => associations.id, { onDelete: 'cascade' }),
	name: text('name').notNull(),
	stage: text('stage', { enum: PROJECT_STAGES }).notNull().default('Intake'),
	combinedRatioTarget: real('combined_ratio_target').notNull().default(0.85),
	createdAt: text('created_at')
		.notNull()
		.$defaultFn(() => new Date().toISOString())
});

// ==========================================
// 5. Feasibility Assessments Table
// ==========================================
export const feasibilityAssessments = sqliteTable('feasibility_assessments', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	email: text('email').notNull(),
	organizationType: text('organization_type').notNull(),
	primaryConcern: text('primary_concern').notNull(),
	annualPremium: real('annual_premium').notNull(),
	fiveYearLosses: real('5yr_losses').notNull(),
	lossRatio: real('loss_ratio').notNull(),
	fitScore: integer('fit_score').notNull(),
	status: text('status', { enum: FEASIBILITY_STATUSES }).notNull().default('Submitted'),
	createdAt: text('created_at')
		.notNull()
		.$defaultFn(() => new Date().toISOString())
});

// ==========================================
// 6. Member Surveys Table (Steps 1-11)
// ==========================================
export const memberSurveys = sqliteTable('member_surveys', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	projectId: text('project_id')
		.notNull()
		.references(() => projects.id, { onDelete: 'cascade' }),
	memberId: text('member_id').references(() => users.id, { onDelete: 'set null' }),
	token: text('token').notNull().unique(),
	stepCompleted: integer('step_completed').notNull().default(1),
	payload: text('payload', { mode: 'json' }).notNull(),
	isCertified: integer('is_certified', { mode: 'boolean' }).notNull().default(false),
	createdAt: text('created_at')
		.notNull()
		.$defaultFn(() => new Date().toISOString())
});

// ==========================================
// 7. Capital Reserves Table (LOC Replacement)
// ==========================================
export const capitalReserves = sqliteTable('capital_reserves', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	projectId: text('project_id')
		.notNull()
		.references(() => projects.id, { onDelete: 'cascade' }),
	reserveType: text('reserve_type', { enum: RESERVE_TYPES }).notNull(),
	requiredAmount: real('required_amount').notNull(),
	allocatedAmount: real('allocated_amount').notNull().default(0.0),
	interestRate: real('interest_rate').notNull().default(0.0),
	status: text('status', { enum: RESERVE_STATUSES }).notNull().default('Pending'),
	createdAt: text('created_at')
		.notNull()
		.$defaultFn(() => new Date().toISOString())
});

// ==========================================
// 8. Document Records Table (Presigned URLs)
// ==========================================
export const documentRecords = sqliteTable('document_records', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	parentEntityType: text('parent_entity_type', {
		enum: ['Project', 'MemberSurvey', 'Association', 'FeasibilityAssessment']
	}).notNull(),
	parentId: text('parent_id').notNull(),
	fileName: text('file_name').notNull(),
	blobKey: text('blob_key').notNull(),
	fileType: text('file_type').notNull(),
	status: text('status', { enum: DOCUMENT_STATUSES }).notNull().default('PendingUpload'),
	createdAt: text('created_at')
		.notNull()
		.$defaultFn(() => new Date().toISOString())
});

// ==========================================
// 9. Audit Logs Table
// ==========================================
export const auditLogs = sqliteTable('audit_logs', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	userId: text('user_id').references(() => users.id, { onDelete: 'set null' }),
	action: text('action').notNull(),
	targetEntity: text('target_entity').notNull(),
	details: text('details', { mode: 'json' }),
	timestamp: text('timestamp')
		.notNull()
		.$defaultFn(() => new Date().toISOString())
});

// ==========================================
// Relations Definitions
// ==========================================
export const usersRelations = relations(users, ({ many }) => ({
	sessions: many(sessions),
	memberSurveys: many(memberSurveys),
	auditLogs: many(auditLogs)
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id]
	})
}));

export const associationsRelations = relations(associations, ({ many }) => ({
	projects: many(projects)
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
	association: one(associations, {
		fields: [projects.associationId],
		references: [associations.id]
	}),
	memberSurveys: many(memberSurveys),
	capitalReserves: many(capitalReserves)
}));

export const memberSurveysRelations = relations(memberSurveys, ({ one }) => ({
	project: one(projects, {
		fields: [memberSurveys.projectId],
		references: [projects.id]
	}),
	member: one(users, {
		fields: [memberSurveys.memberId],
		references: [users.id]
	})
}));

export const capitalReservesRelations = relations(capitalReserves, ({ one }) => ({
	project: one(projects, {
		fields: [capitalReserves.projectId],
		references: [projects.id]
	})
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
	user: one(users, {
		fields: [auditLogs.userId],
		references: [users.id]
	})
}));

// Inferred TypeScript Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;

export type Association = typeof associations.$inferSelect;
export type NewAssociation = typeof associations.$inferInsert;

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;

export type FeasibilityAssessment = typeof feasibilityAssessments.$inferSelect;
export type NewFeasibilityAssessment = typeof feasibilityAssessments.$inferInsert;

export type MemberSurvey = typeof memberSurveys.$inferSelect;
export type NewMemberSurvey = typeof memberSurveys.$inferInsert;

export type CapitalReserve = typeof capitalReserves.$inferSelect;
export type NewCapitalReserve = typeof capitalReserves.$inferInsert;

export type DocumentRecord = typeof documentRecords.$inferSelect;
export type NewDocumentRecord = typeof documentRecords.$inferInsert;

export type AuditLog = typeof auditLogs.$inferSelect;
export type NewAuditLog = typeof auditLogs.$inferInsert;
