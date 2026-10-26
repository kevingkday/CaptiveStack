<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import {
		Shield,
		CheckCircle2,
		AlertCircle,
		ArrowLeft,
		ArrowRight,
		UploadCloud,
		FileSpreadsheet,
		FileText,
		Check,
		Lock,
		Building2,
		DollarSign,
		Percent,
		Scale,
		Landmark,
		BadgeCheck,
		Clock,
		ExternalLink,
		FileCheck,
		Trash2,
		Share2,
		Copy
	} from 'lucide-svelte';
	import {
		getDefaultSurveyPayload,
		type LossRunDocumentItem,
		type MemberSurveyPayload
	} from '$lib/survey/types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	// Active wizard step (1-11)
	let activeStep = $state(1);
	let payload = $state<MemberSurveyPayload>(getDefaultSurveyPayload());
	let isCertified = $state(false);

	$effect(() => {
		if (data?.survey) {
			activeStep = Math.min(11, data.survey.stepCompleted || 1);
			isCertified = data.survey.isCertified;
		}
		if (data?.payload) {
			payload = data.payload;
		}
	});
	let saving = $state(false);
	let uploadLoading = $state(false);
	let uploadSuccess = $state<string | null>(null);
	let uploadError = $state<string | null>(null);
	let copiedLink = $state(false);

	// Calculated Loss Ratio preview
	let lossRatio = $derived(
		payload.currentAnnualPremium > 0
			? (payload.fiveYearTotalIncurredLosses / (payload.currentAnnualPremium * 5)) * 100
			: 0
	);

	function formatCurrency(val: number) {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			maximumFractionDigits: 0
		}).format(val || 0);
	}

	function goToStep(stepNum: number) {
		if (stepNum <= Math.max(activeStep, data.survey.stepCompleted) || isCertified) {
			activeStep = stepNum;
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}

	function copyIntakeLink() {
		navigator.clipboard.writeText(window.location.href);
		copiedLink = true;
		setTimeout(() => {
			copiedLink = false;
		}, 2000);
	}

	// Direct Presigned Upload to Cloudflare R2
	async function handleFileUpload(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (!file) return;

		uploadLoading = true;
		uploadSuccess = null;
		uploadError = null;

		try {
			// 1. Get presigned upload URL from edge API
			const presignedRes = await fetch('/api/documents/presigned-url', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					parentEntityType: 'MemberSurvey',
					parentId: data.survey.id,
					fileName: file.name,
					fileType: file.type || 'application/octet-stream',
					fileSize: file.size
				})
			});

			if (!presignedRes.ok) {
				throw new Error('Failed to obtain presigned upload destination');
			}

			const presignedData = await presignedRes.json();

			// 2. Upload file directly to Cloudflare R2 storage (zero local disk)
			const uploadRes = await fetch(presignedData.uploadUrl, {
				method: 'PUT',
				headers: {
					'Content-Type': file.type || 'application/octet-stream'
				},
				body: file
			});

			if (!uploadRes.ok) {
				throw new Error('Failed to stream document to Cloudflare R2');
			}

			// 3. Add to local document records list
			const newDoc: LossRunDocumentItem = {
				documentId: presignedData.documentId,
				fileName: file.name,
				blobKey: presignedData.blobKey,
				fileSize: file.size,
				fileType: file.type || 'application/octet-stream',
				uploadedAt: new Date().toISOString(),
				status: 'Verified',
				downloadUrl: presignedData.downloadUrl
			};

			payload.lossRunDocuments = [...(payload.lossRunDocuments || []), newDoc];
			uploadSuccess = `File "${file.name}" uploaded and verified in Cloudflare R2.`;
			target.value = '';
		} catch (err: any) {
			console.error('[Upload Error]', err);
			uploadError = err.message || 'Upload failed';
		} finally {
			uploadLoading = false;
		}
	}
</script>

<svelte:head>
	<title>Member Risk Intake (Step {activeStep} of 11) | {data.project?.name || 'CaptiveStack'}</title>
</svelte:head>

<div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
	<!-- Program & Association Ribbon Header -->
	<div class="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/95 to-brand-950/30 border border-slate-800 p-6 shadow-xl">
		<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
			<div class="space-y-1">
				<div class="flex items-center space-x-2">
					<span class="text-xs font-semibold uppercase tracking-wider text-brand-400">
						{data.association?.name}
					</span>
					<span class="text-slate-600">&bull;</span>
					<span class="text-xs font-mono text-emerald-400">
						Stage: {data.project?.stage}
					</span>
				</div>
				<h1 class="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
					{data.project?.name}
				</h1>
				<p class="text-xs text-slate-400 font-mono">
					Survey Intake Token: <strong class="text-slate-200">{data.survey.token}</strong>
				</p>
			</div>

			<div class="flex items-center space-x-2 shrink-0">
				<button
					type="button"
					onclick={copyIntakeLink}
					class="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/60 transition-colors"
				>
					{#if copiedLink}
						<Check class="w-3.5 h-3.5 text-emerald-400" />
						<span class="text-emerald-400 font-bold">Link Copied</span>
					{:else}
						<Share2 class="w-3.5 h-3.5" />
						<span>Share Intake Link</span>
					{/if}
				</button>

				{#if isCertified}
					<span class="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
						<BadgeCheck class="w-4 h-4 text-emerald-400" />
						<span>Certified &amp; Locked</span>
					</span>
				{:else}
					<span class="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30">
						<Clock class="w-3.5 h-3.5 text-amber-400" />
						<span>Intake In Progress</span>
					</span>
				{/if}
			</div>
		</div>

		<!-- Progress Bar -->
		<div class="mt-6 space-y-2">
			<div class="flex items-center justify-between text-xs">
				<span class="text-slate-400">
					Step <strong class="text-white">{activeStep}</strong> of 11:
					<span class="text-brand-300 font-medium">{data.steps[activeStep - 1]?.title}</span>
				</span>
				<span class="font-mono text-emerald-400 font-bold">
					{Math.round((activeStep / 11) * 100)}% Completed
				</span>
			</div>
			<div class="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
				<div
					class="h-full bg-gradient-to-r from-brand-500 via-indigo-500 to-emerald-400 rounded-full transition-all duration-300"
					style="width: {(activeStep / 11) * 100}%"
				></div>
			</div>
		</div>
	</div>

	<!-- Step Navigation Pill Strip -->
	<div class="overflow-x-auto pb-2">
		<nav class="flex items-center space-x-1.5 min-w-max text-xs" aria-label="Survey Steps">
			{#each data.steps as s}
				{@const isCurrent = s.stepNumber === activeStep}
				{@const isCompleted = s.stepNumber < activeStep || (data.survey.stepCompleted >= s.stepNumber)}
				<button
					type="button"
					onclick={() => goToStep(s.stepNumber)}
					class="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border transition-all text-left {isCurrent
						? 'bg-brand-600 text-white font-bold border-brand-500 shadow-md shadow-brand-500/20'
						: isCompleted
							? 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700'
							: 'bg-slate-950/40 text-slate-600 border-slate-900 cursor-not-allowed'}"
				>
					<span class="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-mono {isCurrent ? 'bg-white text-brand-600 font-bold' : isCompleted ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}">
						{#if isCompleted && !isCurrent}
							<Check class="w-2.5 h-2.5" />
						{:else}
							{s.stepNumber}
						{/if}
					</span>
					<span>{s.shortTitle}</span>
				</button>
			{/each}
		</nav>
	</div>

	<!-- Step Content Container -->
	<div class="rounded-2xl bg-slate-900/70 border border-slate-800 p-6 sm:p-8 shadow-2xl backdrop-blur-sm space-y-6">
		<div class="border-b border-slate-800/80 pb-4">
			<span class="text-xs font-semibold uppercase tracking-wider text-brand-400">
				{data.steps[activeStep - 1]?.category}
			</span>
			<h2 class="text-xl sm:text-2xl font-bold text-white mt-0.5">
				{data.steps[activeStep - 1]?.title}
			</h2>
			<p class="text-xs sm:text-sm text-slate-400 mt-1">
				{data.steps[activeStep - 1]?.description}
			</p>
		</div>

		<!-- ========================================================== -->
		<!-- STEP 1: ORGANIZATION & ENTITY PROFILE                      -->
		<!-- ========================================================== -->
		{#if activeStep === 1}
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
				<div class="space-y-1.5">
					<label for="orgName" class="block font-semibold text-slate-300">Legal Business Name</label>
					<input
						id="orgName"
						type="text"
						bind:value={payload.organizationName}
						class="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
					/>
				</div>

				<div class="space-y-1.5">
					<label for="dba" class="block font-semibold text-slate-300">Doing Business As (DBA)</label>
					<input
						id="dba"
						type="text"
						bind:value={payload.dba}
						class="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
					/>
				</div>

				<div class="space-y-1.5">
					<label for="fein" class="block font-semibold text-slate-300">Federal Tax ID (FEIN)</label>
					<input
						id="fein"
						type="text"
						bind:value={payload.fein}
						class="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
					/>
				</div>

				<div class="space-y-1.5">
					<label for="entityType" class="block font-semibold text-slate-300">Entity Structure</label>
					<select
						id="entityType"
						bind:value={payload.entityType}
						class="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
					>
						<option value="Limited Liability Company (LLC)">Limited Liability Company (LLC)</option>
						<option value="S-Corporation">S-Corporation</option>
						<option value="C-Corporation">C-Corporation</option>
						<option value="Partnership">Partnership</option>
					</select>
				</div>

				<div class="space-y-1.5">
					<label for="stateInc" class="block font-semibold text-slate-300">State of Domicile</label>
					<input
						id="stateInc"
						type="text"
						bind:value={payload.stateOfIncorporation}
						class="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
					/>
				</div>

				<div class="space-y-1.5">
					<label for="contactName" class="block font-semibold text-slate-300">Authorized Contact</label>
					<input
						id="contactName"
						type="text"
						bind:value={payload.contactName}
						class="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
					/>
				</div>

				<div class="space-y-1.5">
					<label for="contactEmail" class="block font-semibold text-slate-300">Contact Email</label>
					<input
						id="contactEmail"
						type="email"
						bind:value={payload.contactEmail}
						class="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
					/>
				</div>

				<div class="space-y-1.5">
					<label for="contactPhone" class="block font-semibold text-slate-300">Contact Phone</label>
					<input
						id="contactPhone"
						type="text"
						bind:value={payload.contactPhone}
						class="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
					/>
				</div>
			</div>

		<!-- ========================================================== -->
		<!-- STEP 2: OPERATIONS & PROGRAM SCOPE                         -->
		<!-- ========================================================== -->
		{:else if activeStep === 2}
			<div class="space-y-4 text-xs">
				<div class="space-y-1.5">
					<label for="specialization" class="block font-semibold text-slate-300">Industry Program Specialization</label>
					<select
						id="specialization"
						bind:value={payload.industrySpecialization}
						class="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-sm"
					>
						<option value="Automotive Glass Replacement">Automotive Glass Replacement (GlassCo Pool)</option>
						<option value="Golf Prize Indemnity">Golf Prize Indemnity (Eagle1 Captive)</option>
						<option value="Commercial Specialty ART">Commercial Specialty Alternative Risk Transfer</option>
					</select>
				</div>

				<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
					<div class="space-y-1.5">
						<label for="revenue" class="block font-semibold text-slate-300">Annual Gross Revenue ($)</label>
						<input
							id="revenue"
							type="number"
							bind:value={payload.annualRevenue}
							class="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
						/>
					</div>
					<div class="space-y-1.5">
						<label for="years" class="block font-semibold text-slate-300">Years in Business</label>
						<input
							id="years"
							type="number"
							bind:value={payload.yearsInBusiness}
							class="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
						/>
					</div>
					<div class="space-y-1.5">
						<label for="employees" class="block font-semibold text-slate-300">Full-Time Employees</label>
						<input
							id="employees"
							type="number"
							bind:value={payload.fullTimeEmployees}
							class="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
						/>
					</div>
				</div>

				<div class="space-y-1.5">
					<label for="activities" class="block font-semibold text-slate-300">Description of Primary Commercial Activities</label>
					<textarea
						id="activities"
						rows="3"
						bind:value={payload.primaryActivities}
						class="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs leading-relaxed"
					></textarea>
				</div>
			</div>

		<!-- ========================================================== -->
		<!-- STEP 3: CURRENT COMMERCIAL COVERAGE                        -->
		<!-- ========================================================== -->
		{:else if activeStep === 3}
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
				<div class="space-y-1.5">
					<label for="carrier" class="block font-semibold text-slate-300">Current Primary Carrier</label>
					<input
						id="carrier"
						type="text"
						bind:value={payload.currentCarrier}
						class="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
					/>
				</div>
				<div class="space-y-1.5">
					<label for="premium" class="block font-semibold text-slate-300">Current Annual Commercial Premium ($)</label>
					<input
						id="premium"
						type="number"
						bind:value={payload.currentAnnualPremium}
						class="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
					/>
				</div>
				<div class="space-y-1.5">
					<label for="expDate" class="block font-semibold text-slate-300">Policy Expiration Date</label>
					<input
						id="expDate"
						type="date"
						bind:value={payload.policyExpirationDate}
						class="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
					/>
				</div>
				<div class="space-y-1.5">
					<label for="deductible" class="block font-semibold text-slate-300">Current Per-Occurrence Deductible ($)</label>
					<input
						id="deductible"
						type="number"
						bind:value={payload.currentPerOccurrenceDeductible}
						class="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
					/>
				</div>
			</div>

		<!-- ========================================================== -->
		<!-- STEP 4: HISTORICAL EXPOSURE METRICS                        -->
		<!-- ========================================================== -->
		{:else if activeStep === 4}
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
				<div class="space-y-1.5">
					<label for="vol" class="block font-semibold text-slate-300">Annual Exposure Volume (Events / Replacements)</label>
					<input
						id="vol"
						type="number"
						bind:value={payload.annualExposureVolume}
						class="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
					/>
					<p class="text-[11px] text-slate-500">e.g. 42 tournaments or 3,400 windshield repairs annually.</p>
				</div>
				<div class="space-y-1.5">
					<label for="val" class="block font-semibold text-slate-300">Average Insured Exposure Unit Value ($)</label>
					<input
						id="val"
						type="number"
						bind:value={payload.averageInsuredExposureValue}
						class="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
					/>
					<p class="text-[11px] text-slate-500">e.g. $35,000 hole-in-one prize or $620 windshield replacement.</p>
				</div>
				<div class="space-y-1.5">
					<label for="fleet" class="block font-semibold text-slate-300">Commercial Service Vehicles Fleet</label>
					<input
						id="fleet"
						type="number"
						bind:value={payload.serviceVehiclesCount}
						class="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
					/>
				</div>
				<div class="space-y-1.5">
					<label for="staff" class="block font-semibold text-slate-300">Certified Staff Compliance (%)</label>
					<input
						id="staff"
						type="number"
						min="0"
						max="100"
						bind:value={payload.certifiedStaffPercentage}
						class="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
					/>
				</div>
			</div>

		<!-- ========================================================== -->
		<!-- STEP 5: 5-YEAR LOSS HISTORY & CLAIMS                       -->
		<!-- ========================================================== -->
		{:else if activeStep === 5}
			<div class="space-y-4 text-xs">
				<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
					<div class="space-y-1.5">
						<label for="claimsCount" class="block font-semibold text-slate-300">5-Year Total Claims Count</label>
						<input
							id="claimsCount"
							type="number"
							bind:value={payload.fiveYearTotalClaimsCount}
							class="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
						/>
					</div>
					<div class="space-y-1.5">
						<label for="incurred" class="block font-semibold text-slate-300">5-Year Total Incurred Losses ($)</label>
						<input
							id="incurred"
							type="number"
							bind:value={payload.fiveYearTotalIncurredLosses}
							class="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
						/>
					</div>
					<div class="space-y-1.5">
						<label for="largest" class="block font-semibold text-slate-300">Largest Single Claim Amount ($)</label>
						<input
							id="largest"
							type="number"
							bind:value={payload.largestSingleClaimAmount}
							class="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
						/>
					</div>
				</div>

				<!-- Live Actuarial Loss Ratio Preview Card -->
				<div class="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
					<div>
						<span class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
							Computed 5-Year Loss Ratio
						</span>
						<p class="text-xs text-slate-300 mt-0.5">
							Total Losses ({formatCurrency(payload.fiveYearTotalIncurredLosses)}) / 5-Year Premium ({formatCurrency(payload.currentAnnualPremium * 5)})
						</p>
					</div>
					<div class="text-right">
						<span class="text-2xl font-bold font-mono {lossRatio < 50 ? 'text-emerald-400' : lossRatio < 70 ? 'text-brand-300' : 'text-amber-400'}">
							{lossRatio.toFixed(1)}%
						</span>
						<span class="text-[10px] text-slate-400 block font-mono">
							{lossRatio < 55 ? 'Excellent Captive Candidate' : 'Standard Quota Range'}
						</span>
					</div>
				</div>
			</div>

		<!-- ========================================================== -->
		<!-- STEP 6: LOSS RUN DOCUMENT UPLOAD (R2 PRESIGNED STORAGE)    -->
		<!-- ========================================================== -->
		{:else if activeStep === 6}
			<div class="space-y-5 text-xs">
				<div class="p-4 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-300 space-y-1">
					<p class="font-bold flex items-center space-x-1.5">
						<Shield class="w-4 h-4 text-brand-400" />
						<span>Zero Local Disk Storage Strategy</span>
					</p>
					<p class="text-slate-300 leading-relaxed text-[11px]">
						Documents uploaded here are streamed directly to Cloudflare R2 / Azure Blob storage via presigned edge URLs. Official carrier loss runs are required for actuarial feasibility certification.
					</p>
				</div>

				<!-- Drag & Drop / File Input Zone -->
				<div class="border-2 border-dashed border-slate-800 hover:border-brand-500/60 rounded-xl p-6 text-center space-y-3 transition-colors bg-slate-950/40">
					<div class="w-12 h-12 rounded-full bg-slate-900 mx-auto flex items-center justify-center text-brand-400">
						<UploadCloud class="w-6 h-6" />
					</div>
					<div>
						<label for="docUpload" class="text-sm font-semibold text-white hover:text-brand-400 cursor-pointer">
							<span>Click to upload loss runs</span>
							<input
								id="docUpload"
								type="file"
								accept=".pdf,.xlsx,.xls,.csv"
								onchange={handleFileUpload}
								disabled={uploadLoading}
								class="sr-only"
							/>
						</label>
						<p class="text-slate-500 text-[11px] mt-0.5">
							Supported formats: PDF, Excel (XLSX/XLS), CSV up to 50MB
						</p>
					</div>

					{#if uploadLoading}
						<div class="flex items-center justify-center space-x-2 text-brand-400 font-mono">
							<span class="w-3 h-3 rounded-full border-2 border-brand-400 border-t-transparent animate-spin"></span>
							<span>Generating presigned URL &amp; streaming to Cloudflare R2...</span>
						</div>
					{/if}

					{#if uploadSuccess}
						<p class="text-emerald-400 font-medium flex items-center justify-center space-x-1">
							<CheckCircle2 class="w-4 h-4" />
							<span>{uploadSuccess}</span>
						</p>
					{/if}

					{#if uploadError}
						<p class="text-rose-400 font-medium flex items-center justify-center space-x-1">
							<AlertCircle class="w-4 h-4" />
							<span>{uploadError}</span>
						</p>
					{/if}
				</div>

				<!-- Uploaded Loss Runs Table -->
				<div class="space-y-2">
					<span class="font-bold text-white block">Verified Loss Run Records</span>
					{#if payload.lossRunDocuments && payload.lossRunDocuments.length > 0}
						<div class="divide-y divide-slate-800 rounded-xl border border-slate-800 bg-slate-950/60 overflow-hidden">
							{#each payload.lossRunDocuments as doc}
								<div class="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-900/40 transition-colors">
									<div class="flex items-center space-x-3">
										<div class="p-2 rounded-lg bg-slate-900 text-emerald-400">
											<FileSpreadsheet class="w-4 h-4" />
										</div>
										<div class="space-y-0.5">
											<p class="font-semibold text-white text-xs">{doc.fileName}</p>
											<p class="text-[11px] text-slate-500 font-mono">
												Key: {doc.blobKey} &bull; {(doc.fileSize / 1024).toFixed(0)} KB
											</p>
										</div>
									</div>
									<div class="flex items-center space-x-2">
										<span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
											{doc.status}
										</span>
									</div>
								</div>
							{/each}
						</div>
					{:else}
						<p class="text-slate-500 italic">No loss runs uploaded yet.</p>
					{/if}
				</div>
			</div>

		<!-- ========================================================== -->
		<!-- STEP 7: RISK MITIGATION & PROTOCOLS                        -->
		<!-- ========================================================== -->
		{:else if activeStep === 7}
			<div class="space-y-4 text-xs">
				<div class="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
					<label class="flex items-start space-x-3 cursor-pointer">
						<input
							type="checkbox"
							bind:checked={payload.formalSafetyProtocolsCertified}
							class="mt-1 w-4 h-4 rounded bg-slate-900 border-slate-700 text-brand-600 focus:ring-brand-500"
						/>
						<div class="space-y-0.5">
							<span class="font-bold text-white block">Formal Written Safety Protocols</span>
							<p class="text-slate-400 text-[11px]">
								Member maintains written risk guidelines, equipment certifications, and safety checklists.
							</p>
						</div>
					</label>

					<label class="flex items-start space-x-3 cursor-pointer">
						<input
							type="checkbox"
							bind:checked={payload.adasCalibrationStandardsCompliant}
							class="mt-1 w-4 h-4 rounded bg-slate-900 border-slate-700 text-brand-600 focus:ring-brand-500"
						/>
						<div class="space-y-0.5">
							<span class="font-bold text-white block">ADAS &amp; Technical Calibration Standards</span>
							<p class="text-slate-400 text-[11px]">
								For auto glass contractors: 100% recalibration compliance on forward-facing camera and radar systems.
							</p>
						</div>
					</label>

					<label class="flex items-start space-x-3 cursor-pointer">
						<input
							type="checkbox"
							bind:checked={payload.independentWitnessProtocolEnforced}
							class="mt-1 w-4 h-4 rounded bg-slate-900 border-slate-700 text-brand-600 focus:ring-brand-500"
						/>
						<div class="space-y-0.5">
							<span class="font-bold text-white block">Independent Prize Witness Protocol</span>
							<p class="text-slate-400 text-[11px]">
								For sports &amp; hole-in-one tournaments: Dual-witness attestation and continuous video recording.
							</p>
						</div>
					</label>
				</div>

				<div class="space-y-1.5">
					<label for="fraud" class="block font-semibold text-slate-300">Fraud Mitigation Plan Details</label>
					<textarea
						id="fraud"
						rows="3"
						bind:value={payload.fraudMitigationPlanDetails}
						class="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs leading-relaxed"
					></textarea>
				</div>
			</div>

		<!-- ========================================================== -->
		<!-- STEP 8: RETENTION APPETITE                                 -->
		<!-- ========================================================== -->
		{:else if activeStep === 8}
			<div class="space-y-4 text-xs">
				<div class="space-y-2">
					<span class="font-semibold text-slate-300 block">Preferred Per-Occurrence Deductible / Retention</span>
					<div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
						{#each [5000, 10000, 25000] as amount}
							<button
								type="button"
								onclick={() => (payload.preferredRetentionPerOccurrence = amount)}
								class="p-4 rounded-xl border text-left transition-all {payload.preferredRetentionPerOccurrence === amount
									? 'bg-brand-500/15 border-brand-500 text-white font-bold ring-1 ring-brand-500'
									: 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'}"
							>
								<span class="text-lg font-mono font-bold block">{formatCurrency(amount)}</span>
								<span class="text-[11px] text-slate-400 mt-1 block">
									{#if amount === 5000}Low first-dollar exposure{:else if amount === 10000}Balanced industry baseline{:else}Aggressive premium reduction{/if}
								</span>
							</button>
						{/each}
					</div>
				</div>

				<div class="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
					<label class="flex items-center space-x-3 cursor-pointer">
						<input
							type="checkbox"
							bind:checked={payload.aggregateStopLossPreference}
							class="w-4 h-4 rounded bg-slate-900 border-slate-700 text-brand-600 focus:ring-brand-500"
						/>
						<span class="font-bold text-white">Require Group Aggregate Stop-Loss Protection</span>
					</label>
					<p class="text-slate-400 text-[11px] pl-7">
						Caps association member maximum annual loss pool liability at 115% of projected loss fund.
					</p>
				</div>
			</div>

		<!-- ========================================================== -->
		<!-- STEP 9: CAPITAL RESERVES & LOC REPLACEMENT                 -->
		<!-- ========================================================== -->
		{:else if activeStep === 9}
			<div class="space-y-5 text-xs">
				<div class="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 space-y-1">
					<p class="font-bold flex items-center space-x-1.5">
						<Landmark class="w-4 h-4 text-emerald-400" />
						<span>Replacing Traditional Bank Letters of Credit (LOC)</span>
					</p>
					<p class="text-slate-300 leading-relaxed text-[11px]">
						Commercial insurance regulators require captive capital reserves. Traditional banks charge 2-3% non-refundable fees for Letters of Credit while tying up borrowing capacity. CaptiveStack pools member standby capital at an estimated <strong class="text-emerald-400 font-mono">6.25% yield</strong>.
					</p>
				</div>

				<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div class="space-y-1.5">
						<label for="pledge" class="block font-semibold text-slate-300">Pledged Standby Capital Amount ($)</label>
						<input
							id="pledge"
							type="number"
							step="5000"
							bind:value={payload.pledgedStandbyCapitalAmount}
							class="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-sm"
						/>
					</div>
					<div class="space-y-1.5">
						<label for="yield" class="block font-semibold text-slate-300">Target Capital Reserve Yield (%)</label>
						<input
							id="yield"
							type="number"
							step="0.25"
							bind:value={payload.preferredCapitalYieldRate}
							class="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
						/>
					</div>
				</div>
			</div>

		<!-- ========================================================== -->
		<!-- STEP 10: REINSURANCE & QUOTA SHARE                         -->
		<!-- ========================================================== -->
		{:else if activeStep === 10}
			<div class="space-y-4 text-xs">
				<div class="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
					<label class="flex items-start space-x-3 cursor-pointer">
						<input
							type="checkbox"
							bind:checked={payload.reinsuranceQuotaShareAcknowledged}
							class="mt-1 w-4 h-4 rounded bg-slate-900 border-slate-700 text-brand-600 focus:ring-brand-500"
						/>
						<div class="space-y-0.5">
							<span class="font-bold text-white block">Reinsurance Quota Share Structure</span>
							<p class="text-slate-400 text-[11px]">
								Member agrees to proportionate quota share retention in accordance with actuarial feasibility ratios.
							</p>
						</div>
					</label>

					<label class="flex items-start space-x-3 cursor-pointer">
						<input
							type="checkbox"
							bind:checked={payload.surplusDistributionPolicyAcknowledged}
							class="mt-1 w-4 h-4 rounded bg-slate-900 border-slate-700 text-brand-600 focus:ring-brand-500"
						/>
						<div class="space-y-0.5">
							<span class="font-bold text-white block">Annual Underwriting Dividend Policy</span>
							<p class="text-slate-400 text-[11px]">
								Unspent loss reserves return to association members on a pro-rata loss ratio basis.
							</p>
						</div>
					</label>

					<label class="flex items-start space-x-3 cursor-pointer">
						<input
							type="checkbox"
							bind:checked={payload.regulatoryDomicileAcknowledged}
							class="mt-1 w-4 h-4 rounded bg-slate-900 border-slate-700 text-brand-600 focus:ring-brand-500"
						/>
						<div class="space-y-0.5">
							<span class="font-bold text-white block">State of Domicile Insurance Gating</span>
							<p class="text-slate-400 text-[11px]">
								Captive program operates under Delaware / Vermont Special Purpose Captive statutes.
							</p>
						</div>
					</label>
				</div>
			</div>

		<!-- ========================================================== -->
		<!-- STEP 11: REVIEW & OFFICER CERTIFICATION                    -->
		<!-- ========================================================== -->
		{:else if activeStep === 11}
			<div class="space-y-6 text-xs">
				<!-- Final Intake Summary Review -->
				<div class="rounded-xl bg-slate-950/80 border border-slate-800 p-4 space-y-3">
					<h3 class="text-xs font-bold text-white uppercase tracking-wider">Intake Submission Review</h3>
					<div class="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
						<div>
							<span class="text-slate-500 block text-[10px]">Entity</span>
							<span class="text-white font-bold">{payload.organizationName}</span>
						</div>
						<div>
							<span class="text-slate-500 block text-[10px]">Current Premium</span>
							<span class="text-white font-bold">{formatCurrency(payload.currentAnnualPremium)}</span>
						</div>
						<div>
							<span class="text-slate-500 block text-[10px]">5-Yr Losses</span>
							<span class="text-emerald-400 font-bold">{formatCurrency(payload.fiveYearTotalIncurredLosses)}</span>
						</div>
						<div>
							<span class="text-slate-500 block text-[10px]">Pledged Standby Capital</span>
							<span class="text-white font-bold">{formatCurrency(payload.pledgedStandbyCapitalAmount)}</span>
						</div>
					</div>
				</div>

				<!-- Legal Attestation Box -->
				<div class="p-5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 space-y-4">
					<div class="flex items-start space-x-3">
						<BadgeCheck class="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
						<div class="space-y-1">
							<h4 class="font-bold text-white text-sm">Corporate Officer Legal Attestation</h4>
							<p class="text-slate-300 text-xs leading-relaxed">
								I hereby certify under penalty of perjury that the loss history, exposure volumes, and commercial policy records provided in this intake survey are complete, true, and accurate representations of our commercial loss experience.
							</p>
						</div>
					</div>

					<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
						<div class="space-y-1.5">
							<label for="signature" class="block font-semibold text-white">Full Legal Name (Digital Signature)</label>
							<input
								id="signature"
								type="text"
								bind:value={payload.officerSignature}
								disabled={isCertified}
								placeholder="e.g. Marcus Miller"
								class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-serif text-sm italic"
							/>
						</div>
						<div class="space-y-1.5">
							<label for="title" class="block font-semibold text-white">Corporate Title</label>
							<input
								id="title"
								type="text"
								bind:value={payload.officerTitle}
								disabled={isCertified}
								placeholder="e.g. Managing Principal / President"
								class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
							/>
						</div>
					</div>
				</div>
			</div>
		{/if}

		<!-- Wizard Actions Footer Bar -->
		<div class="pt-6 border-t border-slate-800 flex items-center justify-between gap-3">
			{#if activeStep > 1}
				<button
					type="button"
					onclick={() => goToStep(activeStep - 1)}
					class="inline-flex items-center space-x-2 px-4 py-2.5 rounded-lg text-xs font-semibold bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors cursor-pointer"
				>
					<ArrowLeft class="w-4 h-4" />
					<span>Previous Step</span>
				</button>
			{:else}
				<div></div>
			{/if}

			{#if activeStep < 11}
				<form method="POST" action="?/saveStep" class="inline">
					<input type="hidden" name="step" value={activeStep} />
					<input type="hidden" name="payload" value={JSON.stringify(payload)} />
					<button
						type="submit"
						class="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white shadow-md shadow-brand-500/25 transition-all cursor-pointer"
					>
						<span>Save &amp; Continue Step {activeStep + 1}</span>
						<ArrowRight class="w-4 h-4" />
					</button>
				</form>
			{:else if !isCertified}
				<form method="POST" action="?/certify" class="inline">
					<input type="hidden" name="signature" value={payload.officerSignature} />
					<input type="hidden" name="title" value={payload.officerTitle} />
					<input type="hidden" name="payload" value={JSON.stringify(payload)} />
					<button
						type="submit"
						class="inline-flex items-center space-x-2 px-6 py-2.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
					>
						<BadgeCheck class="w-4 h-4" />
						<span>Execute Legal Attestation &amp; Lock Survey</span>
					</button>
				</form>
			{:else}
				<div class="flex items-center space-x-2 text-emerald-400 font-mono text-xs font-bold">
					<CheckCircle2 class="w-4 h-4" />
					<span>Survey Successfully Certified &amp; Submitted to Association Underwriting</span>
				</div>
			{/if}
		</div>
	</div>
</div>
