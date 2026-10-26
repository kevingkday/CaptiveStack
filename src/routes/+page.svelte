<script lang="ts">
	import type { PageData } from './$types';
	import {
		Shield,
		Layers,
		Landmark,
		Activity,
		Users,
		FileText,
		CheckCircle2,
		AlertCircle,
		TrendingUp,
		ArrowRight,
		Database,
		Lock,
		Check,
		Copy,
		Clock,
		Percent,
		DollarSign,
		ChevronRight,
		FileCheck,
		BadgeCheck
	} from 'lucide-svelte';

	let { data }: { data: PageData } = $props();

	let copiedSnippet = $state<string | null>(null);

	function copyToClipboard(text: string, id: string) {
		navigator.clipboard.writeText(text);
		copiedSnippet = id;
		setTimeout(() => {
			copiedSnippet = null;
		}, 2000);
	}

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

	const pipelineStages = [
		'Intake',
		'Outreach',
		'DataCollection',
		'Review',
		'Feasibility',
		'ActuarialReview',
		'CapitalFormation',
		'Domicile',
		'Bound'
	];
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
	<!-- Hero / Header Section -->
	<section class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-brand-950/40 border border-slate-800 p-6 sm:p-10 shadow-2xl">
		<div class="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>
		<div class="relative z-10 space-y-4">
			<div class="flex flex-wrap items-center gap-2">
				<span class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-brand-500/10 text-brand-400 border border-brand-500/30">
					<Shield class="w-3.5 h-3.5 mr-1.5" />
					CaptiveStack Architecture v2
				</span>
				<span class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800/80 text-slate-300 border border-slate-700/60 font-mono">
					<Database class="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
					{data.source}
				</span>
			</div>

			<h1 class="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
				Alternative Risk Transfer &amp; Group Captive Engine
			</h1>
			<p class="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
				Scaffolding the foundation of CaptiveStack: replacing legacy stateful Blazor Server with a serverless edge architecture powered by <span class="text-white font-medium">Cloudflare D1 (SQLite)</span>, <span class="text-white font-medium">Drizzle ORM</span>, and <span class="text-white font-medium">SvelteKit 2</span>.
			</p>

			<!-- Quick Key Metrics Grid -->
			<div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-4">
				<div class="p-4 rounded-xl bg-slate-950/60 border border-slate-800/90 backdrop-blur-sm">
					<span class="text-xs font-medium text-slate-400 block mb-1">Active Pilot Programs</span>
					<div class="flex items-baseline space-x-2">
						<span class="text-2xl font-bold text-white font-mono">{data.projects.length}</span>
						<span class="text-xs text-brand-400 font-medium">Eagle1 &amp; GlassCo</span>
					</div>
				</div>

				<div class="p-4 rounded-xl bg-slate-950/60 border border-slate-800/90 backdrop-blur-sm">
					<span class="text-xs font-medium text-slate-400 block mb-1">Target Capital Reserves</span>
					<div class="flex items-baseline space-x-2">
						<span class="text-2xl font-bold text-emerald-400 font-mono">$4.50M</span>
						<span class="text-xs text-slate-400">LOC Replacement</span>
					</div>
				</div>

				<div class="p-4 rounded-xl bg-slate-950/60 border border-slate-800/90 backdrop-blur-sm">
					<span class="text-xs font-medium text-slate-400 block mb-1">Seeded RBAC Identities</span>
					<div class="flex items-baseline space-x-2">
						<span class="text-2xl font-bold text-white font-mono">{data.users.length}</span>
						<span class="text-xs text-indigo-400 font-medium">5 Role Types</span>
					</div>
				</div>

				<div class="p-4 rounded-xl bg-slate-950/60 border border-slate-800/90 backdrop-blur-sm">
					<span class="text-xs font-medium text-slate-400 block mb-1">Avg Combined Ratio Target</span>
					<div class="flex items-baseline space-x-2">
						<span class="text-2xl font-bold text-brand-300 font-mono">81.5%</span>
						<span class="text-xs text-emerald-400">&lt; 100% Profitable</span>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Pilot Programs Section -->
	<section id="programs" class="space-y-4">
		<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-800/80 pb-3">
			<div>
				<h2 class="text-xl font-bold text-white flex items-center space-x-2">
					<Layers class="w-5 h-5 text-brand-400" />
					<span>Pilot Group Captives</span>
				</h2>
				<p class="text-xs sm:text-sm text-slate-400">
					Association-backed alternative risk programs targeting letters-of-credit replacement.
				</p>
			</div>
			<div class="flex items-center space-x-2 text-xs font-mono text-slate-400">
				<span class="w-2 h-2 rounded-full bg-emerald-400"></span>
				<span>D1 Synced: {data.projects.length} Programs</span>
			</div>
		</div>

		<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
			{#each data.projects as project}
				<div class="rounded-xl bg-slate-900/70 border border-slate-800/80 p-5 sm:p-6 space-y-5 hover:border-slate-700/80 transition-all duration-200">
					<!-- Card Header -->
					<div class="flex items-start justify-between gap-3">
						<div class="space-y-1">
							<span class="text-[11px] font-semibold uppercase tracking-wider text-brand-400">
								{project.association?.name || 'Association Group'}
							</span>
							<h3 class="text-lg font-bold text-white leading-snug">
								{project.name}
							</h3>
							<p class="text-xs text-slate-400 font-mono">
								ID: {project.id} &bull; Entity: {project.association?.legalEntityType || 'Trade Group'}
							</p>
						</div>

						<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-300 border border-brand-500/30 whitespace-nowrap">
							<span class="w-1.5 h-1.5 rounded-full bg-brand-400 mr-1.5 animate-pulse"></span>
							{project.stage}
						</span>
					</div>

					<!-- Key Metrics Row -->
					<div class="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 rounded-lg bg-slate-950/70 border border-slate-800/70 text-xs">
						<div>
							<span class="text-slate-400 block text-[11px]">Combined Ratio Target</span>
							<span class="font-bold text-white font-mono text-sm">
								{formatPercent(project.combinedRatioTarget)}
							</span>
						</div>
						<div>
							<span class="text-slate-400 block text-[11px]">Surveys In Progress</span>
							<span class="font-bold text-white font-mono text-sm">
								{project.memberSurveys?.length || 1} Active
							</span>
						</div>
						<div class="col-span-2 sm:col-span-1">
							<span class="text-slate-400 block text-[11px]">Legal Entity</span>
							<span class="font-medium text-slate-300 truncate block">
								{project.association?.industrySlug || 'Captive'}
							</span>
						</div>
					</div>

					<!-- Capital Reserves breakdown for this project -->
					<div class="space-y-2.5">
						<div class="flex items-center justify-between text-xs">
							<span class="font-medium text-slate-300 flex items-center space-x-1">
								<Landmark class="w-3.5 h-3.5 text-emerald-400" />
								<span>Capital Reserve Allocations (LOC Alternative)</span>
							</span>
							<span class="text-slate-400 text-[11px] font-mono">
								{project.capitalReserves?.length || 0} Facilities
							</span>
						</div>

						{#if project.capitalReserves && project.capitalReserves.length > 0}
							<div class="space-y-2">
								{#each project.capitalReserves as reserve}
									{@const pct = Math.min(100, Math.round((reserve.allocatedAmount / reserve.requiredAmount) * 100))}
									<div class="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800/60 text-xs space-y-1.5">
										<div class="flex items-center justify-between font-mono">
											<span class="text-slate-300 font-semibold">{reserve.reserveType}</span>
											<span class="text-emerald-400 font-bold">
												{formatCurrency(reserve.allocatedAmount)} / {formatCurrency(reserve.requiredAmount)}
											</span>
										</div>

										<!-- Progress Bar -->
										<div class="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
											<div
												class="h-full bg-gradient-to-r from-brand-500 to-emerald-400 rounded-full transition-all duration-500"
												style="width: {pct}%"
											></div>
										</div>

										<div class="flex items-center justify-between text-[11px] text-slate-400">
											<span>Yield: {reserve.interestRate}% interest</span>
											<span class="inline-flex items-center font-medium {reserve.status === 'Funded' ? 'text-emerald-400' : reserve.status === 'Pledged' ? 'text-brand-300' : 'text-amber-300'}">
												Status: {reserve.status} ({pct}%)
											</span>
										</div>
									</div>
								{/each}
							</div>
						{:else}
							<p class="text-xs text-slate-400 italic">No capital facilities configured.</p>
						{/if}
					</div>

					<!-- Formation Stage Step indicator -->
					<div class="pt-2 border-t border-slate-800/60">
						<div class="flex items-center justify-between text-[11px] text-slate-400">
							<span>Intake Gate</span>
							<span class="text-brand-400 font-medium">Stage 7 of 9: Capital Formation</span>
							<span>Bound Captive</span>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</section>

	<!-- 9-Stage Formation Milestone Pipeline -->
	<section class="rounded-xl bg-slate-900/60 border border-slate-800/80 p-5 sm:p-6 space-y-4">
		<div class="space-y-1">
			<h2 class="text-lg font-bold text-white flex items-center space-x-2">
				<TrendingUp class="w-5 h-5 text-indigo-400" />
				<span>Alternative Risk Transfer (ART) Formation Roadmap</span>
			</h2>
			<p class="text-xs sm:text-sm text-slate-400">
				Deterministic gating milestones for association members from risk data intake to final reinsurance binding.
			</p>
		</div>

		<div class="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2 text-center text-xs">
			{#each pipelineStages as stage, idx}
				{@const isCurrent = stage === 'CapitalFormation'}
				{@const isPassed = idx < 6}
				<div class="p-2.5 rounded-lg border flex flex-col items-center justify-between space-y-1 {isCurrent ? 'bg-brand-500/15 border-brand-500/50 text-white font-bold ring-1 ring-brand-500/40 shadow-sm' : isPassed ? 'bg-slate-950/70 border-emerald-500/30 text-slate-300' : 'bg-slate-950/30 border-slate-800/60 text-slate-400'}">
					<span class="text-[10px] font-mono opacity-60">0{idx + 1}</span>
					<span class="text-[11px] leading-tight">{stage}</span>
					{#if isPassed}
						<CheckCircle2 class="w-3.5 h-3.5 text-emerald-400 mt-0.5" />
					{:else if isCurrent}
						<span class="w-2 h-2 rounded-full bg-brand-400 animate-ping"></span>
					{:else}
						<span class="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
					{/if}
				</div>
			{/each}
		</div>
	</section>

	<!-- Feasibility Assessments & Fit Score Grid -->
	<section id="feasibility" class="space-y-4">
		<div class="border-b border-slate-800/80 pb-3">
			<h2 class="text-xl font-bold text-white flex items-center space-x-2">
				<Activity class="w-5 h-5 text-emerald-400" />
				<span>Feasibility Assessments &amp; Fit Scores</span>
			</h2>
			<p class="text-xs sm:text-sm text-slate-400">
				Actuarial intake algorithms evaluating loss ratios, volatility premiums, and captive suitability.
			</p>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			{#each data.feasibilityAssessments as assessment}
				<div class="rounded-xl bg-slate-900/60 border border-slate-800/80 p-5 space-y-3">
					<div class="flex items-center justify-between">
						<span class="text-xs font-semibold px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
							Fit Score: {assessment.fitScore} / 100
						</span>
						<span class="text-xs font-mono text-slate-400">
							Status: <strong class="text-white">{assessment.status}</strong>
						</span>
					</div>

					<div>
						<h3 class="font-bold text-white text-base">{assessment.organizationType}</h3>
						<p class="text-xs text-slate-400 mt-0.5 font-mono">Contact: {assessment.email}</p>
					</div>

					<p class="text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/60">
						<strong class="text-slate-400 block text-[11px] uppercase tracking-wider mb-0.5">Primary Risk Concern:</strong>
						{assessment.primaryConcern}
					</p>

					<div class="grid grid-cols-3 gap-2 text-center text-xs font-mono pt-1">
						<div class="p-2 rounded bg-slate-950/40 border border-slate-800/60">
							<span class="text-slate-400 block text-[10px]">Annual Premium</span>
							<span class="text-white font-bold">{formatCurrency(assessment.annualPremium)}</span>
						</div>
						<div class="p-2 rounded bg-slate-950/40 border border-slate-800/60">
							<span class="text-slate-400 block text-[10px]">5-Yr Losses</span>
							<span class="text-white font-bold">{formatCurrency(assessment.fiveYearLosses)}</span>
						</div>
						<div class="p-2 rounded bg-slate-950/40 border border-slate-800/60">
							<span class="text-slate-400 block text-[10px]">Loss Ratio</span>
							<span class="text-emerald-400 font-bold">{formatPercent(assessment.lossRatio)}</span>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</section>

	<!-- Role-Based Access Control (RBAC) Accounts Matrix -->
	<section id="rbac" class="space-y-4">
		<div class="border-b border-slate-800/80 pb-3">
			<h2 class="text-xl font-bold text-white flex items-center space-x-2">
				<Users class="w-5 h-5 text-indigo-400" />
				<span>Role-Based Access Control (RBAC) Test Identities</span>
			</h2>
			<p class="text-xs sm:text-sm text-slate-400">
				Edge-compatible session authentication schemas with strictly defined permission scopes.
			</p>
		</div>

		<div class="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/50">
			<table class="w-full text-left text-xs">
				<thead class="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-800">
					<tr>
						<th class="px-4 py-3">Role</th>
						<th class="px-4 py-3">Representative Identity</th>
						<th class="px-4 py-3">Email Address</th>
						<th class="px-4 py-3">Scope &amp; Authority</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-slate-800/60 text-slate-300 font-mono">
					{#each data.users as user}
						<tr class="hover:bg-slate-800/40 transition-colors">
							<td class="px-4 py-3 whitespace-nowrap">
								<span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
									{user.role}
								</span>
							</td>
							<td class="px-4 py-3 text-white font-sans font-medium">
								{user.name}
							</td>
							<td class="px-4 py-3 text-slate-300">
								{user.email}
							</td>
							<td class="px-4 py-3 text-slate-400 font-sans text-xs">
								{#if user.role === 'Admin'}
									Full platform infrastructure, migrations, and tenant onboarding.
								{:else if user.role === 'CaptiveStackAdministrator'}
									Cross-program underwriting review, actuarial oversight, and capital reserves gating.
								{:else if user.role === 'AssociationAdministrator'}
									Manages trade group members, launches campaigns, and tracks survey progress.
								{:else if user.role === 'AssociationMember'}
									Submits loss runs, completes 11-step exposure survey, and certifies risk profile.
								{:else if user.role === 'AdviserReviewer'}
									Third-party actuary, legal counsel, and captive manager auditing milestones.
								{/if}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</section>

	<!-- Local D1 Verification & Terminal Commands Section -->
	<section class="rounded-xl bg-slate-900/80 border border-slate-800 p-5 sm:p-6 space-y-4">
		<div class="flex items-center justify-between">
			<div class="space-y-1">
				<h2 class="text-base font-bold text-white flex items-center space-x-2">
					<Database class="w-4 h-4 text-brand-400" />
					<span>Cloudflare Wrangler &amp; D1 Local Verification Commands</span>
				</h2>
				<p class="text-xs text-slate-400">
					Terminal commands used to run and verify D1 migrations, inspect tables, and preview on Cloudflare Pages.
				</p>
			</div>
			<span class="text-xs font-mono px-2 py-1 rounded bg-slate-950 text-emerald-400 border border-slate-800">
				Wrangler v3.114.17
			</span>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
			<div class="p-3.5 rounded-lg bg-slate-950 border border-slate-800/80 space-y-2">
				<div class="flex items-center justify-between text-slate-400 text-[11px]">
					<span>1. Apply Migrations to Local D1:</span>
					<button
						type="button"
						onclick={() => copyToClipboard('npx wrangler d1 execute DB --local --file=./drizzle/0000_bitter_kid_colt.sql', 'cmd1')}
						class="text-brand-400 hover:text-brand-300 flex items-center space-x-1"
					>
						{#if copiedSnippet === 'cmd1'}
							<Check class="w-3 h-3 text-emerald-400" />
							<span class="text-emerald-400">Copied</span>
						{:else}
							<Copy class="w-3 h-3" />
							<span>Copy</span>
						{/if}
					</button>
				</div>
				<pre class="text-slate-200 overflow-x-auto whitespace-pre-wrap break-all text-[11px] selection:bg-brand-500">npx wrangler d1 execute DB --local --file=./drizzle/0000_bitter_kid_colt.sql</pre>
			</div>

			<div class="p-3.5 rounded-lg bg-slate-950 border border-slate-800/80 space-y-2">
				<div class="flex items-center justify-between text-slate-400 text-[11px]">
					<span>2. Seed Test Roles &amp; Pilot Captives:</span>
					<button
						type="button"
						onclick={() => copyToClipboard('npx wrangler d1 execute DB --local --file=./src/lib/server/db/seed.sql', 'cmd2')}
						class="text-brand-400 hover:text-brand-300 flex items-center space-x-1"
					>
						{#if copiedSnippet === 'cmd2'}
							<Check class="w-3 h-3 text-emerald-400" />
							<span class="text-emerald-400">Copied</span>
						{:else}
							<Copy class="w-3 h-3" />
							<span>Copy</span>
						{/if}
					</button>
				</div>
				<pre class="text-slate-200 overflow-x-auto whitespace-pre-wrap break-all text-[11px] selection:bg-brand-500">npx wrangler d1 execute DB --local --file=./src/lib/server/db/seed.sql</pre>
			</div>

			<div class="p-3.5 rounded-lg bg-slate-950 border border-slate-800/80 space-y-2">
				<div class="flex items-center justify-between text-slate-400 text-[11px]">
					<span>3. Query Seeded Programs via Wrangler:</span>
					<button
						type="button"
						onclick={() => copyToClipboard('npx wrangler d1 execute DB --local --command="SELECT name, stage FROM projects;"', 'cmd3')}
						class="text-brand-400 hover:text-brand-300 flex items-center space-x-1"
					>
						{#if copiedSnippet === 'cmd3'}
							<Check class="w-3 h-3 text-emerald-400" />
							<span class="text-emerald-400">Copied</span>
						{:else}
							<Copy class="w-3 h-3" />
							<span>Copy</span>
						{/if}
					</button>
				</div>
				<pre class="text-slate-200 overflow-x-auto whitespace-pre-wrap break-all text-[11px] selection:bg-brand-500">npx wrangler d1 execute DB --local --command="SELECT name, stage FROM projects;"</pre>
			</div>

			<div class="p-3.5 rounded-lg bg-slate-950 border border-slate-800/80 space-y-2">
				<div class="flex items-center justify-between text-slate-400 text-[11px]">
					<span>4. Generate Next Drizzle Migration:</span>
					<button
						type="button"
						onclick={() => copyToClipboard('npm run db:generate', 'cmd4')}
						class="text-brand-400 hover:text-brand-300 flex items-center space-x-1"
					>
						{#if copiedSnippet === 'cmd4'}
							<Check class="w-3 h-3 text-emerald-400" />
							<span class="text-emerald-400">Copied</span>
						{:else}
							<Copy class="w-3 h-3" />
							<span>Copy</span>
						{/if}
					</button>
				</div>
				<pre class="text-slate-200 overflow-x-auto whitespace-pre-wrap break-all text-[11px] selection:bg-brand-500">npm run db:generate</pre>
			</div>
		</div>
	</section>
</div>
