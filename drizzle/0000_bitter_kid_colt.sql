CREATE TABLE `associations` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`legal_entity_type` text NOT NULL,
	`industry_slug` text NOT NULL,
	`contact_email` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `associations_industry_slug_unique` ON `associations` (`industry_slug`);--> statement-breakpoint
CREATE TABLE `audit_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`action` text NOT NULL,
	`target_entity` text NOT NULL,
	`details` text,
	`timestamp` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `capital_reserves` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`reserve_type` text NOT NULL,
	`required_amount` real NOT NULL,
	`allocated_amount` real DEFAULT 0 NOT NULL,
	`interest_rate` real DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'Pending' NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `document_records` (
	`id` text PRIMARY KEY NOT NULL,
	`parent_entity_type` text NOT NULL,
	`parent_id` text NOT NULL,
	`file_name` text NOT NULL,
	`blob_key` text NOT NULL,
	`file_type` text NOT NULL,
	`status` text DEFAULT 'PendingUpload' NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `feasibility_assessments` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`organization_type` text NOT NULL,
	`primary_concern` text NOT NULL,
	`annual_premium` real NOT NULL,
	`5yr_losses` real NOT NULL,
	`loss_ratio` real NOT NULL,
	`fit_score` integer NOT NULL,
	`status` text DEFAULT 'Submitted' NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `member_surveys` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`member_id` text,
	`token` text NOT NULL,
	`step_completed` integer DEFAULT 1 NOT NULL,
	`payload` text NOT NULL,
	`is_certified` integer DEFAULT false NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`member_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `member_surveys_token_unique` ON `member_surveys` (`token`);--> statement-breakpoint
CREATE TABLE `projects` (
	`id` text PRIMARY KEY NOT NULL,
	`association_id` text NOT NULL,
	`name` text NOT NULL,
	`stage` text DEFAULT 'Intake' NOT NULL,
	`combined_ratio_target` real DEFAULT 0.85 NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`association_id`) REFERENCES `associations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`role` text DEFAULT 'AssociationMember' NOT NULL,
	`password_hash` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);