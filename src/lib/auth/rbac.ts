export const USER_ROLES = [
	'Admin',
	'CaptiveStackAdministrator',
	'AssociationAdministrator',
	'AssociationMember',
	'AdviserReviewer'
] as const;
export type UserRole = (typeof USER_ROLES)[number];

export interface RoleConfig {
	displayName: string;
	description: string;
	badgeClass: string;
	allowedPrefixes: string[];
}

export const ROLE_CONFIGS: Record<UserRole, RoleConfig> = {
	Admin: {
		displayName: 'System Administrator',
		description: 'Full platform administration, infrastructure configuration, and tenant oversight.',
		badgeClass: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
		allowedPrefixes: ['/admin', '/portal', '/association', '/review']
	},
	CaptiveStackAdministrator: {
		displayName: 'CaptiveStack Platform CSA',
		description: 'Chief Underwriting, cross-association actuarial review, and capital reserves gating.',
		badgeClass: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
		allowedPrefixes: ['/admin', '/portal', '/association', '/review']
	},
	AssociationAdministrator: {
		displayName: 'Association Administrator',
		description: 'Trade group executive oversight, member survey campaigns, and captive pool tracking.',
		badgeClass: 'bg-brand-500/15 text-brand-300 border-brand-500/30',
		allowedPrefixes: ['/association', '/portal']
	},
	AssociationMember: {
		displayName: 'Association Member',
		description: 'Member data intake, 11-step survey submissions, loss run uploads, and certification.',
		badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
		allowedPrefixes: ['/portal']
	},
	AdviserReviewer: {
		displayName: 'Adviser Reviewer',
		description: 'Independent actuary, legal counsel, and captive manager auditing milestones.',
		badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
		allowedPrefixes: ['/review', '/portal']
	}
};

/**
 * Checks if a given user role is permitted to access a path.
 */
export function isRouteAllowed(role: UserRole | undefined | null, pathname: string): boolean {
	if (!role) return false;
	if (role === 'Admin' || role === 'CaptiveStackAdministrator') return true;

	const config = ROLE_CONFIGS[role];
	if (!config) return false;

	return config.allowedPrefixes.some((prefix) => pathname.startsWith(prefix));
}
