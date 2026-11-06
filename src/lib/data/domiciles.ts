export interface Domicile {
	id: string;
	name: string;
	region: 'US Onshore' | 'Offshore' | 'Canadian Options';
	tagline: string;
	minimumCapital: string;
	regulatoryBody: string;
	statutoryAct: string;
	formationTimeline: string;
	keyNotes: string[];
	strengths: string[];
	canadianCaptiveUrl: string;
}

export const DOMICILES: Domicile[] = [
	{
		id: 'vermont',
		name: 'Vermont',
		region: 'US Onshore',
		tagline: 'The premier US onshore captive domicile with gold-standard regulatory infrastructure.',
		minimumCapital: '$250,000 for pure; $500,000 for association/group captives',
		regulatoryBody: 'Vermont Department of Financial Regulation (DFR) - Captive Division',
		statutoryAct: 'Special Insurers Act (8 V.S.A. Chapter 141)',
		formationTimeline: '4 to 8 weeks following completed application',
		keyNotes: [
			'Largest US captive domicile by premium volume and active licenses.',
			'Dedicated, highly experienced internal actuarial and examination staff.',
			'Predictable, business-friendly regulatory posture with annual conference and advisory committees.'
		],
		strengths: ['Institutional credibility', 'In-house actuarial staff', 'Broad fronting carrier acceptance'],
		canadianCaptiveUrl: 'https://canadiancaptive.com'
	},
	{
		id: 'utah',
		name: 'Utah',
		region: 'US Onshore',
		tagline: 'Cost-effective, modern Western US captive domicile with rapid regulatory responsiveness.',
		minimumCapital: '$250,000 for pure captives; $500,000 for association groups',
		regulatoryBody: 'Utah Insurance Department - Captive Insurance Division',
		statutoryAct: 'Utah Captive Insurance Companies Act (Utah Code Ann. § 31A-37)',
		formationTimeline: '3 to 6 weeks from formal study submission',
		keyNotes: [
			'Rapidly growing Western hub offering lower annual maintenance costs than older domiciles.',
			'Expedited application review processes with accessible regulatory examiners.',
			'Strong support for mid-market trade associations and proprietary risk pools.'
		],
		strengths: ['Competitive premium taxes', 'Speed of chartering', 'Flexible investment rules'],
		canadianCaptiveUrl: 'https://canadiancaptive.com'
	},
	{
		id: 'delaware',
		name: 'Delaware',
		region: 'US Onshore',
		tagline: 'Corporate law capital of the United States with dedicated Special Purpose captive statutes.',
		minimumCapital: '$250,000 pure / $500,000 association captive',
		regulatoryBody: 'Delaware Department of Insurance - Bureau of Captive & Financial Products',
		statutoryAct: 'Delaware Revised Captive Insurance Act (18 Del. C. ch. 69)',
		formationTimeline: '4 to 6 weeks',
		keyNotes: [
			'Synergy with Delaware corporate governance and the renowned Court of Chancery.',
			'Conditional licensing available to bind coverage while final examination is completed.',
			'Modern Series Captive and Protected Cell legislation available for segregated risk pools.'
		],
		strengths: ['Court of Chancery jurisdiction', 'Conditional licensing authority', 'Segregated cell flex'],
		canadianCaptiveUrl: 'https://canadiancaptive.com'
	},
	{
		id: 'cayman',
		name: 'Cayman Islands',
		region: 'Offshore',
		tagline: 'Leading global center for healthcare, group captives, and segregated portfolio companies (SPCs).',
		minimumCapital: '$100,000 to $400,000 USD (Class B insurer category)',
		regulatoryBody: 'Cayman Islands Monetary Authority (CIMA)',
		statutoryAct: 'Insurance Act, 2010 (as amended)',
		formationTimeline: '6 to 10 weeks',
		keyNotes: [
			'Second largest captive jurisdiction globally with hundreds of active group captive programs.',
			'Tax neutrality with zero local corporate, income, or capital gains taxes.',
			'Pioneering Segregated Portfolio Company (SPC) legislation for multi-member isolation.'
		],
		strengths: ['Tax neutrality', 'Segregated Portfolio Companies (SPCs)', 'Sophisticated service providers'],
		canadianCaptiveUrl: 'https://canadiancaptive.com'
	},
	{
		id: 'bermuda',
		name: 'Bermuda',
		region: 'Offshore',
		tagline: 'The historic capital of the global reinsurance and alternative risk transfer market.',
		minimumCapital: '$120,000 to $250,000 USD (Class 1 / Class 2 captive insurers)',
		regulatoryBody: 'Bermuda Monetary Authority (BMA)',
		statutoryAct: 'Insurance Act 1978 and related regulations',
		formationTimeline: '6 to 10 weeks',
		keyNotes: [
			'Originator of the modern captive concept with unmatched global reinsurance depth.',
			'Solvency II equivalence granted by the European Union and reciprocal jurisdiction with the NAIC.',
			'Deepest concentration of global reinsurance underwriters and syndicates on the planet.'
		],
		strengths: ['Global reinsurance proximity', 'Solvency II equivalence', 'Prestige for multi-national risk'],
		canadianCaptiveUrl: 'https://canadiancaptive.com'
	},
	{
		id: 'barbados',
		name: 'Barbados',
		region: 'Offshore',
		tagline: 'Established Caribbean jurisdiction with historic tax treaties and competitive operating costs.',
		minimumCapital: '$125,000 USD for Class 1 (pure/group member underwriting)',
		regulatoryBody: 'Financial Services Commission (FSC) Barbados',
		statutoryAct: 'Insurance Act (Cap. 310) & Exempt Insurance statutes',
		formationTimeline: '6 to 8 weeks',
		keyNotes: [
			'Pioneer jurisdiction for Canadian and North American cross-border captive structures.',
			'Double Taxation Treaty network, historically favored for Canadian international planning.',
			'Cost-effective professional services and regulatory fee schedule.'
		],
		strengths: ['Canadian bilateral tax treaty history', 'Low fee structure', 'Long track record'],
		canadianCaptiveUrl: 'https://canadiancaptive.com'
	},
	{
		id: 'british-columbia',
		name: 'British Columbia (Canada)',
		region: 'Canadian Options',
		tagline: 'Canada’s pioneer onshore captive domicile, ideal for Canadian association risk pools.',
		minimumCapital: '$200,000 CAD (or risk-based capital as certified by the actuary)',
		regulatoryBody: 'BC Financial Services Authority (BCFSA)',
		statutoryAct: 'Insurance (Captive Company) Act [RSBC 1996] Chapter 227',
		formationTimeline: '8 to 12 weeks',
		keyNotes: [
			'Enacted Canada’s first dedicated captive statute, updated for modern alternative risk transfer.',
			'Exempt from traditional insurance premium taxes under specific association conditions.',
			'Eliminates currency risk and cross-border regulatory friction for Canadian-headquartered groups.'
		],
		strengths: ['Zero currency conversion friction for CAD', 'Canadian legal jurisdiction', 'BCFSA regulation'],
		canadianCaptiveUrl: 'https://canadiancaptive.com'
	},
	{
		id: 'alberta',
		name: 'Alberta (Canada)',
		region: 'Canadian Options',
		tagline: 'Canada’s newest, fastest-growing onshore captive domicile enacted under the 2022 Act.',
		minimumCapital: '$250,000 CAD (or as determined by Superintendent of Insurance)',
		regulatoryBody: 'Alberta Treasury Board and Finance - Superintendent of Insurance',
		statutoryAct: 'Captive Insurance Companies Act (SA 2021, c C-2.5; effective July 2022)',
		formationTimeline: '6 to 10 weeks',
		keyNotes: [
			'Modern 2022 legislation designed specifically to attract Canadian industry captives home.',
			'Explicitly authorizes Association Captives and Segregated Cell Captive structures.',
			'Pro-business provincial administration actively promoting alternative risk transfer for energy, construction, transport, and commercial trades.'
		],
		strengths: ['Latest 2022 modern statute', 'Association and cell captive provisions', 'No provincial sales tax'],
		canadianCaptiveUrl: 'https://canadiancaptive.com'
	}
];

export function getDomicileById(id: string): Domicile | undefined {
	return DOMICILES.find((d) => d.id === id);
}

export function getDomicilesByRegion(region: Domicile['region']): Domicile[] {
	return DOMICILES.filter((d) => d.region === region);
}

