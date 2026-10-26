export interface LossRunDocumentItem {
	documentId: string;
	fileName: string;
	blobKey: string;
	fileSize: number;
	fileType: string;
	uploadedAt: string;
	status: 'PendingUpload' | 'Verified' | 'Archived' | 'Rejected';
	downloadUrl?: string;
}

export interface MemberSurveyPayload {
	// Step 1: Organization & Entity Profile
	organizationName: string;
	dba: string;
	fein: string;
	entityType: string;
	stateOfIncorporation: string;
	primaryOperatingLocations: string;
	contactName: string;
	contactEmail: string;
	contactPhone: string;

	// Step 2: Operations & Program Scope
	primaryActivities: string;
	industrySpecialization: 'Golf Prize Indemnity' | 'Automotive Glass Replacement' | 'Commercial Specialty ART';
	annualRevenue: number;
	yearsInBusiness: number;
	fullTimeEmployees: number;

	// Step 3: Current Commercial Coverage
	currentCarrier: string;
	currentAnnualPremium: number;
	policyExpirationDate: string;
	currentPerOccurrenceDeductible: number;
	currentAggregateLimit: number;

	// Step 4: Historical Exposure Metrics
	annualExposureVolume: number; // e.g. tournaments count or windshield installations
	averageInsuredExposureValue: number; // e.g. average prize or replacement cost
	serviceVehiclesCount: number;
	certifiedStaffPercentage: number;

	// Step 5: 5-Year Loss History & Claims Experience
	fiveYearTotalClaimsCount: number;
	fiveYearTotalIncurredLosses: number;
	largestSingleClaimAmount: number;
	openClaimsCount: number;
	openClaimsReservedAmount: number;

	// Step 6: Loss Run Document Upload
	lossRunDocuments: LossRunDocumentItem[];

	// Step 7: Risk Mitigation & Safety Protocols
	formalSafetyProtocolsCertified: boolean;
	adasCalibrationStandardsCompliant: boolean; // For GlassCo
	independentWitnessProtocolEnforced: boolean; // For Eagle1
	backgroundChecksConducted: boolean;
	fraudMitigationPlanDetails: string;

	// Step 8: Captive Retention & Deductible Preferences
	preferredRetentionPerOccurrence: number; // e.g. $5,000, $10,000, $25,000
	aggregateStopLossPreference: boolean;
	riskToleranceLevel: 'Conservative' | 'Balanced' | 'Aggressive';

	// Step 9: Capital Reserves & LOC Replacement
	willingnessToPledgeCapital: boolean;
	pledgedStandbyCapitalAmount: number; // Pledged standby letter of credit replacement
	preferredCapitalYieldRate: number; // e.g. 6.25%
	capitalFundingType: 'Standby_Cash' | 'LOC_Replacement' | 'Hybrid_Pledge';

	// Step 10: Reinsurance & Quota Share Acknowledgement
	reinsuranceQuotaShareAcknowledged: boolean;
	surplusDistributionPolicyAcknowledged: boolean;
	regulatoryDomicileAcknowledged: boolean; // e.g. Vermont / Delaware / Bermuda

	// Step 11: Review, Legal Attestation & Certification
	officerSignature: string;
	officerTitle: string;
	attestationCertified: boolean;
	certifiedAt?: string;
}

export interface SurveyStepMeta {
	stepNumber: number;
	title: string;
	shortTitle: string;
	category: string;
	description: string;
}

export const SURVEY_STEPS: SurveyStepMeta[] = [
	{
		stepNumber: 1,
		title: 'Organization & Entity Profile',
		shortTitle: 'Entity Profile',
		category: 'Identification',
		description: 'Verify legal business details, FEIN, and association membership credentials.'
	},
	{
		stepNumber: 2,
		title: 'Operations & Program Scope',
		shortTitle: 'Operations',
		category: 'Underwriting Scope',
		description: 'Outline business operations, commercial volume, and specialized lines of coverage.'
	},
	{
		stepNumber: 3,
		title: 'Current Commercial Coverage',
		shortTitle: 'Current Policies',
		category: 'Baseline Coverage',
		description: 'Detail existing commercial insurance carriers, expiring premiums, and deductibles.'
	},
	{
		stepNumber: 4,
		title: 'Historical Exposure Metrics',
		shortTitle: 'Exposures',
		category: 'Exposure Units',
		description: 'Enter measurable exposure units (annual tournament count, glass repairs, vehicle fleets).'
	},
	{
		stepNumber: 5,
		title: '5-Year Loss History & Claims',
		shortTitle: '5-Yr Losses',
		category: 'Actuarial Claims',
		description: 'Record aggregate historical losses, claim frequency, severity, and open reserves.'
	},
	{
		stepNumber: 6,
		title: 'Loss Run Document Upload',
		shortTitle: 'Loss Runs',
		category: 'Verification Docs',
		description: 'Upload official carrier loss run spreadsheets (XLS) and policy declarations (PDF).'
	},
	{
		stepNumber: 7,
		title: 'Risk Mitigation & Protocols',
		shortTitle: 'Safety Controls',
		category: 'Loss Prevention',
		description: 'Confirm witness attestations, ADAS safety calibration compliance, and risk controls.'
	},
	{
		stepNumber: 8,
		title: 'Captive Retention Preferences',
		shortTitle: 'Retention Appetite',
		category: 'Structure',
		description: 'Select member deductible appetites and aggregate stop-loss preferences.'
	},
	{
		stepNumber: 9,
		title: 'Capital Reserves & LOC Replacement',
		shortTitle: 'LOC Capital',
		category: 'Capital Formation',
		description: 'Participate in the pooled capital reserve facility to replace bank Letters of Credit.'
	},
	{
		stepNumber: 10,
		title: 'Reinsurance & Quota Share',
		shortTitle: 'Quota Share',
		category: 'Governance',
		description: 'Review and acknowledge underwriting quota share, domicile, and surplus participation.'
	},
	{
		stepNumber: 11,
		title: 'Attestation & Officer Certification',
		shortTitle: 'Certification',
		category: 'Legal Attestation',
		description: 'Execute officer signature and submit formal certified intake packet.'
	}
];

export function getDefaultSurveyPayload(): MemberSurveyPayload {
	return {
		organizationName: 'AutoGlass Pro Solutions LLC',
		dba: 'GlassCo Certified Dealer #104',
		fein: '84-9382104',
		entityType: 'Limited Liability Company (LLC)',
		stateOfIncorporation: 'Delaware',
		primaryOperatingLocations: 'Austin, TX; San Antonio, TX',
		contactName: 'Marcus Miller',
		contactEmail: 'marcus@autoglasspro.com',
		contactPhone: '(512) 555-0198',

		primaryActivities: 'Commercial and fleet windshield replacement, ADAS sensor calibration, mobile repair.',
		industrySpecialization: 'Automotive Glass Replacement',
		annualRevenue: 4850000,
		yearsInBusiness: 12,
		fullTimeEmployees: 24,

		currentCarrier: 'Travelers Commercial Specialty',
		currentAnnualPremium: 215000,
		policyExpirationDate: '2026-12-31',
		currentPerOccurrenceDeductible: 5000,
		currentAggregateLimit: 2000000,

		annualExposureVolume: 3400,
		averageInsuredExposureValue: 620,
		serviceVehiclesCount: 16,
		certifiedStaffPercentage: 92,

		fiveYearTotalClaimsCount: 14,
		fiveYearTotalIncurredLosses: 84500,
		largestSingleClaimAmount: 18200,
		openClaimsCount: 1,
		openClaimsReservedAmount: 6500,

		lossRunDocuments: [
			{
				documentId: 'doc_seed_lossrun_01',
				fileName: 'AutoGlassPro_LossRuns_2021_2025.xlsx',
				blobKey: 'loss-runs/autoglass-pro/2021-2025.xlsx',
				fileSize: 428000,
				fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
				uploadedAt: '2026-10-24T18:30:00Z',
				status: 'Verified',
				downloadUrl: '#'
			}
		],

		formalSafetyProtocolsCertified: true,
		adasCalibrationStandardsCompliant: true,
		independentWitnessProtocolEnforced: true,
		backgroundChecksConducted: true,
		fraudMitigationPlanDetails: 'Dual-technician verification on all claims over $1,500 with mandatory photo timestamping.',

		preferredRetentionPerOccurrence: 10000,
		aggregateStopLossPreference: true,
		riskToleranceLevel: 'Balanced',

		willingnessToPledgeCapital: true,
		pledgedStandbyCapitalAmount: 75000,
		preferredCapitalYieldRate: 6.25,
		capitalFundingType: 'LOC_Replacement',

		reinsuranceQuotaShareAcknowledged: true,
		surplusDistributionPolicyAcknowledged: true,
		regulatoryDomicileAcknowledged: true,

		officerSignature: 'Marcus Miller',
		officerTitle: 'Managing Principal & Founder',
		attestationCertified: false
	};
}
