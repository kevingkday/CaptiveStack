<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';
	import {
		Activity,
		Shield,
		TrendingUp,
		Landmark,
		Users,
		FileSpreadsheet,
		CheckCircle2,
		AlertCircle,
		ArrowRight,
		Sliders,
		DollarSign,
		Percent,
		Building2,
		Layers,
		Check,
		Clock,
		Sparkles,
		Send,
		Phone,
		Mail,
		FileText
	} from 'lucide-svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	// Reactive calculation state
	let memberCount = $state(28);
	let avgMemberPremium = $state(45000);
	let lossRatioPercent = $state(42);
	let riskCategory = $state<'PrizeIndemnity' | 'GlassReplacement' | 'TradeContractor' | 'FleetTransportation'>('PrizeIndemnity');
	let organizationType = $state('Eagle1 Golf Tournament Association');
	let email = $state('underwriting@eagle1golf.org');
	let primaryConcern = $state('Modeling alternative standby collateral to replace 2.5% bank Letter of Credit fees');
	let isSubmitting = $state(false);

	// Lead review request form state
	let leadName = $state('');
	let leadAssociation = $state('');
	let leadMemberCount = $state<number | ''>('');
	let leadCoverage = $state('Commercial General Liability');
	let leadPremiumSize = $state('$1,000,000 - $2,500,000');
	let leadEmail = $state('');
	let leadPhone = $state('');
	let leadNotes = $state('');
	let isSubmittingLead = $state(false);

	$effect(() => {
		if (data.user?.email) {
			email = data.user.email;
			if (!leadEmail) leadEmail = data.user.email;
		}
		if (data.user?.name && !leadName) {
			leadName = data.user.name;
		}
	});

	// Derived calculations
	let annualPremium = $derived(memberCount * avgMemberPremium);
	let fiveYearLosses = $derived(Math.round(annualPremium * 5 * (lossRatioPercent / 100)));
	let calculatedLossRatio = $derived(lossRatioPercent / 100);

	// Algorithmic Fit Score
	let scoreBreakdown = $derived.by(() => {
		let volumePts = 0;
		if (annualPremium >= 3000000) volumePts = 30;
		else if (annualPremium >= 1500000) volumePts = 25;
		else if (annualPremium >= 750000) volumePts = 20;
		else if (annualPremium >= 400000) volumePts = 14;
		else volumePts = 8;

		let lossPts = 0;
		if (calculatedLossRatio <= 0.35) lossPts = 35;
		else if (calculatedLossRatio <= 0.50) lossPts = 30;
		else if (calculatedLossRatio <= 0.65) lossPts = 22;
		else if (calculatedLossRatio <= 0.80) lossPts = 12;
		else lossPts = 4;

		let memberPts = 0;
		if (memberCount >= 40) memberPts = 20;
		else if (memberCount >= 20) memberPts = 16;
		else if (memberCount >= 10) memberPts = 12;
		else memberPts = 7;

		let riskPts = 0;
		if (riskCategory === 'PrizeIndemnity' || riskCategory === 'GlassReplacement') riskPts = 15;
		else if (riskCategory === 'TradeContractor') riskPts = 12;
		else riskPts = 9;

		const total = Math.min(100, volumePts + lossPts + memberPts + riskPts);
		return { volumePts, lossPts, memberPts, riskPts, total };
	});

	// Financial Underwriting Pro-Forma (Annual)
	let proForma = $derived.by(() => {
		const gross = annualPremium;
		const expectedClaims = gross * calculatedLossRatio;
		const operatingExpense = gross * 0.16; // TPA, captive management, legal, audit (16%)
		const reinsuranceCeded = gross * 0.22; // Stop loss excess of loss treaty (22%)
		const captiveRetained = gross - reinsuranceCeded;
		const netUnderwritingProfit = captiveRetained - expectedClaims - operatingExpense;
		const traditionalCarrierProfitRetained = gross * 0.35; // Carrier margin

		// Bank LOC Replacement
		const requiredBankLOC = gross * 0.45; // 45% collateral benchmark
		const annualBankLOCFee = requiredBankLOC * 0.025; // 2.5% bank commitment fee
		const fiveYearLOCSavings = annualBankLOCFee * 5;
		const fiveYearCumulativeMemberProfit = netUnderwritingProfit * 5;

		return {
			gross,
			expectedClaims,
			operatingExpense,
			reinsuranceCeded,
			netUnderwritingProfit,
			traditionalCarrierProfitRetained,
			requiredBankLOC,
			annualBankLOCFee,
			fiveYearLOCSavings,
			fiveYearCumulativeMemberProfit
		};
	});

	function formatCurrency(val: number) {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			maximumFractionDigits: 0
		}).format(val);
	}

	function applyPreset(preset: 'Eagle1' | 'GlassCo' | 'Contractors') {
		if (preset === 'Eagle1') {
			memberCount = 32;
			avgMemberPremium = 46875; // $1.5M
			lossRatioPercent = 33;
			riskCategory = 'PrizeIndemnity';
			organizationType = 'Eagle1 Golf Tournament Association';
			primaryConcern = 'Modeling alternative standby collateral for par-3 prize program';
		} else if (preset === 'GlassCo') {
			memberCount = 48;
			avgMemberPremium = 52083; // $2.5M
			lossRatioPercent = 57;
			riskCategory = 'GlassReplacement';
			organizationType = 'GlassCo Windshield Warranty Group';
			primaryConcern = 'Pooling multi-state glass claims and retaining potential surplus';
		} else {
			memberCount = 22;
			avgMemberPremium = 65000;
			lossRatioPercent = 48;
			riskCategory = 'TradeContractor';
			organizationType = 'National Specialty Trade Contractors';
			primaryConcern = 'Stabilizing hardening commercial property/casualty rates';
		}
	}
</script>

<svelte:head>
	<title>Group Captive Feasibility Calculator | CaptiveStack</title>
	<meta
		name="description"
		content="Evaluate group captive insurance viability in real time. Model alternative collateral mechanisms, simulate underwriting surplus, and qualify for formation milestone gates."
	/>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
	<!-- Hero Header -->
	<header class="relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-xs">
		<div class="relative z-10 space-y-3">
			<div class="flex flex-wrap items-center gap-2">
				<span class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
					<Activity class="w-3.5 h-3.5 mr-1.5 text-blue-600" />
					Interactive Actuarial Calculator
				</span>
				<span class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
					Real-Time Feasibility Engine
				</span>
				<span class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
					Illustrative Scenario Modeling
				</span>
			</div>

			<h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
				Alternative Risk Transfer (ART) Feasibility Calculator
			</h1>
			<p class="text-sm text-slate-600 max-w-3xl leading-relaxed">
				Evaluate group captive viability in real time. Simulate potential underwriting returns, model alternative collateral mechanisms, and review formation milestone readiness.
			</p>

			<!-- Quick Presets -->
			<div class="pt-2 flex flex-wrap items-center gap-2 text-xs">
				<span class="text-slate-500 font-medium">Load Illustrative Scenarios (Sample data):</span>
				<button
					type="button"
					onclick={() => applyPreset('Eagle1')}
					class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-300 transition-colors font-medium cursor-pointer"
				>
					Eagle1 Hole-in-One ($1.5M)
				</button>
				<button
					type="button"
					onclick={() => applyPreset('GlassCo')}
					class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-300 transition-colors font-medium cursor-pointer"
				>
					GlassCo Auto Glass ($2.5M)
				</button>
				<button
					type="button"
					onclick={() => applyPreset('Contractors')}
					class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-300 transition-colors font-medium cursor-pointer"
				>
					Specialty Contractors ($1.4M)
				</button>
			</div>
		</div>
	</header>

	{#if form?.success}
		<div class="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-start space-x-3 text-sm animate-in fade-in duration-200">
			<CheckCircle2 class="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
			<div class="space-y-1">
				<strong class="font-bold text-emerald-900">Feasibility Assessment Successfully Recorded!</strong>
				<p class="text-xs text-emerald-700 font-mono">
					Record ID: {form.assessment.id} &bull; Fit Score: {form.assessment.fitScore}/100 &bull; Status: {form.assessment.status}
				</p>
			</div>
		</div>
	{/if}

	<!-- Main 2-Column Calculator Layout -->
	<div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
		<!-- Left: Reactive Parameter Controls & Form Submission -->
		<div class="lg:col-span-7 space-y-6">
			<div class="rounded-xl bg-white border border-slate-200 p-6 space-y-6 shadow-xs">
				<div class="flex items-center justify-between border-b border-slate-200 pb-3">
					<h2 class="text-base font-bold text-slate-900 flex items-center space-x-2">
						<Sliders class="w-4 h-4 text-blue-600" />
						<span>Risk Pool Parameters</span>
					</h2>
					<span class="text-xs font-mono text-slate-500">Step 1 of 5: Feasibility Gate</span>
				</div>

				<form
					method="POST"
					action="?/submitAssessment"
					use:enhance={() => {
						isSubmitting = true;
						return async ({ update }) => {
							await update();
							isSubmitting = false;
						};
					}}
					class="space-y-5"
				>
					<input type="hidden" name="annualPremium" value={annualPremium} />
					<input type="hidden" name="fiveYearLosses" value={fiveYearLosses} />
					<input type="hidden" name="memberCount" value={memberCount} />
					<input type="hidden" name="riskCategory" value={riskCategory} />

					<!-- Organization Info -->
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
						<div class="space-y-1.5">
							<label for="organizationType" class="text-slate-700 font-medium">Association / Trade Group Name</label>
							<input
								id="organizationType"
								name="organizationType"
								bind:value={organizationType}
								required
								class="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
							/>
						</div>
						<div class="space-y-1.5">
							<label for="email" class="text-slate-700 font-medium">Contact Email</label>
							<input
								id="email"
								name="email"
								type="email"
								bind:value={email}
								required
								class="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
							/>
						</div>
					</div>

					<div class="space-y-1.5 text-xs">
						<label for="primaryConcern" class="text-slate-700 font-medium">Primary Risk Transfer Objective</label>
						<input
							id="primaryConcern"
							name="primaryConcern"
							bind:value={primaryConcern}
							required
							class="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
						/>
					</div>

					<!-- Risk Category Pills -->
					<div class="space-y-2">
						<span class="text-xs text-slate-700 font-medium block">Program Risk Category</span>
						<div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
							{#each [
								{ id: 'PrizeIndemnity', label: 'Prize Indemnity', desc: 'Contingency / Prize Pool' },
								{ id: 'GlassReplacement', label: 'Warranty Pool', desc: 'Automotive / Specialty' },
								{ id: 'TradeContractor', label: 'Trade Contractor', desc: 'Artisan / Liability' },
								{ id: 'FleetTransportation', label: 'Fleet / Cargo', desc: 'Specialty Transit' }
							] as cat}
								<button
									type="button"
									onclick={() => (riskCategory = cat.id as any)}
									class="p-2.5 rounded-lg border text-left transition-all cursor-pointer {riskCategory === cat.id ? 'bg-blue-50 border-blue-600 text-blue-900 ring-1 ring-blue-500/30' : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'}"
								>
									<span class="block text-xs font-bold leading-tight">{cat.label}</span>
									<span class="block text-[10px] text-slate-500 mt-0.5">{cat.desc}</span>
								</button>
							{/each}
						</div>
					</div>

					<!-- Slider 1: Member Count -->
					<div class="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
						<div class="flex items-center justify-between text-xs">
							<span class="text-slate-700 font-medium flex items-center space-x-1.5">
								<Users class="w-3.5 h-3.5 text-blue-600" />
								<span>Participating Association Members</span>
							</span>
							<span class="font-mono text-slate-900 font-bold text-sm bg-white px-2.5 py-0.5 rounded border border-slate-200 shadow-2xs">
								{memberCount} Members
							</span>
						</div>
						<input
							type="range"
							min="5"
							max="120"
							step="1"
							bind:value={memberCount}
							class="w-full accent-blue-600 cursor-pointer"
						/>
						<div class="flex justify-between text-[10px] font-mono text-slate-500">
							<span>5 Min Required</span>
							<span>25 Ideal Scale</span>
							<span>120+ Max</span>
						</div>
					</div>

					<!-- Slider 2: Average Commercial Premium -->
					<div class="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
						<div class="flex items-center justify-between text-xs">
							<span class="text-slate-700 font-medium flex items-center space-x-1.5">
								<DollarSign class="w-3.5 h-3.5 text-emerald-600" />
								<span>Average Annual Commercial Premium per Member</span>
							</span>
							<span class="font-mono text-emerald-700 font-bold text-sm bg-white px-2.5 py-0.5 rounded border border-slate-200 shadow-2xs">
								{formatCurrency(avgMemberPremium)} / yr
							</span>
						</div>
						<input
							type="range"
							min="10000"
							max="150000"
							step="2500"
							bind:value={avgMemberPremium}
							class="w-full accent-emerald-600 cursor-pointer"
						/>
						<div class="flex justify-between text-[10px] font-mono text-slate-500">
							<span>$10,000 / member</span>
							<span>Pooled Gross: {formatCurrency(annualPremium)}</span>
							<span>$150,000 / member</span>
						</div>
					</div>

					<!-- Slider 3: 5-Year Historical Loss Ratio -->
					<div class="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
						<div class="flex items-center justify-between text-xs">
							<span class="text-slate-700 font-medium flex items-center space-x-1.5">
								<Percent class="w-3.5 h-3.5 text-amber-600" />
								<span>5-Year Historical Incurred Loss Ratio</span>
							</span>
							<span class="font-mono font-bold text-sm px-2.5 py-0.5 rounded border bg-white shadow-2xs {lossRatioPercent <= 45 ? 'text-emerald-700 border-emerald-200' : lossRatioPercent <= 65 ? 'text-amber-700 border-amber-200' : 'text-rose-700 border-rose-200'}">
								{lossRatioPercent.toFixed(1)}% Incurred
							</span>
						</div>
						<input
							type="range"
							min="15"
							max="90"
							step="1"
							bind:value={lossRatioPercent}
							class="w-full accent-amber-500 cursor-pointer"
						/>
						<div class="flex justify-between text-[10px] font-mono text-slate-500">
							<span>15% Favorable</span>
							<span>5-Yr Claims: {formatCurrency(fiveYearLosses)}</span>
							<span>90% Distressed</span>
						</div>
					</div>

					<div class="pt-2">
						<button
							type="submit"
							disabled={isSubmitting}
							class="w-full py-3 px-4 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 text-white shadow-xs transition-all flex items-center justify-center space-x-2 cursor-pointer"
						>
							{#if isSubmitting}
								<span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
								<span>Simulating &amp; Recording Assessment...</span>
							{:else}
								<Sparkles class="w-4 h-4 text-blue-200" />
								<span>Calculate &amp; Save Feasibility Estimate</span>
							{/if}
						</button>
					</div>
				</form>
			</div>
		</div>

		<!-- Right: Feasibility Gauge, Pro-Forma, and LOC Replacement Model -->
		<div class="lg:col-span-5 space-y-6">
			<!-- Live Fit Score Gauge Card -->
			<div class="rounded-xl bg-white border border-slate-200 p-6 space-y-5 shadow-xs">
				<div class="flex items-center justify-between border-b border-slate-200 pb-3">
					<span class="text-xs font-bold uppercase tracking-wider text-slate-500">Actuarial Viability Rating</span>
					<span class="text-xs font-semibold px-2 py-0.5 rounded-full {scoreBreakdown.total >= 75 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}">
						{scoreBreakdown.total >= 75 ? 'Tier-1 Candidate' : 'Feasible with Stop-Loss'}
					</span>
				</div>

				<div class="flex items-center space-x-5">
					<div class="relative w-24 h-24 flex-shrink-0 flex items-center justify-center rounded-full bg-slate-50 border-4 {scoreBreakdown.total >= 75 ? 'border-emerald-500' : 'border-amber-500'} shadow-xs font-mono">
						<div class="text-center">
							<span class="text-3xl font-extrabold text-slate-900 block leading-none">{scoreBreakdown.total}</span>
							<span class="text-[9px] uppercase tracking-wider text-slate-500 font-sans">/ 100</span>
						</div>
					</div>

					<div class="space-y-1">
						<h3 class="text-base font-bold text-slate-900">
							{#if scoreBreakdown.total >= 80}
								High-Fit Group Candidate
							{:else if scoreBreakdown.total >= 65}
								Viable Alternative Risk Transfer Candidate
							{:else}
								Conditional Viability
							{/if}
						</h3>
						<p class="text-xs text-slate-600 leading-relaxed">
							Based on {memberCount} members pooling {formatCurrency(annualPremium)} annual premium at {lossRatioPercent}% historical loss ratio.
						</p>
					</div>
				</div>

				<!-- Score Component Breakdown -->
				<div class="space-y-2 text-xs font-mono pt-1">
					<div class="flex items-center justify-between">
						<span class="text-slate-600">Premium Scale (30 max)</span>
						<span class="text-slate-900 font-bold">{scoreBreakdown.volumePts} pts</span>
					</div>
					<div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
						<div class="h-full bg-blue-600 rounded-full" style="width: {(scoreBreakdown.volumePts / 30) * 100}%"></div>
					</div>

					<div class="flex items-center justify-between pt-1">
						<span class="text-slate-600">Loss Ratio Stability (35 max)</span>
						<span class="text-emerald-700 font-bold">{scoreBreakdown.lossPts} pts</span>
					</div>
					<div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
						<div class="h-full bg-emerald-600 rounded-full" style="width: {(scoreBreakdown.lossPts / 35) * 100}%"></div>
					</div>

					<div class="flex items-center justify-between pt-1">
						<span class="text-slate-600">Member Density & Scale (20 max)</span>
						<span class="text-indigo-700 font-bold">{scoreBreakdown.memberPts} pts</span>
					</div>
					<div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
						<div class="h-full bg-indigo-600 rounded-full" style="width: {(scoreBreakdown.memberPts / 20) * 100}%"></div>
					</div>

					<div class="flex items-center justify-between pt-1">
						<span class="text-slate-600">Risk Homogeneity (15 max)</span>
						<span class="text-amber-700 font-bold">{scoreBreakdown.riskPts} pts</span>
					</div>
					<div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
						<div class="h-full bg-amber-500 rounded-full" style="width: {(scoreBreakdown.riskPts / 15) * 100}%"></div>
					</div>
				</div>
			</div>

			<!-- Letter of Credit (LOC) Collateral Optimization Card -->
			<div class="rounded-xl bg-white border border-blue-200 p-6 space-y-4 shadow-xs">
				<div class="flex items-center justify-between">
					<span class="text-xs font-bold uppercase tracking-wider text-blue-700 flex items-center space-x-1.5">
						<Landmark class="w-4 h-4 text-emerald-600" />
						<span>Collateral &amp; LOC Alternative Modeling</span>
					</span>
					<span class="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
						Standby Capital Model
					</span>
				</div>

				<div class="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
					<div class="flex items-center justify-between text-xs">
						<span class="text-slate-600">Traditional Bank LOC Required:</span>
						<span class="font-mono text-slate-900 font-bold">{formatCurrency(proForma.requiredBankLOC)}</span>
					</div>
					<div class="flex items-center justify-between text-xs">
						<span class="text-slate-600">Bank Commitment Fee (2.5% p.a.):</span>
						<span class="font-mono text-rose-600 font-bold">{formatCurrency(proForma.annualBankLOCFee)} / yr</span>
					</div>
					<div class="border-t border-slate-200 pt-2 flex items-center justify-between text-xs">
						<span class="text-emerald-800 font-semibold">Potential 5-Year Collateral Savings:</span>
						<span class="font-mono text-emerald-700 font-bold text-sm">
							{formatCurrency(proForma.fiveYearLOCSavings)}
						</span>
					</div>
				</div>

				<p class="text-[11px] text-slate-600 leading-relaxed">
					CaptiveStack helps associations model alternative collateral mechanisms—such as member standby capital pledges and surplus notes—which can reduce reliance on commercial bank LOCs, subject to fronting carrier and domicile regulatory acceptance.
				</p>
			</div>

			<!-- 5-Year Underwriting Member Return Card -->
			<div class="rounded-xl bg-white border border-slate-200 p-6 space-y-4 shadow-xs">
				<h3 class="text-xs font-bold uppercase tracking-wider text-slate-500">
					5-Year Illustrative Underwriting Projection
				</h3>

				<div class="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs font-mono">
					<div class="flex items-center justify-between">
						<span class="text-slate-600">5-Yr Gross Pooled Premium:</span>
						<span class="text-slate-900 font-bold">{formatCurrency(annualPremium * 5)}</span>
					</div>
					<div class="flex items-center justify-between">
						<span class="text-slate-600">5-Yr Projected Claims Paid:</span>
						<span class="text-amber-700 font-bold">-{formatCurrency(fiveYearLosses)}</span>
					</div>
					<div class="flex items-center justify-between">
						<span class="text-slate-600">5-Yr Reinsurance &amp; Operations:</span>
						<span class="text-slate-700 font-bold">-{formatCurrency((proForma.reinsuranceCeded + proForma.operatingExpense) * 5)}</span>
					</div>
					<div class="border-t border-slate-200 pt-2 flex items-center justify-between font-bold text-sm">
						<span class="text-emerald-700 font-sans">Potential Underwriting Surplus:</span>
						<span class="text-emerald-700">{formatCurrency(proForma.fiveYearCumulativeMemberProfit)}</span>
					</div>
				</div>

				<!-- Calculator Result Disclaimer Notice -->
				<div class="p-3 rounded-lg bg-amber-50/80 border border-amber-200 text-[11px] text-amber-900 flex items-start space-x-2">
					<AlertCircle class="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
					<p class="leading-relaxed">
						<strong>Notice:</strong> Illustrative estimates, not an actuarial opinion or offer. Results are subject to independent actuarial study, fronting carrier criteria, and domicile regulatory approval.
					</p>
				</div>

				<div class="flex items-center justify-between pt-2">
					<a
						href="/capital"
						class="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center space-x-1"
					>
						<span>Explore Capital &amp; Standby Collateral Modeling</span>
						<ArrowRight class="w-3.5 h-3.5" />
					</a>
				</div>
			</div>
		</div>
	</div>

	<!-- =========================================================================
	     LEAD CAPTURE SECTION: "Get a Feasibility Review"
	     ========================================================================= -->
	<section id="review-form" class="rounded-2xl bg-white border-2 border-blue-600 p-6 sm:p-10 shadow-md space-y-6 scroll-mt-24">
		<div class="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b border-slate-200 pb-6">
			<div class="space-y-2 max-w-2xl">
				<div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
					<Mail class="w-3.5 h-3.5" />
					<span>Confidential Risk Review</span>
				</div>
				<h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
					Get a Professional Group Feasibility Review
				</h2>
				<p class="text-sm text-slate-600 leading-relaxed">
					Ready to explore whether an association captive makes financial sense for your group? Submit your preliminary metrics below. <strong>Kevin Day</strong> and our captive advisory network will review your risk pool parameters and provide guidance.
				</p>
			</div>
			<div class="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5 shrink-0 max-w-xs">
				<span class="font-bold text-slate-900 block">No Marketing Spam:</span>
				<p class="text-slate-600 text-[11px] leading-relaxed">
					We do not send automated outbound marketing drip campaigns. You will receive a direct evaluation from our team within 1&ndash;2 business days.
				</p>
			</div>
		</div>

		{#if form?.reviewSuccess}
			<div class="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-3 animate-in fade-in duration-200">
				<div class="flex items-center space-x-2 text-base font-bold text-emerald-800">
					<CheckCircle2 class="w-6 h-6 text-emerald-600" />
					<span>Feasibility Review Request Successfully Received</span>
				</div>
				<p class="text-xs text-emerald-800 leading-relaxed">
					Thank you, <strong>{form.lead?.name}</strong>. Your feasibility review request for <strong>{form.lead?.associationName}</strong> ({form.lead?.memberCount} members, {form.lead?.lineOfCoverage}) has been securely logged and notified to <strong>Kevin Day</strong>. We will review your preliminary details and follow up directly.
				</p>
				<p class="text-[11px] text-emerald-700 font-mono">
					Confirmation ID: {form.lead?.id} &bull; No automated outbound emails have been sent.
				</p>
			</div>
		{:else}
			{#if form?.reviewError}
				<div class="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start space-x-2.5">
					<AlertCircle class="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
					<span>{form.reviewError}</span>
				</div>
			{/if}

			<form
				method="POST"
				action="?/requestReview"
				use:enhance={() => {
					isSubmittingLead = true;
					return async ({ update }) => {
						await update();
						isSubmittingLead = false;
					};
				}}
				class="space-y-6"
			>
				<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
					<!-- Contact Name -->
					<div class="space-y-1.5">
						<label for="leadName" class="block font-semibold text-slate-700">
							Your Full Name <span class="text-rose-500">*</span>
						</label>
						<input
							id="leadName"
							name="name"
							type="text"
							required
							bind:value={leadName}
							placeholder="e.g. David Vance"
							class="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
						/>
					</div>

					<!-- Association / Group Name -->
					<div class="space-y-1.5">
						<label for="leadAssociation" class="block font-semibold text-slate-700">
							Association / Trade Group Name <span class="text-rose-500">*</span>
						</label>
						<input
							id="leadAssociation"
							name="associationName"
							type="text"
							required
							bind:value={leadAssociation}
							placeholder="e.g. National Glass Contractors Assoc."
							class="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
						/>
					</div>

					<!-- Member Count -->
					<div class="space-y-1.5">
						<label for="leadMemberCount" class="block font-semibold text-slate-700">
							Estimated Participating Members <span class="text-rose-500">*</span>
						</label>
						<input
							id="leadMemberCount"
							name="memberCount"
							type="number"
							min="1"
							required
							bind:value={leadMemberCount}
							placeholder="e.g. 35"
							class="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
						/>
					</div>

					<!-- Line of Coverage -->
					<div class="space-y-1.5">
						<label for="leadCoverage" class="block font-semibold text-slate-700">
							Primary Line of Coverage <span class="text-rose-500">*</span>
						</label>
						<select
							id="leadCoverage"
							name="lineOfCoverage"
							required
							bind:value={leadCoverage}
							class="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
						>
							<option value="Commercial General Liability">Commercial General Liability</option>
							<option value="Commercial Auto / Fleet">Commercial Auto / Fleet</option>
							<option value="Workers Compensation">Workers Compensation</option>
							<option value="Property / Inland Marine">Property / Inland Marine</option>
							<option value="Specialty / Warranty / Indemnity">Specialty / Warranty / Prize Indemnity</option>
							<option value="Professional Liability / Errors & Omissions">Professional Liability (E&amp;O / D&amp;O)</option>
							<option value="Other Multi-Line Commercial">Other Multi-Line Commercial Risk</option>
						</select>
					</div>

					<!-- Annual Premium Size -->
					<div class="space-y-1.5">
						<label for="leadPremiumSize" class="block font-semibold text-slate-700">
							Estimated Combined Annual Premium <span class="text-rose-500">*</span>
						</label>
						<select
							id="leadPremiumSize"
							name="annualPremiumSize"
							required
							bind:value={leadPremiumSize}
							class="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
						>
							<option value="Under $500,000">Under $500,000 / year</option>
							<option value="$500,000 - $1,000,000">$500,000 &ndash; $1,000,000 / year</option>
							<option value="$1,000,000 - $2,500,000">$1,000,000 &ndash; $2,500,000 / year</option>
							<option value="$2,500,000 - $5,000,000">$2,500,000 &ndash; $5,000,000 / year</option>
							<option value="$5,000,000+">$5,000,000+ / year</option>
						</select>
					</div>

					<!-- Business Email -->
					<div class="space-y-1.5">
						<label for="leadEmail" class="block font-semibold text-slate-700">
							Business Email Address <span class="text-rose-500">*</span>
						</label>
						<input
							id="leadEmail"
							name="email"
							type="email"
							required
							bind:value={leadEmail}
							placeholder="david@contractors.org"
							class="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
						/>
					</div>

					<!-- Phone (Optional) -->
					<div class="space-y-1.5 sm:col-span-2 lg:col-span-1">
						<label for="leadPhone" class="block font-semibold text-slate-700">
							Phone Number <span class="text-slate-400 font-normal">(Optional)</span>
						</label>
						<input
							id="leadPhone"
							name="phone"
							type="tel"
							bind:value={leadPhone}
							placeholder="+1 (555) 000-0000"
							class="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
						/>
					</div>

					<!-- Objectives / Notes -->
					<div class="space-y-1.5 sm:col-span-2">
						<label for="leadNotes" class="block font-semibold text-slate-700">
							Key Challenges or Specific Objectives <span class="text-slate-400 font-normal">(Optional)</span>
						</label>
						<textarea
							id="leadNotes"
							name="notes"
							rows="2"
							bind:value={leadNotes}
							placeholder="e.g. Unwarranted rate hikes on commercial auto renewals, looking to model 2027 renewal alternatives..."
							class="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs"
						></textarea>
					</div>
				</div>

				<div class="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
					<p class="text-[11px] text-slate-500">
						Submitting this request does not constitute an insurance application or binding coverage commitment.
					</p>
					<button
						type="submit"
						disabled={isSubmittingLead}
						class="inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-xs transition-all cursor-pointer disabled:opacity-50 shrink-0"
					>
						{#if isSubmittingLead}
							<span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
							<span>Submitting Request...</span>
						{:else}
							<Send class="w-4 h-4" />
							<span>Request Feasibility Review</span>
						{/if}
					</button>
				</div>
			</form>
		{/if}
	</section>

	<!-- 5-Stage Formation Milestone Gating Pipeline -->
	<section class="rounded-xl bg-white border border-slate-200 p-6 space-y-4 shadow-xs">
		<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
			<div>
				<h2 class="text-base font-bold text-slate-900 flex items-center space-x-2">
					<TrendingUp class="w-4 h-4 text-blue-600" />
					<span>Gated Formation Milestones &bull; Readiness Overview</span>
				</h2>
				<p class="text-xs text-slate-500">
					Standard milestone gates required by captive insurance domiciles (Vermont, Utah, Delaware, Cayman, Bermuda, Canada).
				</p>
			</div>
			<span class="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
				Gate 1 Cleared
			</span>
		</div>

		<div class="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
			<div class="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 space-y-1">
				<div class="flex items-center justify-between">
					<span class="font-bold text-emerald-900">Gate 1: Feasibility</span>
					<CheckCircle2 class="w-4 h-4 text-emerald-600" />
				</div>
				<p class="text-[11px] text-emerald-800">
					Fit score {scoreBreakdown.total}/100 exceeds 70-point minimum threshold.
				</p>
			</div>

			<div class="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
				<div class="flex items-center justify-between">
					<span class="font-bold text-slate-900">Gate 2: Survey Intake</span>
					<span class="text-[10px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">Ready</span>
				</div>
				<p class="text-[11px] text-slate-500">
					Deploy member exposure surveys and collect loss run documents.
				</p>
			</div>

			<div class="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
				<div class="flex items-center justify-between">
					<span class="font-bold text-slate-900">Gate 3: Actuarial Study</span>
					<Clock class="w-4 h-4 text-slate-400" />
				</div>
				<p class="text-[11px] text-slate-500">
					Independent actuary certifies binomial/Poisson loss distributions.
				</p>
			</div>

			<div class="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
				<div class="flex items-center justify-between">
					<span class="font-bold text-slate-900">Gate 4: Capital Reserves</span>
					<Clock class="w-4 h-4 text-slate-400" />
				</div>
				<p class="text-[11px] text-slate-500">
					Structure standby capital pledges &amp; surplus notes for collateral.
				</p>
			</div>

			<div class="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
				<div class="flex items-center justify-between">
					<span class="font-bold text-slate-900">Gate 5: Captive Launch</span>
					<Clock class="w-4 h-4 text-slate-400" />
				</div>
				<p class="text-[11px] text-slate-500">
					Obtain Certificate of Authority and execute fronting/reinsurance treaties.
				</p>
			</div>
		</div>
	</section>

	<!-- Historical Feasibility Assessments Registry (Sample data) -->
	<section class="rounded-xl bg-white border border-slate-200 p-6 space-y-4 shadow-xs">
		<div class="flex items-center justify-between border-b border-slate-200 pb-3">
			<div>
				<h2 class="text-base font-bold text-slate-900 flex items-center space-x-2">
					<Building2 class="w-4 h-4 text-blue-600" />
					<span>Illustrative Assessment Archive</span>
					<span class="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
						Sample data
					</span>
				</h2>
				<p class="text-xs text-slate-500">
					Sample group captive feasibility models recorded for demonstration purposes.
				</p>
			</div>
			<span class="text-xs font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
				{data.assessments.length} Sample Records
			</span>
		</div>

		<div class="overflow-x-auto rounded-lg border border-slate-200">
			<table class="w-full text-left text-xs font-mono">
				<thead class="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200">
					<tr>
						<th class="px-4 py-2.5 font-semibold font-sans">Entity</th>
						<th class="px-4 py-2.5 font-semibold font-sans">Annual Premium</th>
						<th class="px-4 py-2.5 font-semibold font-sans">5-Yr Losses</th>
						<th class="px-4 py-2.5 font-semibold font-sans">Loss Ratio</th>
						<th class="px-4 py-2.5 font-semibold font-sans">Fit Score</th>
						<th class="px-4 py-2.5 font-semibold font-sans">Status</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-slate-200 text-slate-700">
					{#each data.assessments as item}
						<tr class="hover:bg-slate-50 transition-colors">
							<td class="px-4 py-3 text-slate-900 font-sans font-medium">
								<div>
									<span>{item.organizationType}</span>
									<span class="text-[10px] text-slate-500 font-mono block">{item.email}</span>
								</div>
							</td>
							<td class="px-4 py-3">{formatCurrency(item.annualPremium)}</td>
							<td class="px-4 py-3">{formatCurrency(item.fiveYearLosses)}</td>
							<td class="px-4 py-3 text-emerald-700 font-bold">{(item.lossRatio * 100).toFixed(1)}%</td>
							<td class="px-4 py-3">
								<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold {item.fitScore >= 75 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}">
									{item.fitScore} / 100
								</span>
							</td>
							<td class="px-4 py-3">
								<span class="text-[11px] font-sans font-medium px-2 py-0.5 rounded {item.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-700 border border-slate-200'}">
									{item.status}
								</span>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</section>
</div>
