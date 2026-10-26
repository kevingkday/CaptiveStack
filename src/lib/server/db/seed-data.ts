export interface SeedData {
	users: Array<{
		id: string;
		email: string;
		name: string;
		role: 'Admin' | 'CaptiveStackAdministrator' | 'AssociationAdministrator' | 'AssociationMember' | 'AdviserReviewer';
		passwordHash: string;
		createdAt: string;
	}>;
	associations: Array<{
		id: string;
		name: string;
		legalEntityType: string;
		industrySlug: string;
		contactEmail: string;
		createdAt: string;
	}>;
	projects: Array<{
		id: string;
		associationId: string;
		name: string;
		stage: 'Intake' | 'Outreach' | 'DataCollection' | 'Review' | 'Feasibility' | 'ActuarialReview' | 'CapitalFormation' | 'Domicile' | 'Bound';
		combinedRatioTarget: number;
		createdAt: string;
	}>;
	feasibilityAssessments: Array<{
		id: string;
		email: string;
		organizationType: string;
		primaryConcern: string;
		annualPremium: number;
		fiveYearLosses: number;
		lossRatio: number;
		fitScore: number;
		status: 'Draft' | 'Submitted' | 'UnderReview' | 'Approved' | 'Rejected';
		createdAt: string;
	}>;
	memberSurveys: Array<{
		id: string;
		projectId: string;
		memberId: string;
		token: string;
		stepCompleted: number;
		payload: string;
		isCertified: number;
		createdAt: string;
	}>;
	capitalReserves: Array<{
		id: string;
		projectId: string;
		reserveType: 'LOC_Replacement' | 'Cash_Reserve';
		requiredAmount: number;
		allocatedAmount: number;
		interestRate: number;
		status: 'Pending' | 'Pledged' | 'Funded' | 'Released';
		createdAt: string;
	}>;
	documentRecords: Array<{
		id: string;
		parentEntityType: 'Project' | 'MemberSurvey' | 'Association' | 'FeasibilityAssessment';
		parentId: string;
		fileName: string;
		blobKey: string;
		fileType: string;
		status: 'PendingUpload' | 'Verified' | 'Archived' | 'Rejected';
		createdAt: string;
	}>;
	auditLogs: Array<{
		id: string;
		userId: string;
		action: string;
		targetEntity: string;
		details: string;
		timestamp: string;
	}>;
}

const now = new Date().toISOString();

export const seedData: SeedData = {
	users: [
		{
			id: 'usr_admin_001',
			email: 'admin@captivestack.com',
			name: 'CaptiveStack System Admin',
			role: 'Admin',
			passwordHash: '$2a$12$e9qO2qS4.K9Xw3fJ1O/1MeFp5KxR4zW1V8P6C0H7B2M4D5F8A1G2H',
			createdAt: now
		},
		{
			id: 'usr_csa_002',
			email: 'csa@captivestack.com',
			name: 'Sarah Underwriter (Platform CSA)',
			role: 'CaptiveStackAdministrator',
			passwordHash: '$2a$12$e9qO2qS4.K9Xw3fJ1O/1MeFp5KxR4zW1V8P6C0H7B2M4D5F8A1G2H',
			createdAt: now
		},
		{
			id: 'usr_assoc_admin_003',
			email: 'admin@glassco.org',
			name: 'David Vance (GlassCo Exec Director)',
			role: 'AssociationAdministrator',
			passwordHash: '$2a$12$e9qO2qS4.K9Xw3fJ1O/1MeFp5KxR4zW1V8P6C0H7B2M4D5F8A1G2H',
			createdAt: now
		},
		{
			id: 'usr_assoc_member_004',
			email: 'marcus@autoglasspro.com',
			name: 'Marcus Miller (GlassCo Dealer)',
			role: 'AssociationMember',
			passwordHash: '$2a$12$e9qO2qS4.K9Xw3fJ1O/1MeFp5KxR4zW1V8P6C0H7B2M4D5F8A1G2H',
			createdAt: now
		},
		{
			id: 'usr_actuary_005',
			email: 'elena@actuarialrisk.com',
			name: 'Dr. Elena Rostova (Adviser Reviewer)',
			role: 'AdviserReviewer',
			passwordHash: '$2a$12$e9qO2qS4.K9Xw3fJ1O/1MeFp5KxR4zW1V8P6C0H7B2M4D5F8A1G2H',
			createdAt: now
		}
	],
	associations: [
		{
			id: 'asc_glassco_001',
			name: 'GlassCo Association',
			legalEntityType: '501(c)(6) Trade Association',
			industrySlug: 'glass-replacement',
			contactEmail: 'admin@glassco.org',
			createdAt: now
		},
		{
			id: 'asc_eagle1_002',
			name: 'American Hole-in-One Association',
			legalEntityType: 'Risk Retention Group Sponsor',
			industrySlug: 'sports-prize-indemnity',
			contactEmail: 'pilot@eagle1coverage.com',
			createdAt: now
		}
	],
	projects: [
		{
			id: 'prj_eagle1_pilot',
			associationId: 'asc_eagle1_002',
			name: 'Eagle1 Hole-in-One Prize Indemnity Captive',
			stage: 'CapitalFormation',
			combinedRatioTarget: 0.78,
			createdAt: now
		},
		{
			id: 'prj_glassco_pool',
			associationId: 'asc_glassco_001',
			name: 'GlassCo Replacement Warranty Group Captive',
			stage: 'DataCollection',
			combinedRatioTarget: 0.85,
			createdAt: now
		}
	],
	feasibilityAssessments: [
		{
			id: 'fea_eagle1_001',
			email: 'pilot@eagle1coverage.com',
			organizationType: 'Sports & Entertainment Trade Group',
			primaryConcern: 'Volatile Prize Insurance Premiums & High Reinsurer Margins',
			annualPremium: 1850000.0,
			fiveYearLosses: 620000.0,
			lossRatio: 0.335,
			fitScore: 94,
			status: 'Approved',
			createdAt: now
		},
		{
			id: 'fea_glassco_002',
			email: 'admin@glassco.org',
			organizationType: 'Mid-Market Automotive Glass Contractors',
			primaryConcern: 'OEM Windshield Part Spikes & Commercial Auto Retention',
			annualPremium: 4200000.0,
			fiveYearLosses: 2400000.0,
			lossRatio: 0.571,
			fitScore: 88,
			status: 'UnderReview',
			createdAt: now
		}
	],
	memberSurveys: [
		{
			id: 'msv_eagle1_demo',
			projectId: 'prj_eagle1_pilot',
			memberId: 'usr_assoc_member_004',
			token: 'tk_eagle1_intake_verified_2026',
			stepCompleted: 8,
			payload: JSON.stringify({
				annualTournaments: 42,
				avgPrizeValue: 35000,
				holeDistanceYards: 165,
				witnessProtocolCertification: true,
				priorFiveYearClaims: 2,
				preferredLOCReplacementReserve: true
			}),
			isCertified: 0,
			createdAt: now
		}
	],
	capitalReserves: [
		{
			id: 'res_eagle1_loc_01',
			projectId: 'prj_eagle1_pilot',
			reserveType: 'LOC_Replacement',
			requiredAmount: 1500000.0,
			allocatedAmount: 1125000.0,
			interestRate: 6.25,
			status: 'Pledged',
			createdAt: now
		},
		{
			id: 'res_eagle1_cash_02',
			projectId: 'prj_eagle1_pilot',
			reserveType: 'Cash_Reserve',
			requiredAmount: 500000.0,
			allocatedAmount: 500000.0,
			interestRate: 4.5,
			status: 'Funded',
			createdAt: now
		},
		{
			id: 'res_glassco_loc_03',
			projectId: 'prj_glassco_pool',
			reserveType: 'LOC_Replacement',
			requiredAmount: 2500000.0,
			allocatedAmount: 850000.0,
			interestRate: 5.75,
			status: 'Pending',
			createdAt: now
		}
	],
	documentRecords: [
		{
			id: 'doc_eagle1_actuarial',
			parentEntityType: 'Project',
			parentId: 'prj_eagle1_pilot',
			fileName: 'Eagle1_Actuarial_Feasibility_Study_2026.pdf',
			blobKey: 'projects/prj_eagle1_pilot/actuarial_study_v1.pdf',
			fileType: 'application/pdf',
			status: 'Verified',
			createdAt: now
		},
		{
			id: 'doc_glassco_lossruns',
			parentEntityType: 'Project',
			parentId: 'prj_glassco_pool',
			fileName: 'GlassCo_Aggregated_Loss_Runs_2021_2025.xlsx',
			blobKey: 'projects/prj_glassco_pool/loss_runs_v2.xlsx',
			fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			status: 'Verified',
			createdAt: now
		}
	],
	auditLogs: [
		{
			id: 'aud_seed_001',
			userId: 'usr_admin_001',
			action: 'DATABASE_INITIALIZED',
			targetEntity: 'System',
			details: JSON.stringify({
				version: 'v2.0.0-edge',
				pilot: 'Eagle1 Hole-in-One Prize Coverage',
				association: 'GlassCo Association'
			}),
			timestamp: now
		}
	]
};
