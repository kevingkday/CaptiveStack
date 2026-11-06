<script lang="ts">
	import type { PageData } from './$types';
	import {
		Users,
		ShieldCheck,
		Sparkles,
		ArrowRight,
		CheckCircle2,
		AlertTriangle,
		Building2,
		Calendar,
		TrendingUp,
		Send,
		ExternalLink,
		ChevronRight,
		Lock
	} from 'lucide-svelte';

	let { data }: { data: PageData } = $props();

	// Interactive Second Opinion Form State
	let associationName = $state('');
	let companyName = $state('');
	let contactName = $state('');
	let email = $state('');
	let phone = $state('');
	let currentCarrier = $state('');
	let renewalWindow = $state('30 - 60 Days');
	let annualPremium = $state('$100k - $250k');
	let isSubmitting = $state(false);
	let submitted = $state(false);

	async function handleSubmitSecondOpinion(e: SubmitEvent) {
		e.preventDefault();
		if (!email || !contactName) return;
		isSubmitting = true;

		try {
			const res = await fetch('/api/readiness/save-step', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					role: 'business',
					name: contactName,
					email,
					phone,
					companyName,
					associationName,
					currentCarrier,
					renewalDate: renewalWindow,
					annualPremiumBand: annualPremium,
					secondOpinionRequested: true,
					notes: `Second opinion requested via /for-business-owners. Carrier: ${currentCarrier || 'None given'}. Renewal: ${renewalWindow}.`
				})
			});
			if (res.ok) {
				submitted = true;
			}
		} catch (err) {
			console.error('[Second Opinion Error]', err);
		} finally {
			isSubmitting = false;
		}
	}
</script>

<svelte:head>
	<title>Group Captive Insurance for Business Owners | CaptiveStack</title>
	<meta
		name="description"
		content="Too small for your own captive? Join a forming group captive with trade peers, stabilize commercial insurance rates, and get a second opinion on your renewal."
	/>
	<meta property="og:title" content="Group Captive Insurance for Business Owners | CaptiveStack" />
	<meta
		property="og:description"
		content="Too small for your own captive? Join a forming group captive with trade peers, stabilize commercial insurance rates, and get a second opinion on your renewal."
	/>
	<meta property="og:image" content="https://www.captivestack.com/og-image.svg" />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-16 sm:space-y-24">
	<!-- Hero Section -->
	<header class="max-w-4xl mx-auto text-center space-y-6">
		<div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold shadow-2xs">
			<Users class="w-3.5 h-3.5 text-emerald-600" />
			<span>Commercial Business Owner Track</span>
			<span class="text-slate-300">•</span>
			<span class="text-slate-600 font-medium">Alternative Risk Transfer &amp; P&amp;C</span>
		</div>

		<h1 class="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
			Too Small for Your Own Captive? <span class="text-emerald-600">Band Together With Peers.</span>
		</h1>

		<p class="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
			Single-parent captive insurance requires millions in annual premium. But when mid-market businesses band together in a member-owned group captive, you unlock Fortune 500 purchasing power, rate insulation, and underwriting dividends.
		</p>

		<!-- Hero CTA Buttons -->
		<div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
			<a
				href="/readiness?role=business"
				class="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-sm transition-all shadow-xs flex items-center justify-center gap-2"
			>
				<Sparkles class="w-4 h-4 text-emerald-200" />
				<span>Get Your Business Readiness Score</span>
				<ArrowRight class="w-4 h-4" />
			</a>

			<a
				href="#second-opinion"
				class="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold text-sm transition-all shadow-2xs flex items-center justify-center gap-2"
			>
				<span>Free Renewal Second Opinion</span>
				<ChevronRight class="w-4 h-4 text-slate-400" />
			</a>
		</div>
	</header>

	<!-- Dual Value Proposition Grid -->
	<section class="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
		<!-- Value 1: Group Captive Cohort -->
		<div class="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-5 flex flex-col justify-between">
			<div class="space-y-4">
				<div class="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shadow-2xs">
					<Building2 class="w-6 h-6" />
				</div>
				<h2 class="text-xl font-bold text-slate-900 tracking-tight">
					1. Join a Forming Group in Your Industry
				</h2>
				<p class="text-xs text-slate-600 leading-relaxed">
					Instead of forfeiting 100% of your insurance premiums to commercial insurance shareholders, join a forming group captive with disciplined trade peers in your region.
				</p>
				<ul class="space-y-2 text-xs text-slate-700 pt-2 border-t border-slate-100">
					<li class="flex items-center gap-2">
						<CheckCircle2 class="w-3.5 h-3.5 text-emerald-600 shrink-0" />
						<span>Retain up to 40% of underwriting surplus when claims are low</span>
					</li>
					<li class="flex items-center gap-2">
						<CheckCircle2 class="w-3.5 h-3.5 text-emerald-600 shrink-0" />
						<span>Stop subsidizing careless operators in standard commercial pools</span>
					</li>
					<li class="flex items-center gap-2">
						<CheckCircle2 class="w-3.5 h-3.5 text-emerald-600 shrink-0" />
						<span>Customized coverage forms with fewer exclusionary loopholes</span>
					</li>
				</ul>
			</div>

			<a
				href="/readiness?role=business"
				class="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
			>
				<span>Check If Your Business Qualifies</span>
				<ArrowRight class="w-3.5 h-3.5" />
			</a>
		</div>

		<!-- Value 2: Traditional P&C Second Opinion -->
		<div class="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-5 flex flex-col justify-between">
			<div class="space-y-4">
				<div class="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center shadow-2xs">
					<ShieldCheck class="w-6 h-6" />
				</div>
				<h2 class="text-xl font-bold text-slate-900 tracking-tight">
					2. Immediate Commercial P&amp;C Second Opinion
				</h2>
				<p class="text-xs text-slate-600 leading-relaxed">
					Is your policy renewing in the next 30 to 90 days? While your group captive is being structured, <strong>Ocean Falls Insurance</strong> (founded by Kevin Day) provides an independent review of your renewal terms right now.
				</p>
				<ul class="space-y-2 text-xs text-slate-700 pt-2 border-t border-slate-100">
					<li class="flex items-center gap-2">
						<CheckCircle2 class="w-3.5 h-3.5 text-blue-600 shrink-0" />
						<span>Identify hidden coverage sub-limits and restrictive exclusions</span>
					</li>
					<li class="flex items-center gap-2">
						<CheckCircle2 class="w-3.5 h-3.5 text-blue-600 shrink-0" />
						<span>Benchmark your rates against regional industry averages</span>
					</li>
					<li class="flex items-center gap-2">
						<CheckCircle2 class="w-3.5 h-3.5 text-blue-600 shrink-0" />
						<span>Traditional P&amp;C placement support without commercial broker bias</span>
					</li>
				</ul>
			</div>

			<a
				href="#second-opinion"
				class="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-slate-200"
			>
				<span>Request Renewal Second Opinion</span>
				<ChevronRight class="w-3.5 h-3.5 text-slate-500" />
			</a>
		</div>
	</section>

	<!-- =========================================================================
	     INTERACTIVE SECOND OPINION & COHORT INTAKE FORM
	     ========================================================================= -->
	<section id="second-opinion" class="max-w-4xl mx-auto rounded-3xl bg-white border-2 border-emerald-600 p-8 sm:p-12 shadow-md space-y-6 scroll-mt-24">
		<div class="border-b border-slate-200 pb-6 space-y-2">
			<div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
				<Calendar class="w-3.5 h-3.5" />
				<span>Commercial Insurance Second Opinion</span>
			</div>
			<h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
				Get an Objective Second Opinion on Your Upcoming Renewal
			</h2>
			<p class="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
				Tell us a bit about your business, current coverage, and renewal date. Kevin Day and Ocean Falls Insurance will review your policy parameters and provide guidance.
			</p>
		</div>

		{#if submitted}
			<div class="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2 animate-in fade-in duration-200">
				<div class="flex items-center gap-2 font-bold text-base text-emerald-800">
					<CheckCircle2 class="w-5 h-5 text-emerald-600" />
					<span>Second Opinion Request Successfully Received!</span>
				</div>
				<p class="text-xs text-emerald-800 leading-relaxed">
					Thank you, <strong>{contactName}</strong>. Your request for <strong>{companyName}</strong> (Renewal: {renewalWindow}) has been securely logged and notified to <strong>Kevin Day</strong> at Ocean Falls Insurance. We will review your preliminary details and follow up directly.
				</p>
				<p class="text-[11px] font-mono text-emerald-700">
					No automated marketing drip campaigns will be sent.
				</p>
			</div>
		{:else}
			<form onsubmit={handleSubmitSecondOpinion} class="space-y-5 text-xs">
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div class="space-y-1.5">
						<label for="contactName" class="font-semibold text-slate-700 block">Your Full Name *</label>
						<input
							id="contactName"
							type="text"
							required
							bind:value={contactName}
							placeholder="e.g. Sarah Miller"
							class="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
						/>
					</div>

					<div class="space-y-1.5">
						<label for="email" class="font-semibold text-slate-700 block">Business Email *</label>
						<input
							id="email"
							type="email"
							required
							bind:value={email}
							placeholder="e.g. smiller@contracting.com"
							class="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
						/>
					</div>

					<div class="space-y-1.5">
						<label for="companyName" class="font-semibold text-slate-700 block">Company Name *</label>
						<input
							id="companyName"
							type="text"
							required
							bind:value={companyName}
							placeholder="e.g. Miller Mechanical Contractors Ltd."
							class="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
						/>
					</div>

					<div class="space-y-1.5">
						<label for="phone" class="font-semibold text-slate-700 block">Phone Number (Optional)</label>
						<input
							id="phone"
							type="tel"
							bind:value={phone}
							placeholder="e.g. (604) 555-0199"
							class="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
						/>
					</div>

					<!-- Association Autocomplete -->
					<div class="space-y-1.5 sm:col-span-2">
						<label for="assocInput" class="font-semibold text-slate-700 block">
							Which association or trade group are you in? <span class="text-slate-400 font-normal">(Free text or select below)</span>
						</label>
						<input
							id="assocInput"
							type="text"
							list="assocDatalist"
							bind:value={associationName}
							placeholder="e.g. National Specialty Trade Contractors Assoc., Mechanical Contractors Association"
							class="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
						/>
						<datalist id="assocDatalist">
							{#each data.knownAssociations as aName}
								<option value={aName}></option>
							{/each}
						</datalist>
						<span class="text-[11px] text-slate-500 block">
							If you do not belong to an association, leave blank or type "None" &mdash; we will place you on the interest list for forming industry cohorts in your province/state.
						</span>
					</div>

					<div class="space-y-1.5">
						<label for="carrierInput" class="font-semibold text-slate-700 block">Current Insurance Carrier (Optional)</label>
						<input
							id="carrierInput"
							type="text"
							bind:value={currentCarrier}
							placeholder="e.g. Travelers, Intact, Aviva, Chubb, Wawanesa"
							class="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
						/>
					</div>

					<div class="space-y-1.5">
						<label for="renewalSelect" class="font-semibold text-slate-700 block">Next Policy Renewal Window *</label>
						<select
							id="renewalSelect"
							bind:value={renewalWindow}
							class="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
						>
							<option value="Within 30 Days">Within 30 Days (Urgent)</option>
							<option value="30 - 60 Days">30 - 60 Days</option>
							<option value="60 - 90 Days">60 - 90 Days</option>
							<option value="90 - 120 Days">90 - 120 Days</option>
							<option value="6+ Months">6+ Months (Planning)</option>
						</select>
					</div>

					<div class="space-y-1.5 sm:col-span-2">
						<label for="premiumSelect" class="font-semibold text-slate-700 block">Approximate Annual Insurance Premium</label>
						<select
							id="premiumSelect"
							bind:value={annualPremium}
							class="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
						>
							<option value="< $100k">&lt; $100,000 / yr</option>
							<option value="$100k - $250k">$100,000 - $250,000 / yr</option>
							<option value="$250k - $500k">$250,000 - $500,000 / yr</option>
							<option value="$500k - $1M">$500,000 - $1,000,000 / yr</option>
							<option value="$1M - $2.5M">$1,000,000 - $2,500,000 / yr</option>
							<option value="$2.5M+">$2,500,000+ / yr</option>
						</select>
					</div>
				</div>

				<div class="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
					<p class="text-[11px] text-slate-500">
						Submitting this request does not obligate you or bind coverage. Information is kept strictly confidential.
					</p>
					<button
						type="submit"
						disabled={isSubmitting}
						class="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
					>
						{#if isSubmitting}
							<span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
							<span>Sending Request...</span>
						{:else}
							<Send class="w-4 h-4" />
							<span>Request Second Opinion Review</span>
						{/if}
					</button>
				</div>
			</form>
		{/if}
	</section>
</div>
