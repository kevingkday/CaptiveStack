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
	<title>{roleMeta.displayName} Portal | Captive8</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
	<!-- Unauthorized Route Warning (if redirected from forbidden area) -->
	{#if data.error === 'unauthorized_role'}
		<div class="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-start space-x-3 animate-in fade-in duration-200">
			<AlertCircle class="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
			<div>
				<p class="font-bold">Role-Based Access Control Notice</p>
				<p class="text-amber-800 text-xs mt-0.5">
					Your authenticated role (<strong class="text-amber-950">{data.role}</strong>) does not have authorization to access <code class="bg-amber-100 px-1.5 py-0.5 rounded text-amber-900 font-mono">{data.required}</code>. You have been safely routed to your role-authorized workspace.
				</p>
			</div>
		</div>
	{/if}

	<!-- User Header Banner -->
	<section class="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-xs">
		<div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
			<div class="space-y-3">
				<div class="flex flex-wrap items-center gap-2">
					<span class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border {roleMeta.badgeClass}">
						<Shield class="w-3.5 h-3.5 mr-1.5" />
						{data.role}
					</span>
					<span class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
						<span class="w-2 h-2 rounded-full bg-emerald-500 mr-1.5"></span>
						Session Active
					</span>
				</div>

				<div>
					<h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
						Welcome, {data.user.name}
					</h1>
					<p class="text-xs sm:text-sm text-slate-600 mt-1 font-mono">
						{data.user.email} &bull; {roleMeta.description}
					</p>
				</div>
			</div>

			<div class="flex items-center space-x-3 shrink-0">
				<a
					href="/login"
					class="px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
				>
					Switch Persona
				</a>
				<a
					href="/logout"
					class="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors"
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
			<div class="flex items-center justify-between border-b border-slate-200 pb-3">
				<div>
					<h2 class="text-lg font-bold text-slate-900 flex items-center space-x-2">
						<Scale class="w-5 h-5 text-blue-600" />
						<span>Chief Underwriting &amp; Capital Reserve Gating</span>
					</h2>
					<p class="text-xs text-slate-500">
						Cross-association program approvals, combined ratio underwriting, and LOC replacement monitoring.
					</p>
				</div>
				<span class="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
					All Programs Live
				</span>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				{#each data.projects as project}
					<div class="rounded-xl bg-white border border-slate-200 p-5 space-y-4 shadow-xs">
						<div class="flex items-start justify-between">
							<div>
								<span class="text-[11px] font-semibold text-blue-600 uppercase tracking-wider block">
									{project.association?.name}
								</span>
								<h3 class="text-base font-bold text-slate-900">{project.name}</h3>
							</div>
							<span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
								{project.stage}
							</span>
						</div>

						<div class="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-50 p-3 rounded-lg border border-slate-200">
							<div>
								<span class="text-slate-500 block text-[10px]">Target Combined Ratio</span>
								<span class="text-slate-900 font-bold">{formatPercent(project.combinedRatioTarget)}</span>
							</div>
							<div>
								<span class="text-slate-500 block text-[10px]">Surveys Filed</span>
								<span class="text-emerald-700 font-bold">{project.memberSurveys?.length || 1} Audited</span>
							</div>
						</div>

						<div class="space-y-2">
							<span class="text-xs font-medium text-slate-700 flex items-center space-x-1">
								<Landmark class="w-3.5 h-3.5 text-emerald-600" />
								<span>Capital Reserve Verification</span>
							</span>
							{#each project.capitalReserves as res}
								<div class="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50 border border-slate-200 font-mono">
									<span class="text-slate-700">{res.reserveType}</span>
									<span class="text-emerald-700 font-bold">
										{formatCurrency(res.allocatedAmount)} / {formatCurrency(res.requiredAmount)}
									</span>
								</div>
							{/each}
						</div>
					</div>
				{/each}
			</div>

			<!-- System Audit Logs -->
			<div class="rounded-xl bg-white border border-slate-200 p-5 space-y-3 shadow-xs">
				<h3 class="text-sm font-bold text-slate-900 flex items-center space-x-2">
					<Clock class="w-4 h-4 text-blue-600" />
					<span>Governance &amp; Audit Trail</span>
				</h3>
				<div class="space-y-2 text-xs font-mono">
					{#each data.auditLogs as log}
						<div class="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
							<div class="flex items-center space-x-2">
								<span class="w-2 h-2 rounded-full bg-emerald-500"></span>
								<strong class="text-slate-900">{log.action}</strong>
								<span class="text-slate-500">Target: {log.targetEntity}</span>
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
			<div class="flex items-center justify-between border-b border-slate-200 pb-3">
				<div>
					<h2 class="text-lg font-bold text-slate-900 flex items-center space-x-2">
						<Building2 class="w-5 h-5 text-blue-600" />
						<span>GlassCo Association Member Intake Campaign</span>
					</h2>
					<p class="text-xs text-slate-500">
						Tracking trade member loss run submissions, warranty data polling, and pooled reserve quota.
					</p>
				</div>
				<span class="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
					501(c)(6) Association View
				</span>
			</div>

			<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
				<div class="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
					<span class="text-xs text-slate-500 font-medium block mb-1">Invited Dealers</span>
					<span class="text-2xl font-bold text-slate-900 font-mono">48 Dealers</span>
				</div>
				<div class="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
					<span class="text-xs text-slate-500 font-medium block mb-1">Surveys In Progress</span>
					<span class="text-2xl font-bold text-blue-600 font-mono">36 Active</span>
				</div>
				<div class="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
					<span class="text-xs text-slate-500 font-medium block mb-1">Quota Share Target</span>
					<span class="text-2xl font-bold text-emerald-600 font-mono">$2.50M LOC</span>
				</div>
			</div>

			<div class="rounded-xl bg-white border border-slate-200 p-5 space-y-4 shadow-xs">
				<h3 class="text-sm font-bold text-slate-900">Active Member Surveys in Pipeline</h3>
				<div class="space-y-2">
					{#each data.surveys as survey}
						<svelte:element
							this={survey.token ? 'a' : 'div'}
							href={survey.token ? `/survey/${survey.token}` : undefined}
							class="p-3.5 rounded-lg bg-slate-50 border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs block group"
						>
							<div>
								<div class="flex items-center space-x-2">
									<span class="font-bold text-slate-900 group-hover:text-blue-600 transition-colors font-sans">{survey.member?.name || 'Marcus Miller (AutoGlass Pro)'}</span>
									<span class="text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 font-mono">Open Survey</span>
								</div>
								<p class="text-slate-500 font-mono text-[11px]">
									{survey.token ? `Token: ${survey.token}` : 'Private intake link is not published here.'}
								</p>
							</div>
							<div class="flex items-center space-x-3">
								<span class="font-mono text-blue-700 font-semibold">Step {survey.stepCompleted} of 11</span>
								<span class="px-2 py-0.5 rounded-full text-[10px] font-semibold {survey.isCertified ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}">
									{survey.isCertified ? 'Certified' : 'In Progress'}
								</span>
							</div>
						</svelte:element>
					{/each}
				</div>
			</div>
		</div>

	{:else if data.role === 'AssociationMember'}
		<!-- 3. ASSOCIATION MEMBER WORKSPACE: 11-Step Survey & Loss Run Intake -->
		<div class="space-y-6">
			<div class="flex items-center justify-between border-b border-slate-200 pb-3">
				<div>
					<h2 class="text-lg font-bold text-slate-900 flex items-center space-x-2">
						<UserCheck class="w-5 h-5 text-emerald-600" />
						<span>Member Risk Profile &amp; Underwriting Survey</span>
					</h2>
					<p class="text-xs text-slate-500">
						11-step exposure survey for alternative risk transfer and capital participation.
					</p>
				</div>
				<span class="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
					Member Portal
				</span>
			</div>

			<!-- 11-Step Progress Card -->
			<div class="rounded-xl bg-white border border-slate-200 p-6 space-y-4 shadow-xs">
				<div class="flex items-center justify-between">
					<div class="space-y-0.5">
						<span class="text-xs font-bold uppercase tracking-wider text-blue-600">Step 8 of 11 Completed</span>
						<h3 class="text-lg font-bold text-slate-900">Loss Run History &amp; Fleet Exposure Verification</h3>
					</div>
					<span class="text-sm font-mono font-bold text-emerald-600">72% Completed</span>
				</div>

				<div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
					<div class="h-full bg-gradient-to-r from-blue-600 to-emerald-500 w-[72%] rounded-full"></div>
				</div>

				<div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono pt-2">
					<div class="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
						<span class="text-slate-500 block text-[10px]">Tournaments / Year</span>
						<span class="text-slate-900 font-bold">42 Events</span>
					</div>
					<div class="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
						<span class="text-slate-500 block text-[10px]">Avg Prize Insured</span>
						<span class="text-slate-900 font-bold">$35,000</span>
					</div>
					<div class="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
						<span class="text-slate-500 block text-[10px]">5-Yr Claims</span>
						<span class="text-emerald-700 font-bold">2 Historical</span>
					</div>
					<div class="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
						<span class="text-slate-500 block text-[10px]">LOC Replacement</span>
						<span class="text-emerald-700 font-bold">Approved</span>
					</div>
				</div>

				<div class="pt-4 flex items-center justify-between border-t border-slate-200">
					<span class="text-xs text-slate-500 flex items-center space-x-1.5">
						<Lock class="w-3.5 h-3.5 text-slate-400" />
						<span>Protected by Secure Session &bull; Auto-saved</span>
					</span>
					<span class="text-xs text-slate-500">
						A private intake link is issued for each member and is not published here.
					</span>
				</div>
			</div>
		</div>

	{:else if data.role === 'AdviserReviewer'}
		<!-- 4. ADVISER REVIEWER WORKSPACE: Actuarial Audit & Combined Ratio Sign-off -->
		<div class="space-y-6">
			<div class="flex items-center justify-between border-b border-slate-200 pb-3">
				<div>
					<h2 class="text-lg font-bold text-slate-900 flex items-center space-x-2">
						<FileSpreadsheet class="w-5 h-5 text-amber-600" />
						<span>Actuarial Review &amp; Feasibility Audit Queue</span>
					</h2>
					<p class="text-xs text-slate-500">
						Independent actuarial review for Eagle1 Hole-in-One prize coverage and GlassCo captive models.
					</p>
				</div>
				<span class="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
					Independent Actuary View
				</span>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div class="rounded-xl bg-white border border-slate-200 p-5 space-y-3 shadow-xs">
					<div class="flex items-center justify-between">
						<span class="text-xs font-bold text-slate-900">Eagle1 Hole-in-One Actuarial Study</span>
						<span class="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
							Verified
						</span>
					</div>
					<p class="text-xs text-slate-600 leading-relaxed">
						Historical binomial probability models for 165-yard par-3 hole-in-one distribution. Loss ratio verified at 33.5% with target combined ratio 78.0%.
					</p>
					<div class="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono flex items-center justify-between">
						<span class="text-slate-500">Feasibility Fit Score</span>
						<span class="text-emerald-700 font-bold">94 / 100</span>
					</div>
				</div>

				<div class="rounded-xl bg-white border border-slate-200 p-5 space-y-3 shadow-xs">
					<div class="flex items-center justify-between">
						<span class="text-xs font-bold text-slate-900">GlassCo Replacement Loss Runs</span>
						<span class="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
							Under Review
						</span>
					</div>
					<p class="text-xs text-slate-600 leading-relaxed">
						Aggregated claims from 2021-2025 across 48 dealer locations. Evaluating severity tail risk and reinsurance excess of loss detachment points.
					</p>
					<div class="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono flex items-center justify-between">
						<span class="text-slate-500">Current Loss Ratio</span>
						<span class="text-amber-700 font-bold">57.1%</span>
					</div>
				</div>
			</div>
		</div>
	{/if}

	{#if data.demoMode}
	<!-- Quick Switcher Bar at Bottom -->
	<section class="rounded-xl bg-white border border-slate-200 p-4 text-xs space-y-2 shadow-xs">
		<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
			<span class="text-slate-600 font-medium">Quick Persona Switch:</span>
			<div class="flex flex-wrap gap-2">
				{#each ['Admin', 'CaptiveStackAdministrator', 'AssociationAdministrator', 'AssociationMember', 'AdviserReviewer'] as testRole}
					{#if testRole !== data.role}
						<form method="POST" action="/login?/demoLogin" class="inline">
							<input type="hidden" name="role" value={testRole} />
							<input type="hidden" name="redirectTo" value="/portal" />
							<button
								type="submit"
								class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-[11px] transition-colors cursor-pointer border border-slate-200"
							>
								Switch to {testRole}
							</button>
						</form>
					{/if}
				{/each}
			</div>
		</div>
	</section>
	{/if}
</div>
