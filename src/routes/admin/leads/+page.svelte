<script lang="ts">
	import type { PageProps } from './$types';
	import {
		Shield,
		Users,
		Building2,
		AlertCircle,
		Clock,
		Search,
		Download,
		Filter,
		ExternalLink,
		Sparkles,
		Phone,
		Mail,
		CheckCircle2,
		XCircle,
		ChevronRight,
		FileSpreadsheet,
		RefreshCw,
		Info,
		Calendar,
		ArrowRight
	} from 'lucide-svelte';

	let { data }: PageProps = $props();

	// Reactive Filter State
	let searchTerm = $state('');
	let filterType = $state<'all' | 'association' | 'business'>('all');
	let filterIndustry = $state<string>('all');
	let filterRenewalWindow = $state<'all' | '30' | '60' | '90' | '120'>('all');
	let filterStage = $state<string>('all');
	let filterSecondOpinionOnly = $state<boolean>(false);

	// Selected lead for detail slide-over modal
	let selectedLead = $state<any>(null);

	// Client-side computed filtered leads
	let filteredLeads = $derived(
		data.leads.filter((lead) => {
			// Search filter
			if (searchTerm.trim()) {
				const term = searchTerm.toLowerCase();
				const matches =
					(lead.name && lead.name.toLowerCase().includes(term)) ||
					(lead.email && lead.email.toLowerCase().includes(term)) ||
					(lead.companyName && lead.companyName.toLowerCase().includes(term)) ||
					(lead.associationName && lead.associationName.toLowerCase().includes(term)) ||
					(lead.currentCarrier && lead.currentCarrier.toLowerCase().includes(term)) ||
					(lead.notes && lead.notes.toLowerCase().includes(term)) ||
					(lead.region && lead.region.toLowerCase().includes(term));
				if (!matches) return false;
			}

			// Type filter
			if (filterType !== 'all' && lead.leadType !== filterType) {
				return false;
			}

			// Industry filter
			if (filterIndustry !== 'all' && lead.industry !== filterIndustry) {
				return false;
			}

			// Second Opinion Only filter
			if (filterSecondOpinionOnly && !lead.secondOpinionRequested) {
				return false;
			}

			// Stage filter
			if (filterStage !== 'all' && lead.stage !== filterStage) {
				return false;
			}

			// Renewal window filter
			if (filterRenewalWindow !== 'all') {
				const days = lead.daysUntilRenewal;
				if (days === null || days === undefined) return false;
				const maxDays = parseInt(filterRenewalWindow, 10);
				if (days < 0 || days > maxDays) return false;
			}

			return true;
		})
	);

	function resetFilters() {
		searchTerm = '';
		filterType = 'all';
		filterIndustry = 'all';
		filterRenewalWindow = 'all';
		filterStage = 'all';
		filterSecondOpinionOnly = false;
	}

	// CSV Export Generator
	function exportToCsv() {
		const headers = [
			'Lead ID',
			'Type',
			'Contact Name',
			'Email',
			'Phone',
			'Company Name',
			'Association Name',
			'Industry',
			'Members / Size',
			'Annual Premium Band',
			'Lines of Coverage',
			'Loss History',
			'Renewal Date',
			'Days Until Renewal',
			'Readiness Score',
			'Funnel Stage',
			'Second Opinion (Ocean Falls)',
			'Current Carrier',
			'Status',
			'Created At',
			'Notes',
			'UTM Source'
		];

		const rows = filteredLeads.map((l) => [
			l.id,
			l.leadType,
			`"${(l.name || '').replace(/"/g, '""')}"`,
			`"${(l.email || '').replace(/"/g, '""')}"`,
			`"${(l.phone || '').replace(/"/g, '""')}"`,
			`"${(l.companyName || '').replace(/"/g, '""')}"`,
			`"${(l.associationName || '').replace(/"/g, '""')}"`,
			`"${(l.industry || '').replace(/"/g, '""')}"`,
			l.size || l.memberCount || 0,
			`"${(l.annualPremiumSize || '').replace(/"/g, '""')}"`,
			`"${(l.lineOfCoverage || '').replace(/"/g, '""')}"`,
			`"${(l.lossHistory || '').replace(/"/g, '""')}"`,
			l.renewalDate || '',
			l.daysUntilRenewal !== null ? l.daysUntilRenewal : '',
			l.score || 0,
			l.stage,
			l.secondOpinionRequested ? 'YES' : 'NO',
			`"${(l.currentCarrier || '').replace(/"/g, '""')}"`,
			l.status,
			l.createdAt,
			`"${(l.notes || '').replace(/"/g, '""')}"`,
			`"${(l.sourceUtm || '').replace(/"/g, '""')}"`
		]);

		const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\r\n');
		const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.setAttribute('href', url);
		link.setAttribute(
			'download',
			`captivestack-leads-export-${new Date().toISOString().slice(0, 10)}.csv`
		);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	}

	function parseUtm(sourceUtm?: string | null) {
		if (!sourceUtm) return null;
		try {
			return JSON.parse(sourceUtm);
		} catch (e) {
			return { raw: sourceUtm };
		}
	}
</script>

<svelte:head>
	<title>Admin Leads &amp; Funnel Intelligence | CaptiveStack</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
	<!-- Page Header -->
	<header class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
		<div class="space-y-1">
			<div class="flex items-center gap-2">
				<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300">
					<Shield class="w-3.5 h-3.5 text-amber-600" />
					<span>Admin Portal</span>
				</span>
				{#if data.isUsingSampleFallback}
					<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
						<Info class="w-3 h-3" />
						<span>Sample Preview Data Active</span>
					</span>
				{/if}
			</div>
			<h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
				Lead Intelligence &amp; Funnel Oversight
			</h1>
			<p class="text-xs sm:text-sm text-slate-600">
				Monitor association group captive opportunities, member prospect cohorts, and commercial renewals tagged for Ocean Falls Insurance.
			</p>
		</div>

		<div class="flex items-center gap-2.5 shrink-0">
			<button
				type="button"
				onclick={exportToCsv}
				class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-2xs transition-all cursor-pointer"
			>
				<Download class="w-4 h-4 text-slate-500" />
				<span>Export Filtered CSV ({filteredLeads.length})</span>
			</button>

			<a
				href="/admin/leads"
				class="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-2xs transition-colors"
				title="Refresh data"
			>
				<RefreshCw class="w-3.5 h-3.5" />
				<span>Refresh</span>
			</a>
		</div>
	</header>

	<!-- KPI Summary Metrics Grid -->
	<div class="grid grid-cols-2 lg:grid-cols-6 gap-4">
		<!-- Total Leads -->
		<div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
			<span class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total Leads</span>
			<div class="flex items-baseline justify-between">
				<span class="text-2xl sm:text-3xl font-extrabold text-slate-900">{data.metrics.totalLeads}</span>
				<Users class="w-4 h-4 text-blue-600" />
			</div>
			<span class="text-[10px] text-slate-400 block">All recorded prospects</span>
		</div>

		<!-- Association Track -->
		<div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
			<span class="text-[11px] font-bold text-blue-700 uppercase tracking-wider block">Associations</span>
			<div class="flex items-baseline justify-between">
				<span class="text-2xl sm:text-3xl font-extrabold text-blue-900">{data.metrics.associationLeads}</span>
				<Building2 class="w-4 h-4 text-blue-600" />
			</div>
			<span class="text-[10px] text-slate-500 block">High-leverage groups</span>
		</div>

		<!-- Business Owner Track -->
		<div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
			<span class="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">Businesses</span>
			<div class="flex items-baseline justify-between">
				<span class="text-2xl sm:text-3xl font-extrabold text-slate-900">{data.metrics.businessLeads}</span>
				<Users class="w-4 h-4 text-slate-500" />
			</div>
			<span class="text-[10px] text-slate-500 block">Mid-market operators</span>
		</div>

		<!-- Second Opinions (Ocean Falls) -->
		<div class="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 shadow-2xs space-y-2">
			<span class="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">Ocean Falls P&amp;C</span>
			<div class="flex items-baseline justify-between">
				<span class="text-2xl sm:text-3xl font-extrabold text-emerald-700">{data.metrics.secondOpinions}</span>
				<Sparkles class="w-4 h-4 text-emerald-600" />
			</div>
			<span class="text-[10px] text-emerald-700 font-medium block">Second opinion requests</span>
		</div>

		<!-- Urgent Renewals (<= 30 Days) -->
		<div class="p-5 rounded-2xl bg-rose-50/70 border border-rose-200 shadow-2xs space-y-2">
			<span class="text-[11px] font-bold text-rose-800 uppercase tracking-wider block">Renewals &le; 30d</span>
			<div class="flex items-baseline justify-between">
				<span class="text-2xl sm:text-3xl font-extrabold text-rose-700">{data.metrics.renewals30}</span>
				<AlertCircle class="w-4 h-4 text-rose-600" />
			</div>
			<span class="text-[10px] text-rose-700 font-medium block">Immediate action required</span>
		</div>

		<!-- Average Readiness Score -->
		<div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
			<span class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Avg Readiness</span>
			<div class="flex items-baseline justify-between">
				<span class="text-2xl sm:text-3xl font-extrabold text-indigo-700">{data.metrics.avgScore}<span class="text-sm text-slate-400 font-normal">/100</span></span>
				<Shield class="w-4 h-4 text-indigo-600" />
			</div>
			<span class="text-[10px] text-slate-500 block">Group viability index</span>
		</div>
	</div>

	<!-- Funnel Stage Drop-Off Overview -->
	<div class="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-2">
				<Filter class="w-4 h-4 text-blue-600" />
				<h3 class="font-bold text-sm text-slate-900 uppercase tracking-wider">
					Conversion Funnel Drop-off Analysis
				</h3>
			</div>
			<span class="text-xs text-slate-500">Live Stage Progression</span>
		</div>

		<div class="grid grid-cols-2 sm:grid-cols-6 gap-3 pt-2">
			<div class="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1">
				<span class="text-[10px] text-slate-500 uppercase font-bold block">1. Quiz Started</span>
				<span class="text-lg font-extrabold text-slate-900">{data.metrics.stageCounts.QuizStarted}</span>
			</div>
			<div class="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1">
				<span class="text-[10px] text-slate-500 uppercase font-bold block">2. In-Progress</span>
				<span class="text-lg font-extrabold text-slate-900">{data.metrics.stageCounts.Partial}</span>
			</div>
			<div class="p-3 rounded-xl bg-blue-50 border border-blue-200 text-center space-y-1">
				<span class="text-[10px] text-blue-700 uppercase font-bold block">3. Score Computed</span>
				<span class="text-lg font-extrabold text-blue-800">{data.metrics.stageCounts.ScoreGenerated}</span>
			</div>
			<div class="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-center space-y-1">
				<span class="text-[10px] text-indigo-700 uppercase font-bold block">4. Gated Lead Unlocked</span>
				<span class="text-lg font-extrabold text-indigo-800">{data.metrics.stageCounts.ReportGated}</span>
			</div>
			<div class="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-1">
				<span class="text-[10px] text-emerald-700 uppercase font-bold block">5. Second Opinion</span>
				<span class="text-lg font-extrabold text-emerald-800">{data.metrics.stageCounts.SecondOpinionRequested}</span>
			</div>
			<div class="p-3 rounded-xl bg-amber-50 border border-amber-200 text-center space-y-1">
				<span class="text-[10px] text-amber-700 uppercase font-bold block">6. Review Booked</span>
				<span class="text-lg font-extrabold text-amber-800">{data.metrics.stageCounts.ReviewBooked}</span>
			</div>
		</div>
	</div>

	<!-- Interactive Filter Toolbar -->
	<div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
			<!-- Search Bar -->
			<div class="lg:col-span-2 relative">
				<Search class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
				<input
					type="text"
					bind:value={searchTerm}
					placeholder="Search company, association, name, carrier..."
					class="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
				/>
			</div>

			<!-- Lead Type Filter -->
			<div>
				<select
					bind:value={filterType}
					class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
				>
					<option value="all">All Types</option>
					<option value="association">Associations Only</option>
					<option value="business">Businesses Only</option>
				</select>
			</div>

			<!-- Industry Filter -->
			<div>
				<select
					bind:value={filterIndustry}
					class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
				>
					<option value="all">All Industries</option>
					<option value="contractors">Contractors</option>
					<option value="transportation">Transportation</option>
					<option value="healthcare">Healthcare</option>
					<option value="it-services">IT &amp; MSPs</option>
					<option value="hospitality">Hospitality</option>
					<option value="property-managers">Property Managers</option>
				</select>
			</div>

			<!-- Renewal Window Filter -->
			<div>
				<select
					bind:value={filterRenewalWindow}
					class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
				>
					<option value="all">All Renewal Dates</option>
					<option value="30">&le; 30 Days (Urgent)</option>
					<option value="60">&le; 60 Days</option>
					<option value="90">&le; 90 Days</option>
					<option value="120">&le; 120 Days</option>
				</select>
			</div>

			<!-- Stage Filter -->
			<div>
				<select
					bind:value={filterStage}
					class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
				>
					<option value="all">All Funnel Stages</option>
					<option value="ReportGated">Report Gated (Full Lead)</option>
					<option value="SecondOpinionRequested">Second Opinion Requested</option>
					<option value="ScoreGenerated">Score Generated</option>
					<option value="Partial">Partial / In-Progress</option>
					<option value="QuizStarted">Quiz Started</option>
				</select>
			</div>
		</div>

		<div class="flex items-center justify-between pt-1 text-xs border-t border-slate-100">
			<label class="inline-flex items-center gap-2 cursor-pointer select-none">
				<input
					type="checkbox"
					bind:checked={filterSecondOpinionOnly}
					class="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
				/>
				<span class="text-slate-700 font-semibold">Show only Ocean Falls Second Opinion requests</span>
			</label>

			<div class="flex items-center gap-3">
				<span class="text-slate-500">
					Showing <strong>{filteredLeads.length}</strong> of {data.leads.length} leads
				</span>
				{#if searchTerm || filterType !== 'all' || filterIndustry !== 'all' || filterRenewalWindow !== 'all' || filterStage !== 'all' || filterSecondOpinionOnly}
					<button
						type="button"
						onclick={resetFilters}
						class="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer underline"
					>
						Clear Filters
					</button>
				{/if}
			</div>
		</div>
	</div>

	<!-- Leads Data Table -->
	<div class="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden">
		{#if filteredLeads.length === 0}
			<div class="p-12 text-center space-y-3">
				<AlertCircle class="w-8 h-8 text-slate-400 mx-auto" />
				<h4 class="font-bold text-slate-700 text-sm">No leads match the selected filters</h4>
				<p class="text-xs text-slate-500 max-w-sm mx-auto">
					Try clearing your search term or adjusting the renewal window and industry filters.
				</p>
				<button
					type="button"
					onclick={resetFilters}
					class="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
				>
					Reset All Filters
				</button>
			</div>
		{:else}
			<div class="overflow-x-auto">
				<table class="w-full text-left border-collapse text-xs">
					<thead>
						<tr class="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
							<th class="py-3.5 px-4">Type &amp; Score</th>
							<th class="py-3.5 px-4">Contact &amp; Organization</th>
							<th class="py-3.5 px-4">Industry &amp; Scale</th>
							<th class="py-3.5 px-4">Premium &amp; Lines</th>
							<th class="py-3.5 px-4">Renewal Date</th>
							<th class="py-3.5 px-4">Funnel / Tags</th>
							<th class="py-3.5 px-4">Status</th>
							<th class="py-3.5 px-4 text-right">Actions</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-slate-100 text-slate-700">
						{#each filteredLeads as lead}
							<tr class="hover:bg-slate-50/80 transition-colors">
								<!-- Type & Score -->
								<td class="py-4 px-4 whitespace-nowrap">
									<div class="flex items-center gap-2">
										<span
											class="w-8 h-8 rounded-lg flex items-center justify-center font-extrabold text-xs {lead.score >= 80 ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : lead.score >= 60 ? 'bg-blue-100 text-blue-800 border border-blue-300' : 'bg-slate-100 text-slate-800 border border-slate-300'}"
											title="Readiness Score: {lead.score}/100"
										>
											{lead.score || 0}
										</span>
										<div>
											<span class="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider {lead.leadType === 'association' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-purple-50 text-purple-700 border border-purple-200'}">
												{lead.leadType}
											</span>
										</div>
									</div>
								</td>

								<!-- Contact & Org -->
								<td class="py-4 px-4">
									<div class="space-y-0.5">
										<div class="font-bold text-slate-900 text-xs">
											{lead.companyName || lead.associationName || 'Unknown Entity'}
										</div>
										<div class="text-slate-500 text-[11px] flex items-center gap-2">
											<span>{lead.name || 'Anonymous Prospect'}</span>
											{#if lead.email}
												<span class="text-slate-300">•</span>
												<a href="mailto:{lead.email}" class="text-blue-600 hover:underline">{lead.email}</a>
											{/if}
										</div>
										{#if lead.region}
											<div class="text-[10px] text-slate-400">{lead.region}</div>
										{/if}
									</div>
								</td>

								<!-- Industry & Scale -->
								<td class="py-4 px-4 whitespace-nowrap">
									<div class="space-y-0.5">
										<span class="font-semibold text-slate-800 capitalize">
											{(lead.industry || 'general').replace(/-/g, ' ')}
										</span>
										<div class="text-[11px] text-slate-500">
											{#if lead.leadType === 'association'}
												{lead.memberCount || lead.size || 'N/A'} member orgs
											{:else}
												{lead.size || 'N/A'} employees
											{/if}
										</div>
									</div>
								</td>

								<!-- Premium & Lines -->
								<td class="py-4 px-4 max-w-xs">
									<div class="space-y-0.5">
										<div class="font-semibold text-slate-900">
											{lead.annualPremiumSize || 'Illustrative'}
										</div>
										<div class="text-[11px] text-slate-500 truncate" title={lead.lineOfCoverage}>
											{lead.lineOfCoverage || 'General Lines'}
										</div>
									</div>
								</td>

								<!-- Renewal Date & Countdown -->
								<td class="py-4 px-4 whitespace-nowrap">
									{#if lead.renewalDate}
										<div class="space-y-1">
											<div class="font-mono text-xs font-semibold text-slate-900">
												{lead.renewalDate}
											</div>
											{#if lead.daysUntilRenewal !== null && lead.daysUntilRenewal !== undefined}
												{#if lead.daysUntilRenewal <= 30 && lead.daysUntilRenewal >= 0}
													<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
														<Clock class="w-3 h-3 text-rose-600" />
														<span>{lead.daysUntilRenewal}d remaining</span>
													</span>
												{:else if lead.daysUntilRenewal <= 60 && lead.daysUntilRenewal >= 0}
													<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
														<Clock class="w-3 h-3 text-amber-600" />
														<span>{lead.daysUntilRenewal}d remaining</span>
													</span>
												{:else if lead.daysUntilRenewal <= 120 && lead.daysUntilRenewal >= 0}
													<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
														<span>{lead.daysUntilRenewal}d</span>
													</span>
												{:else if lead.daysUntilRenewal < 0}
													<span class="text-[10px] text-slate-400">Past renewal</span>
												{:else}
													<span class="text-[10px] text-slate-500">{lead.daysUntilRenewal}d</span>
												{/if}
											{/if}
										</div>
									{:else}
										<span class="text-slate-400 text-[11px]">Unspecified</span>
									{/if}
								</td>

								<!-- Funnel / Tags -->
								<td class="py-4 px-4 whitespace-nowrap">
									<div class="space-y-1">
										<span class="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
											{lead.stage}
										</span>
										{#if lead.secondOpinionRequested}
											<div class="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
												<Sparkles class="w-3 h-3 text-emerald-600" />
												<span>Ocean Falls P&amp;C</span>
											</div>
										{/if}
									</div>
								</td>

								<!-- Status -->
								<td class="py-4 px-4 whitespace-nowrap">
									<form method="POST" action="?/updateStatus" class="inline-block">
										<input type="hidden" name="leadId" value={lead.id} />
										<select
											name="status"
											value={lead.status}
											onchange={(e) => e.currentTarget.form?.requestSubmit()}
											class="px-2 py-1 bg-white border border-slate-300 rounded-lg text-[11px] font-medium text-slate-800 cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500"
										>
											<option value="New">New</option>
											<option value="Contacted">Contacted</option>
											<option value="InReview">In Review</option>
											<option value="Qualified">Qualified</option>
											<option value="Closed">Closed</option>
										</select>
									</form>
								</td>

								<!-- Actions -->
								<td class="py-4 px-4 text-right whitespace-nowrap">
									<button
										type="button"
										onclick={() => (selectedLead = lead)}
										class="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
									>
										View Details
									</button>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>
</div>

<!-- SLIDE-OVER DETAIL MODAL -->
{#if selectedLead}
	<div class="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
		<div class="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
			<!-- Header -->
			<div class="flex items-start justify-between border-b border-slate-100 pb-4">
				<div class="space-y-1">
					<div class="flex items-center gap-2">
						<span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider {selectedLead.leadType === 'association' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}">
							{selectedLead.leadType}
						</span>
						<span class="text-xs font-mono text-slate-500">ID: {selectedLead.id}</span>
					</div>
					<h3 class="text-xl font-bold text-slate-900">
						{selectedLead.companyName || selectedLead.associationName || 'Organization Details'}
					</h3>
				</div>
				<button
					type="button"
					onclick={() => (selectedLead = null)}
					class="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
				>
					<XCircle class="w-5 h-5" />
				</button>
			</div>

			<!-- Main Details Grid -->
			<div class="grid grid-cols-2 gap-4 text-xs">
				<div class="p-3.5 rounded-xl bg-slate-50 space-y-1">
					<span class="text-[10px] text-slate-500 uppercase font-bold block">Contact Person</span>
					<div class="font-bold text-slate-900 text-sm">{selectedLead.name || 'Not provided'}</div>
					{#if selectedLead.email}
						<a href="mailto:{selectedLead.email}" class="text-blue-600 hover:underline block">{selectedLead.email}</a>
					{/if}
					{#if selectedLead.phone}
						<div class="text-slate-600">{selectedLead.phone}</div>
					{/if}
				</div>

				<div class="p-3.5 rounded-xl bg-slate-50 space-y-1">
					<span class="text-[10px] text-slate-500 uppercase font-bold block">Readiness Score &amp; Stage</span>
					<div class="flex items-center gap-2">
						<span class="text-2xl font-extrabold text-blue-600">{selectedLead.score}/100</span>
						<span class="text-slate-500">({selectedLead.stage})</span>
					</div>
					<div class="text-slate-500 text-[11px]">Loss History: <strong>{selectedLead.lossHistory || 'N/A'}</strong></div>
				</div>

				<div class="p-3.5 rounded-xl bg-slate-50 space-y-1">
					<span class="text-[10px] text-slate-500 uppercase font-bold block">Scale &amp; Premium</span>
					<div class="font-bold text-slate-900">{selectedLead.annualPremiumSize || 'Illustrative'}</div>
					<div class="text-slate-500 text-[11px]">
						{selectedLead.leadType === 'association' ? `${selectedLead.memberCount || selectedLead.size || 0} member organizations` : `${selectedLead.size || 0} employees`}
					</div>
				</div>

				<div class="p-3.5 rounded-xl bg-slate-50 space-y-1">
					<span class="text-[10px] text-slate-500 uppercase font-bold block">Renewal &amp; Carrier</span>
					<div class="font-bold text-slate-900">
						{selectedLead.renewalDate || 'Unspecified'}
						{#if selectedLead.daysUntilRenewal !== null}
							<span class="text-slate-500 font-normal">({selectedLead.daysUntilRenewal}d remaining)</span>
						{/if}
					</div>
					<div class="text-slate-500 text-[11px]">Carrier: {selectedLead.currentCarrier || 'None specified'}</div>
				</div>
			</div>

			<!-- Lines of Coverage -->
			<div class="space-y-1 text-xs">
				<span class="text-[10px] text-slate-500 uppercase font-bold block">Lines of Coverage Underwritten</span>
				<div class="p-3 rounded-xl bg-slate-50 text-slate-800">
					{selectedLead.lineOfCoverage || 'No specific lines checked'}
				</div>
			</div>

			<!-- Ocean Falls Traditional P&C Section -->
			{#if selectedLead.secondOpinionRequested}
				<div class="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs space-y-2">
					<div class="flex items-center gap-2 text-emerald-900 font-bold">
						<Sparkles class="w-4 h-4 text-emerald-600" />
						<span>Ocean Falls Insurance — Second Opinion Action Required</span>
					</div>
					<p class="text-emerald-800 leading-relaxed">
						This lead requested a direct policy review on their upcoming renewal. Follow up via Ocean Falls Insurance to evaluate traditional commercial terms, market pricing, and broker spread while their group captive is evaluated.
					</p>
				</div>
			{/if}

			<!-- Notes -->
			{#if selectedLead.notes}
				<div class="space-y-1 text-xs">
					<span class="text-[10px] text-slate-500 uppercase font-bold block">Notes / Broker Friction</span>
					<div class="p-3 rounded-xl bg-slate-50 text-slate-800 whitespace-pre-wrap">
						{selectedLead.notes}
					</div>
				</div>
			{/if}

			<!-- Attribution / UTM Metadata -->
			{#if selectedLead.sourceUtm}
				{@const utmData = parseUtm(selectedLead.sourceUtm)}
				<div class="space-y-1 text-xs">
					<span class="text-[10px] text-slate-500 uppercase font-bold block">Acquisition Attribution (UTM &amp; Referrer)</span>
					<div class="p-3 rounded-xl bg-slate-100 font-mono text-[11px] text-slate-700 whitespace-pre-wrap overflow-x-auto">
						{JSON.stringify(utmData, null, 2)}
					</div>
				</div>
			{/if}

			<!-- Footer Actions -->
			<div class="flex items-center justify-between border-t border-slate-100 pt-4 text-xs">
				<span class="text-slate-400">Created: {new Date(selectedLead.createdAt).toLocaleString()}</span>
				<div class="flex items-center gap-2">
					{#if selectedLead.email}
						<a
							href="mailto:{selectedLead.email}?subject=CaptiveStack%20Feasibility%20Follow-up%20for%20{encodeURIComponent(selectedLead.companyName || selectedLead.associationName || 'Your Organization')}"
							class="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors inline-flex items-center gap-1.5"
						>
							<Mail class="w-3.5 h-3.5" />
							<span>Email Prospect</span>
						</a>
					{/if}
					<button
						type="button"
						onclick={() => (selectedLead = null)}
						class="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors"
					>
						Close
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}
