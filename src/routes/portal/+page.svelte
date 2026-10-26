<script lang="ts">
	import type { PageData } from './$types';
	import {
		Shield,
		Lock,
		CheckCircle2,
		AlertCircle,
		LogOut,
		Users,
		Building2,
		Scale,
		FileSpreadsheet,
		UserCheck,
		Layers,
		Landmark,
		Activity,
		FileText,
		ArrowRight,
		ExternalLink,
		ChevronRight,
		Clock,
		BadgeCheck,
		FileCheck,
		Database,
		Check
	} from 'lucide-svelte';
	import { ROLE_CONFIGS, type UserRole } from '$lib/auth/rbac';

	let { data }: { data: PageData } = $props();

	let roleMeta = $derived(ROLE_CONFIGS[data.role as UserRole] || ROLE_CONFIGS.AssociationMember);

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
</script>

<svelte:head>
	<title>{roleMeta.displayName} Portal | CaptiveStack</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
	<!-- Unauthorized Route Warning (if redirected from forbidden area) -->
	{#if data.error === 'unauthorized_role'}
		<div class="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs sm:text-sm flex items-start space-x-3 animate-in fade-in duration-200">
			<AlertCircle class="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
			<div>
				<p class="font-bold">Role-Based Access Control Notice</p>
				<p class="text-amber-200/90 text-xs mt-0.5">
					Your authenticated role (<strong class="text-white">{data.role}</strong>) does not have authorization to access <code class="bg-amber-950/60 px-1.5 py-0.5 rounded text-amber-300 font-mono">{data.required}</code>. You have been safely routed to your role-authorized workspace.
				</p>
			</div>
		</div>
	{/if}

	<!-- User Header Banner -->
	<section class="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/95 to-brand-950/30 border border-slate-800 p-6 sm:p-8 shadow-xl">
		<div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
			<div class="space-y-3">
				<div class="flex flex-wrap items-center gap-2">
					<span class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border {roleMeta.badgeClass}">
						<Shield class="w-3.5 h-3.5 mr-1.5" />
						{data.role}
					</span>
					<span class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono bg-slate-950/70 text-slate-300 border border-slate-800">
						<Database class="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
						Edge Session Active
					</span>
				</div>

				<div>
					<h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
						Welcome, {data.user.name}
					</h1>
					<p class="text-xs sm:text-sm text-slate-400 mt-1 font-mono">
						{data.user.email} &bull; {roleMeta.description}
					</p>
				</div>
			</div>

			<div class="flex items-center space-x-3 shrink-0">
				<a
					href="/login"
					class="px-3.5 py-2 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/60 transition-colors"
				>
					Switch Persona
				</a>
				<a
					href="/logout"
					class="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-colors"
				>
					<LogOut class="w-3.5 h-3.5" />
					<span>Sign Out</span>
				</a>
			</div>
		</div>
	</section>

	<!-- ============================================================== -->
	<!-- ROLE SPECIFIC WORKSPACES                                       -->
	<!-- ============================================================== -->

	{#if data.role === 'Admin' || data.role === 'CaptiveStackAdministrator'}
		<!-- 1. ADMIN & CSA WORKSPACE: Underwriting & Cross-Program Oversight -->
		<div class="space-y-6">
			<div class="flex items-center justify-between border-b border-slate-800 pb-3">
				<div>
					<h2 class="text-lg font-bold text-white flex items-center space-x-2">
						<Scale class="w-5 h-5 text-indigo-400" />
						<span>Chief Underwriting &amp; Capital Reserve Gating</span>
					</h2>
					<p class="text-xs text-slate-400">
						Cross-association program approvals, combined ratio underwriting, and LOC replacement monitoring.
					</p>
				</div>
				<span class="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
					All Programs Live
				</span>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				{#each data.projects as project}
					<div class="rounded-xl bg-slate-900/60 border border-slate-800 p-5 space-y-4">
						<div class="flex items-start justify-between">
							<div>
								<span class="text-[11px] font-semibold text-brand-400 uppercase tracking-wider block">
									{project.association?.name}
								</span>
								<h3 class="text-base font-bold text-white">{project.name}</h3>
							</div>
							<span class="text-xs font-semibold px-2 py-0.5 rounded bg-brand-500/15 text-brand-300 border border-brand-500/30">
								{project.stage}
							</span>
						</div>

						<div class="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-950/60 p-3 rounded-lg border border-slate-800">
							<div>
								<span class="text-slate-400 block text-[10px]">Target Combined Ratio</span>
								<span class="text-white font-bold">{formatPercent(project.combinedRatioTarget)}</span>
							</div>
							<div>
								<span class="text-slate-400 block text-[10px]">Surveys Filed</span>
								<span class="text-emerald-400 font-bold">{project.memberSurveys?.length || 1} Audited</span>
							</div>
						</div>

						<div class="space-y-2">
							<span class="text-xs font-medium text-slate-300 flex items-center space-x-1">
								<Landmark class="w-3.5 h-3.5 text-emerald-400" />
								<span>Capital Reserve Verification</span>
							</span>
							{#each project.capitalReserves as res}
								<div class="flex items-center justify-between text-xs p-2 rounded bg-slate-950/40 border border-slate-800/60 font-mono">
									<span class="text-slate-300">{res.reserveType}</span>
									<span class="text-emerald-400 font-bold">
										{formatCurrency(res.allocatedAmount)} / {formatCurrency(res.requiredAmount)}
									</span>
								</div>
							{/each}
						</div>
					</div>
				{/each}
			</div>

			<!-- System Audit Logs from SQLite D1 -->
			<div class="rounded-xl bg-slate-900/60 border border-slate-800 p-5 space-y-3">
				<h3 class="text-sm font-bold text-white flex items-center space-x-2">
					<Clock class="w-4 h-4 text-brand-400" />
					<span>D1 SQLite Audit Trail</span>
				</h3>
				<div class="space-y-2 text-xs font-mono">
					{#each data.auditLogs as log}
						<div class="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
							<div class="flex items-center space-x-2">
								<span class="w-2 h-2 rounded-full bg-emerald-400"></span>
								<strong class="text-white">{log.action}</strong>
								<span class="text-slate-400">Target: {log.targetEntity}</span>
							</div>
							<span class="text-slate-400 text-[11px]">{new Date(log.timestamp).toLocaleTimeString()}</span>
						</div>
					{/each}
				</div>
			</div>
		</div>

	{:else if data.role === 'AssociationAdministrator'}
		<!-- 2. ASSOCIATION ADMIN WORKSPACE: GlassCo Campaign Oversight -->
		<div class="space-y-6">
			<div class="flex items-center justify-between border-b border-slate-800 pb-3">
				<div>
					<h2 class="text-lg font-bold text-white flex items-center space-x-2">
						<Building2 class="w-5 h-5 text-brand-400" />
						<span>GlassCo Association Member Intake Campaign</span>
					</h2>
					<p class="text-xs text-slate-400">
						Tracking trade member loss run submissions, warranty data polling, and pooled reserve quota.
					</p>
				</div>
				<span class="text-xs font-mono text-brand-300 bg-brand-500/10 px-2.5 py-1 rounded border border-brand-500/30">
					501(c)(6) Association View
				</span>
			</div>

			<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
				<div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
					<span class="text-xs text-slate-400 block mb-1">Invited Dealers</span>
					<span class="text-2xl font-bold text-white font-mono">48 Dealers</span>
				</div>
				<div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
					<span class="text-xs text-slate-400 block mb-1">Surveys In Progress</span>
					<span class="text-2xl font-bold text-brand-400 font-mono">36 Active</span>
				</div>
				<div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
					<span class="text-xs text-slate-400 block mb-1">Quota Share Target</span>
					<span class="text-2xl font-bold text-emerald-400 font-mono">$2.50M LOC</span>
				</div>
			</div>

			<div class="rounded-xl bg-slate-900/60 border border-slate-800 p-5 space-y-4">
				<h3 class="text-sm font-bold text-white">Active Member Surveys in Pipeline</h3>
				<div class="space-y-2">
					{#each data.surveys as survey}
						<a
							href="/survey/{survey.token}"
							class="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 hover:border-brand-500/50 hover:bg-slate-950 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs block group"
						>
							<div>
								<div class="flex items-center space-x-2">
									<span class="font-bold text-white group-hover:text-brand-300 transition-colors font-sans">{survey.member?.name || 'Marcus Miller (AutoGlass Pro)'}</span>
									<span class="text-[10px] text-brand-400 bg-brand-500/10 px-1.5 py-0.5 rounded border border-brand-500/20 font-mono">Open Survey</span>
								</div>
								<p class="text-slate-400 font-mono text-[11px]">Token: {survey.token}</p>
							</div>
							<div class="flex items-center space-x-3">
								<span class="font-mono text-brand-300">Step {survey.stepCompleted} of 11</span>
								<span class="px-2 py-0.5 rounded text-[10px] font-semibold {survey.isCertified ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'}">
									{survey.isCertified ? 'Certified' : 'In Progress'}
								</span>
							</div>
						</a>
					{/each}
				</div>
			</div>
		</div>

	{:else if data.role === 'AssociationMember'}
		<!-- 3. ASSOCIATION MEMBER WORKSPACE: 11-Step Survey & Loss Run Intake -->
		<div class="space-y-6">
			<div class="flex items-center justify-between border-b border-slate-800 pb-3">
				<div>
					<h2 class="text-lg font-bold text-white flex items-center space-x-2">
						<UserCheck class="w-5 h-5 text-emerald-400" />
						<span>Member Risk Profile &amp; Underwriting Survey</span>
					</h2>
					<p class="text-xs text-slate-400">
						11-step exposure survey for alternative risk transfer and capital participation.
					</p>
				</div>
				<span class="text-xs font-mono text-emerald-300 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
					Member Portal
				</span>
			</div>

			<!-- 11-Step Progress Card -->
			<div class="rounded-xl bg-slate-900/60 border border-slate-800 p-6 space-y-4">
				<div class="flex items-center justify-between">
					<div class="space-y-0.5">
						<span class="text-xs font-bold uppercase tracking-wider text-brand-400">Step 8 of 11 Completed</span>
						<h3 class="text-lg font-bold text-white">Loss Run History &amp; Fleet Exposure Verification</h3>
					</div>
					<span class="text-sm font-mono font-bold text-emerald-400">72% Completed</span>
				</div>

				<div class="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
					<div class="h-full bg-gradient-to-r from-brand-500 to-emerald-400 w-[72%] rounded-full"></div>
				</div>

				<div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono pt-2">
					<div class="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
						<span class="text-slate-400 block text-[10px]">Tournaments / Year</span>
						<span class="text-white font-bold">42 Events</span>
					</div>
					<div class="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
						<span class="text-slate-400 block text-[10px]">Avg Prize Insured</span>
						<span class="text-white font-bold">$35,000</span>
					</div>
					<div class="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
						<span class="text-slate-400 block text-[10px]">5-Yr Claims</span>
						<span class="text-emerald-400 font-bold">2 Historical</span>
					</div>
					<div class="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
						<span class="text-slate-400 block text-[10px]">LOC Replacement</span>
						<span class="text-emerald-400 font-bold">Approved</span>
					</div>
				</div>

				<div class="pt-4 flex items-center justify-between border-t border-slate-800/80">
					<span class="text-xs text-slate-400 flex items-center space-x-1.5">
						<Lock class="w-3.5 h-3.5 text-slate-400" />
						<span>Protected by Edge Session Auth &bull; Auto-saved</span>
					</span>
					<a
						href="/survey/tk_eagle1_intake_verified_2026"
						class="inline-flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white shadow-md transition-colors"
					>
						<span>Open 11-Step Survey Intake Wizard</span>
						<ArrowRight class="w-3.5 h-3.5" />
					</a>
				</div>
			</div>
		</div>

	{:else if data.role === 'AdviserReviewer'}
		<!-- 4. ADVISER REVIEWER WORKSPACE: Actuarial Audit & Combined Ratio Sign-off -->
		<div class="space-y-6">
			<div class="flex items-center justify-between border-b border-slate-800 pb-3">
				<div>
					<h2 class="text-lg font-bold text-white flex items-center space-x-2">
						<FileSpreadsheet class="w-5 h-5 text-amber-400" />
						<span>Actuarial Review &amp; Feasibility Audit Queue</span>
					</h2>
					<p class="text-xs text-slate-400">
						Independent actuarial review for Eagle1 Hole-in-One prize coverage and GlassCo captive models.
					</p>
				</div>
				<span class="text-xs font-mono text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20">
					Independent Actuary View
				</span>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div class="rounded-xl bg-slate-900/60 border border-slate-800 p-5 space-y-3">
					<div class="flex items-center justify-between">
						<span class="text-xs font-bold text-white">Eagle1 Hole-in-One Actuarial Study</span>
						<span class="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
							Verified
						</span>
					</div>
					<p class="text-xs text-slate-300 leading-relaxed">
						Historical binomial probability models for 165-yard par-3 hole-in-one distribution. Loss ratio verified at 33.5% with target combined ratio 78.0%.
					</p>
					<div class="p-2.5 rounded bg-slate-950/60 border border-slate-800 text-xs font-mono flex items-center justify-between">
						<span class="text-slate-400">Feasibility Fit Score</span>
						<span class="text-emerald-400 font-bold">94 / 100</span>
					</div>
				</div>

				<div class="rounded-xl bg-slate-900/60 border border-slate-800 p-5 space-y-3">
					<div class="flex items-center justify-between">
						<span class="text-xs font-bold text-white">GlassCo Replacement Loss Runs</span>
						<span class="text-xs font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
							Under Review
						</span>
					</div>
					<p class="text-xs text-slate-300 leading-relaxed">
						Aggregated claims from 2021-2025 across 48 dealer locations. Evaluating severity tail risk and reinsurance excess of loss detachment points.
					</p>
					<div class="p-2.5 rounded bg-slate-950/60 border border-slate-800 text-xs font-mono flex items-center justify-between">
						<span class="text-slate-400">Current Loss Ratio</span>
						<span class="text-amber-300 font-bold">57.1%</span>
					</div>
				</div>
			</div>
		</div>
	{/if}

	<!-- Quick Switcher Bar at Bottom -->
	<section class="rounded-xl bg-slate-950/80 border border-slate-800/80 p-4 text-xs space-y-2">
		<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
			<span class="text-slate-400 font-medium">Quick Persona Switch (Pair Programming Demo):</span>
			<div class="flex flex-wrap gap-2">
				{#each ['Admin', 'CaptiveStackAdministrator', 'AssociationAdministrator', 'AssociationMember', 'AdviserReviewer'] as testRole}
					{#if testRole !== data.role}
						<form method="POST" action="/login?/demoLogin" class="inline">
							<input type="hidden" name="role" value={testRole} />
							<input type="hidden" name="redirectTo" value="/portal" />
							<button
								type="submit"
								class="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 font-mono text-[11px] transition-colors cursor-pointer"
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
