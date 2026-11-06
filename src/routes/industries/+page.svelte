<script lang="ts">
	import { INDUSTRIES } from '$lib/data/industries';
	import {
		Shield,
		ArrowRight,
		ChevronRight,
		Sparkles,
		Layers,
		CheckCircle2
	} from 'lucide-svelte';
</script>

<svelte:head>
	<title>Target Industries for Group Captive Insurance | CaptiveStack</title>
	<meta
		name="description"
		content="Explore how trade contractors, fleet transportation, healthcare, IT/MSPs, hospitality, and property managers form member-owned group captive insurance programs."
	/>
	<meta property="og:title" content="Target Industries for Group Captive Insurance | CaptiveStack" />
	<meta
		property="og:description"
		content="Explore how trade contractors, fleet transportation, healthcare, IT/MSPs, hospitality, and property managers form member-owned group captive insurance programs."
	/>
	<meta property="og:image" content="https://www.captivestack.com/og-image.svg" />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-12">
	<!-- Hero Header -->
	<header class="text-center max-w-3xl mx-auto space-y-4">
		<div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold shadow-2xs">
			<Layers class="w-3.5 h-3.5 text-blue-600" />
			<span>Industry Solutions</span>
		</div>

		<h1 class="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
			Group Captives by <span class="text-blue-600">Industry</span>
		</h1>

		<p class="text-base sm:text-lg text-slate-600 leading-relaxed">
			Select your industry sector below to see how peer organizations overcome hardening commercial insurance cycles, pool risk, and retain underwriting surplus.
		</p>
	</header>

	<!-- Industries Grid -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
		{#each INDUSTRIES as ind}
			<div class="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col justify-between hover:border-blue-300 transition-all space-y-6">
				<div class="space-y-3">
					<span class="text-[10px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
						{ind.shortTitle}
					</span>

					<h2 class="text-xl font-bold text-slate-900">
						{ind.name}
					</h2>

					<p class="text-xs text-slate-600 leading-relaxed line-clamp-3">
						{ind.subheadline}
					</p>

					<div class="pt-2 flex flex-wrap gap-1.5">
						{#each ind.typicalLines.slice(0, 3) as line}
							<span class="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
								{line}
							</span>
						{/each}
					</div>
				</div>

				<div class="pt-4 border-t border-slate-100 flex items-center justify-between">
					<a
						href="/industries/{ind.slug}"
						class="text-xs font-semibold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
					>
						<span>Industry Guide</span>
						<ChevronRight class="w-3.5 h-3.5" />
					</a>

					<a
						href="/readiness?industry={ind.slug}"
						class="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-semibold border border-slate-200 transition-colors"
					>
						<span>Check Score</span>
					</a>
				</div>
			</div>
		{/each}
	</div>
</div>
