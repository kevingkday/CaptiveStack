<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';
	import {
		FileSpreadsheet,
		Shield,
		CheckCircle2,
		AlertCircle,
		ArrowRight,
		Sliders,
		Landmark,
		Coins,
		Building2,
		Layers,
		Check,
		Lock,
		Clock,
		BadgeCheck,
		FileText,
		FileCheck,
		TrendingUp,
		Database
	} from 'lucide-svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	// Active selected program
	let selectedProjectId = $state('proj-eagle1-2026');
	let activeProject = $derived(
		data.projects.find((p) => p.id === selectedProjectId) || data.projects[0]
	);

	$effect(() => {
		if (data.projects?.[0]?.id) {
			selectedProjectId = data.projects[0].id;
		}
	});

	// Eagle1 Binomial Probability Parameters
	let tournamentsPerYear = $state(42);
	let playersPerTournament = $state(144);
	let par3Yardage = $state(165);
	let prizeValue = $state(50000);
	let premiumPerPlayer = $state(38);
	let actuaryNotes = $state('Binomial hole-in-one probability models verified against 10-year USGA amateur hole-in-one statistics. Combined ratio target of 78.0% satisfies domicile surplus guidelines.');
	let isSubmitting = $state(false);

	function formatCurrency(val: number) {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			maximumFractionDigits: 0
		}).format(val);
	}

	function formatPercent(val: number) {
		return (val * 100).toFixed(1) + '%';
	}

	// Eagle1 Model Derivations
	let eagleModel = $derived.by(() => {
		const totalAttempts = tournamentsPerYear * playersPerTournament;
		// Distance adjustment: 165yd is 1 in 12,500; steeper for >175
		const distanceFactor = par3Yardage > 165 ? 1 + (par3Yardage - 165) * 0.015 : 1 - (165 - par3Yardage) * 0.01;
		const baseProbability = 1 / (12500 * distanceFactor);

		const expectedClaimsCount = totalAttempts * baseProbability;
		const expectedGrossLosses = expectedClaimsCount * prizeValue;
		const grossPremiumPool = totalAttempts * premiumPerPlayer;
		const lossRatio = expectedGrossLosses / grossPremiumPool;

		const expenseRatio = 0.14; // Captive manager, actuary, TPA
		const reinsuranceStopLoss = 0.305; // Excess of loss treaty
		const combinedRatio = lossRatio + expenseRatio + reinsuranceStopLoss;

		return {
			totalAttempts,
			baseProbability,
			expectedClaimsCount,
			expectedGrossLosses,
			grossPremiumPool,
			lossRatio,
			expenseRatio,
			reinsuranceStopLoss,
			combinedRatio
		};
	});
</script>

<svelte:head>
	<title>Actuarial Review & Feasibility Audit Queue | CaptiveStack</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
	<!-- Hero Header -->
	<header class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-brand-950/40 border border-slate-800 p-6 sm:p-8 shadow-xl">
		<div class="relative z-10 space-y-3">
			<div class="flex flex-wrap items-center gap-2">
				<span class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30">
					<FileSpreadsheet class="w-3.5 h-3.5 mr-1.5" />
					Actuarial Review &amp; Feasibility Audit
				</span>
				<span class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono bg-slate-800 text-slate-300 border border-slate-700">
					Adviser Reviewer Portal
				</span>
			</div>

			<h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
				Actuarial Loss Distribution &amp; Combined Ratio Review
			</h1>
			<p class="text-sm text-slate-300 max-w-3xl leading-relaxed">
				Independent actuary workspace evaluating binomial prize indemnity risk (Eagle1) and Poisson frequency models (GlassCo). Review verified loss runs from Cloudflare R2 and certify combined ratio targets.
			</p>

			<!-- Program Switcher -->
			<div class="pt-2 flex flex-wrap items-center gap-2 text-xs">
				<span class="text-slate-400 font-medium">Select Pilot Program:</span>
				{#each data.projects as project}
					<button
						type="button"
						onclick={() => (selectedProjectId = project.id)}
						class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all {selectedProjectId === project.id ? 'bg-amber-600 text-white shadow-md shadow-amber-500/20 ring-1 ring-amber-400' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 border border-slate-700/60'}"
					>
						{project.name} &bull; Stage: {project.stage}
					</button>
				{/each}
			</div>
		</div>
	</header>

	{#if form?.success}
		<div class="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-start space-x-3 text-sm animate-in fade-in duration-200">
			<CheckCircle2 class="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
			<div class="space-y-1">
				<strong class="font-bold text-white">Actuarial Feasibility Certified in Cloudflare D1 SQLite!</strong>
				<p class="text-xs text-emerald-300/90 font-mono">
					Project ID: {form.projectId} &bull; Target Combined Ratio: {formatPercent(form.combinedRatioTarget)} &bull; Next Stage: {form.nextStage}
				</p>
			</div>
		</div>
	{/if}

	<!-- 2-Column Actuarial Modeling Studio -->
	<div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
		<!-- Left: Mathematical Modeling Parameters -->
		<div class="lg:col-span-7 space-y-6">
			<div class="rounded-xl bg-slate-900/70 border border-slate-800 p-6 space-y-6">
				<div class="flex items-center justify-between border-b border-slate-800 pb-3">
					<div>
						<h2 class="text-base font-bold text-white flex items-center space-x-2">
							<Sliders class="w-4 h-4 text-amber-400" />
							<span>Eagle1 Hole-in-One Binomial Probability Model</span>
						</h2>
						<p class="text-xs text-slate-400">
							Mathematical risk modeling for prize indemnity coverage on designated par-3 holes.
						</p>
					</div>
					<span class="text-xs font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
						1 in 12,500 Odds
					</span>
				</div>

				<div class="space-y-4">
					<!-- Slider 1: Tournaments per Year -->
					<div class="space-y-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
						<div class="flex items-center justify-between text-xs">
							<span class="text-slate-300 font-medium">Tournaments Insured per Year</span>
							<span class="font-mono text-white font-bold text-sm bg-slate-900 px-2.5 py-0.5 rounded border border-slate-800">
								{tournamentsPerYear} Events
							</span>
						</div>
						<input
							type="range"
							min="10"
							max="80"
							step="2"
							bind:value={tournamentsPerYear}
							class="w-full accent-amber-500 cursor-pointer"
						/>
						<div class="flex justify-between text-[10px] font-mono text-slate-400">
							<span>10 Events</span>
							<span>Total Shots: {eagleModel.totalAttempts.toLocaleString()}</span>
							<span>80 Events</span>
						</div>
					</div>

					<!-- Slider 2: Golfers per Tournament -->
					<div class="space-y-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
						<div class="flex items-center justify-between text-xs">
							<span class="text-slate-300 font-medium">Amateur Golfers per Tournament</span>
							<span class="font-mono text-white font-bold text-sm bg-slate-900 px-2.5 py-0.5 rounded border border-slate-800">
								{playersPerTournament} Players
							</span>
						</div>
						<input
							type="range"
							min="72"
							max="288"
							step="18"
							bind:value={playersPerTournament}
							class="w-full accent-amber-500 cursor-pointer"
						/>
						<div class="flex justify-between text-[10px] font-mono text-slate-400">
							<span>72 (Single Shotgun)</span>
							<span>144 (Standard Field)</span>
							<span>288 (Double Shotgun)</span>
						</div>
					</div>

					<!-- Slider 3: Par 3 Yardage -->
					<div class="space-y-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
						<div class="flex items-center justify-between text-xs">
							<span class="text-slate-300 font-medium">Target Hole Yardage</span>
							<span class="font-mono text-white font-bold text-sm bg-slate-900 px-2.5 py-0.5 rounded border border-slate-800">
								{par3Yardage} Yards
							</span>
						</div>
						<input
							type="range"
							min="145"
							max="195"
							step="5"
							bind:value={par3Yardage}
							class="w-full accent-amber-500 cursor-pointer"
						/>
						<div class="flex justify-between text-[10px] font-mono text-slate-400">
							<span>145 Yards (Higher Prob)</span>
							<span>165 Yards (USGA Benchmark)</span>
							<span>195 Yards (Lower Prob)</span>
						</div>
					</div>

					<!-- Slider 4: Prize Value Insured -->
					<div class="space-y-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
						<div class="flex items-center justify-between text-xs">
							<span class="text-slate-300 font-medium">Grand Prize Value Insured</span>
							<span class="font-mono text-emerald-400 font-bold text-sm bg-slate-900 px-2.5 py-0.5 rounded border border-slate-800">
								{formatCurrency(prizeValue)}
							</span>
						</div>
						<input
							type="range"
							min="15000"
							max="100000"
							step="5000"
							bind:value={prizeValue}
							class="w-full accent-emerald-500 cursor-pointer"
						/>
						<div class="flex justify-between text-[10px] font-mono text-slate-400">
							<span>$15,000 (Local Charity)</span>
							<span>$50,000 (Luxury Auto)</span>
							<span>$100,000 (Cash Shootout)</span>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Right: Mathematical Combined Ratio Output & Actuarial Sign-off -->
		<div class="lg:col-span-5 space-y-6">
			<!-- Actuarial Model Outputs -->
			<div class="rounded-xl bg-slate-900/70 border border-slate-800 p-6 space-y-5">
				<div class="flex items-center justify-between border-b border-slate-800 pb-3">
					<span class="text-xs font-bold uppercase tracking-wider text-slate-400">Actuarial Loss Metrics</span>
					<span class="text-xs font-mono px-2 py-0.5 rounded {eagleModel.combinedRatio <= 0.85 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-300 border border-rose-500/30'}">
						Combined Ratio: {formatPercent(eagleModel.combinedRatio)}
					</span>
				</div>

				<div class="space-y-3 font-mono text-xs">
					<div class="p-3 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-between">
						<span class="text-slate-400">Gross Premium Pool:</span>
						<span class="text-white font-bold">{formatCurrency(eagleModel.grossPremiumPool)}</span>
					</div>

					<div class="p-3 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-between">
						<span class="text-slate-400">Expected Annual Payouts:</span>
						<span class="text-amber-300 font-bold">{eagleModel.expectedClaimsCount.toFixed(2)} Prizes ({formatCurrency(eagleModel.expectedGrossLosses)})</span>
					</div>

					<div class="p-3 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-between">
						<span class="text-slate-400">Model Expected Loss Ratio:</span>
						<span class="text-emerald-400 font-bold">{formatPercent(eagleModel.lossRatio)}</span>
					</div>

					<div class="p-3 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-between">
						<span class="text-slate-400">Expense &amp; TPA Operations:</span>
						<span class="text-slate-300 font-bold">{formatPercent(eagleModel.expenseRatio)}</span>
					</div>

					<div class="p-3 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-between">
						<span class="text-slate-400">Stop-Loss Reinsurance Ceded:</span>
						<span class="text-slate-300 font-bold">{formatPercent(eagleModel.reinsuranceStopLoss)}</span>
					</div>

					<div class="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
						<span class="text-emerald-300 font-bold">Underwriting Margin Retained:</span>
						<span class="text-emerald-400 font-bold">{formatPercent(1 - eagleModel.combinedRatio)}</span>
					</div>
				</div>
			</div>

			<!-- Actuarial Sign-off Certification Form -->
			<div class="rounded-xl bg-slate-900/70 border border-slate-800 p-6 space-y-5">
				<div class="flex items-center justify-between border-b border-slate-800 pb-3">
					<h3 class="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
						<BadgeCheck class="w-4 h-4 text-emerald-400" />
						<span>Actuary Feasibility Certification</span>
					</h3>
					<span class="text-[11px] font-mono text-slate-400">D1 SQLite Mutation</span>
				</div>

				<form
					method="POST"
					action="?/certifyStudy"
					use:enhance={() => {
						isSubmitting = true;
						return async ({ update }) => {
							await update();
							isSubmitting = false;
						};
					}}
					class="space-y-4 text-xs"
				>
					<input type="hidden" name="projectId" value={activeProject.id} />
					<input type="hidden" name="combinedRatioTarget" value={eagleModel.combinedRatio} />
					<input type="hidden" name="nextStage" value="CapitalFormation" />

					<div class="space-y-1.5">
						<label for="actuaryNotes" class="text-slate-300 font-medium">Actuarial Opinion &amp; Domicile Filing Notes</label>
						<textarea
							id="actuaryNotes"
							name="actuaryNotes"
							rows="3"
							bind:value={actuaryNotes}
							required
							class="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-1 focus:ring-brand-500 font-sans text-xs"
						></textarea>
					</div>

					<button
						type="submit"
						disabled={isSubmitting}
						class="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center space-x-2 cursor-pointer"
					>
						{#if isSubmitting}
							<span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
							<span>Recording Actuarial Sign-off to D1...</span>
						{:else}
							<CheckCircle2 class="w-4 h-4" />
							<span>Certify Actuarial Study &bull; Advance to Capital Formation</span>
						{/if}
					</button>
				</form>
			</div>
		</div>
	</div>

	<!-- Cloudflare R2 Document Audit Table -->
	<section class="rounded-xl bg-slate-900/60 border border-slate-800 p-6 space-y-4">
		<div class="flex items-center justify-between border-b border-slate-800 pb-3">
			<div>
				<h2 class="text-base font-bold text-white flex items-center space-x-2">
					<Database class="w-4 h-4 text-brand-400" />
					<span>Cloudflare R2 Document Records &amp; Loss Runs Queue</span>
				</h2>
				<p class="text-xs text-slate-400">
					Zero local disk storage: direct stream uploads from 11-step member surveys to Cloudflare R2 with D1 metadata.
				</p>
			</div>
			<span class="text-xs font-mono text-slate-400">
				{data.documents.length} Uploaded Files
			</span>
		</div>

		<div class="overflow-x-auto rounded-lg border border-slate-800">
			<table class="w-full text-left text-xs font-mono">
				<thead class="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
					<tr>
						<th class="px-4 py-2.5 font-semibold font-sans">Document Name</th>
						<th class="px-4 py-2.5 font-semibold font-sans">Entity Type</th>
						<th class="px-4 py-2.5 font-semibold font-sans">File Type</th>
						<th class="px-4 py-2.5 font-semibold font-sans">R2 Blob Key</th>
						<th class="px-4 py-2.5 font-semibold font-sans">Status</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-slate-800/60 text-slate-300">
					{#each data.documents as doc}
						<tr class="hover:bg-slate-800/30 transition-colors">
							<td class="px-4 py-3 text-white font-sans font-medium flex items-center space-x-2">
								<FileText class="w-4 h-4 text-slate-400 flex-shrink-0" />
								<span>{doc.fileName}</span>
							</td>
							<td class="px-4 py-3">{doc.parentEntityType}</td>
							<td class="px-4 py-3 text-slate-400">{doc.fileType}</td>
							<td class="px-4 py-3 text-brand-300">{doc.blobKey}</td>
							<td class="px-4 py-3">
								<span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold {doc.status === 'Verified' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'}">
									{doc.status}
								</span>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</section>

	<!-- Quick Switcher Bar at Bottom -->
	<section class="rounded-xl bg-slate-950/80 border border-slate-800/80 p-4 text-xs space-y-2">
		<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
			<span class="text-slate-400 font-medium">Quick Persona Switch:</span>
			<div class="flex flex-wrap gap-2">
				{#each ['Admin', 'CaptiveStackAdministrator', 'AssociationAdministrator', 'AssociationMember', 'AdviserReviewer'] as testRole}
					{#if testRole !== data.user?.role}
						<form method="POST" action="/login?/demoLogin" class="inline">
							<input type="hidden" name="role" value={testRole} />
							<input type="hidden" name="redirectTo" value="/review" />
							<button
								type="submit"
								class="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 font-mono text-[11px] transition-colors cursor-pointer"
							>
								Switch to {testRole}
							</button>
						</form>
					{/if}
				{/each}
			</div>
		</div>
	</section>
</div>
