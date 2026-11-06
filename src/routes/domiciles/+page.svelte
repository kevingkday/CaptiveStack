<script lang="ts">
	import { DOMICILES, type Domicile } from '$lib/data/domiciles';
	import {
		Building2,
		Shield,
		ExternalLink,
		Coins,
		Clock,
		FileText,
		CheckCircle2,
		Sparkles,
		ArrowRight,
		ChevronRight,
		Landmark,
		Scale,
		Globe,
		Filter
	} from 'lucide-svelte';

	let selectedRegion = $state<'All' | 'US Onshore' | 'Offshore' | 'Canadian Options'>('All');

	let filteredDomiciles = $derived(
		selectedRegion === 'All'
			? DOMICILES
			: DOMICILES.filter((d) => d.region === selectedRegion)
	);

	const regions = ['All', 'US Onshore', 'Offshore', 'Canadian Options'] as const;
</script>

<svelte:head>
	<title>Supported Captive Domiciles &amp; Capital Guidelines | CaptiveStack</title>
	<meta
		name="description"
		content="Compare leading captive insurance domiciles including Vermont, Utah, Delaware, Cayman Islands, Bermuda, Barbados, British Columbia, and Alberta."
	/>
	<meta property="og:title" content="Supported Captive Domiciles &amp; Capital Guidelines | CaptiveStack" />
	<meta
		property="og:description"
		content="Compare leading captive insurance domiciles including Vermont, Utah, Delaware, Cayman Islands, Bermuda, Barbados, British Columbia, and Alberta."
	/>
	<meta property="og:image" content="https://www.captivestack.com/og-image.svg" />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-12 sm:space-y-16">
	<!-- Hero Section -->
	<header class="text-center max-w-3xl mx-auto space-y-4">
		<div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold shadow-2xs">
			<Globe class="w-3.5 h-3.5 text-blue-600" />
			<span>Multi-Jurisdictional Formation Support</span>
		</div>

		<h1 class="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
			Supported Captive <span class="text-blue-600">Domiciles</span>
		</h1>

		<p class="text-base sm:text-lg text-slate-600 leading-relaxed">
			Selecting the optimal domicile is a critical governance and capitalization decision. CaptiveStack supports onshore US, offshore, and Canadian jurisdictions, each offering distinct capital requirements, tax treatments, and regulatory infrastructure.
		</p>
	</header>

	<!-- Regulatory Research Outbound Header Banner -->
	<div class="max-w-5xl mx-auto p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
		<div class="flex items-center gap-3">
			<div class="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center flex-shrink-0">
				<Landmark class="w-5 h-5" />
			</div>
			<div>
				<h2 class="text-sm font-bold text-slate-900">Research Domiciles at CanadianCaptive.com</h2>
				<p class="text-xs text-slate-600">
					Comprehensive regulatory analysis, statutory histories, and cross-border comparisons curated by founder Kevin Day.
				</p>
			</div>
		</div>

		<a
			href="https://canadiancaptive.com"
			target="_blank"
			rel="noopener noreferrer"
			class="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors flex items-center gap-2 shadow-xs whitespace-nowrap"
		>
			<span>Visit CanadianCaptive.com</span>
			<ExternalLink class="w-3.5 h-3.5 text-blue-200" />
		</a>
	</div>

	<!-- Filter Tabs -->
	<div class="flex items-center justify-center gap-2 flex-wrap">
		{#each regions as reg}
			<button
				type="button"
				onclick={() => (selectedRegion = reg)}
				class="px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer {selectedRegion === reg ? 'bg-blue-600 text-white shadow-xs' : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'}"
			>
				{reg}
				<span class="ml-1 text-[11px] opacity-80">
					({reg === 'All' ? DOMICILES.length : DOMICILES.filter((d) => d.region === reg).length})
				</span>
			</button>
		{/each}
	</div>

	<!-- Domiciles Grid -->
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
		{#each filteredDomiciles as domicile}
			<div class="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col justify-between hover:border-blue-300 transition-all space-y-6">
				<div class="space-y-4">
					<div class="flex items-start justify-between gap-3">
						<div>
							<span class="text-[10px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded-md {domicile.region === 'US Onshore' ? 'bg-blue-50 text-blue-700 border border-blue-200' : domicile.region === 'Offshore' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}">
								{domicile.region}
							</span>
							<h3 class="text-xl font-bold text-slate-900 mt-1">
								{domicile.name}
							</h3>
						</div>

						<a
							href={domicile.canadianCaptiveUrl}
							target="_blank"
							rel="noopener noreferrer"
							title="View on CanadianCaptive.com"
							class="text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors inline-flex items-center gap-1 bg-slate-50 hover:bg-blue-50 px-2.5 py-1 rounded-lg border border-slate-200"
						>
							<span>Research</span>
							<ExternalLink class="w-3 h-3" />
						</a>
					</div>

					<p class="text-xs text-slate-600 leading-relaxed">
						{domicile.tagline}
					</p>

					<!-- Key Parameters Grid -->
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
						<div class="space-y-1">
							<span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Minimum Capital:</span>
							<span class="text-slate-900 font-bold">{domicile.minimumCapital}</span>
						</div>
						<div class="space-y-1">
							<span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Charter Timeline:</span>
							<span class="text-slate-900 font-semibold">{domicile.formationTimeline}</span>
						</div>
						<div class="sm:col-span-2 space-y-1 pt-2 border-t border-slate-200">
							<span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Regulatory Authority:</span>
							<span class="text-slate-800 text-[11px] block">{domicile.regulatoryBody}</span>
							<span class="text-slate-500 text-[10px] block font-mono">{domicile.statutoryAct}</span>
						</div>
					</div>

					<!-- Key Strategic Notes -->
					<div class="space-y-1.5 pt-2">
						<span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Jurisdictional Highlights:</span>
						<ul class="space-y-1 text-xs text-slate-600">
							{#each domicile.keyNotes as note}
								<li class="flex items-start gap-2">
									<CheckCircle2 class="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
									<span>{note}</span>
								</li>
							{/each}
						</ul>
					</div>
				</div>

				<div class="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
					<div class="flex flex-wrap gap-1.5">
						{#each domicile.strengths as strength}
							<span class="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium border border-slate-200">
								{strength}
							</span>
						{/each}
					</div>

					<a
						href="/feasibility"
						class="inline-flex items-center text-xs font-semibold text-blue-600 hover:text-blue-800"
					>
						<span>Evaluate for {domicile.name}</span>
						<ChevronRight class="w-3.5 h-3.5 ml-0.5" />
					</a>
				</div>
			</div>
		{/each}
	</div>

	<!-- Domicile Comparison Table -->
	<section class="max-w-6xl mx-auto space-y-4">
		<div class="flex items-center justify-between border-b border-slate-200 pb-3">
			<div>
				<h2 class="text-lg font-bold text-slate-900 flex items-center gap-2">
					<Scale class="w-4 h-4 text-blue-600" />
					<span>Quick Reference &amp; Capital Comparison</span>
				</h2>
				<p class="text-xs text-slate-500">
					Editable domicile specifications configured in <code class="font-mono text-blue-600">src/lib/data/domiciles.ts</code>.
				</p>
			</div>
		</div>

		<div class="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
			<table class="w-full text-left text-xs">
				<thead class="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200 font-mono">
					<tr>
						<th class="px-5 py-3 font-semibold font-sans">Domicile</th>
						<th class="px-5 py-3 font-semibold font-sans">Jurisdiction</th>
						<th class="px-5 py-3 font-semibold font-sans">Statutory Minimum Capital</th>
						<th class="px-5 py-3 font-semibold font-sans">Licensing Timeline</th>
						<th class="px-5 py-3 font-semibold font-sans">Research</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-slate-100 text-slate-700">
					{#each DOMICILES as d}
						<tr class="hover:bg-slate-50 transition-colors">
							<td class="px-5 py-3 font-bold text-slate-900">{d.name}</td>
							<td class="px-5 py-3">
								<span class="px-2 py-0.5 rounded text-[10px] font-semibold {d.region === 'US Onshore' ? 'bg-blue-50 text-blue-700' : d.region === 'Offshore' ? 'bg-indigo-50 text-indigo-700' : 'bg-emerald-50 text-emerald-700'}">
									{d.region}
								</span>
							</td>
							<td class="px-5 py-3 font-mono text-[11px] text-slate-800">{d.minimumCapital}</td>
							<td class="px-5 py-3 text-slate-600">{d.formationTimeline}</td>
							<td class="px-5 py-3">
								<a
									href={d.canadianCaptiveUrl}
									target="_blank"
									rel="noopener noreferrer"
									class="text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-1"
								>
									<span>Profile</span>
									<ExternalLink class="w-3 h-3" />
								</a>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</section>

	<!-- Call to Action Banner -->
	<section class="max-w-5xl mx-auto">
		<div class="rounded-3xl bg-slate-900 text-white p-8 sm:p-12 text-center space-y-6 shadow-xl relative overflow-hidden">
			<div class="relative z-10 max-w-2xl mx-auto space-y-4">
				<h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight">
					Need help determining the right domicile for your risk pool?
				</h2>
				<p class="text-xs sm:text-sm text-slate-300 leading-relaxed">
					Run your numbers in our feasibility calculator or submit an association review request to evaluate statutory capital, fronting carrier availability, and tax considerations.
				</p>
				<div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
					<a
						href="/feasibility"
						class="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
					>
						<Sparkles class="w-4 h-4 text-blue-200" />
						<span>Check Group Feasibility</span>
						<ArrowRight class="w-4 h-4" />
					</a>
					<a
						href="/capital"
						class="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all flex items-center justify-center gap-2"
					>
						<span>Explore Capital &amp; Standby Facilities</span>
						<ChevronRight class="w-4 h-4" />
					</a>
				</div>
			</div>
		</div>
	</section>
</div>

