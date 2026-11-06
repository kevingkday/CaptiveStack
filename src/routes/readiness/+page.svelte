<script lang="ts">
	import type { PageData } from './$types';
	import {
		BarChart3,
		Shield,
		Sparkles,
		CheckCircle2,
		AlertCircle,
		ArrowRight,
		ArrowLeft,
		ChevronRight,
		Building2,
		Users,
		DollarSign,
		Calendar,
		Layers,
		Compass,
		Send,
		Lock,
		FileSpreadsheet,
		Copy,
		Check,
		ExternalLink,
		FileText
	} from 'lucide-svelte';
	import { calculateReadinessScore, type ReadinessScoreResult } from '$lib/readiness/scoring';

	let { data }: { data: PageData } = $props();

	// Quiz Steps (1 to 8, 9 is results, 10 is unlocked report)
	let currentStep = $state(1);

	// Quiz Form State
	let role = $state<'association' | 'business'>(
		data.roleParam === 'business' || data.existingLead?.leadType === 'business' ? 'business' : 'association'
	);
	let industry = $state(data.industryParam || data.existingLead?.industry || 'contractors');
	let size = $state(data.existingLead?.size || (role === 'association' ? 25 : 35));
	let annualPremiumBand = $state(data.existingLead?.annualPremiumSize || '$500k - $1M');
	let selectedLines = $state<string[]>([
		'Commercial General Liability',
		"Workers' Compensation"
	]);
	let lossHistory = $state<'Good' | 'Average' | 'High'>(
		(data.existingLead?.lossHistory as any) || 'Good'
	);
	let renewalDate = $state(data.existingLead?.renewalDate || '60 - 90 Days');
	let region = $state(data.existingLead?.region || 'British Columbia');

	// Gated Unlock Form
	let leadId = $state(data.existingLead?.id || '');
	let contactName = $state(data.existingLead?.name || '');
	let contactEmail = $state(data.existingLead?.email || '');
	let companyOrAssocName = $state(data.existingLead?.companyName || data.existingLead?.associationName || '');
	let phone = $state(data.existingLead?.phone || '');
	let isUnlocking = $state(false);
	let reportUnlocked = $state(data.existingLead?.stage === 'ReportGated' || false);

	// Business track extra fields
	let associationAffiliation = $state(data.existingLead?.associationName || '');
	let currentCarrier = $state(data.existingLead?.currentCarrier || '');
	let secondOpinionRequested = $state(Boolean(data.existingLead?.secondOpinionRequested));
	let secondOpinionSubmitted = $state(false);

	// Association track invite link state
	let generatedSurveyToken = $state('');
	let copiedLink = $state(false);

	// Instant calculated results
	let scoreResult = $derived(
		calculateReadinessScore({
			role,
			industry,
			size,
			annualPremiumBand,
			linesOfCoverage: selectedLines,
			lossHistory,
			renewalDate,
			region
		})
	);

	function formatCurrency(val: number) {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			maximumFractionDigits: 0
		}).format(val);
	}

	async function persistStep(stepNumber: number, isGated = false, isSecondOpinion = false) {
		try {
			const res = await fetch('/api/readiness/save-step', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					leadId,
					step: stepNumber,
					role,
					industry,
					size: Number(size),
					annualPremiumBand,
					linesOfCoverage: selectedLines,
					lossHistory,
					renewalDate,
					region,
					sourceUtm: data.utm,
					name: contactName,
					email: contactEmail,
					companyName: role === 'business' ? companyOrAssocName : undefined,
					associationName: role === 'association' ? companyOrAssocName : associationAffiliation,
					phone,
					isGatedSubmit: isGated,
					secondOpinionRequested: isSecondOpinion,
					currentCarrier
				})
			});
			if (res.ok) {
				const resData = await res.json();
				if (resData.leadId) leadId = resData.leadId;
				if (resData.scoreResult) scoreResult = resData.scoreResult;
			}
		} catch (e) {
			console.error('[Progressive Save Error]', e);
		}
	}

	async function nextStep() {
		// Update reactive calculation
		scoreResult = calculateReadinessScore({
			role,
			industry,
			size,
			annualPremiumBand,
			linesOfCoverage: selectedLines,
			lossHistory,
			renewalDate,
			region
		});

		await persistStep(currentStep);
		currentStep = Math.min(9, currentStep + 1);
		window.scrollTo({ top: 120, behavior: 'smooth' });
	}

	function prevStep() {
		currentStep = Math.max(1, currentStep - 1);
		window.scrollTo({ top: 120, behavior: 'smooth' });
	}

	async function handleUnlockReport(e: SubmitEvent) {
		e.preventDefault();
		if (!contactEmail || !contactName) return;
		isUnlocking = true;
		await persistStep(9, true);
		isUnlocking = false;
		reportUnlocked = true;
	}

	async function handleSecondOpinionRequest() {
		secondOpinionRequested = true;
		await persistStep(9, false, true);
		secondOpinionSubmitted = true;
	}

	function toggleLine(line: string) {
		if (selectedLines.includes(line)) {
			if (selectedLines.length > 1) {
				selectedLines = selectedLines.filter((l) => l !== line);
			}
		} else {
			selectedLines = [...selectedLines, line];
		}
	}

	function generateMemberSurvey() {
		// Generate random 64-char hex token
		const bytes = crypto.getRandomValues(new Uint8Array(32));
		generatedSurveyToken = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
	}

	function copySurveyLink() {
		const url = `${window.location.origin}/survey/${generatedSurveyToken}`;
		navigator.clipboard.writeText(url);
		copiedLink = true;
		setTimeout(() => (copiedLink = false), 2500);
	}
</script>

<svelte:head>
	<title>Group Captive Readiness Score &amp; Feasibility Quiz | CaptiveStack</title>
	<meta
		name="description"
		content="Take our 2-minute Readiness Score quiz. Evaluate group captive feasibility, calculate illustrative surplus retention, and benchmark your commercial insurance program."
	/>
	<meta property="og:title" content="Group Captive Readiness Score &amp; Feasibility Quiz | CaptiveStack" />
	<meta
		property="og:description"
		content="Take our 2-minute Readiness Score quiz. Evaluate group captive feasibility, calculate illustrative surplus retention, and benchmark your commercial insurance program."
	/>
	<meta property="og:image" content="https://www.captivestack.com/og-image.svg" />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-10">
	<!-- Quiz Progress Header -->
	<header class="text-center space-y-3">
		<div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold shadow-2xs">
			<Sparkles class="w-3.5 h-3.5 text-blue-600" />
			<span>Group Captive Readiness Engine</span>
			<span class="text-slate-300">•</span>
			<span class="text-slate-600 font-medium">Progressive 2-Minute Assessment</span>
		</div>

		<h1 class="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
			Calculate Your <span class="text-blue-600">Group Captive Readiness Score</span>
		</h1>

		<p class="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
			Discover if your association or peer group qualifies to pool risk, escape hard market rate hikes, and participate directly in underwriting profits.
		</p>

		<!-- Progress Bar Indicator (Steps 1 to 8) -->
		{#if currentStep <= 8}
			<div class="max-w-md mx-auto pt-3 space-y-2">
				<div class="flex items-center justify-between text-[11px] font-mono text-slate-500">
					<span>Step {currentStep} of 8</span>
					<span>{Math.round((currentStep / 8) * 100)}% Complete</span>
				</div>
				<div class="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
					<div
						class="h-full bg-blue-600 transition-all duration-300"
						style="width: {(currentStep / 8) * 100}%"
					></div>
				</div>
			</div>
		{/if}
	</header>

	<!-- =========================================================================
	     QUIZ QUESTION CARDS (STEPS 1 - 8)
	     ========================================================================= -->
	{#if currentStep <= 8}
		<div class="rounded-3xl bg-white border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8 animate-in fade-in duration-200">
			<!-- STEP 1: ROLE -->
			{#if currentStep === 1}
				<div class="space-y-6">
					<div class="space-y-2">
						<span class="text-xs font-mono font-bold text-blue-600 uppercase tracking-wider">Question 1 of 8</span>
						<h2 class="text-xl sm:text-2xl font-bold text-slate-900">
							Which best describes your organization and role?
						</h2>
						<p class="text-xs text-slate-500">
							CaptiveStack tailors models differently for group sponsors vs individual trade businesses.
						</p>
					</div>

					<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<button
							type="button"
							onclick={() => { role = 'association'; nextStep(); }}
							class="p-6 rounded-2xl border-2 text-left transition-all cursor-pointer {role === 'association' ? 'border-blue-600 bg-blue-50/50 shadow-xs' : 'border-slate-200 hover:border-slate-300 bg-white'}"
						>
							<div class="flex items-center justify-between mb-3">
								<div class="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
									<Building2 class="w-5 h-5" />
								</div>
								{#if role === 'association'}
									<CheckCircle2 class="w-5 h-5 text-blue-600" />
								{/if}
							</div>
							<h3 class="font-bold text-base text-slate-900 mb-1">Association / Group Leader</h3>
							<p class="text-xs text-slate-600 leading-relaxed">
								I run an association, trade group, purchasing coalition, or franchise network exploring a captive program for our member organizations.
							</p>
						</button>

						<button
							type="button"
							onclick={() => { role = 'business'; nextStep(); }}
							class="p-6 rounded-2xl border-2 text-left transition-all cursor-pointer {role === 'business' ? 'border-blue-600 bg-blue-50/50 shadow-xs' : 'border-slate-200 hover:border-slate-300 bg-white'}"
						>
							<div class="flex items-center justify-between mb-3">
								<div class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
									<Users class="w-5 h-5" />
								</div>
								{#if role === 'business'}
									<CheckCircle2 class="w-5 h-5 text-blue-600" />
								{/if}
							</div>
							<h3 class="font-bold text-base text-slate-900 mb-1">Commercial Business Owner</h3>
							<p class="text-xs text-slate-600 leading-relaxed">
								I own or operate a small-to-midsize business looking to band together with industry peers in a captive risk pool.
							</p>
						</button>
					</div>
				</div>

			<!-- STEP 2: INDUSTRY -->
			{:else if currentStep === 2}
				<div class="space-y-6">
					<div class="space-y-2">
						<span class="text-xs font-mono font-bold text-blue-600 uppercase tracking-wider">Question 2 of 8</span>
						<h2 class="text-xl sm:text-2xl font-bold text-slate-900">
							What primary industry or trade sector do you operate in?
						</h2>
						<p class="text-xs text-slate-500">
							Underwriting stability improves significantly when risk pools share homogenous operations and safety standards.
						</p>
					</div>

					<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
						{#each [
							{ slug: 'contractors', label: 'Trade & Specialty Contractors', desc: 'Roofing, Electrical, Mechanical, Drywall' },
							{ slug: 'transportation', label: 'Trucking & Fleet Transportation', desc: 'Freight, Logistics, Regional Fleets' },
							{ slug: 'healthcare', label: 'Dental & Medical Practices', desc: 'Surgeons, Clinics, Specialty Healthcare' },
							{ slug: 'it-services', label: 'IT Providers & MSPs', desc: 'Cloud Services, Managed IT, Cybersecurity' },
							{ slug: 'hospitality', label: 'Hotels, Lodging & Resorts', desc: 'Hospitality, Venues, Leisure' },
							{ slug: 'property-managers', label: 'Real Estate & Property Managers', desc: 'Multi-Family, Commercial Portfolio' }
						] as item}
							<button
								type="button"
								onclick={() => { industry = item.slug; nextStep(); }}
								class="p-4 rounded-xl border text-left transition-all cursor-pointer {industry === item.slug ? 'border-blue-600 bg-blue-50/60 shadow-xs ring-1 ring-blue-600' : 'border-slate-200 hover:border-slate-300 bg-white'}"
							>
								<strong class="text-xs font-bold text-slate-900 block mb-1">{item.label}</strong>
								<span class="text-[11px] text-slate-500 leading-normal block">{item.desc}</span>
							</button>
						{/each}
					</div>
				</div>

			<!-- STEP 3: SIZE / SCALE -->
			{:else if currentStep === 3}
				<div class="space-y-6">
					<div class="space-y-2">
						<span class="text-xs font-mono font-bold text-blue-600 uppercase tracking-wider">Question 3 of 8</span>
						<h2 class="text-xl sm:text-2xl font-bold text-slate-900">
							{role === 'association' ? 'How many member companies belong to your association?' : 'How many full-time employees work across your business?'}
						</h2>
						<p class="text-xs text-slate-500">
							{role === 'association' ? 'A group captive typically targets 15 to 50+ charter member businesses.' : 'Group captives allow mid-market employers to achieve Fortune 500 scale.'}
						</p>
					</div>

					<div class="space-y-4 max-w-md">
						<div class="flex items-center justify-between text-base font-bold text-slate-900">
							<span>Selected Count:</span>
							<span class="font-mono text-2xl text-blue-600">{size}</span>
						</div>

						<input
							type="range"
							min={role === 'association' ? 5 : 5}
							max={role === 'association' ? 150 : 250}
							step={role === 'association' ? 5 : 5}
							bind:value={size}
							class="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
						/>

						<div class="flex justify-between text-[11px] font-mono text-slate-400">
							<span>Min: 5</span>
							<span>Mid: {role === 'association' ? '40 members' : '75 employees'}</span>
							<span>Max: {role === 'association' ? '150+' : '250+'}</span>
						</div>
					</div>
				</div>

			<!-- STEP 4: ANNUAL PREMIUM SPEND -->
			{:else if currentStep === 4}
				<div class="space-y-6">
					<div class="space-y-2">
						<span class="text-xs font-mono font-bold text-blue-600 uppercase tracking-wider">Question 4 of 8</span>
						<h2 class="text-xl sm:text-2xl font-bold text-slate-900">
							What is your {role === 'association' ? 'collective member' : 'annual'} commercial insurance premium spend?
						</h2>
						<p class="text-xs text-slate-500">
							Combined premium volume is the key driver of feasibility and underwriting profit retention.
						</p>
					</div>

					<div class="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
						{#each [
							{ band: '< $100k', note: 'Early exploratory stage' },
							{ band: '$100k - $250k', note: 'Viable for forming cohort' },
							{ band: '$250k - $500k', note: 'High ROI pooling candidate' },
							{ band: '$500k - $1M', note: 'Standard mid-market threshold' },
							{ band: '$1M - $2.5M', note: 'Prime captive scale' },
							{ band: '$2.5M+', note: 'Optimal standalone or group feasibility' }
						] as item}
							<button
								type="button"
								onclick={() => { annualPremiumBand = item.band; nextStep(); }}
								class="p-4 rounded-xl border text-left transition-all cursor-pointer {annualPremiumBand === item.band ? 'border-blue-600 bg-blue-50/60 shadow-xs ring-1 ring-blue-600' : 'border-slate-200 hover:border-slate-300 bg-white'}"
							>
								<strong class="text-sm font-bold font-mono text-slate-900 block">{item.band}</strong>
								<span class="text-[11px] text-slate-500 block">{item.note}</span>
							</button>
						{/each}
					</div>
				</div>

			<!-- STEP 5: LINES OF COVERAGE -->
			{:else if currentStep === 5}
				<div class="space-y-6">
					<div class="space-y-2">
						<span class="text-xs font-mono font-bold text-blue-600 uppercase tracking-wider">Question 5 of 8</span>
						<h2 class="text-xl sm:text-2xl font-bold text-slate-900">
							Which lines of coverage are you interested in transferring to a captive?
						</h2>
						<p class="text-xs text-slate-500">
							Select all lines that apply (multi-line programs create diversification).
						</p>
					</div>

					<div class="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl">
						{#each [
							'Commercial General Liability',
							'Commercial Property & Buydowns',
							"Workers' Compensation",
							'Commercial Auto & Fleet',
							'Cyber Liability & Data Breach',
							'Professional Errors & Omissions (E&O)',
							'Warranty & Specialty Prize Indemnity'
						] as line}
							<button
								type="button"
								onclick={() => toggleLine(line)}
								class="p-3.5 rounded-xl border text-left flex items-center justify-between transition-colors cursor-pointer {selectedLines.includes(line) ? 'border-blue-600 bg-blue-50/60' : 'border-slate-200 hover:border-slate-300 bg-white'}"
							>
								<span class="text-xs font-semibold text-slate-800">{line}</span>
								{#if selectedLines.includes(line)}
									<CheckCircle2 class="w-4 h-4 text-blue-600 flex-shrink-0" />
								{:else}
									<span class="w-4 h-4 rounded-full border border-slate-300"></span>
								{/if}
							</button>
						{/each}
					</div>
				</div>

			<!-- STEP 6: LOSS HISTORY -->
			{:else if currentStep === 6}
				<div class="space-y-6">
					<div class="space-y-2">
						<span class="text-xs font-mono font-bold text-blue-600 uppercase tracking-wider">Question 6 of 8</span>
						<h2 class="text-xl sm:text-2xl font-bold text-slate-900">
							How would you describe your historical claims experience over the past 5 years?
						</h2>
						<p class="text-xs text-slate-500">
							In a captive, low loss ratios directly generate annual underwriting surplus for members.
						</p>
					</div>

					<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
						<button
							type="button"
							onclick={() => { lossHistory = 'Good'; nextStep(); }}
							class="p-5 rounded-2xl border-2 text-left transition-all cursor-pointer {lossHistory === 'Good' ? 'border-emerald-600 bg-emerald-50/50' : 'border-slate-200 hover:border-slate-300 bg-white'}"
						>
							<div class="flex items-center justify-between mb-2">
								<span class="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">Favorable</span>
								{#if lossHistory === 'Good'}
									<CheckCircle2 class="w-4 h-4 text-emerald-600" />
								{/if}
							</div>
							<h3 class="font-bold text-sm text-slate-900">Low Claims (Loss Ratio &le; 35%)</h3>
							<p class="text-[11px] text-slate-600 mt-1">
								Strong risk controls, minimal frequency, and zero major catastrophe claims. Prime profit retention candidate.
							</p>
						</button>

						<button
							type="button"
							onclick={() => { lossHistory = 'Average'; nextStep(); }}
							class="p-5 rounded-2xl border-2 text-left transition-all cursor-pointer {lossHistory === 'Average' ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200 hover:border-slate-300 bg-white'}"
						>
							<div class="flex items-center justify-between mb-2">
								<span class="text-xs font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">Standard</span>
								{#if lossHistory === 'Average'}
									<CheckCircle2 class="w-4 h-4 text-blue-600" />
								{/if}
							</div>
							<h3 class="font-bold text-sm text-slate-900">Average (Loss Ratio 36%–55%)</h3>
							<p class="text-[11px] text-slate-600 mt-1">
								Predictable minor frequency with standard severity. Stable candidate for association pooling.
							</p>
						</button>

						<button
							type="button"
							onclick={() => { lossHistory = 'High'; nextStep(); }}
							class="p-5 rounded-2xl border-2 text-left transition-all cursor-pointer {lossHistory === 'High' ? 'border-amber-600 bg-amber-50/50' : 'border-slate-200 hover:border-slate-300 bg-white'}"
						>
							<div class="flex items-center justify-between mb-2">
								<span class="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">Challenging</span>
								{#if lossHistory === 'High'}
									<CheckCircle2 class="w-4 h-4 text-amber-600" />
								{/if}
							</div>
							<h3 class="font-bold text-sm text-slate-900">High (&gt; 55% or Rate Spikes)</h3>
							<p class="text-[11px] text-slate-600 mt-1">
								Facing carrier non-renewals or severe rate hikes. Second opinion and deductible buydown recommended.
							</p>
						</button>
					</div>
				</div>

			<!-- STEP 7: RENEWAL TIMELINE -->
			{:else if currentStep === 7}
				<div class="space-y-6">
					<div class="space-y-2">
						<span class="text-xs font-mono font-bold text-blue-600 uppercase tracking-wider">Question 7 of 8</span>
						<h2 class="text-xl sm:text-2xl font-bold text-slate-900">
							When is your next commercial insurance policy renewal date?
						</h2>
						<p class="text-xs text-slate-500">
							Captive formation requires 60 to 90 days of statutory chartering; renewal timing determines the implementation roadmap.
						</p>
					</div>

					<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
						{#each [
							{ window: 'Within 30 Days', urgency: 'Urgent', badge: 'bg-rose-50 text-rose-700 border-rose-200' },
							{ window: '30 - 60 Days', urgency: 'High Priority', badge: 'bg-amber-50 text-amber-700 border-amber-200' },
							{ window: '60 - 90 Days', urgency: 'Optimal Planning Window', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
							{ window: '90 - 120 Days', urgency: 'Advance Structuring', badge: 'bg-blue-50 text-blue-700 border-blue-200' },
							{ window: '6+ Months', urgency: 'Strategic Research', badge: 'bg-slate-50 text-slate-700 border-slate-200' }
						] as item}
							<button
								type="button"
								onclick={() => { renewalDate = item.window; nextStep(); }}
								class="p-4 rounded-xl border text-left transition-all cursor-pointer {renewalDate === item.window ? 'border-blue-600 bg-blue-50/60 shadow-xs ring-1 ring-blue-600' : 'border-slate-200 hover:border-slate-300 bg-white'}"
							>
								<span class="text-[10px] font-mono px-2 py-0.5 rounded border font-semibold {item.badge}">
									{item.urgency}
								</span>
								<strong class="text-sm font-bold text-slate-900 block mt-2">{item.window}</strong>
							</button>
						{/each}
					</div>
				</div>

			<!-- STEP 8: REGION / JURISDICTION -->
			{:else if currentStep === 8}
				<div class="space-y-6">
					<div class="space-y-2">
						<span class="text-xs font-mono font-bold text-blue-600 uppercase tracking-wider">Question 8 of 8</span>
						<h2 class="text-xl sm:text-2xl font-bold text-slate-900">
							What is your primary operating jurisdiction or region?
						</h2>
						<p class="text-xs text-slate-500">
							CaptiveStack models both Canadian (BC, Alberta) and US onshore/offshore statutory domiciles.
						</p>
					</div>

					<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
						{#each [
							{ name: 'British Columbia', group: 'Canada' },
							{ name: 'Alberta', group: 'Canada' },
							{ name: 'Ontario', group: 'Canada' },
							{ name: 'Vermont', group: 'US Onshore' },
							{ name: 'Utah', group: 'US Onshore' },
							{ name: 'Delaware', group: 'US Onshore' },
							{ name: 'Cayman Islands', group: 'Offshore' },
							{ name: 'Other US / Canada', group: 'North America' }
						] as reg}
							<button
								type="button"
								onclick={() => { region = reg.name; nextStep(); }}
								class="p-4 rounded-xl border text-left transition-all cursor-pointer {region === reg.name ? 'border-blue-600 bg-blue-50/60 shadow-xs ring-1 ring-blue-600' : 'border-slate-200 hover:border-slate-300 bg-white'}"
							>
								<span class="text-[10px] text-slate-400 font-mono block">{reg.group}</span>
								<strong class="text-xs font-bold text-slate-900 block mt-1">{reg.name}</strong>
							</button>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Navigation Buttons Footer -->
			<div class="pt-6 border-t border-slate-100 flex items-center justify-between">
				{#if currentStep > 1}
					<button
						type="button"
						onclick={prevStep}
						class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer"
					>
						<ArrowLeft class="w-3.5 h-3.5" />
						<span>Previous Question</span>
					</button>
				{:else}
					<div></div>
				{/if}

				<button
					type="button"
					onclick={nextStep}
					class="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-xs shadow-xs transition-all flex items-center gap-2 cursor-pointer"
				>
					<span>{currentStep === 8 ? 'Calculate Readiness Score' : 'Next Step'}</span>
					<ArrowRight class="w-3.5 h-3.5" />
				</button>
			</div>
		</div>

	<!-- =========================================================================
	     RESULTS VIEW (STEP 9): SCORE + GATED REPORT & REPORT UNLOCKED
	     ========================================================================= -->
	{:else}
		<div class="space-y-10 animate-in fade-in duration-300">
			<!-- Instant Score Card -->
			<div class="rounded-3xl bg-white border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8">
				<div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
					<div class="space-y-2">
						<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold {scoreResult.tier === 'Optimal' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}">
							<CheckCircle2 class="w-3.5 h-3.5" />
							<span>{scoreResult.tierTitle}</span>
						</span>
						<h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
							Your Group Captive Readiness Score
						</h2>
						<p class="text-xs text-slate-600 max-w-xl leading-relaxed">
							{scoreResult.tierSummary}
						</p>
					</div>

					<!-- Big Numerical Score Circle -->
					<div class="flex flex-col items-center justify-center p-5 rounded-2xl bg-slate-50 border border-slate-200 min-w-[140px] text-center shadow-2xs">
						<span class="text-4xl sm:text-5xl font-extrabold font-mono text-blue-600 tracking-tight">
							{scoreResult.score}
						</span>
						<span class="text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-1">out of 100</span>
					</div>
				</div>

				<!-- Illustrative Pro-Forma Metrics Grid -->
				<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					<div class="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
						<span class="text-[11px] text-slate-500 font-medium block">Approximate Premium Pool</span>
						<span class="text-xl font-bold font-mono text-slate-900 block">{formatCurrency(scoreResult.approxAnnualSpend)} / yr</span>
						<span class="text-[10px] text-slate-400 block">Based on {annualPremiumBand} range</span>
					</div>

					<div class="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-1">
						<span class="text-[11px] text-emerald-800 font-medium block">Potential 5-Year Surplus Retention</span>
						<span class="text-xl font-bold font-mono text-emerald-700 block">
							{formatCurrency(scoreResult.illustrative5YrSurplusMin)} &ndash; {formatCurrency(scoreResult.illustrative5YrSurplusMax)}
						</span>
						<span class="text-[10px] text-emerald-600 block">May be retained under {scoreResult.projectedLossRatioPercent}% loss ratio</span>
					</div>

					<div class="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-1">
						<span class="text-[11px] text-indigo-800 font-medium block">5-Year Standby Collateral Benefit</span>
						<span class="text-xl font-bold font-mono text-indigo-700 block">{formatCurrency(scoreResult.illustrative5YrLocSavings)}</span>
						<span class="text-[10px] text-indigo-600 block">Avoided commercial bank LOC fees</span>
					</div>
				</div>

				<div class="p-3.5 rounded-xl bg-slate-100 border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2">
					<AlertCircle class="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
					<span><strong>Notice:</strong> {scoreResult.disclaimerNotice}</span>
				</div>
			</div>

			<!-- GATED REPORT SECTION -->
			{#if !reportUnlocked}
				<div class="rounded-3xl bg-white border-2 border-blue-600 p-8 sm:p-10 shadow-md space-y-6">
					<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
						<div class="space-y-1">
							<div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
								<Lock class="w-3.5 h-3.5" />
								<span>Full Feasibility Breakdown &amp; Roadmap</span>
							</div>
							<h3 class="text-xl font-bold text-slate-900">
								Unlock Your Complete Feasibility Report &amp; Next Steps
							</h3>
							<p class="text-xs text-slate-600">
								Get access to your customized formation timeline, capital requirements, and cohort roadmap.
							</p>
						</div>
						<span class="text-[11px] text-slate-500 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200 self-start sm:self-auto">
							Confidential &bull; No Marketing Spam
						</span>
					</div>

					<form onsubmit={handleUnlockReport} class="space-y-4">
						<div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
							<div class="space-y-1.5">
								<label for="leadName" class="font-semibold text-slate-700 block">Your Full Name *</label>
								<input
									id="leadName"
									type="text"
									required
									bind:value={contactName}
									placeholder="e.g. David Vance"
									class="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs"
								/>
							</div>

							<div class="space-y-1.5">
								<label for="leadEmail" class="font-semibold text-slate-700 block">Business Email *</label>
								<input
									id="leadEmail"
									type="email"
									required
									bind:value={contactEmail}
									placeholder="e.g. dvance@association.org"
									class="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs"
								/>
							</div>

							<div class="space-y-1.5">
								<label for="leadCompany" class="font-semibold text-slate-700 block">
									{role === 'association' ? 'Association / Trade Group Name *' : 'Company Name *'}
								</label>
								<input
									id="leadCompany"
									type="text"
									required
									bind:value={companyOrAssocName}
									placeholder={role === 'association' ? 'e.g. National Glass Assoc.' : 'e.g. Acme Contracting Ltd.'}
									class="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs"
								/>
							</div>
						</div>

						<div class="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
							<p class="text-[11px] text-slate-500">
								We do not send automated marketing drip emails. Submitting unlocks your tailored next steps and notifies Kevin Day.
							</p>
							<button
								type="submit"
								disabled={isUnlocking}
								class="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
							>
								{#if isUnlocking}
									<span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
									<span>Unlocking Report...</span>
								{:else}
									<Sparkles class="w-4 h-4 text-blue-200" />
									<span>Unlock Report &amp; Next Steps</span>
								{/if}
							</button>
						</div>
					</form>
				</div>

			<!-- UNLOCKED REPORT & ACTION ROADMAP -->
			{:else}
				<div class="space-y-8 animate-in fade-in duration-300">
					<!-- ASSOCIATION TRACK UNLOCKED ACTION CARD -->
					{#if role === 'association'}
						<div class="rounded-3xl bg-white border border-slate-200 p-8 sm:p-10 shadow-xs space-y-6">
							<div class="space-y-2 border-b border-slate-100 pb-5">
								<div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
									<Building2 class="w-3.5 h-3.5" />
									<span>Association Executive Action Plan</span>
								</div>
								<h3 class="text-xl sm:text-2xl font-bold text-slate-900">
									Next Steps for {companyOrAssocName || 'Your Association'}
								</h3>
								<p class="text-xs text-slate-600 leading-relaxed">
									As an association leader, you have two clear next steps to evaluate your member captive program:
								</p>
							</div>

							<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
								<!-- Option A: Full Feasibility Calculator -->
								<div class="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-4">
									<div class="space-y-2">
										<span class="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
											A
										</span>
										<h4 class="font-bold text-sm text-slate-900">Run Group Feasibility Calculator</h4>
										<p class="text-xs text-slate-600 leading-relaxed">
											Explore dynamic sliders, binomial probability stress tests, and formation milestone readiness for your member pool.
										</p>
									</div>

									<a
										href="/feasibility?annualPremium={scoreResult.approxAnnualSpend}&memberCount={size}&riskCategory={industry}"
										class="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors"
									>
										<span>Open Full Feasibility Engine</span>
										<ArrowRight class="w-3.5 h-3.5" />
									</a>
								</div>

								<!-- Option B: Generate Member Survey Link -->
								<div class="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-4">
									<div class="space-y-2">
										<span class="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
											B
										</span>
										<h4 class="font-bold text-sm text-slate-900">Generate Member Intake Survey Link</h4>
										<p class="text-xs text-slate-600 leading-relaxed">
											Deploy an 11-step member risk survey link to your member organizations. Collect exposure metrics and loss run documents.
										</p>
									</div>

									{#if !generatedSurveyToken}
										<button
											type="button"
											onclick={generateMemberSurvey}
											class="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
										>
											<Sparkles class="w-3.5 h-3.5" />
											<span>Generate Secure Member Survey Link</span>
										</button>
									{:else}
										<div class="space-y-2">
											<div class="flex items-center gap-2">
												<input
													readonly
													value="{typeof window !== 'undefined' ? window.location.origin : 'https://www.captivestack.com'}/survey/{generatedSurveyToken}"
													class="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-[11px] font-mono text-slate-700"
												/>
												<button
													type="button"
													onclick={copySurveyLink}
													class="px-3 py-2 rounded-lg bg-slate-800 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
												>
													{#if copiedLink}
														<Check class="w-3.5 h-3.5 text-emerald-400" />
														<span>Copied!</span>
													{:else}
														<Copy class="w-3.5 h-3.5" />
														<span>Copy</span>
													{/if}
												</button>
											</div>
											<span class="text-[10px] text-slate-500 block">
												Unguessable 32-byte token generated. Share with member executives.
											</span>
											<div class="pt-2">
												<a
													href="/association/dashboard?token={generatedSurveyToken}"
													target="_blank"
													class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold text-[11px] transition-colors"
												>
													<BarChart3 class="w-3.5 h-3.5 text-blue-600" />
													<span>Open Executive Campaign Dashboard &rarr;</span>
												</a>
											</div>
										</div>
									{/if}
								</div>
							</div>
						</div>

					<!-- BUSINESS OWNER TRACK UNLOCKED ACTION CARD -->
					{:else}
						<div class="rounded-3xl bg-white border border-slate-200 p-8 sm:p-10 shadow-xs space-y-6">
							<div class="space-y-2 border-b border-slate-100 pb-5">
								<div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
									<Users class="w-3.5 h-3.5" />
									<span>Business Owner Opportunities</span>
								</div>
								<h3 class="text-xl sm:text-2xl font-bold text-slate-900">
									Next Steps for {companyOrAssocName || 'Your Business'}
								</h3>
								<p class="text-xs text-slate-600 leading-relaxed">
									As a business owner, you can join a forming group captive in your trade or get an immediate second opinion on your renewal:
								</p>
							</div>

							<!-- Association Affiliation / Autocomplete -->
							<div class="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
								<h4 class="font-bold text-sm text-slate-900">
									Which association or trade group do you belong to?
								</h4>
								<div class="max-w-md space-y-2">
									<input
										type="text"
										list="associationsList"
										bind:value={associationAffiliation}
										placeholder="e.g. National Specialty Trade Contractors Assoc."
										class="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
									/>
									<datalist id="associationsList">
										{#each data.knownAssociations as aName}
											<option value={aName}></option>
										{/each}
									</datalist>
									<span class="text-[11px] text-slate-500 block">
										If your group is forming a captive on CaptiveStack, we will connect your profile to their cohort.
									</span>
								</div>
							</div>

							<!-- Second Opinion on Upcoming Renewal -->
							<div class="p-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200 space-y-4">
								<div class="flex items-start justify-between gap-4">
									<div class="space-y-1">
										<span class="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
											Immediate P&amp;C Value
										</span>
										<h4 class="font-bold text-base text-slate-900">
											Free Second Opinion on Your Current Insurance Renewal
										</h4>
										<p class="text-xs text-slate-600 leading-relaxed">
											While your group captive is forming, <strong>Ocean Falls Insurance</strong> (run by founder Kevin Day) can review your upcoming renewal to eliminate broker markups, optimize terms, and protect your business right now.
										</p>
									</div>
								</div>

								{#if secondOpinionSubmitted}
									<div class="p-4 rounded-xl bg-white border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
										<CheckCircle2 class="w-4 h-4 text-emerald-600" />
										<span>Second opinion request received! Kevin Day and Ocean Falls Insurance will follow up within 1 business day.</span>
									</div>
								{:else}
									<div class="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg text-xs">
										<div class="space-y-1">
											<label for="carrierInput" class="font-semibold text-slate-700 block">Current Insurance Carrier (Optional)</label>
											<input
												id="carrierInput"
												type="text"
												bind:value={currentCarrier}
												placeholder="e.g. Travelers, Intact, Aviva, Chubb"
												class="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900"
											/>
										</div>
										<div class="space-y-1 flex flex-col justify-end">
											<button
												type="button"
												onclick={handleSecondOpinionRequest}
												class="px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
											>
												Request Second Opinion Review
											</button>
										</div>
									</div>
								{/if}
							</div>
						</div>
					{/if}

					<!-- BOOKING CTA BAR -->
					<div class="p-8 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-lg">
						<div class="space-y-1 max-w-xl">
							<span class="text-[10px] font-mono text-blue-400 uppercase tracking-wider font-bold">Direct Consultation</span>
							<h4 class="text-lg sm:text-xl font-bold tracking-tight">
								Schedule a Feasibility Review with Kevin Day
							</h4>
							<p class="text-xs text-slate-300">
								Discuss your score, historical loss runs, and statutory domicile strategy in a 1-on-1 video review.
							</p>
						</div>

						<a
							href={data.bookingUrl}
							target="_blank"
							rel="noopener noreferrer"
							class="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all shrink-0"
						>
							<Calendar class="w-4 h-4 text-blue-200" />
							<span>Book Feasibility Review</span>
							<ExternalLink class="w-3.5 h-3.5" />
						</a>
					</div>
				</div>
			{/if}
		</div>
	{/if}
</div>
