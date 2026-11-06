<script lang="ts">
	import type { PageData } from './$types';
	import {
		Shield,
		AlertTriangle,
		TrendingUp,
		Sparkles,
		ArrowRight,
		CheckCircle2,
		Landmark,
		Calendar,
		Building2,
		Users,
		Scale,
		FileSpreadsheet,
		ChevronRight,
		ExternalLink
	} from 'lucide-svelte';

	let { data }: { data: PageData } = $props();
	let ind = $derived(data.industry);
</script>

<svelte:head>
	<title>{ind.name} Group Captive Insurance | CaptiveStack</title>
	<meta
		name="description"
		content="Explore how {ind.name} groups use member-owned group captive insurance to escape commercial market cycles, stabilize premiums, and retain underwriting profits."
	/>
	<meta property="og:title" content="{ind.name} Group Captive Insurance | CaptiveStack" />
	<meta
		property="og:description"
		content="Explore how {ind.name} groups use member-owned group captive insurance to escape commercial market cycles, stabilize premiums, and retain underwriting profits."
	/>
	<meta property="og:image" content="https://www.captivestack.com/og-image.svg" />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-16">
	<!-- Breadcrumb Navigation -->
	<nav aria-label="Breadcrumb" class="flex items-center space-x-2 text-xs text-slate-500">
		<a href="/" class="hover:text-blue-600 transition-colors">Home</a>
		<ChevronRight class="w-3 h-3 text-slate-400" />
		<a href="/industries" class="hover:text-blue-600 transition-colors">Industries</a>
		<ChevronRight class="w-3 h-3 text-slate-400" />
		<span class="text-slate-900 font-semibold">{ind.shortTitle}</span>
	</nav>

	<!-- =========================================================================
	     1. HERO SECTION
	     ========================================================================= -->
	<header class="max-w-4xl mx-auto text-center space-y-6">
		<div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold shadow-2xs">
			<Shield class="w-3.5 h-3.5 text-blue-600" />
			<span>{ind.badge}</span>
			<span class="text-slate-300">•</span>
			<span class="text-slate-600 font-medium">Alternative Risk Transfer</span>
		</div>

		<h1 class="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
			{ind.heroHeadline}
		</h1>

		<p class="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
			{ind.subheadline}
		</p>

		<!-- Hero CTA Buttons -->
		<div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
			<a
				href="/readiness?industry={ind.slug}"
				class="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm transition-all shadow-xs flex items-center justify-center gap-2"
			>
				<Sparkles class="w-4 h-4 text-blue-200" />
				<span>Calculate {ind.shortTitle} Readiness Score</span>
				<ArrowRight class="w-4 h-4" />
			</a>

			<a
				href={data.bookingUrl}
				target="_blank"
				rel="noopener noreferrer"
				class="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold text-sm transition-all shadow-2xs flex items-center justify-center gap-2"
			>
				<Calendar class="w-4 h-4 text-slate-500" />
				<span>Book a Feasibility Review</span>
				<ExternalLink class="w-3 h-3 text-slate-400" />
			</a>
		</div>

		<!-- Typical Lines Covered Pills -->
		<div class="pt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
			<span class="text-slate-400 font-medium mr-1">Typical Captive Lines:</span>
			{#each ind.typicalLines as line}
				<span class="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium border border-slate-200">
					{line}
				</span>
			{/each}
		</div>
	</header>

	<!-- =========================================================================
	     2. THE COMMERCIAL INSURANCE MARKET CRISIS & PAIN POINTS
	     ========================================================================= -->
	<section class="max-w-5xl mx-auto space-y-8">
		<div class="text-center max-w-3xl mx-auto space-y-3">
			<div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
				<AlertTriangle class="w-3.5 h-3.5" />
				<span>Conventional Insurance Market Challenges</span>
			</div>
			<h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
				Why Traditional Insurance Is Failing {ind.name}
			</h2>
			<p class="text-sm text-slate-600 leading-relaxed">
				{ind.marketCrisis}
			</p>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
			{#each ind.coveragePainPoints as pain, idx}
				<div class="p-6 rounded-2xl bg-white border border-rose-200 shadow-xs space-y-3 flex flex-col justify-between">
					<div class="space-y-2.5">
						<div class="w-8 h-8 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center font-bold text-xs">
							0{idx + 1}
						</div>
						<h3 class="text-base font-bold text-slate-900">
							{pain.title}
						</h3>
						<p class="text-xs text-slate-600 leading-relaxed">
							{pain.description}
						</p>
					</div>
					<div class="pt-3 border-t border-rose-100 text-[11px] font-semibold text-rose-700 flex items-center gap-1">
						<span>Exclusionary carrier stance</span>
					</div>
				</div>
			{/each}
		</div>
	</section>

	<!-- =========================================================================
	     3. HOW A MEMBER-OWNED GROUP CAPTIVE APPLIES
	     ========================================================================= -->
	<section class="max-w-5xl mx-auto">
		<div class="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-8">
			<div class="space-y-3 max-w-3xl">
				<div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
					<CheckCircle2 class="w-3.5 h-3.5" />
					<span>Alternative Risk Transfer Solution</span>
				</div>
				<h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
					How a Group Captive Works for Your Sector
				</h2>
				<p class="text-sm text-slate-600 leading-relaxed">
					{ind.howGroupCaptiveApplies}
				</p>
			</div>

			<!-- Key Structural Benefits -->
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
				{#each ind.keyBenefits as benefit}
					<div class="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
						<CheckCircle2 class="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
						<span class="text-xs font-semibold text-slate-800 leading-relaxed">{benefit}</span>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- =========================================================================
	     4. ILLUSTRATIVE FINANCIAL EXAMPLE (Clearly Labeled Example)
	     ========================================================================= -->
	<section class="max-w-5xl mx-auto space-y-4">
		<div class="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white p-8 sm:p-10 shadow-xl space-y-6">
			<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700 pb-5">
				<div class="space-y-1">
					<div class="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold">
						<span>Example &bull; Illustrative Case Study</span>
					</div>
					<h3 class="text-xl sm:text-2xl font-bold tracking-tight">
						{ind.illustrativeExample.title}
					</h3>
					<p class="text-xs text-slate-300">
						{ind.illustrativeExample.cohortDescription}
					</p>
				</div>
				<span class="text-xs font-mono px-3 py-1 rounded-lg bg-white/10 text-slate-200 border border-white/10 self-start sm:self-auto">
					{ind.illustrativeExample.memberCount} Participating Members
				</span>
			</div>

			<!-- Metrics Grid -->
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
				<div class="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
					<span class="text-[10px] text-slate-400 font-sans block">Combined Annual Premium</span>
					<span class="text-base font-bold text-white block">{ind.illustrativeExample.combinedAnnualPremium}</span>
					<span class="text-[10px] text-slate-400 font-sans block">Pooled group buying power</span>
				</div>

				<div class="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
					<span class="text-[10px] text-slate-400 font-sans block">Claims Experience</span>
					<span class="text-base font-bold text-emerald-400 block">{ind.illustrativeExample.traditionalLossRatio}</span>
					<span class="text-[10px] text-slate-400 font-sans block">Disciplined risk practices</span>
				</div>

				<div class="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
					<span class="text-[10px] text-slate-400 font-sans block">Potential 5-Yr Surplus</span>
					<span class="text-base font-bold text-blue-300 block">{ind.illustrativeExample.illustrative5YrSurplusRetention}</span>
					<span class="text-[10px] text-slate-400 font-sans block">May be retained by members</span>
				</div>

				<div class="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
					<span class="text-[10px] text-slate-400 font-sans block">Standby Collateral Benefit</span>
					<span class="text-base font-bold text-indigo-300 block">{ind.illustrativeExample.collateralSavings}</span>
					<span class="text-[10px] text-slate-400 font-sans block">Alternative standby reserves</span>
				</div>
			</div>

			<p class="text-[11px] text-slate-400 leading-relaxed pt-2 border-t border-slate-800">
				<strong>Notice:</strong> {ind.illustrativeExample.disclaimerNotice}
			</p>
		</div>
	</section>

	<!-- =========================================================================
	     5. TWO AUDIENCE PATHS
	     ========================================================================= -->
	<section class="max-w-5xl mx-auto space-y-6">
		<div class="text-center space-y-2">
			<h2 class="text-2xl font-bold text-slate-900 tracking-tight">
				Choose Your Track in the {ind.shortTitle} Industry
			</h2>
			<p class="text-xs text-slate-600">
				Whether you represent an association or lead a commercial business, CaptiveStack has tailored tools.
			</p>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<!-- Track A: Association Leader -->
			<div class="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-6 hover:border-blue-300 transition-colors">
				<div class="space-y-3">
					<div class="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center font-bold">
						<Building2 class="w-5 h-5" />
					</div>
					<h3 class="text-lg font-bold text-slate-900">
						I Run an Association or Trade Group
					</h3>
					<p class="text-xs text-slate-600 leading-relaxed">
						Offer your {ind.name} members a high-value alternative risk program. Boost member retention, establish industry-specific policy terms, and explore potential non-dues revenue.
					</p>
				</div>

				<a
					href="/for-associations?industry={ind.slug}"
					class="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-xs"
				>
					<span>Explore Association Group Program</span>
					<ArrowRight class="w-3.5 h-3.5" />
				</a>
			</div>

			<!-- Track B: Business Owner -->
			<div class="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-6 hover:border-blue-300 transition-colors">
				<div class="space-y-3">
					<div class="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-bold">
						<Users class="w-5 h-5" />
					</div>
					<h3 class="text-lg font-bold text-slate-900">
						I Own a {ind.shortTitle} Business
					</h3>
					<p class="text-xs text-slate-600 leading-relaxed">
						Join a forming group in your trade to participate in captive profits. If your policy renewal is coming up soon, get a free second opinion through Ocean Falls Insurance right away.
					</p>
				</div>

				<a
					href="/for-business-owners?industry={ind.slug}"
					class="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-xs"
				>
					<span>Join Forming Cohort / Second Opinion</span>
					<ArrowRight class="w-3.5 h-3.5" />
				</a>
			</div>
		</div>
	</section>

	<!-- =========================================================================
	     6. CONVERSION CALL-TO-ACTION BANNER
	     ========================================================================= -->
	<section class="max-w-5xl mx-auto">
		<div class="rounded-3xl bg-blue-600 text-white p-8 sm:p-12 text-center space-y-6 shadow-xl relative overflow-hidden">
			<div class="relative z-10 max-w-2xl mx-auto space-y-4">
				<h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight">
					Ready to assess group captive feasibility for {ind.name}?
				</h2>
				<p class="text-xs sm:text-sm text-blue-100 leading-relaxed">
					Take our 2-minute Readiness Score quiz pre-filled for the {ind.shortTitle} industry, or schedule a direct review with Kevin Day.
				</p>
				<div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
					<a
						href="/readiness?industry={ind.slug}"
						class="w-full sm:w-auto px-6 py-3 rounded-xl bg-white hover:bg-slate-100 text-blue-700 text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
					>
						<Sparkles class="w-4 h-4 text-blue-600" />
						<span>Take 2-Minute Readiness Quiz</span>
						<ArrowRight class="w-4 h-4" />
					</a>

					<a
						href={data.bookingUrl}
						target="_blank"
						rel="noopener noreferrer"
						class="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-700/80 hover:bg-blue-800 text-white text-xs font-semibold border border-blue-400 transition-all flex items-center justify-center gap-2"
					>
						<Calendar class="w-4 h-4 text-blue-200" />
						<span>Book a Feasibility Review</span>
						<ExternalLink class="w-3 h-3 text-blue-200" />
					</a>
				</div>
			</div>
		</div>
	</section>
</div>
