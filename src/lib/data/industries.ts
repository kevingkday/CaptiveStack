export interface IndustryConfig {
	slug: string;
	name: string;
	shortTitle: string;
	badge: string;
	heroHeadline: string;
	subheadline: string;
	marketCrisis: string;
	coveragePainPoints: Array<{
		title: string;
		description: string;
	}>;
	howGroupCaptiveApplies: string;
	keyBenefits: string[];
	illustrativeExample: {
		title: string;
		cohortDescription: string;
		memberCount: number;
		combinedAnnualPremium: string;
		traditionalLossRatio: string;
		illustrative5YrSurplusRetention: string;
		collateralSavings: string;
		disclaimerNotice: string;
	};
	typicalLines: string[];
	readinessParam: string;
}

export const INDUSTRIES: IndustryConfig[] = [
	{
		slug: 'contractors',
		name: 'Trade Contractors & Construction',
		shortTitle: 'Contractors',
		badge: 'Trade & Specialty Contractors',
		heroHeadline: 'Group Captive Insurance for Trade & Specialty Contractors',
		subheadline:
			'Tired of soaring General Liability rates and subcontractor exclusions? Pool risk with quality contractors, stabilize long-term rates, and participate directly in underwriting profits.',
		marketCrisis:
			'Commercial P&C carriers are drastically restricting capacity for residential and commercial trade contractors. Blanket exclusions for action-over claims, residential work, and prior acts leave contractors dangerously exposed while annual renewal premiums continue to rise.',
		coveragePainPoints: [
			{
				title: 'Action-Over & Labor Law Exclusions',
				description:
					'Carriers insert restrictive sub-limits or eliminate coverage for third-party indemnification claims on commercial job sites.'
			},
			{
				title: 'Subcontractor Liability Gaps',
				description:
					'Strict warranty conditions in commercial policies void coverage if a downstream trade has a minor certificate flaw.'
			},
			{
				title: 'Trapped Premium Capital',
				description:
					'Disciplined contractors with zero claims subsidize careless competitors in traditional multi-industry commercial pools.'
			}
		],
		howGroupCaptiveApplies:
			'A member-owned group captive allows regional trade contractors with verified safety practices to pool their General Liability, Workers’ Comp, and Inland Marine exposures. Members control claims investigations, enforce trade-specific job safety guidelines, and retain underwriting surplus.',
		keyBenefits: [
			'Custom policy wording with trade-specific endorsements',
			'Underwriting surplus retention returned to members',
			'Direct member oversight on third-party claims defense',
			'Multi-year rate stability insulated from carrier market cycles'
		],
		illustrativeExample: {
			title: 'Regional Specialty Contractors Group (Illustrative Example)',
			cohortDescription: 'A coalition of 24 commercial drywall, electrical, and mechanical contractors.',
			memberCount: 24,
			combinedAnnualPremium: '$2,850,000 USD',
			traditionalLossRatio: '34% Historical 5-Year Loss Ratio',
			illustrative5YrSurplusRetention: '$1,420,000 – $2,100,000 (Illustrative Range)',
			collateralSavings: '$140,000 in avoided bank LOC commitment fees',
			disclaimerNotice:
				'Illustrative example only; not an actuarial opinion or guarantee. Actual results depend on loss experience, fronting fees, and domicile regulatory approval.'
		},
		typicalLines: ['Commercial General Liability', "Workers' Compensation", 'Commercial Auto', 'Inland Marine & Equipment'],
		readinessParam: 'Contractors'
	},
	{
		slug: 'transportation',
		name: 'Trucking & Fleet Transportation',
		shortTitle: 'Transportation',
		badge: 'Motor Carriers & Logistics',
		heroHeadline: 'Member-Owned Captive Risk Solutions for Fleet Transportation',
		subheadline:
			'Overcome nuclear verdicts and escalating auto liability deductibles. Safe motor carriers can band together to stabilize insurance costs and take control of claims handling.',
		marketCrisis:
			'The commercial transportation insurance market has hardened severely due to nuclear verdicts and excessive litigation. Fleets face annual rate hikes regardless of clean telematics records, while primary carriers demand unsustainable deductibles.',
		coveragePainPoints: [
			{
				title: 'Escalating Auto Liability Premiums',
				description:
					'Primary commercial auto rates have climbed over 60% across North America, penalizing fleets that invest heavily in dashcams and driver safety.'
			},
			{
				title: 'Rigid Reinsurance Attachment Points',
				description:
					'Conventional excess towers require high self-insured retentions ($250,000+ per power unit) without offering commensurate premium reductions.'
			},
			{
				title: 'Disputed Cargo & Delay Exclusions',
				description:
					'Commercial underwriters aggressively narrow motor truck cargo definitions and introduce strict refrigeration loss limitations.'
			}
		],
		howGroupCaptiveApplies:
			'A transportation group captive enables qualified fleets to retain the primary layer (e.g. $250k–$500k per occurrence) where loss frequency is manageable and telematics investments pay off. Excess stop-loss reinsurance attaches above the captive layer, capping member exposure.',
		keyBenefits: [
			'Telematics-driven safety credits directly reward safe operators',
			'Prompt, specialized crash investigation and defense management',
			'Pooled standby collateral to satisfy fronting carrier LOC requirements',
			'Underwriting profits remain in member fleet treasuries'
		],
		illustrativeExample: {
			title: 'Midwest Intermodal Carrier Coalition (Illustrative Example)',
			cohortDescription: 'A group of 18 regional dry van and refrigerated motor carriers operating 420 power units.',
			memberCount: 18,
			combinedAnnualPremium: '$4,200,000 USD',
			traditionalLossRatio: '46% Incurred Loss Ratio',
			illustrative5YrSurplusRetention: '$1,850,000 – $2,650,000 (Illustrative Range)',
			collateralSavings: '$210,000 in avoided bank letter of credit fees',
			disclaimerNotice:
				'Illustrative example only; not an actuarial opinion or guarantee. Transportation captives require qualified safety profiles and fronting carrier review.'
		},
		typicalLines: ['Commercial Auto Liability', 'Physical Damage', 'Motor Truck Cargo', 'General Liability'],
		readinessParam: 'Transportation'
	},
	{
		slug: 'healthcare',
		name: 'Dental & Medical Practices',
		shortTitle: 'Healthcare',
		badge: 'Physicians & Dental Groups',
		heroHeadline: 'Healthcare Group Captive Solutions for Medical & Dental Groups',
		subheadline:
			'Medical malpractice and regulatory billing risks are increasingly difficult to place in the standard market. Form a group captive to insulate your practice and retain capital.',
		marketCrisis:
			'Specialty healthcare providers face narrowing professional liability coverage, soaring deductibles, and new exclusions for regulatory audits and digital health records breach. Commercial carriers provide zero return when claims are low.',
		coveragePainPoints: [
			{
				title: 'Volatile Medical Malpractice Rates',
				description:
					'Regional medical liability carriers adjust rates based on state-wide jury verdicts rather than individual clinic claim experience.'
			},
			{
				title: 'Regulatory & Billing Defense Limitations',
				description:
					'Standard commercial policies provide sub-limits of $25,000 for Medicare/Medicaid or insurer billing audits, leaving practices underinsured.'
			},
			{
				title: 'Cyber & HIPAA Regulatory Penalties',
				description:
					'Off-the-shelf cyber policies contain onerous multi-factor authentication warranties that can void coverage during a breach.'
			}
		],
		howGroupCaptiveApplies:
			'A group captive allows medical associations, physician syndicates, and dental practice networks to write tailored professional liability forms, establish peer-led medical review boards, and retain the underwriting surplus historically kept by commercial insurers.',
		keyBenefits: [
			'Doctor-led claims committees protect professional reputation',
			'Custom regulatory billing audit and HIPAA defense endorsements',
			'Substantial long-term dividend potential for low-claim practices',
			'Insulation from state-wide malpractice insurance market fluctuations'
		],
		illustrativeExample: {
			title: 'Regional Dental Surgeons Association (Illustrative Example)',
			cohortDescription: 'A regional group of 36 independent oral surgery and specialized dental clinics.',
			memberCount: 36,
			combinedAnnualPremium: '$1,950,000 USD',
			traditionalLossRatio: '28% 5-Year Average Loss Ratio',
			illustrative5YrSurplusRetention: '$1,200,000 – $1,800,000 (Illustrative Range)',
			collateralSavings: '$95,000 in bank collateral fee savings',
			disclaimerNotice:
				'Illustrative example only; not an actuarial opinion or guarantee. Healthcare captives are subject to domicile regulatory licensing and actuarial feasibility.'
		},
		typicalLines: ['Medical / Professional Malpractice (E&O)', 'Regulatory Billing Audit Defense', 'Healthcare Cyber & HIPAA', 'Commercial General Liability'],
		readinessParam: 'Healthcare'
	},
	{
		slug: 'it-services',
		name: 'IT Providers & Managed Service Providers (MSPs)',
		shortTitle: 'IT & MSPs',
		badge: 'Technology & Cloud Providers',
		heroHeadline: 'Group Captive Insurance for MSPs, Cloud & IT Service Providers',
		subheadline:
			'Overcome uninsurable cyber terms, systemic supply-chain exclusions, and soaring Tech E&O premiums with an association-owned risk transfer structure.',
		marketCrisis:
			'The commercial cyber and Tech E&O market is notoriously volatile. Underwriters impose unworkable exclusions for supply-chain attacks, third-party software vulnerabilities, and wire transfer fraud, while charging double-digit rate increases at every renewal.',
		coveragePainPoints: [
			{
				title: 'Systemic Cyber & Ransomware Exclusions',
				description:
					'Carriers introduce blanket exclusions for zero-day exploits and ransomware co-insurance clauses requiring policyholders to pay 50% of ransom costs.'
			},
			{
				title: 'Contractual Indemnity Gaps',
				description:
					'Enterprise clients demand higher cyber and E&O limits ($5M+) that are cost-prohibitive in the hardening commercial broker market.'
			},
			{
				title: 'Rigid Cyber Security Warranties',
				description:
					'Minor endpoint configuration errors can provide carriers with legal grounds to deny multimillion-dollar breach response claims.'
			}
		],
		howGroupCaptiveApplies:
			'An IT industry group captive unifies peer MSPs that adhere to standardized NIST/SOC-2 cybersecurity frameworks. The captive underwrites primary Tech E&O and Cyber Liability layers, while ceding catastrophic systemic breach risk to global reinsurers.',
		keyBenefits: [
			'Coverage terms tailored specifically to managed service delivery models',
			'Captive reinsurance relationships provide affordable high-limit towers ($10M+)',
			'Incident response panel selected and managed by tech peers, not carrier adjusters',
			'Participating MSPs build long-term equity through retained underwriting profits'
		],
		illustrativeExample: {
			title: 'National Cloud MSP Alliance (Illustrative Example)',
			cohortDescription: 'A consortium of 30 managed service providers managing 85,000 client endpoints.',
			memberCount: 30,
			combinedAnnualPremium: '$2,400,000 USD',
			traditionalLossRatio: '31% Historical Cyber & E&O Loss Ratio',
			illustrative5YrSurplusRetention: '$1,350,000 – $1,950,000 (Illustrative Range)',
			collateralSavings: '$120,000 in alternative collateral fee savings',
			disclaimerNotice:
				'Illustrative example only; not an actuarial opinion or insurance offer. Subject to captive domicile review and reinsurance treaties.'
		},
		typicalLines: ['Technology Errors & Omissions (E&O)', 'Network Security & Cyber Liability', 'First-Party Ransomware & Interruption', 'Commercial Crime / Social Engineering'],
		readinessParam: 'IT_Services'
	},
	{
		slug: 'hospitality',
		name: 'Hospitality, Hotels & Resorts',
		shortTitle: 'Hospitality',
		badge: 'Hotels, Lodging & Venues',
		heroHeadline: 'Group Captive Insurance for Hotels, Resorts & Hospitality Groups',
		subheadline:
			'Escape crippling property rate increases, restrictive storm deductibles, and contentious liability exclusions by forming a hospitality risk retention structure.',
		marketCrisis:
			'Property and casualty insurance in the hospitality sector is under intense pressure. Commercial carriers are slashing property limits, tripling wind/water deductibles, and denying weather or business interruption claims while demanding higher premiums.',
		coveragePainPoints: [
			{
				title: 'Severe Property Deductible Spikes',
				description:
					'Percentage deductibles (3%–5% of Total Insured Value) leave hoteliers bearing millions in out-of-pocket losses after minor storms.'
			},
			{
				title: 'General Liability Slip-and-Fall Claims Inflation',
				description:
					'Third-party premises claims face aggressive plaintiff tactics that commercial adjusters settle hastily, spiking member loss runs.'
			},
			{
				title: 'Liquor & Entertainment Liability Restrictions',
				description:
					'Carriers eliminate assault and battery coverage or refuse to insure properties with banquet or event venues.'
			}
		],
		howGroupCaptiveApplies:
			'Hospitality associations can form a member-owned group captive to fund the working property deductible layer and write primary general liability. High-quality operators who invest in premises safety and risk management recover substantial underwriting margins.',
		keyBenefits: [
			'Deductible buydown protection funded through captive reserves',
			'Dedicated hospitality claims defense preventing nuisance settlements',
			'Custom terms covering specialized resort activities and amenities',
			'Underwriting dividends returned to hotel ownership groups'
		],
		illustrativeExample: {
			title: 'Independent Hotel & Resort Syndicate (Illustrative Example)',
			cohortDescription: 'A group of 22 boutique hotel and resort properties with $140M in Total Insured Value.',
			memberCount: 22,
			combinedAnnualPremium: '$3,100,000 USD',
			traditionalLossRatio: '38% 5-Year Loss Ratio',
			illustrative5YrSurplusRetention: '$1,500,000 – $2,250,000 (Illustrative Range)',
			collateralSavings: '$155,000 in avoided bank LOC costs',
			disclaimerNotice:
				'Illustrative example only; not an actuarial opinion or offer. Actual surplus depends on catastrophic weather events and reinsurance terms.'
		},
		typicalLines: ['Commercial Property & Business Interruption', 'Commercial General Liability', 'Liquor Liability', 'Umbrella / Excess Liability'],
		readinessParam: 'Hospitality'
	},
	{
		slug: 'property-managers',
		name: 'Real Estate & Property Managers',
		shortTitle: 'Property Managers',
		badge: 'Residential & Commercial Real Estate',
		heroHeadline: 'Member-Owned Captive Risk Transfer for Property Managers',
		subheadline:
			'Protect multi-family and commercial real estate portfolios from water damage exclusions, carrier non-renewals, and runaway property deductibles.',
		marketCrisis:
			'Real estate managers face the hardest commercial property market in decades. Aging infrastructure, freeze events, and water damage claims have driven major insurers to pull out of metropolitan multi-family markets entirely.',
		coveragePainPoints: [
			{
				title: 'Water Damage Deductibles & Exclusions',
				description:
					'Carriers impose mandatory $50,000 to $100,000 per-unit water damage deductibles, rendering standard coverage ineffective for routine pipe breaks.'
			},
			{
				title: 'Habitational Liability Rate Surges',
				description:
					'Tenant liability claims and habitability lawsuits have led commercial underwriters to charge steep annual rate increases.'
			},
			{
				title: 'Sudden Carrier Non-Renewals',
				description:
					'Property managers receive non-renewal notices 30 days before expiration, forcing them into expensive surplus-lines policies.'
			}
		],
		howGroupCaptiveApplies:
			'A property management group captive acts as a structured deductible buydown and primary liability facility. Portfolio managers who implement proactive plumbing telemetry, leak detection sensors, and security protocols retain the savings from prevented losses.',
		keyBenefits: [
			'Structured deductible buydown layers tailored to real estate portfolios',
			'Leak detection technology investments directly lower captive funding rates',
			'Master policy coverage with predictable annual renewal cycles',
			'Underwriting surplus returned directly to property owners and management companies'
		],
		illustrativeExample: {
			title: 'Urban Multi-Family Management Coalition (Illustrative Example)',
			cohortDescription: 'A collective of 16 real estate management firms overseeing 6,400 residential and mixed-use units.',
			memberCount: 16,
			combinedAnnualPremium: '$3,800,000 USD',
			traditionalLossRatio: '41% Incurred 5-Year Loss Ratio',
			illustrative5YrSurplusRetention: '$1,650,000 – $2,450,000 (Illustrative Range)',
			collateralSavings: '$190,000 in bank LOC commitment fee savings',
			disclaimerNotice:
				'Illustrative example only; not an actuarial opinion or offer. Property captives require independent actuarial certification and domicile review.'
		},
		typicalLines: ['Commercial Property (Deductible Buydown)', 'Habitational General Liability', 'Tenant Legal Liability', 'Commercial Umbrella'],
		readinessParam: 'Property_Management'
	}
];

export function getIndustryBySlug(slug: string): IndustryConfig | undefined {
	return INDUSTRIES.find((ind) => ind.slug === slug);
}
