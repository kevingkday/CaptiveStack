<script lang="ts">
	import type { PageData } from './$types';
	import {
		Shield,
		Layers,
		Landmark,
		Users,
		FileText,
		CheckCircle2,
		AlertCircle,
		TrendingUp,
		ArrowRight,
		Sliders,
		Check,
		DollarSign,
		Percent,
		ChevronRight,
		Sparkles,
		ShieldCheck,
		Scale,
		FileCheck,
		Building2,
		AlertTriangle,
		XCircle,
		Coins,
		HelpCircle,
		Compass
	} from 'lucide-svelte';

	let { data }: { data: PageData } = $props();

	function scrollToSection(id: string) {
		const el = document.getElementById(id);
		if (el) {
			el.scrollIntoView({ behavior: 'smooth' });
		}
	}
</script>

<svelte:head>
	<title>CaptiveStack | Member-Owned Group Captive Insurance</title>
	<meta
		name="description"
		content="CaptiveStack makes it easy for groups and associations to setup their own insurance company to insure the risks of their members."
	/>
</svelte:head>

<div class="space-y-16 sm:space-y-24 py-8 sm:py-16">
	<!-- =========================================================================
	     1. HERO SECTION WITH TWO CLEAR AUDIENCE PATHS
	     ========================================================================= -->
	<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
		<!-- Eyebrow Pill -->
		<div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-6 shadow-2xs">
			<span class="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
			<span>Alternative Risk Marketplace</span>
			<span class="text-slate-300">•</span>
			<span class="text-slate-600 font-medium">CaptiveStack Formation Platform</span>
		</div>

		<!-- Category Tagline -->
		<div class="text-xs sm:text-sm font-bold uppercase tracking-wider text-blue-600 mb-3">
			Member-owned group captive insurance
		</div>

		<!-- Main Headline -->
		<h1 class="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl leading-[1.15] mb-6">
			CaptiveStack makes it easy for groups and associations to setup their own insurance company to <span class="text-blue-600">insure the risks of their members.</span>
		</h1>

		<!-- Subtitle -->
		<p class="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed mb-10">
			Take control back from the hardening commercial insurance market. Escape rising premiums and claim denials by pooling risk with vetted trade peers and participating directly in underwriting profits.
		</p>

		<!-- =====================================================================
		     TWO CLEAR AUDIENCE PATHWAYS (Association Leaders vs Business Owners)
		     ===================================================================== -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mb-12 text-left">
			<!-- Path A: Association Leader -->
			<div class="p-8 rounded-3xl bg-white border-2 border-blue-600 shadow-md hover:shadow-lg transition-all flex flex-col justify-between space-y-6 relative overflow-hidden group">
				<div class="space-y-4">
					<div class="flex items-center justify-between">
						<div class="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
							<Building2 class="w-6 h-6" />
						</div>
						<span class="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
							High-Impact Group Track
						</span>
					</div>

					<div>
						<h2 class="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
							I Run an Association or Group
						</h2>
						<p class="text-xs text-slate-600 mt-2 leading-relaxed">
							Transform insurance into your association's strongest member benefit. Drastically reduce member churn, tailor policy coverage to your trade, and explore potential non-dues revenue.
						</p>
					</div>

					<ul class="space-y-2 text-xs text-slate-700 pt-3 border-t border-slate-100">
						<li class="flex items-center gap-2">
							<Check class="w-4 h-4 text-emerald-600 flex-shrink-0" />
							<span>Proprietary member retention benefit</span>
						</li>
						<li class="flex items-center gap-2">
							<Check class="w-4 h-4 text-emerald-600 flex-shrink-0" />
							<span>Deploy member surveys with 1-click tokenized links</span>
						</li>
					</ul>
				</div>

				<div class="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
					<a
						href="/for-associations"
						class="w-full sm:w-auto px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
					>
						<span>Explore Association Track</span>
						<ArrowRight class="w-3.5 h-3.5" />
					</a>
					<a
						href="/readiness?role=association"
						class="w-full sm:w-auto px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors flex items-center justify-center gap-1"
					>
						<Sparkles class="w-3.5 h-3.5 text-blue-600" />
						<span>Check Group Readiness</span>
					</a>
				</div>
			</div>

			<!-- Path B: Business Owner -->
			<div class="p-8 rounded-3xl bg-white border-2 border-slate-200 hover:border-emerald-500 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between space-y-6 group">
				<div class="space-y-4">
					<div class="flex items-center justify-between">
						<div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
							<Users class="w-6 h-6" />
						</div>
						<span class="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
							Mid-Market Business Track
						</span>
					</div>

					<div>
						<h2 class="text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
							I'm a Commercial Business Owner
						</h2>
						<p class="text-xs text-slate-600 mt-2 leading-relaxed">
							Too small for your own captive? Band together with industry peers in a member-owned group captive. If renewing soon, get an immediate second opinion via Ocean Falls Insurance.
						</p>
					</div>

					<ul class="space-y-2 text-xs text-slate-700 pt-3 border-t border-slate-100">
						<li class="flex items-center gap-2">
							<Check class="w-4 h-4 text-emerald-600 flex-shrink-0" />
							<span>Participate in underwriting profits with trade peers</span>
						</li>
						<li class="flex items-center gap-2">
							<Check class="w-4 h-4 text-emerald-600 flex-shrink-0" />
							<span>Free renewal second opinion (Ocean Falls Insurance)</span>
						</li>
					</ul>
				</div>

				<div class="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
					<a
						href="/for-business-owners"
						class="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
					>
						<span>Explore Business Track</span>
						<ArrowRight class="w-3.5 h-3.5" />
					</a>
					<a
						href="/readiness?role=business"
						class="w-full sm:w-auto px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors flex items-center justify-center gap-1"
					>
						<Sparkles class="w-3.5 h-3.5 text-emerald-600" />
						<span>Get Readiness Score</span>
					</a>
				</div>
			</div>
		</div>

		<!-- What Is a Group Captive? (Short Explanation & Proof of Value) -->
		<div class="max-w-4xl mx-auto p-6 rounded-2xl bg-white border border-slate-200 shadow-xs text-left space-y-4 mb-8">
			<div class="flex items-center justify-between border-b border-slate-100 pb-3">
				<h2 class="text-sm font-bold text-slate-900 flex items-center gap-2">
					<Compass class="w-4 h-4 text-blue-600" />
					<span>What is a Member-Owned Group Captive?</span>
				</h2>
				<span class="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
					Alternative Risk Transfer (ART)
				</span>
			</div>

			<p class="text-xs text-slate-600 leading-relaxed">
				A group captive is an insurance company owned and governed by multiple non-related organizations &mdash; typically members of an association or trade coalition. Instead of paying premiums into a traditional commercial insurer where unspent money becomes carrier profit, group members pool predictable primary risk, share underwriting gains, and purchase reinsurance as a group for catastrophic protection.
			</p>

			<!-- Proof of Value Grid -->
			<div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
				<a
					href="/feasibility"
					class="p-3 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 transition-colors space-y-1 block"
				>
					<span class="font-bold text-slate-900 block flex items-center gap-1">
						<span>Feasibility Engine</span>
						<ArrowRight class="w-3 h-3 text-blue-600" />
					</span>
					<span class="text-[11px] text-slate-500 block">Simulate loss ratios &amp; underwriting surplus</span>
				</a>

				<a
					href="/capital"
					class="p-3 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 transition-colors space-y-1 block"
				>
					<span class="font-bold text-slate-900 block flex items-center gap-1">
						<span>Capital &amp; LOC Model</span>
						<ArrowRight class="w-3 h-3 text-blue-600" />
					</span>
					<span class="text-[11px] text-slate-500 block">Replace trapped bank LOCs with standby capital</span>
				</a>

				<a
					href="/domiciles"
					class="p-3 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 transition-colors space-y-1 block"
				>
					<span class="font-bold text-slate-900 block flex items-center gap-1">
						<span>8 Domiciles</span>
						<ArrowRight class="w-3 h-3 text-blue-600" />
					</span>
					<span class="text-[11px] text-slate-500 block">Vermont, Utah, Cayman, Bermuda, BC, Alberta</span>
				</a>

				<a
					href="/industries"
					class="p-3 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 transition-colors space-y-1 block"
				>
					<span class="font-bold text-slate-900 block flex items-center gap-1">
						<span>Target Industries</span>
						<ArrowRight class="w-3 h-3 text-blue-600" />
					</span>
					<span class="text-[11px] text-slate-500 block">Contractors, Fleet, Dental, IT/MSPs, Hospitality</span>
				</a>
			</div>

			<!-- Hero Short Disclaimer -->
			<div class="pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-start gap-2">
				<AlertCircle class="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
				<span>
					<strong>Illustrative estimates only:</strong> CaptiveStack is an educational modeling platform and not an insurer. Captive formation is subject to regulatory approval in the chosen domicile and fronting carrier criteria.
				</span>
			</div>
		</div>

		<!-- Trust Highlights Grid (TwinFlow Style 4-Pillar Grid) -->
		<div class="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 w-full max-w-5xl text-left">
			<div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
				<div class="flex items-center gap-2 text-blue-700 text-xs font-bold mb-1.5">
					<ShieldCheck class="w-4 h-4 text-blue-600" />
					<span>Member-Owned</span>
				</div>
				<p class="text-xs text-slate-600 leading-relaxed">
					Owned and governed directly by your association members, not commercial carriers.
				</p>
			</div>

			<div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
				<div class="flex items-center gap-2 text-emerald-700 text-xs font-bold mb-1.5">
					<TrendingUp class="w-4 h-4 text-emerald-600" />
					<span>Profit Participation</span>
				</div>
				<p class="text-xs text-slate-600 leading-relaxed">
					Retain underwriting surplus and investment income instead of forfeiting premiums.
				</p>
			</div>

			<div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
				<div class="flex items-center gap-2 text-indigo-700 text-xs font-bold mb-1.5">
					<Sliders class="w-4 h-4 text-indigo-600" />
					<span>Custom Policies</span>
				</div>
				<p class="text-xs text-slate-600 leading-relaxed">
					Flexibility to write custom policy terms tailored to your association's risk profile.
				</p>
			</div>

			<div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
				<div class="flex items-center gap-2 text-amber-700 text-xs font-bold mb-1.5">
					<Landmark class="w-4 h-4 text-amber-600" />
					<span>Standby Collateral</span>
				</div>
				<p class="text-xs text-slate-600 leading-relaxed">
					Model pooled standby capital to help reduce or replace costly commercial bank LOCs.
				</p>
			</div>
		</div>
	</section>

	<!-- =========================================================================
	     2. THE PROBLEM SECTION (Exact User Copy)
	     ========================================================================= -->
	<section id="problem" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
		<div class="text-center max-w-3xl mx-auto mb-12">
			<div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold mb-3">
				<AlertCircle class="w-3.5 h-3.5" />
				<span>The Conventional Insurance Market Crisis</span>
			</div>
			<h2 class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
				The Problem
			</h2>
			<p class="text-base text-slate-600 leading-relaxed">
				As the global insurance market continues to harden, organizations are increasingly facing multiple challenges:
			</p>
		</div>

		<!-- 4 Core Problem Challenge Cards -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl mx-auto mb-12">
			<div class="p-6 rounded-2xl bg-white border border-rose-200 shadow-xs flex items-start gap-4">
				<div class="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center flex-shrink-0">
					<XCircle class="w-5 h-5" />
				</div>
				<div class="space-y-1">
					<h3 class="text-base font-bold text-slate-900">
						Insurers are no longer willing to underwrite certain risks.
					</h3>
					<p class="text-xs text-slate-600 leading-relaxed">
						Commercial carriers are withdrawing capacity across specialized and niche industries, leaving associations and trade members underinsured or completely dropped.
					</p>
				</div>
			</div>

			<div class="p-6 rounded-2xl bg-white border border-rose-200 shadow-xs flex items-start gap-4">
				<div class="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center flex-shrink-0">
					<TrendingUp class="w-5 h-5" />
				</div>
				<div class="space-y-1">
					<h3 class="text-base font-bold text-slate-900">
						Premiums are going up, even for those who have favorable loss experiences.
					</h3>
					<p class="text-xs text-slate-600 leading-relaxed">
						Disciplined businesses with stellar safety records and minimal losses are penalized with steep annual rate hikes to subsidize unprofitable policyholders in broad commercial pools.
					</p>
				</div>
			</div>

			<div class="p-6 rounded-2xl bg-white border border-rose-200 shadow-xs flex items-start gap-4">
				<div class="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center flex-shrink-0">
					<AlertTriangle class="w-5 h-5" />
				</div>
				<div class="space-y-1">
					<h3 class="text-base font-bold text-slate-900">
						Coverage options for new policies are more limited, and insurers are reducing or eliminating certain coverages on renewal.
					</h3>
					<p class="text-xs text-slate-600 leading-relaxed">
						Carriers aggressively strip key coverage endorsements upon renewal, increase policy deductibles, and introduce restrictive sub-limits while charging higher overall premiums.
					</p>
				</div>
			</div>

			<div class="p-6 rounded-2xl bg-white border border-rose-200 shadow-xs flex items-start gap-4">
				<div class="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center flex-shrink-0">
					<Scale class="w-5 h-5" />
				</div>
				<div class="space-y-1">
					<h3 class="text-base font-bold text-slate-900">
						Insurers are increasingly denying claims. Business interruption claims due to COVID-19 are an example.
					</h3>
					<p class="text-xs text-slate-600 leading-relaxed">
						When unprecedented industry events occur, commercial carriers often default to blanket claim denials, protracted litigation, and legal exclusions rather than protecting their policyholders.
					</p>
				</div>
			</div>
		</div>

		<!-- TwinFlow-Style Comparison Module: Old Way vs CaptiveStack Way -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
			<!-- The Hardened Market -->
			<div class="p-6 sm:p-8 rounded-2xl bg-white border border-rose-200 flex flex-col justify-between shadow-xs">
				<div>
					<div class="flex items-center gap-2 text-rose-700 font-bold text-xs uppercase tracking-wider mb-4">
						<span class="w-2 h-2 rounded-full bg-rose-500"></span>
						<span>The Conventional Insurance Trap</span>
					</div>
					<ul class="space-y-3.5 text-xs text-slate-700">
						<li class="flex items-start gap-2.5">
							<span class="text-rose-500 font-bold">✕</span>
							<span><strong>Uncontrollable Rate Hikes:</strong> Premiums spike regardless of individual member loss history.</span>
						</li>
						<li class="flex items-start gap-2.5">
							<span class="text-rose-500 font-bold">✕</span>
							<span><strong>Lost Capital:</strong> Unspent premiums are permanently pocketed by commercial insurance shareholders.</span>
						</li>
						<li class="flex items-start gap-2.5">
							<span class="text-rose-500 font-bold">✕</span>
							<span><strong>Coverage Exclusions:</strong> Rigid carrier forms that omit coverage for key industry-specific hazards.</span>
						</li>
						<li class="flex items-start gap-2.5">
							<span class="text-rose-500 font-bold">✕</span>
							<span><strong>Adversarial Claims:</strong> Outside adjusters focused on minimizing payouts and denying claims.</span>
						</li>
					</ul>
				</div>
				<div class="mt-6 pt-4 border-t border-rose-100 text-xs text-rose-700 font-medium">
					Traditional outcome: <strong>Zero profit return &amp; complete market dependency</strong>
				</div>
			</div>

			<!-- The CaptiveStack Solution -->
			<div class="p-6 sm:p-8 rounded-2xl bg-white border-2 border-blue-600 flex flex-col justify-between shadow-md relative">
				<div class="absolute top-0 right-0 px-3 py-1 bg-blue-600 text-[10px] font-bold text-white uppercase tracking-wider rounded-bl-xl">
					The CaptiveStack Way
				</div>
				<div>
					<div class="flex items-center gap-2 text-blue-700 font-bold text-xs uppercase tracking-wider mb-4">
						<span class="w-2 h-2 rounded-full bg-blue-600"></span>
						<span>Member-Owned Group Captive</span>
					</div>
					<ul class="space-y-3.5 text-xs text-slate-800">
						<li class="flex items-start gap-2.5">
							<Check class="w-4 h-4 text-emerald-600 flex-shrink-0" />
							<span><strong>Profit Participation:</strong> Underwriting surplus and investment income may be retained and returned to member businesses.</span>
						</li>
						<li class="flex items-start gap-2.5">
							<Check class="w-4 h-4 text-emerald-600 flex-shrink-0" />
							<span><strong>Tailored Policy Terms:</strong> Greater flexibility to customize policy terms and coverage for association risks, subject to actuarial feasibility and domicile regulation.</span>
						</li>
						<li class="flex items-start gap-2.5">
							<Check class="w-4 h-4 text-emerald-600 flex-shrink-0" />
							<span><strong>Price Stabilization:</strong> Favorable loss ratios can help reduce or stabilize the long-term cost of member coverage.</span>
						</li>
						<li class="flex items-start gap-2.5">
							<Check class="w-4 h-4 text-emerald-600 flex-shrink-0" />
							<span><strong>Member-Led Claims:</strong> Establish your own fair, member-aligned claims handling guidelines and procedures.</span>
						</li>
					</ul>
				</div>
				<div class="mt-6 pt-4 border-t border-slate-100 text-xs text-blue-700 font-semibold">
					Captive outcome: <strong>Underwriting surplus retained by your member organizations</strong>
				</div>
			</div>
		</div>
	</section>

	<!-- =========================================================================
	     3. THE SOLUTION SECTION (Exact User Copy)
	     ========================================================================= -->
	<section id="solution" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
		<div class="text-center max-w-3xl mx-auto mb-12">
			<div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-3">
				<ShieldCheck class="w-3.5 h-3.5" />
				<span>Alternative Risk Transfer Advantage</span>
			</div>
			<h2 class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
				The Solution
			</h2>
			<p class="text-base text-slate-700 leading-relaxed font-medium max-w-3xl">
				An online insurance marketplace where groups and associations can easily and cost effectively setup their own captive insurance company to provide customized coverages to their members while participating in the profitability of the underlying insurance program.
			</p>
		</div>

		<!-- 6 Key Solution Advantage Cards (Exact User Copy) -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
			<!-- Advantage 1 -->
			<div class="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between hover:border-blue-300 transition-colors">
				<div class="space-y-3">
					<div class="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center font-bold text-sm">
						01
					</div>
					<h3 class="text-base font-bold text-slate-900">
						Cover Hard-to-Place Risks
					</h3>
					<p class="text-xs text-slate-600 leading-relaxed">
						A captive may be able to provide coverages where the conventional market is unwilling or unable to for certain risks.
					</p>
				</div>
				<div class="pt-4 mt-4 border-t border-slate-100 flex items-center text-[11px] font-semibold text-blue-600">
					<span>Tailored coverage options</span>
				</div>
			</div>

			<!-- Advantage 2 -->
			<div class="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between hover:border-blue-300 transition-colors">
				<div class="space-y-3">
					<div class="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-bold text-sm">
						02
					</div>
					<h3 class="text-base font-bold text-slate-900">
						Price Reduction &amp; Stabilization
					</h3>
					<p class="text-xs text-slate-600 leading-relaxed">
						With a good loss ratio, the captive has the potential to reduce or at least stabilize the price of coverage.
					</p>
				</div>
				<div class="pt-4 mt-4 border-t border-slate-100 flex items-center text-[11px] font-semibold text-emerald-600">
					<span>Insulation from market cycles</span>
				</div>
			</div>

			<!-- Advantage 3 -->
			<div class="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between hover:border-blue-300 transition-colors">
				<div class="space-y-3">
					<div class="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center font-bold text-sm">
						03
					</div>
					<h3 class="text-base font-bold text-slate-900">
						Underwriting Profit Participation
					</h3>
					<p class="text-xs text-slate-600 leading-relaxed">
						A captive is able to participate in the profits of its own insurance program.
					</p>
				</div>
				<div class="pt-4 mt-4 border-t border-slate-100 flex items-center text-[11px] font-semibold text-blue-600">
					<span>Potential dividend distributions</span>
				</div>
			</div>

			<!-- Advantage 4 -->
			<div class="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between hover:border-blue-300 transition-colors">
				<div class="space-y-3">
					<div class="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center font-bold text-sm">
						04
					</div>
					<h3 class="text-base font-bold text-slate-900">
						Flexible Payment Planning
					</h3>
					<p class="text-xs text-slate-600 leading-relaxed">
						Establishing a captive allows more flexibility in premium payment planning.
					</p>
				</div>
				<div class="pt-4 mt-4 border-t border-slate-100 flex items-center text-[11px] font-semibold text-indigo-600">
					<span>Tailored cash flow scheduling</span>
				</div>
			</div>

			<!-- Advantage 5 -->
			<div class="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between hover:border-blue-300 transition-colors">
				<div class="space-y-3">
					<div class="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center font-bold text-sm">
						05
					</div>
					<h3 class="text-base font-bold text-slate-900">
						Policy Freedom &amp; Custom Terms
					</h3>
					<p class="text-xs text-slate-600 leading-relaxed">
						A captive can provide the flexibility to insure risks tailored to its members and customize policy terms and conditions, subject to domicile regulation, fronting carrier and reinsurer requirements, and actuarial feasibility.
					</p>
				</div>
				<div class="pt-4 mt-4 border-t border-slate-100 flex items-center text-[11px] font-semibold text-purple-600">
					<span>Customized policy design</span>
				</div>
			</div>

			<!-- Advantage 6 -->
			<div class="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between hover:border-blue-300 transition-colors">
				<div class="space-y-3">
					<div class="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center font-bold text-sm">
						06
					</div>
					<h3 class="text-base font-bold text-slate-900">
						Member-Driven Claims Procedures
					</h3>
					<p class="text-xs text-slate-600 leading-relaxed">
						A captive is also able to establish its own claims handling policies and procedures.
					</p>
				</div>
				<div class="pt-4 mt-4 border-t border-slate-100 flex items-center text-[11px] font-semibold text-teal-600">
					<span>Fair, member-aligned claims procedures</span>
				</div>
			</div>
		</div>
	</section>

	<!-- =========================================================================
	     4. HOW IT WORKS (3-Step Workflow)
	     ========================================================================= -->
	<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200 shadow-xs">
			<div class="text-center max-w-2xl mx-auto mb-10">
				<div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-3">
					<Layers class="w-3.5 h-3.5" />
					<span>Streamlined Setup Process</span>
				</div>
				<h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
					How CaptiveStack Works for Your Group
				</h2>
				<p class="text-sm text-slate-600 leading-relaxed">
					From initial loss history evaluation to licensing and profit distributions in three clear steps.
				</p>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
				<div class="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
					<div class="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-2xs">
						1
					</div>
					<h3 class="text-base font-bold text-slate-900">Evaluate Feasibility</h3>
					<p class="text-xs text-slate-600 leading-relaxed">
						Your association or group inputs member risk parameters and 5-year loss histories into our calculator to determine feasibility and projected underwriting profit.
					</p>
					<div class="pt-2">
						<a href="/feasibility" class="inline-flex items-center text-xs font-semibold text-blue-600 hover:text-blue-700">
							<span>Try Feasibility Calculator</span>
							<ChevronRight class="w-3.5 h-3.5 ml-0.5" />
						</a>
					</div>
				</div>

				<div class="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
					<div class="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-2xs">
						2
					</div>
					<h3 class="text-base font-bold text-slate-900">Pool Risk &amp; Standby Capital</h3>
					<p class="text-xs text-slate-600 leading-relaxed">
						Members complete digital risk surveys and commit standby capital reserves, modeling member standby collateral to help replace or minimize reliance on traditional bank Letters of Credit (LOC), subject to fronting carrier requirements.
					</p>
					<div class="pt-2">
						<a href="/capital" class="inline-flex items-center text-xs font-semibold text-blue-600 hover:text-blue-700">
							<span>Explore Capital Model</span>
							<ChevronRight class="w-3.5 h-3.5 ml-0.5" />
						</a>
					</div>
				</div>

				<div class="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
					<div class="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-2xs">
						3
					</div>
					<h3 class="text-base font-bold text-slate-900">Form Captive &amp; Retain Profit</h3>
					<p class="text-xs text-slate-600 leading-relaxed">
						Your captive insurance company issues customized member policies, manages claims under your own rules, and distributes annual underwriting profits back to members.
					</p>
					<div class="pt-2">
						<a href="/portal" class="inline-flex items-center text-xs font-semibold text-blue-600 hover:text-blue-700">
							<span>View Member Portal</span>
							<ChevronRight class="w-3.5 h-3.5 ml-0.5" />
						</a>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- =========================================================================
	     5. ABOUT US & VISION (Exact User Copy)
	     ========================================================================= -->
	<section id="about" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
		<div class="text-center max-w-3xl mx-auto mb-12">
			<div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-3">
				<Building2 class="w-3.5 h-3.5" />
				<span>About CaptiveStack</span>
			</div>
			<h2 class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
				Find Out More About Us
			</h2>
			<p class="text-base sm:text-lg text-slate-700 font-medium leading-relaxed max-w-2xl mx-auto">
				CaptiveStack was created out of the need to reduce the cost and complexity of captive insurance for small to medium sized organizations.
			</p>
		</div>

		<!-- Two Large Narrative Cards: Who We Are & Vision -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-8">
			<!-- Who We Are Card -->
			<div class="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
				<div class="space-y-4">
					<div class="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center shadow-2xs">
						<Users class="w-6 h-6" />
					</div>
					<h3 class="text-2xl font-bold text-slate-900 tracking-tight">
						Who We Are
					</h3>
					<p class="text-sm text-slate-600 leading-relaxed">
						We specialize in the setup of captive insurance companies for associations and groups. "Association" or "group" captives are insurance companies that are owned and managed by multiple non-related organizations. Among other things, they offer the opportunity for members of a group or association to participate in the profitability of their own insurance program.
					</p>
				</div>
				<div class="pt-6 mt-6 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-blue-700">
					<CheckCircle2 class="w-4 h-4 text-blue-600" />
					<span>Specialized in Trade Association Group Captives</span>
				</div>
			</div>

			<!-- Vision Card -->
			<div class="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
				<div class="space-y-4">
					<div class="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shadow-2xs">
						<Compass class="w-6 h-6" />
					</div>
					<h3 class="text-2xl font-bold text-slate-900 tracking-tight">
						Vision
					</h3>
					<p class="text-sm text-slate-600 leading-relaxed">
						To give small and medium sized businesses the opportunity to participate in the profitability of their own insurance programs while simultaneously having more control over claims and underwriting.
					</p>
				</div>
				<div class="pt-6 mt-6 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-emerald-700">
					<CheckCircle2 class="w-4 h-4 text-emerald-600" />
					<span>Control Over Claims &amp; Underwriting</span>
				</div>
			</div>
		</div>

		<!-- Deep-Dive Link to Dedicated About & Formation Page -->
		<div class="text-center">
			<a
				href="/about"
				class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold border border-slate-200 transition-colors"
			>
				<span>Meet Founder Kevin Day, Formation Partners &amp; Stakeholder Roles</span>
				<ArrowRight class="w-3.5 h-3.5 text-blue-600" />
			</a>
		</div>
	</section>

	<!-- =========================================================================
	     6. BOTTOM CALL-TO-ACTION BANNER (TwinFlow Style)
	     ========================================================================= -->
	<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white p-8 sm:p-14 text-center shadow-lg">
			<!-- Subtle background glow -->
			<div class="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>

			<div class="relative z-10 max-w-3xl mx-auto space-y-6">
				<div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-white text-xs font-semibold">
					<Sparkles class="w-3.5 h-3.5 text-blue-200" />
					<span>Free Feasibility Evaluation</span>
				</div>

				<h2 class="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
					Ready to setup your association's own captive insurance company?
				</h2>

				<p class="text-sm sm:text-base text-blue-100 leading-relaxed max-w-xl mx-auto">
					Stop forfeiting premiums to commercial insurers. Calculate your group's feasibility, explore capital reserve requirements, and take control of your underwriting profitability.
				</p>

				<div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
					<a
						href="/feasibility"
						class="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-blue-700 font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
					>
						<span>Check Feasibility Now</span>
						<ArrowRight class="w-4 h-4" />
					</a>

					<a
						href="/capital"
						class="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-blue-500/30 hover:bg-blue-500/40 text-white font-semibold text-sm border border-white/20 transition-all flex items-center justify-center gap-2"
					>
						<Landmark class="w-4 h-4 text-blue-200" />
						<span>View Capital &amp; LOC Model</span>
					</a>
				</div>
			</div>
		</div>
	</section>
</div>
