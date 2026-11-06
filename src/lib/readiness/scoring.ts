export interface ReadinessInput {
	role?: 'association' | 'business';
	industry?: string;
	size?: number; // members count (association) or employee count (business)
	annualPremiumBand?: string;
	linesOfCoverage?: string[];
	lossHistory?: 'Good' | 'Average' | 'High';
	renewalDate?: string; // e.g. 'Within 30 Days', '30-60 Days', '60-90 Days', '90-120 Days', '6+ Months'
	region?: string;
}

export interface ReadinessScoreResult {
	score: number; // 0 - 100
	tier: 'Optimal' | 'Favorable' | 'Developing';
	tierTitle: string;
	tierSummary: string;
	approxAnnualSpend: number;
	projectedLossRatioPercent: number;
	illustrative5YrSurplusMin: number;
	illustrative5YrSurplusMax: number;
	illustrativeAnnualLocSavings: number;
	illustrative5YrLocSavings: number;
	disclaimerNotice: string;
}

export function parsePremiumBandToAmount(band?: string): number {
	if (!band) return 500000;
	if (band.includes('25M') || band.includes('$25,000,000')) return 25000000;
	if (band.includes('10M') || band.includes('$10,000,000')) return 15000000;
	if (band.includes('5M') || band.includes('$5,000,000')) return 7500000;
	if (band.includes('2.5M') || band.includes('$2,500,000')) return 3500000;
	if (band.includes('1M') || band.includes('$1,000,000')) return 1750000;
	if (band.includes('500k') || band.includes('$500,000')) return 750000;
	if (band.includes('250k') || band.includes('$250,000')) return 375000;
	if (band.includes('100k') || band.includes('$100,000')) return 175000;
	return 75000;
}

export function calculateReadinessScore(input: ReadinessInput): ReadinessScoreResult {
	let score = 0;
	const approxSpend = parsePremiumBandToAmount(input.annualPremiumBand);

	// 1. Premium Volume Points (Max 30)
	if (approxSpend >= 3000000) score += 30;
	else if (approxSpend >= 1500000) score += 25;
	else if (approxSpend >= 700000) score += 20;
	else if (approxSpend >= 350000) score += 15;
	else if (approxSpend >= 150000) score += 10;
	else score += 5;

	// 2. Loss History & Safety Record (Max 35)
	const loss = input.lossHistory || 'Average';
	let lossRatio = 0.45;
	if (loss === 'Good') {
		score += 35;
		lossRatio = 0.30;
	} else if (loss === 'Average') {
		score += 25;
		lossRatio = 0.45;
	} else {
		score += 10;
		lossRatio = 0.65;
	}

	// 3. Scale & Density (Max 20)
	const size = input.size || 15;
	if (input.role === 'business') {
		if (size >= 100) score += 20;
		else if (size >= 50) score += 16;
		else if (size >= 20) score += 12;
		else score += 8;
	} else {
		// Association members
		if (size >= 40) score += 20;
		else if (size >= 20) score += 16;
		else if (size >= 10) score += 12;
		else score += 7;
	}

	// 4. Industry Homogeneity (Max 15)
	const industry = (input.industry || '').toLowerCase();
	if (
		industry.includes('contractor') ||
		industry.includes('transport') ||
		industry.includes('truck') ||
		industry.includes('health') ||
		industry.includes('dental') ||
		industry.includes('it') ||
		industry.includes('msp') ||
		industry.includes('property') ||
		industry.includes('hospitality')
	) {
		score += 15;
	} else {
		score += 11;
	}

	const finalScore = Math.min(100, Math.max(10, score));

	// Tiering
	let tier: 'Optimal' | 'Favorable' | 'Developing' = 'Developing';
	let tierTitle = 'Developing Group Captive Feasibility';
	let tierSummary =
		'Your profile has potential. For smaller groups or businesses, joining an established cohort or securing an independent second opinion on traditional coverage is recommended.';

	if (finalScore >= 78) {
		tier = 'Optimal';
		tierTitle = 'High-Conviction Group Captive Viability';
		tierSummary =
			'Your premium volume, favorable loss control, and group scale indicate strong potential for a member-owned group captive structure, significant rate stabilization, and surplus retention.';
	} else if (finalScore >= 62) {
		tier = 'Favorable';
		tierTitle = 'Favorable Group Pooling Candidate';
		tierSummary =
			'Strong suitability for an association captive risk pool. Banding together with peers can provide immediate leverage against commercial market rate spikes.';
	}

	// Illustrative Pro-Forma Range Modeling
	// Reusing feasibility math: Primary captive retained: ~78%, operating overhead: ~16%
	const captiveRetained = approxSpend * 0.78;
	const operatingExpense = approxSpend * 0.16;
	const expectedClaims = approxSpend * lossRatio;
	const netAnnualSurplusBase = Math.max(0, captiveRetained - expectedClaims - operatingExpense);

	const illustrative5YrSurplusMin = Math.round(netAnnualSurplusBase * 5 * 0.85);
	const illustrative5YrSurplusMax = Math.round(netAnnualSurplusBase * 5 * 1.25);

	// Standby LOC Collateral replacement benefit (2.5% bank fee avoidance on 45% facility)
	const standbyFacility = approxSpend * 0.45;
	const illustrativeAnnualLocSavings = Math.round(standbyFacility * 0.025);
	const illustrative5YrLocSavings = illustrativeAnnualLocSavings * 5;

	return {
		score: finalScore,
		tier,
		tierTitle,
		tierSummary,
		approxAnnualSpend: approxSpend,
		projectedLossRatioPercent: Math.round(lossRatio * 100),
		illustrative5YrSurplusMin,
		illustrative5YrSurplusMax,
		illustrativeAnnualLocSavings,
		illustrative5YrLocSavings,
		disclaimerNotice:
			'Illustrative estimates only; not an actuarial opinion or guarantee of insurance. Subject to domicile regulatory approval, fronting carrier criteria, and loss performance.'
	};
}
