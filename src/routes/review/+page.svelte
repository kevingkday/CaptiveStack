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
	<title>Actuarial Review & Feasibility Audit Queue | Captive8</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
	<!-- Hero Header -->
	<header class="relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-xs">
		<div class="relative z-10 space-y-3">
			<div class="flex flex-wrap items-center gap-2">
				<span class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
					<FileSpreadsheet class="w-3.5 h-3.5 mr-1.5 text-amber-600" />
					Actuarial Review &amp; Feasibility Audit
				</span>
				<span class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
					Adviser Reviewer Portal
				</span>
			</div>

			<h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
				Actuarial Loss Distribution &amp; Combined Ratio Review
			</h1>
			<p class="text-sm text-slate-600 max-w-3xl leading-relaxed">
				Independent actuary workspace evaluating binomial prize indemnity risk (Eagle1) and frequency models (GlassCo). Review verified loss runs and certify combined ratio targets.
			</p>

			<!-- Program Switcher -->
			<div class="pt-2 flex flex-wrap items-center gap-2 text-xs">
				<span class="text-slate-500 font-medium">Select Pilot Program:</span>
				{#each data.projects as project}
					<button
						type="button"
						onclick={() => (selectedProjectId = project.id)}
						class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer {selectedProjectId === project.id ? 'bg-amber-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'}"
					>
						{project.name} &bull; Stage: {project.stage}
					</button>
				{/each}
			</div>
		</div>
	</header>

	{#if form?.success}
		<div class="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-start space-x-3 text-sm animate-in fade-in duration-200">
			<CheckCircle2 class="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
			<div class="space-y-1">
				<strong class="font-bold text-emerald-900">Actuarial Feasibility Certified Successfully!</strong>
				<p class="text-xs text-emerald-700 font-mono">
					Project ID: {form.projectId} &bull; Target Combined Ratio: {formatPercent(form.combinedRatioTarget)} &bull; Next Stage: {form.nextStage}
				</p>
			</div>
		</div>
	{/if}

	<!-- 2-Column Actuarial Modeling Studio -->
	<div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
		<!-- Left: Mathematical Modeling Parameters -->
		<div class="lg:col-span-7 space-y-6">
			<div class="rounded-xl bg-white border border-slate-200 p-6 space-y-6 shadow-xs">
				<div class="flex items-center justify-between border-b border-slate-200 pb-3">
					<div>
						<h2 class="text-base font-bold text-slate-900 flex items-center space-x-2">
							<Sliders class="w-4 h-4 text-amber-600" />
							<span>Eagle1 Hole-in-One Binomial Probability Model</span>
						</h2>
						<p class="text-xs text-slate-500">
							Mathematical risk modeling for prize indemnity coverage on designated par-3 holes.
						</p>
					</div>
					<span class="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
						1 in 12,500 Odds
					</span>
				</div>

				<div class="space-y-4">
					<!-- Slider 1: Tournaments per Year -->
					<div class="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
						<div class="flex items-center justify-between text-xs">
							<span class="text-slate-700 font-medium">Tournaments Insured per Year</span>
							<span class="font-mono text-slate-900 font-bold text-sm bg-white px-2.5 py-0.5 rounded border border-slate-200 shadow-2xs">
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
						<div class="flex justify-between text-[10px] font-mono text-slate-500">
							<span>10 Events</span>
							<span>Total Shots: {eagleModel.totalAttempts.toLocaleString()}</span>
							<span>80 Events</span>
						</div>
					</div>

					<!-- Slider 2: Golfers per Tournament -->
					<div class="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
						<div class="flex items-center justify-between text-xs">
							<span class="text-slate-700 font-medium">Amateur Golfers per Tournament</span>
							<span class="font-mono text-slate-900 font-bold text-sm bg-white px-2.5 py-0.5 rounded border border-slate-200 shadow-2xs">
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
						<div class="flex justify-between text-[10px] font-mono text-slate-500">
							<span>72 (Single Shotgun)</span>
							<span>144 (Standard Field)</span>
							<span>288 (Double Shotgun)</span>
						</div>
					</div>

					<!-- Slider 3: Par 3 Yardage -->
					<div class="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
						<div class="flex items-center justify-between text-xs">
							<span class="text-slate-700 font-medium">Target Hole Yardage</span>
							<span class="font-mono text-slate-900 font-bold text-sm bg-white px-2.5 py-0.5 rounded border border-slate-200 shadow-2xs">
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
						<div class="flex justify-between text-[10px] font-mono text-slate-500">
							<span>145 Yards (Higher Prob)</span>
							<span>165 Yards (USGA Benchmark)</span>
							<span>195 Yards (Lower Prob)</span>
						</div>
					</div>

					<!-- Slider 4: Prize Value Insured -->
					<div class="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
						<div class="flex items-center justify-between text-xs">
							<span class="text-slate-700 font-medium">Grand Prize Value Insured</span>
							<span class="font-mono text-emerald-700 font-bold text-sm bg-white px-2.5 py-0.5 rounded border border-slate-200 shadow-2xs">
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
						<div class="flex justify-between text-[10px] font-mono text-slate-500">
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
			<div class="rounded-xl bg-white border border-slate-200 p-6 space-y-5 shadow-xs">
				<div class="flex items-center justify-between border-b border-slate-200 pb-3">
					<span class="text-xs font-bold uppercase tracking-wider text-slate-500">Actuarial Loss Metrics</span>
					<span class="text-xs font-semibold px-2 py-0.5 rounded-full {eagleModel.combinedRatio <= 0.85 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}">
						Combined Ratio: {formatPercent(eagleModel.combinedRatio)}
					</span>
				</div>

				<div class="space-y-3 font-mono text-xs">
					<div class="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
						<span class="text-slate-600">Gross Premium Pool:</span>
						<span class="text-slate-900 font-bold">{formatCurrency(eagleModel.grossPremiumPool)}</span>
					</div>

					<div class="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
						<span class="text-slate-600">Expected Annual Payouts:</span>
						<span class="text-amber-700 font-bold">{eagleModel.expectedClaimsCount.toFixed(2)} Prizes ({formatCurrency(eagleModel.expectedGrossLosses)})</span>
					</div>

					<div class="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
						<span class="text-slate-600">Model Expected Loss Ratio:</span>
						<span class="text-emerald-700 font-bold">{formatPercent(eagleModel.lossRatio)}</span>
					</div>

					<div class="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
						<span class="text-slate-600">Expense &amp; TPA Operations:</span>
						<span class="text-slate-700 font-bold">{formatPercent(eagleModel.expenseRatio)}</span>
					</div>

					<div class="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
						<span class="text-slate-600">Stop-Loss Reinsurance Ceded:</span>
						<span class="text-slate-700 font-bold">{formatPercent(eagleModel.reinsuranceStopLoss)}</span>
					</div>

					<div class="p-3 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between">
						<span class="text-emerald-900 font-bold">Underwriting Margin Retained:</span>
						<span class="text-emerald-700 font-bold">{formatPercent(1 - eagleModel.combinedRatio)}</span>
					</div>
				</div>
			</div>

			<!-- Actuarial Sign-off Certification Form -->
			<div class="rounded-xl bg-white border border-slate-200 p-6 space-y-5 shadow-xs">
				<div class="flex items-center justify-between border-b border-slate-200 pb-3">
					<h3 class="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
						<BadgeCheck class="w-4 h-4 text-emerald-600" />
						<span>Actuary Feasibility Certification</span>
					</h3>
					<span class="text-[11px] font-mono text-slate-500">Audit Status</span>
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
						<label for="actuaryNotes" class="text-slate-700 font-medium">Actuarial Opinion &amp; Domicile Filing Notes</label>
						<textarea
							id="actuaryNotes"
							name="actuaryNotes"
							rows="3"
							bind:value={actuaryNotes}
							required
							class="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-sans text-xs"
						></textarea>
					</div>

					<button
						type="submit"
						disabled={isSubmitting}
						class="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 active:bg-amber-800 disabled:opacity-50 text-white shadow-xs transition-all flex items-center justify-center space-x-2 cursor-pointer"
					>
						{#if isSubmitting}
							<span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
							<span>Recording Actuarial Sign-off...</span>
						{:else}
							<CheckCircle2 class="w-4 h-4" />
							<span>Certify Actuarial Study &bull; Advance to Capital Formation</span>
						{/if}
					</button>
				</form>
			</div>
		</div>
	</div>

	<!-- Document Audit Table -->
	<section class="rounded-xl bg-white border border-slate-200 p-6 space-y-4 shadow-xs">
		<div class="flex items-center justify-between border-b border-slate-200 pb-3">
			<div>
				<h2 class="text-base font-bold text-slate-900 flex items-center space-x-2">
					<Database class="w-4 h-4 text-blue-600" />
					<span>Document Records &amp; Loss Runs Queue</span>
				</h2>
				<p class="text-xs text-slate-500">
					Direct encrypted uploads from member surveys with validated audit trail metadata.
				</p>
			</div>
			<span class="text-xs font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
				{data.documents.length} Uploaded Files
			</span>
		</div>

		<div class="overflow-x-auto rounded-lg border border-slate-200">
			<table class="w-full text-left text-xs font-mono">
				<thead class="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200">
					<tr>
						<th class="px-4 py-2.5 font-semibold font-sans">Document Name</th>
						<th class="px-4 py-2.5 font-semibold font-sans">Entity Type</th>
						<th class="px-4 py-2.5 font-semibold font-sans">File Type</th>
						<th class="px-4 py-2.5 font-semibold font-sans">Storage Key</th>
						<th class="px-4 py-2.5 font-semibold font-sans">Status</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-slate-200 text-slate-700">
					{#each data.documents as doc}
						<tr class="hover:bg-slate-50 transition-colors">
							<td class="px-4 py-3 text-slate-900 font-sans font-medium flex items-center space-x-2">
								<FileText class="w-4 h-4 text-slate-400 flex-shrink-0" />
								<span>{doc.fileName}</span>
							</td>
							<td class="px-4 py-3">{doc.parentEntityType}</td>
							<td class="px-4 py-3 text-slate-500">{doc.fileType}</td>
							<td class="px-4 py-3 text-blue-600">{doc.blobKey}</td>
							<td class="px-4 py-3">
								<span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold {doc.status === 'Verified' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}">
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
	<section class="rounded-xl bg-white border border-slate-200 p-4 text-xs space-y-2 shadow-xs">
		<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
			<span class="text-slate-600 font-medium">Quick Persona Switch:</span>
			<div class="flex flex-wrap gap-2">
				{#each ['Admin', 'CaptiveStackAdministrator', 'AssociationAdministrator', 'AssociationMember', 'AdviserReviewer'] as testRole}
					{#if testRole !== data.user?.role}
						<form method="POST" action="/login?/demoLogin" class="inline">
							<input type="hidden" name="role" value={testRole} />
							<input type="hidden" name="redirectTo" value="/review" />
							<button
								type="submit"
								class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-[11px] transition-colors cursor-pointer border border-slate-200"
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
