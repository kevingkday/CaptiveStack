<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';
	import {
		Landmark,
		Shield,
		TrendingUp,
		DollarSign,
		CheckCircle2,
		AlertCircle,
		ArrowRight,
		Sliders,
		Users,
		Percent,
		Building2,
		Check,
		Lock,
		PlusCircle,
		Clock,
		Coins,
		ChevronRight,
		FileText
	} from 'lucide-svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	// Select active project
	let selectedProjectId = $state('proj-eagle1-2026');
	let activeProject = $derived(
		data.projects.find((p) => p.id === selectedProjectId) || data.projects[0]
	);

	// Capital Call Stress Test Slider
	let simulatedLossRatio = $state(45); // 45% standard year
	let pledgeModalOpen = $state(false);
	let selectedReserveId = $state<string | null>(null);
	let pledgeAmount = $state(50000);
	let memberName = $state('Charter Association Member');
	let isSubmitting = $state(false);

	$effect(() => {
		if (data.projects?.[0]?.id) {
			selectedProjectId = data.projects[0].id;
		}
		if (data.user?.name) {
			memberName = data.user.name;
		}
	});

	function formatCurrency(val: number) {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			maximumFractionDigits: 0
		}).format(val);
	}

	// Simulation math based on active project
	let simMath = $derived.by(() => {
		const isEagle = activeProject?.name?.includes('Eagle1');
		const grossPremium = isEagle ? 1500000 : 2500000;
		const memberCount = isEagle ? 32 : 48;
		const primaryRetained = grossPremium * 0.78; // 78% retained before excess stop-loss
		const reinsuranceDetachment = grossPremium * 0.85; // 85% attachment point

		const totalLosses = grossPremium * (simulatedLossRatio / 100);

		// Waterfall layers
		const layer1PremiumAbsorbed = Math.min(totalLosses, primaryRetained);
		const remainingAfterPrem = Math.max(0, totalLosses - layer1PremiumAbsorbed);

		// Tier 2: Cash Reserve Buffer ($500k)
		const cashBuffer = isEagle ? 500000 : 750000;
		const layer2CashAbsorbed = Math.min(remainingAfterPrem, cashBuffer);
		const remainingAfterCash = Math.max(0, remainingAfterPrem - layer2CashAbsorbed);

		// Tier 3: Standby Capital / LOC Drawdown ($1.5M or $2.5M)
		const standbyFacility = isEagle ? 1500000 : 2500000;
		const layer3StandbyDrawn = Math.min(remainingAfterCash, standbyFacility);
		const remainingAfterStandby = Math.max(0, remainingAfterCash - layer3StandbyDrawn);

		// Tier 4: Reinsurance Recovery
		const layer4ReinsurancePaid = remainingAfterStandby;

		// Bank LOC Fee Comparison (2.5% fee on standby facility)
		const traditionalAnnualBankFee = standbyFacility * 0.025;
		const fiveYearLOCSavings = traditionalAnnualBankFee * 5;

		return {
			grossPremium,
			memberCount,
			totalLosses,
			layer1PremiumAbsorbed,
			layer2CashAbsorbed,
			layer3StandbyDrawn,
			layer4ReinsurancePaid,
			standbyFacility,
			traditionalAnnualBankFee,
			fiveYearLOCSavings
		};
	});

	// Quota-share members breakdown
	const sampleMembers = [
		{ name: 'Pine Valley Golf & Events', share: 0.065, locTraditional: 97500 },
		{ name: 'Cypress Point Invitational', share: 0.055, locTraditional: 82500 },
		{ name: 'Augusta Tournament Services', share: 0.075, locTraditional: 112500 },
		{ name: 'Pebble Beach Prize Syndicate', share: 0.082, locTraditional: 123000 },
		{ name: 'Scottsdale Pro-Am Network', share: 0.048, locTraditional: 72000 },
		{ name: 'Kiawah Island Sports Assoc.', share: 0.058, locTraditional: 87000 }
	];

	function openPledge(resId: string) {
		selectedReserveId = resId;
		pledgeModalOpen = true;
	}
</script>

<svelte:head>
	<title>Capital Reserves & LOC Replacement Engine | CaptiveStack</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
	<!-- Hero Header -->
	<header class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-brand-950/40 border border-slate-800 p-6 sm:p-8 shadow-xl">
		<div class="relative z-10 space-y-3">
			<div class="flex flex-wrap items-center gap-2">
				<span class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-brand-500/10 text-brand-400 border border-brand-500/30">
					<Landmark class="w-3.5 h-3.5 mr-1.5" />
					Alternative Risk Financing
				</span>
				<span class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
					Letter of Credit (LOC) Replacement Engine
				</span>
			</div>

			<h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
				Pooled Capital Reserves &amp; Standby Collateral
			</h1>
			<p class="text-sm text-slate-300 max-w-3xl leading-relaxed">
				Commercial fronting carriers demand association members post bank Letters of Credit with 100% cash collateral and 1.5%&ndash;3.0% annual bank commitment fees. CaptiveStack replaces trapped bank LOCs with pooled standby capital pledges and subordinated surplus notes yielding 6.5% interest.
			</p>

			<!-- Program Switcher Buttons -->
			<div class="pt-3 flex flex-wrap items-center gap-2">
				<span class="text-xs text-slate-400 font-medium mr-1">Select Captive Program:</span>
				{#each data.projects as project}
					<button
						type="button"
						onclick={() => (selectedProjectId = project.id)}
						class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all {selectedProjectId === project.id ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20 ring-1 ring-brand-400' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 border border-slate-700/60'}"
					>
						{project.name}
					</button>
				{/each}
			</div>
		</div>
	</header>

	{#if form?.success}
		<div class="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-start space-x-3 text-sm animate-in fade-in duration-200">
			<CheckCircle2 class="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
			<div class="space-y-1">
				<strong class="font-bold text-white">Capital Pledge of {formatCurrency(form.pledgeAmount)} Committed to D1 Database!</strong>
				<p class="text-xs text-emerald-300/90 font-mono">
					Reserve ID: {form.reserveId} &bull; New Total: {formatCurrency(form.allocatedAmount)} &bull; Status: {form.status}
				</p>
			</div>
		</div>
	{/if}

	<!-- Active Program Summary Bar -->
	<section class="grid grid-cols-2 lg:grid-cols-4 gap-4">
		<div class="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
			<span class="text-xs text-slate-400 block mb-1">Target Capital Facility</span>
			<span class="text-2xl font-bold text-white font-mono">{formatCurrency(simMath.standbyFacility)}</span>
			<span class="text-[11px] text-emerald-400 block mt-1">Replaces Traditional Bank LOC</span>
		</div>

		<div class="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
			<span class="text-xs text-slate-400 block mb-1">Annual Bank Fee Avoidance</span>
			<span class="text-2xl font-bold text-emerald-400 font-mono">{formatCurrency(simMath.traditionalAnnualBankFee)} / yr</span>
			<span class="text-[11px] text-slate-400 block mt-1">At 2.50% standard bank LOC fee</span>
		</div>

		<div class="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
			<span class="text-xs text-slate-400 block mb-1">5-Year Group Savings</span>
			<span class="text-2xl font-bold text-brand-300 font-mono">{formatCurrency(simMath.fiveYearLOCSavings)}</span>
			<span class="text-[11px] text-slate-400 block mt-1">Retained in member treasury</span>
		</div>

		<div class="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
			<span class="text-xs text-slate-400 block mb-1">Surplus Note Yield</span>
			<span class="text-2xl font-bold text-indigo-400 font-mono">6.50% APY</span>
			<span class="text-[11px] text-slate-400 block mt-1">Subordinated capital dividend</span>
		</div>
	</section>

	<!-- Capital Reserve Facilities Grid for Active Project -->
	<section class="space-y-4">
		<div class="flex items-center justify-between border-b border-slate-800 pb-3">
			<div>
				<h2 class="text-base font-bold text-white flex items-center space-x-2">
					<Coins class="w-4 h-4 text-emerald-400" />
					<span>Configured Capital Facilities &bull; {activeProject.name}</span>
				</h2>
				<p class="text-xs text-slate-400">
					D1 SQLite records for project standby credit, liquid working reserves, and surplus notes.
				</p>
			</div>
			<span class="text-xs font-mono text-slate-400">
				{activeProject.capitalReserves?.length || 0} Facilities
			</span>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			{#each activeProject.capitalReserves || [] as res}
				{@const pct = Math.min(100, Math.round((res.allocatedAmount / res.requiredAmount) * 100))}
				<div class="rounded-xl bg-slate-900/70 border border-slate-800 p-5 space-y-4">
					<div class="flex items-start justify-between">
						<div class="space-y-1">
							<span class="text-xs font-mono text-brand-400 uppercase tracking-wider">{res.reserveType}</span>
							<h3 class="text-base font-bold text-white font-mono">
								{formatCurrency(res.allocatedAmount)} <span class="text-slate-400 font-sans text-xs">/ {formatCurrency(res.requiredAmount)}</span>
							</h3>
						</div>
						<span class="px-2 py-0.5 rounded text-xs font-semibold {res.status === 'Funded' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-brand-500/10 text-brand-300 border border-brand-500/20'}">
							{res.status} ({pct}%)
						</span>
					</div>

					<!-- Progress Bar -->
					<div class="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
						<div
							class="h-full bg-gradient-to-r from-brand-500 to-emerald-400 rounded-full transition-all duration-300"
							style="width: {pct}%"
						></div>
					</div>

					<div class="grid grid-cols-2 gap-2 text-xs font-mono p-2.5 rounded bg-slate-950/60 border border-slate-800/80">
						<div>
							<span class="text-slate-400 block text-[10px]">Annual Interest / Coupon</span>
							<span class="text-white font-bold">{res.interestRate > 0 ? `${res.interestRate}% APY` : 'Zero Interest (Standby)'}</span>
						</div>
						<div>
							<span class="text-slate-400 block text-[10px]">Unfunded Remainder</span>
							<span class="text-amber-300 font-bold">{formatCurrency(Math.max(0, res.requiredAmount - res.allocatedAmount))}</span>
						</div>
					</div>

					<div class="pt-2 flex items-center justify-between border-t border-slate-800">
						<span class="text-xs text-slate-400 font-mono text-[11px]">ID: {res.id.slice(0, 16)}...</span>
						<button
							type="button"
							onclick={() => openPledge(res.id)}
							class="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white transition-colors cursor-pointer"
						>
							<PlusCircle class="w-3.5 h-3.5" />
							<span>Commit Member Pledge</span>
						</button>
					</div>
				</div>
			{/each}
		</div>
	</section>

	<!-- Interactive Capital Call Waterfall Simulation -->
	<section class="rounded-xl bg-slate-900/60 border border-slate-800 p-6 space-y-6">
		<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
			<div>
				<h2 class="text-base font-bold text-white flex items-center space-x-2">
					<Sliders class="w-4 h-4 text-brand-400" />
					<span>Capital Call Stress Test &amp; Loss Waterfall Simulation</span>
				</h2>
				<p class="text-xs text-slate-400">
					Simulate how the captive's layered capital structure absorbs claims spikes without insolvency.
				</p>
			</div>

			<!-- Loss Ratio Slider Control -->
			<div class="flex items-center space-x-3 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
				<span class="text-xs font-mono text-slate-400">Stress Loss Ratio:</span>
				<input
					type="range"
					min="20"
					max="150"
					step="5"
					bind:value={simulatedLossRatio}
					class="w-32 accent-amber-500 cursor-pointer"
				/>
				<span class="font-mono text-xs font-bold px-2 py-0.5 rounded {simulatedLossRatio <= 45 ? 'bg-emerald-500/10 text-emerald-400' : simulatedLossRatio <= 85 ? 'bg-amber-500/10 text-amber-300' : 'bg-rose-500/10 text-rose-300'}">
					{simulatedLossRatio}% Incurred
				</span>
			</div>
		</div>

		<!-- Waterfall Breakdown Diagram -->
		<div class="space-y-4">
			<div class="flex items-center justify-between text-xs font-mono">
				<span class="text-slate-400">Total Simulated Claims: <strong class="text-white">{formatCurrency(simMath.totalLosses)}</strong></span>
				<span class="text-slate-400">Gross Premium Pool: <strong class="text-brand-300">{formatCurrency(simMath.grossPremium)}</strong></span>
			</div>

			<!-- 4 Layer Waterfall Bars -->
			<div class="space-y-3">
				<!-- Layer 1: Retained Premium -->
				<div class="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
					<div class="flex items-center justify-between text-xs">
						<span class="font-bold text-white flex items-center space-x-2">
							<span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
							<span>Tier 1: Retained Premium Absorption</span>
						</span>
						<span class="font-mono text-emerald-400 font-bold">{formatCurrency(simMath.layer1PremiumAbsorbed)}</span>
					</div>
					<div class="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
						<div
							class="h-full bg-emerald-400 rounded-full"
							style="width: {Math.min(100, (simMath.layer1PremiumAbsorbed / simMath.totalLosses) * 100)}%"
						></div>
					</div>
					<p class="text-[11px] text-slate-400">
						Standard underwriting claims absorbed directly from member premiums with zero capital drawdown.
					</p>
				</div>

				<!-- Layer 2: Cash Reserve Buffer -->
				<div class="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
					<div class="flex items-center justify-between text-xs">
						<span class="font-bold text-white flex items-center space-x-2">
							<span class="w-2.5 h-2.5 rounded-full bg-indigo-400"></span>
							<span>Tier 2: Liquid Cash Reserve Buffer</span>
						</span>
						<span class="font-mono text-indigo-400 font-bold">{formatCurrency(simMath.layer2CashAbsorbed)}</span>
					</div>
					<div class="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
						<div
							class="h-full bg-indigo-400 rounded-full"
							style="width: {Math.min(100, (simMath.layer2CashAbsorbed / Math.max(1, simMath.totalLosses)) * 100)}%"
						></div>
					</div>
					<p class="text-[11px] text-slate-400">
						Liquid bank reserves funded at formation to absorb moderate variance without issuing capital calls.
					</p>
				</div>

				<!-- Layer 3: Standby LOC Facility -->
				<div class="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
					<div class="flex items-center justify-between text-xs">
						<span class="font-bold text-white flex items-center space-x-2">
							<span class="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
							<span>Tier 3: Standby Capital / Member Quota-Share Drawdown</span>
						</span>
						<span class="font-mono text-amber-300 font-bold">{formatCurrency(simMath.layer3StandbyDrawn)}</span>
					</div>
					<div class="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
						<div
							class="h-full bg-amber-400 rounded-full"
							style="width: {Math.min(100, (simMath.layer3StandbyDrawn / Math.max(1, simMath.totalLosses)) * 100)}%"
						></div>
					</div>
					<p class="text-[11px] text-slate-400">
						Standby pledges called pro-rata across members. Members retain their cash unless a 1-in-25+ year loss spike occurs.
					</p>
				</div>

				<!-- Layer 4: Reinsurance Treaty Attachment -->
				<div class="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
					<div class="flex items-center justify-between text-xs">
						<span class="font-bold text-white flex items-center space-x-2">
							<span class="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
							<span>Tier 4: Reinsurance Stop-Loss Recovery</span>
						</span>
						<span class="font-mono text-rose-400 font-bold">{formatCurrency(simMath.layer4ReinsurancePaid)}</span>
					</div>
					<div class="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
						<div
							class="h-full bg-rose-400 rounded-full"
							style="width: {Math.min(100, (simMath.layer4ReinsurancePaid / Math.max(1, simMath.totalLosses)) * 100)}%"
						></div>
					</div>
					<p class="text-[11px] text-slate-400">
						Stop-loss reinsurance attaches above the captive detachment point. Zero further member liability.
					</p>
				</div>
			</div>
		</div>

		<!-- Member Quota-Share Allocation Table -->
		<div class="space-y-3 pt-3 border-t border-slate-800">
			<h3 class="text-xs font-bold uppercase tracking-wider text-slate-300">
				Representative Member Standby Allocation &amp; Traditional LOC Savings
			</h3>

			<div class="overflow-x-auto rounded-lg border border-slate-800">
				<table class="w-full text-left text-xs font-mono">
					<thead class="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
						<tr>
							<th class="px-4 py-2.5 font-semibold font-sans">Member Entity</th>
							<th class="px-4 py-2.5 font-semibold font-sans">Quota Share</th>
							<th class="px-4 py-2.5 font-semibold font-sans">Standby Obligation</th>
							<th class="px-4 py-2.5 font-semibold font-sans">Simulated Call</th>
							<th class="px-4 py-2.5 font-semibold font-sans">5-Yr Bank Fee Saved</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-slate-800/60 text-slate-300">
						{#each sampleMembers as m}
							{@const obligation = simMath.standbyFacility * m.share}
							{@const simulatedCall = simMath.layer3StandbyDrawn * m.share}
							{@const fiveYrSaved = (obligation * 0.025) * 5}
							<tr class="hover:bg-slate-800/30 transition-colors">
								<td class="px-4 py-2.5 text-white font-sans font-medium">{m.name}</td>
								<td class="px-4 py-2.5">{(m.share * 100).toFixed(1)}%</td>
								<td class="px-4 py-2.5">{formatCurrency(obligation)}</td>
								<td class="px-4 py-2.5 font-bold {simulatedCall > 0 ? 'text-amber-300' : 'text-slate-400'}">
									{formatCurrency(simulatedCall)}
								</td>
								<td class="px-4 py-2.5 text-emerald-400 font-bold">{formatCurrency(fiveYrSaved)}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</section>

	<!-- Pledge Commitment Modal / Slide-over -->
	{#if pledgeModalOpen}
		<div class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
			<div class="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
				<div class="flex items-center justify-between border-b border-slate-800 pb-3">
					<h3 class="text-base font-bold text-white flex items-center space-x-2">
						<PlusCircle class="w-4 h-4 text-emerald-400" />
						<span>Pledge Standby Capital</span>
					</h3>
					<button
						type="button"
						onclick={() => (pledgeModalOpen = false)}
						class="text-slate-400 hover:text-white text-xs font-mono"
					>
						Cancel
					</button>
				</div>

				<form
					method="POST"
					action="?/pledgeReserve"
					use:enhance={() => {
						isSubmitting = true;
						return async ({ update }) => {
							await update();
							isSubmitting = false;
							pledgeModalOpen = false;
						};
					}}
					class="space-y-4 text-xs"
				>
					<input type="hidden" name="reserveId" value={selectedReserveId} />

					<div class="space-y-1.5">
						<label for="memberName" class="text-slate-300 font-medium">Member Entity Name</label>
						<input
							id="memberName"
							name="memberName"
							bind:value={memberName}
							required
							class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-1 focus:ring-brand-500 font-sans"
						/>
					</div>

					<div class="space-y-1.5">
						<label for="amount" class="text-slate-300 font-medium">Pledge Amount (USD)</label>
						<input
							id="amount"
							name="amount"
							type="number"
							min="10000"
							step="5000"
							bind:value={pledgeAmount}
							required
							class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-1 focus:ring-brand-500 font-mono text-sm"
						/>
						<span class="text-[11px] text-slate-400">
							Standby commitment. Zero cash is transferred until required under captive articles.
						</span>
					</div>

					<div class="pt-3 flex items-center justify-end space-x-3">
						<button
							type="button"
							onclick={() => (pledgeModalOpen = false)}
							class="px-3.5 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={isSubmitting}
							class="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-bold transition-all shadow-md shadow-brand-500/20 cursor-pointer disabled:opacity-50"
						>
							{isSubmitting ? 'Recording to D1...' : 'Confirm Capital Pledge'}
						</button>
					</div>
				</form>
			</div>
		</div>
	{/if}
</div>
