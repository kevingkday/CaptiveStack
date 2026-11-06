<script lang="ts">
	import type { PageProps } from './$types';
	import {
		Shield,
		Users,
		Sparkles,
		Building2,
		Copy,
		Check,
		ExternalLink,
		FileSpreadsheet,
		Calendar,
		ArrowRight,
		Info,
		CheckCircle2,
		Clock,
		Coins,
		BarChart3
	} from 'lucide-svelte';

	let { data }: PageProps = $props();

	let copiedSurveyUrl = $state(false);
	let copiedEmailTemplate = $state(false);

	let surveyUrl = $derived(
		typeof window !== 'undefined'
			? `${window.location.origin}/survey/${data.token}`
			: `https://www.captivestack.com/survey/${data.token}`
	);

	function copyLink() {
		navigator.clipboard.writeText(surveyUrl);
		copiedSurveyUrl = true;
		setTimeout(() => (copiedSurveyUrl = false), 2500);
	}

	const emailTemplate = $derived(`Subject: Evaluating a Member-Owned Group Insurance Captive for Our Association

Dear Member Executive,

As commercial insurance premiums continue to escalate, our association leadership is exploring a Member-Owned Group Captive Insurance program through CaptiveStack.

A group captive allows top-performing member organizations to pool their commercial risks, escape unpredictable commercial rate hikes, and potentially recapture underwriting profits and investment income.

To determine if our collective group volume meets statutory capital and underwriting feasibility thresholds, please take 5 minutes to complete our secure, confidential member intake survey:

${surveyUrl}

All policy data submitted is encrypted and will be anonymized for aggregate feasibility analysis. Thank you for helping us strengthen our collective buying power.

Best regards,
Association Leadership`);

	function copyEmail() {
		navigator.clipboard.writeText(emailTemplate);
		copiedEmailTemplate = true;
		setTimeout(() => (copiedEmailTemplate = false), 2500);
	}
</script>

<svelte:head>
	<title>Association Group Captive Dashboard | CaptiveStack</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
	<!-- Dashboard Header -->
	<header class="space-y-4 border-b border-slate-200 pb-8">
		<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
			<div class="space-y-1">
				<div class="flex items-center gap-2">
					<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
						<Building2 class="w-3.5 h-3.5 text-blue-600" />
						<span>Association Executive Portal</span>
					</span>
					{#if data.isSample}
						<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
							<Info class="w-3 h-3" />
							<span>Illustrative Sample Cohort</span>
						</span>
					{/if}
				</div>
				<h1 class="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
					Member Survey Campaign &amp; Feasibility Dashboard
				</h1>
				<p class="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
					Track member intake responses, aggregated commercial premium volume, and potential retained surplus.
				</p>
			</div>

			<div class="flex items-center gap-3 shrink-0">
				<a
					href="/feasibility"
					class="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-2xs transition-all"
				>
					<BarChart3 class="w-4 h-4 text-slate-500" />
					<span>Run Full Feasibility Model</span>
				</a>
				<a
					href="/readiness"
					class="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-2xs transition-all"
				>
					<Sparkles class="w-3.5 h-3.5 text-blue-200" />
					<span>New Assessment</span>
				</a>
			</div>
		</div>

		<!-- Mandatory Regulatory Disclaimer -->
		<div class="p-3.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 text-[11px] leading-relaxed flex items-center gap-2">
			<Shield class="w-4 h-4 text-blue-600 shrink-0" />
			<span>
				<strong>Illustrative estimates, not an actuarial opinion or offer.</strong> Formation of a member-owned group captive is subject to formal feasibility study, fronting carrier approval, and regulatory licensing in the chosen domicile.
			</span>
		</div>
	</header>

	<!-- KPI Summary Metrics Grid -->
	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
		<!-- Participating Members -->
		<div class="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2">
			<span class="text-xs font-bold text-slate-500 uppercase tracking-wider block">Intake Participation</span>
			<div class="flex items-baseline justify-between">
				<span class="text-3xl font-extrabold text-slate-900">
					{data.metrics.activeResponses} <span class="text-lg font-normal text-slate-400">/ {data.metrics.totalInvited}</span>
				</span>
				<Users class="w-5 h-5 text-blue-600" />
			</div>
			<div class="text-[11px] text-slate-500 flex items-center gap-1">
				<span class="w-2 h-2 rounded-full bg-emerald-500"></span>
				<span>{data.metrics.inProgressResponses} submissions in progress</span>
			</div>
		</div>

		<!-- Aggregate Participating Premium -->
		<div class="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2">
			<span class="text-xs font-bold text-blue-700 uppercase tracking-wider block">Aggregated Premium</span>
			<div class="flex items-baseline justify-between">
				<span class="text-3xl font-extrabold text-blue-900">
					${(data.metrics.aggregatePremium / 1000000).toFixed(2)}M
				</span>
				<Coins class="w-5 h-5 text-blue-600" />
			</div>
			<div class="text-[11px] text-slate-500">
				Total annual commercial P&amp;C spend
			</div>
		</div>

		<!-- Estimated 5-Year Retained Surplus -->
		<div class="p-6 rounded-3xl bg-gradient-to-br from-emerald-50 to-blue-50 border border-emerald-200 shadow-xs space-y-2">
			<span class="text-xs font-bold text-emerald-800 uppercase tracking-wider block">5-Yr Retained Surplus</span>
			<div class="flex items-baseline justify-between">
				<span class="text-2xl font-extrabold text-emerald-800">
					${(data.metrics.estimatedMinSurplus / 1000000).toFixed(1)}M – ${(data.metrics.estimatedMaxSurplus / 1000000).toFixed(1)}M
				</span>
				<Sparkles class="w-5 h-5 text-emerald-600" />
			</div>
			<div class="text-[11px] text-emerald-700">
				Illustrative underwriting profit at ~{data.metrics.weightedAvgLossRatio}% loss ratio
			</div>
		</div>

		<!-- Association Non-Dues Revenue Potential -->
		<div class="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2">
			<span class="text-xs font-bold text-slate-500 uppercase tracking-wider block">Potential Non-Dues Revenue</span>
			<div class="flex items-baseline justify-between">
				<span class="text-2xl font-extrabold text-slate-900">
					${(data.metrics.potentialNonDuesRevenueMin / 1000).toFixed(0)}k – ${(data.metrics.potentialNonDuesRevenueMax / 1000).toFixed(0)}k <span class="text-xs font-normal text-slate-400">/yr</span>
				</span>
				<Shield class="w-5 h-5 text-slate-500" />
			</div>
			<div class="text-[11px] text-slate-500">
				Based on typical 1.5% - 2.5% program management allowance
			</div>
		</div>
	</div>

	<!-- Member Survey Campaign Share Widget -->
	<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
		<!-- Left: Survey Link Sharing -->
		<div class="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-5">
			<div class="space-y-1">
				<span class="text-xs font-bold uppercase tracking-wider text-blue-600">Member Outreach</span>
				<h3 class="text-lg sm:text-xl font-bold text-slate-900">
					Distribute Tokenized Intake Survey to Members
				</h3>
				<p class="text-xs text-slate-600 leading-relaxed">
					Each member accesses a secure, multi-step intake flow to input their current coverage, annual premium, and 5-year loss history. Responses populate this dashboard automatically.
				</p>
			</div>

			<!-- URL Copy Box -->
			<div class="space-y-2">
				<label for="surveyTokenInput" class="text-xs font-bold text-slate-700 block">Unique Member Survey URL</label>
				<div class="flex items-center gap-2">
					<input
						id="surveyTokenInput"
						readonly
						value={surveyUrl}
						class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-800 select-all"
					/>
					<button
						type="button"
						onclick={copyLink}
						class="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shrink-0 shadow-2xs transition-colors cursor-pointer"
					>
						{#if copiedSurveyUrl}
							<Check class="w-4 h-4 text-blue-200" />
							<span>Copied!</span>
						{:else}
							<Copy class="w-4 h-4" />
							<span>Copy Link</span>
						{/if}
					</button>
				</div>
				<span class="text-[11px] text-slate-500 block">
					Unguessable 256-bit token bearer link. Safe to email to all prospective association members.
				</span>
			</div>

			<!-- Quick Instructions -->
			<div class="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
				<div class="space-y-1">
					<span class="font-bold text-slate-800 flex items-center gap-1">
						<span class="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px]">1</span>
						<span>Share Link</span>
					</span>
					<p class="text-slate-500 text-[11px]">Send via newsletter or committee email.</p>
				</div>
				<div class="space-y-1">
					<span class="font-bold text-slate-800 flex items-center gap-1">
						<span class="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px]">2</span>
						<span>Members Submit</span>
					</span>
					<p class="text-slate-500 text-[11px]">Members submit policy data in 5 minutes.</p>
				</div>
				<div class="space-y-1">
					<span class="font-bold text-slate-800 flex items-center gap-1">
						<span class="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px]">3</span>
						<span>Actuarial Review</span>
					</span>
					<p class="text-slate-500 text-[11px]">Kevin Day reviews aggregate feasibility.</p>
				</div>
			</div>
		</div>

		<!-- Right: Pre-drafted Member Announcement Email -->
		<div class="p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
			<div class="space-y-2">
				<div class="flex items-center justify-between">
					<span class="text-xs font-bold uppercase tracking-wider text-slate-600">Email Template</span>
					<button
						type="button"
						onclick={copyEmail}
						class="text-blue-600 hover:text-blue-800 text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
					>
						{#if copiedEmailTemplate}
							<Check class="w-3.5 h-3.5 text-emerald-600" />
							<span>Copied!</span>
						{:else}
							<Copy class="w-3.5 h-3.5" />
							<span>Copy Email</span>
						{/if}
					</button>
				</div>
				<h4 class="font-bold text-slate-900 text-sm">
					Ready-to-Send Member Announcement
				</h4>
				<div class="p-3 bg-white border border-slate-200 rounded-xl text-[11px] text-slate-600 font-mono leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap select-all">
					{emailTemplate}
				</div>
			</div>

			<p class="text-[11px] text-slate-500">
				Copy and customize for your board, insurance committee, or general membership distribution list.
			</p>
		</div>
	</div>

	<!-- Member Cohort Table -->
	<div class="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden space-y-0">
		<div class="p-6 border-b border-slate-100 flex items-center justify-between">
			<div class="space-y-0.5">
				<h3 class="font-bold text-base text-slate-900">
					Member Prospect Submissions
				</h3>
				<p class="text-xs text-slate-500">
					Anonymized aggregate submissions participating in this captive feasibility cohort.
				</p>
			</div>
			<span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
				{data.prospects.length} Participating Members
			</span>
		</div>

		<div class="overflow-x-auto">
			<table class="w-full text-left border-collapse text-xs">
				<thead>
					<tr class="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
						<th class="py-3 px-4">Member Organization</th>
						<th class="py-3 px-4">Lines of Coverage</th>
						<th class="py-3 px-4">Annual Premium</th>
						<th class="py-3 px-4">Loss Ratio</th>
						<th class="py-3 px-4">Status</th>
						<th class="py-3 px-4 text-right">Intake Date</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-slate-100 text-slate-700">
					{#each data.prospects as prospect}
						<tr class="hover:bg-slate-50/80 transition-colors">
							<td class="py-3.5 px-4 font-semibold text-slate-900">
								{prospect.companyName}
							</td>
							<td class="py-3.5 px-4 text-slate-600">
								{prospect.lines || 'Commercial Package'}
							</td>
							<td class="py-3.5 px-4 font-mono font-bold text-slate-900">
								{prospect.annualPremium ? `$${prospect.annualPremium.toLocaleString()}` : 'Pending'}
							</td>
							<td class="py-3.5 px-4">
								{#if prospect.lossRatio}
									<span class="inline-block px-2 py-0.5 rounded text-[11px] font-semibold {prospect.lossRatio <= 45 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
										{prospect.lossRatio}%
									</span>
								{:else}
									<span class="text-slate-400">Under Review</span>
								{/if}
							</td>
							<td class="py-3.5 px-4 whitespace-nowrap">
								{#if prospect.status === 'Certified'}
									<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
										<CheckCircle2 class="w-3 h-3 text-emerald-600" />
										<span>Certified</span>
									</span>
								{:else if prospect.status === 'Completed'}
									<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-300">
										<Check class="w-3 h-3 text-blue-600" />
										<span>Submitted</span>
									</span>
								{:else if prospect.status === 'InProgress'}
									<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
										<Clock class="w-3 h-3 text-amber-600" />
										<span>In Progress</span>
									</span>
								{:else}
									<span class="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">
										Invited
									</span>
								{/if}
							</td>
							<td class="py-3.5 px-4 text-right text-slate-500 whitespace-nowrap">
								{new Date(prospect.createdAt).toLocaleDateString()}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>

	<!-- Next Step: Consult Kevin Day -->
	<div class="p-8 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl">
		<div class="space-y-2 max-w-xl">
			<div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-blue-500/20 text-blue-300 text-xs font-mono">
				<span>Actuarial Next Step</span>
			</div>
			<h3 class="text-xl sm:text-2xl font-bold tracking-tight">
				Review Your Association's Feasibility with Kevin Day
			</h3>
			<p class="text-xs text-slate-300 leading-relaxed">
				Once you have 5-10 participating member organizations, Kevin Day will analyze the loss ratios, recommend optimal domiciles (Vermont, Cayman, Bermuda, BC, Alberta), and draft a formation capital structure.
			</p>
		</div>

		<a
			href="https://canadiancaptive.com"
			target="_blank"
			rel="noopener noreferrer"
			class="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all shrink-0 cursor-pointer"
		>
			<Calendar class="w-4 h-4 text-blue-200" />
			<span>Book Feasibility Consultation</span>
			<ExternalLink class="w-3.5 h-3.5" />
		</a>
	</div>
</div>
