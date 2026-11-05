<script lang="ts">
	import {
		Shield,
		Users,
		Building2,
		Scale,
		FileText,
		CheckCircle2,
		ArrowRight,
		ExternalLink,
		Compass,
		Landmark,
		Sparkles,
		ChevronRight,
		Briefcase,
		GraduationCap,
		Handshake
	} from 'lucide-svelte';

	const formationRoles = [
		{
			role: 'The Actuary',
			badge: 'Actuarial Feasibility & Reserves',
			description:
				'Performs historical loss analysis, calculates expected loss frequencies and severities, certifies rate adequacy, and prepares the independent actuarial feasibility study required by the domicile insurance commissioner.',
			deliverables: ['5-year loss run analysis', 'Binomial & frequency modeling', 'Capital reserve certification', 'Pro forma loss ratios']
		},
		{
			role: 'The Captive Manager',
			badge: 'Domicile Administration & Regulatory Liaison',
			description:
				'Coordinates the formal application with the domicile regulator, maintains the captive’s statutory accounting records, prepares annual NAIC or domicile regulatory filings, and oversees daily administrative operations.',
			deliverables: ['Business plan drafting', 'Regulatory application submission', 'Statutory accounting & audit liaison', 'Board minute books & compliance']
		},
		{
			role: 'The Fronting Carrier',
			badge: 'Licensed Paper & Regulatory Compliance',
			description:
				'Provides an A-rated admitted or licensed insurance policy paper required by certificates of insurance, contractual counterparties, and lenders, while ceding retained member risk to the captive via a reinsurance agreement.',
			deliverables: ['A-rated policy issuance', 'State/provincial certificate compliance', 'Collateral & trust agreement administration', 'Fronting fee schedules']
		},
		{
			role: 'The Reinsurer',
			badge: 'Catastrophic Stop-Loss & Capital Backstop',
			description:
				'Provides specific excess-of-loss and aggregate stop-loss treaty reinsurance, ensuring that catastrophic claims exceeding the captive’s retention detachment point are fully absorbed without further member capital calls.',
			deliverables: ['Specific excess treaty', 'Aggregate stop-loss coverage', 'Quota-share participation', 'Tail risk protection']
		},
		{
			role: 'The Domicile Regulator',
			badge: 'Licensing & Ongoing Solvency Oversight',
			description:
				'State, provincial, or offshore insurance commissioner division that reviews the feasibility study, conducts background and fitness checks on principals, issues the formal Certificate of Authority (license), and conducts periodic examinations.',
			deliverables: ['Initial charter review', 'Certificate of Authority', 'Annual financial audit review', 'Risk-based capital monitoring']
		}
	];

	const partnerCategories = [
		{
			title: 'Actuarial Partners',
			status: 'Network Partners Available',
			description: 'Independent credentialed FCAS / MAAA actuarial firms with specialized practices in association group captives and alternative risk financing.',
			items: ['Milliman / Pinnacle / Independent practice networks', 'Custom binomial prize indemnity modeling', 'Formal domicile feasibility certifications']
		},
		{
			title: 'Captive Management Partners',
			status: 'Licensed Across All Domiciles',
			description: 'Full-service captive management firms licensed in Vermont, Utah, Delaware, Cayman, Bermuda, Barbados, BC, and Alberta.',
			items: ['Turnkey regulatory application submission', 'Statutory financial statement preparation', 'Corporate secretarial & board meeting support']
		},
		{
			title: 'Fronting & Reinsurance Brokers',
			status: 'A-Rated Paper Relationships',
			description: 'Intermediaries and fronting insurers providing admitted paper and reinsurance treaties tailored to mid-market associations.',
			items: ['Admitted A-rated AM Best carriers', 'Structured letters of credit & standby collateral trusts', 'Quota-share and excess stop-loss reinsurance']
		},
		{
			title: 'Legal & Tax Counsel',
			status: 'Cross-Border Practice Network',
			description: 'Specialized captive legal counsel advising on group shareholder agreements, participant subscription documents, and federal tax elections.',
			items: ['IRC Section 831(b) and 953(d) elections', 'Association quota-share member agreements', 'Domicile statutory corporate filings']
		}
	];
</script>

<svelte:head>
	<title>About Us &amp; Captive Formation Process | CaptiveStack</title>
	<meta
		name="description"
		content="Learn about CaptiveStack founder Kevin Day, our institutional network of actuaries and captive managers, and how the 5 key captive formation roles work."
	/>
	<meta property="og:title" content="About Us &amp; Captive Formation Process | CaptiveStack" />
	<meta
		property="og:description"
		content="Learn about CaptiveStack founder Kevin Day, our institutional network of actuaries and captive managers, and how the 5 key captive formation roles work."
	/>
	<meta property="og:image" content="https://www.captivestack.com/og-image.svg" />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-16 sm:space-y-24">
	<!-- =========================================================================
	     1. HERO HEADER
	     ========================================================================= -->
	<header class="text-center max-w-3xl mx-auto space-y-4">
		<div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold shadow-2xs">
			<Shield class="w-3.5 h-3.5 text-blue-600" />
			<span>Leadership &amp; Institutional Formation Ecosystem</span>
		</div>

		<h1 class="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
			About <span class="text-blue-600">CaptiveStack</span>
		</h1>

		<p class="text-base sm:text-lg text-slate-600 leading-relaxed">
			CaptiveStack was created out of the need to reduce the cost and complexity of captive insurance for small to medium sized organizations, associations, and commercial trade groups.
		</p>
	</header>

	<!-- =========================================================================
	     2. FOUNDER PROFILE & CREDIBILITY
	     ========================================================================= -->
	<section class="max-w-5xl mx-auto">
		<div class="rounded-3xl bg-white border border-slate-200 p-8 sm:p-12 shadow-xs space-y-8">
			<div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-slate-100">
				<div class="space-y-2">
					<div class="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
						<Briefcase class="w-3.5 h-3.5 text-blue-600" />
						<span>Founder &amp; Managing Director</span>
					</div>
					<h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
						Kevin Day
					</h2>
					<p class="text-sm text-slate-600 font-medium">
						Founder of CaptiveStack, CanadianCaptive.com, and Ocean Falls Insurance
					</p>
				</div>

				<div class="flex flex-wrap items-center gap-3">
					<a
						href="https://canadiancaptive.com"
						target="_blank"
						rel="noopener noreferrer"
						class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors shadow-2xs"
					>
						<span>Visit CanadianCaptive.com</span>
						<ExternalLink class="w-3.5 h-3.5 text-slate-400" />
					</a>
					<a
						href="/feasibility"
						class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-xs"
					>
						<span>Request Feasibility Review</span>
						<ArrowRight class="w-3.5 h-3.5 text-blue-200" />
					</a>
				</div>
			</div>

			<!-- Bio Sections with Structured Placeholder Fields -->
			<div class="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-slate-600 leading-relaxed">
				<div class="space-y-4">
					<h3 class="text-base font-bold text-slate-900 flex items-center gap-2">
						<Compass class="w-4 h-4 text-blue-600" />
						<span>Background &amp; Industry Vision</span>
					</h3>
					<p>
						Kevin Day founded CaptiveStack to bridge the gap between complex institutional alternative risk transfer structures and mid-market organizations. For decades, Fortune 500 corporations have used captive insurance subsidiaries to escape commercial market cycles, stabilize premiums, and retain underwriting profits. CaptiveStack brings the same financial sovereignty to trade associations and member groups.
					</p>
					<!-- [Founder Bio Field: Background & Career Narrative Placeholder] -->
					<div class="p-4 rounded-xl bg-slate-50 border border-dashed border-slate-300 text-xs text-slate-500 space-y-1">
						<span class="font-bold text-slate-700 block">Leadership &amp; Career Focus (Editable Profile Field):</span>
						<p>
							Extensive background in Property &amp; Casualty (P&amp;C) risk underwriting, captive structuring, digital insurance architecture, and cross-border risk management between Canada and US/offshore domiciles.
						</p>
					</div>
				</div>

				<div class="space-y-4">
					<h3 class="text-base font-bold text-slate-900 flex items-center gap-2">
						<Landmark class="w-4 h-4 text-emerald-600" />
						<span>P&amp;C and Captive Experience</span>
					</h3>
					<p>
						As the principal behind <strong>CanadianCaptive.com</strong> (Canada's premier research portal for onshore and offshore captive domiciles) and <strong>Ocean Falls Insurance</strong>, Kevin has advised commercial organizations on alternative risk mechanisms, captive feasibility, and collateral optimization.
					</p>
					<!-- [Founder Bio Field: Professional Credentials & Education Placeholder] -->
					<div class="p-4 rounded-xl bg-slate-50 border border-dashed border-slate-300 text-xs text-slate-500 space-y-1">
						<span class="font-bold text-slate-700 block">Credentials &amp; Affiliations (Editable Profile Field):</span>
						<p>
							Active participant in international captive conferences and domicile working groups across Vermont, Utah, Delaware, Cayman, Bermuda, British Columbia, and Alberta.
						</p>
					</div>
				</div>
			</div>

			<!-- Quick Research Outbound Banner -->
			<div class="p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
				<div class="space-y-1">
					<h4 class="text-xs font-bold text-blue-900 uppercase tracking-wider">In-Depth Domicile Research</h4>
					<p class="text-xs text-blue-800">
						Explore detailed statutory comparisons, capital guidelines, and regulatory histories at <strong>CanadianCaptive.com</strong>.
					</p>
				</div>
				<a
					href="https://canadiancaptive.com"
					target="_blank"
					rel="noopener noreferrer"
					class="px-3.5 py-1.5 rounded-lg bg-white text-blue-700 text-xs font-bold border border-blue-200 hover:bg-blue-50 transition-colors inline-flex items-center gap-1.5 shadow-2xs whitespace-nowrap"
				>
					<span>Research Domiciles</span>
					<ExternalLink class="w-3.5 h-3.5" />
				</a>
			</div>
		</div>
	</section>

	<!-- =========================================================================
	     3. HOW FORMATION WORKS (The 5 Key Stakeholder Roles)
	     ========================================================================= -->
	<section class="max-w-6xl mx-auto space-y-8">
		<div class="text-center max-w-3xl mx-auto space-y-3">
			<div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
				<Scale class="w-3.5 h-3.5" />
				<span>Institutional Stakeholders</span>
			</div>
			<h2 class="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
				How Captive Formation Works
			</h2>
			<p class="text-sm text-slate-600 leading-relaxed">
				Forming and operating a compliant member-owned captive insurance company requires collaboration among five specialized institutional roles. CaptiveStack integrates this process from feasibility to ongoing management.
			</p>
		</div>

		<!-- 5 Stakeholder Role Cards -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each formationRoles as role, idx}
				<div class="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between hover:border-blue-300 transition-colors">
					<div class="space-y-4">
						<div class="flex items-center justify-between">
							<span class="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
								0{idx + 1}
							</span>
							<span class="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
								{role.badge}
							</span>
						</div>

						<h3 class="text-lg font-bold text-slate-900">
							{role.role}
						</h3>

						<p class="text-xs text-slate-600 leading-relaxed">
							{role.description}
						</p>

						<div class="pt-3 border-t border-slate-100 space-y-1.5">
							<span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Core Responsibilities:</span>
							<ul class="space-y-1 text-xs text-slate-700">
								{#each role.deliverables as del}
									<li class="flex items-center gap-1.5">
										<CheckCircle2 class="w-3 h-3 text-emerald-600 flex-shrink-0" />
										<span>{del}</span>
									</li>
								{/each}
							</ul>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</section>

	<!-- =========================================================================
	     4. ADVISOR & PARTNER NETWORK PLACEHOLDERS
	     ========================================================================= -->
	<section class="max-w-6xl mx-auto space-y-8">
		<div class="text-center max-w-3xl mx-auto space-y-3">
			<div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
				<Handshake class="w-3.5 h-3.5" />
				<span>Institutional Partner Network</span>
			</div>
			<h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
				Independent Advisors, Actuaries &amp; Fronting Partners
			</h2>
			<p class="text-sm text-slate-600 leading-relaxed">
				CaptiveStack works alongside accredited third-party service providers across North America and international domiciles.
			</p>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			{#each partnerCategories as cat}
				<div class="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
					<div class="flex items-center justify-between">
						<h3 class="text-base font-bold text-slate-900">{cat.title}</h3>
						<span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
							{cat.status}
						</span>
					</div>
					<p class="text-xs text-slate-600 leading-relaxed">
						{cat.description}
					</p>
					<ul class="space-y-1 text-xs text-slate-700 pt-2 border-t border-slate-100">
						{#each cat.items as item}
							<li class="flex items-center gap-2">
								<span class="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
								<span>{item}</span>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>
	</section>

	<!-- =========================================================================
	     5. BOTTOM CTA BANNER
	     ========================================================================= -->
	<section class="max-w-5xl mx-auto">
		<div class="rounded-3xl bg-slate-900 text-white p-8 sm:p-12 text-center space-y-6 shadow-xl relative overflow-hidden">
			<div class="relative z-10 max-w-2xl mx-auto space-y-4">
				<h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight">
					Ready to assess your association’s captive feasibility?
				</h2>
				<p class="text-xs sm:text-sm text-slate-300 leading-relaxed">
					Run preliminary actuarial projections or submit your member profile for an initial feasibility review with our team.
				</p>
				<div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
					<a
						href="/feasibility"
						class="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
					>
						<Sparkles class="w-4 h-4 text-blue-200" />
						<span>Evaluate Feasibility</span>
						<ArrowRight class="w-4 h-4" />
					</a>
					<a
						href="/domiciles"
						class="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all flex items-center justify-center gap-2"
					>
						<span>Explore Supported Domiciles</span>
						<ChevronRight class="w-4 h-4" />
					</a>
				</div>
			</div>
		</div>
	</section>
</div>
