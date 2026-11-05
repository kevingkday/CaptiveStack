<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import {
		Shield,
		Lock,
		Mail,
		KeyRound,
		ArrowRight,
		AlertCircle,
		CheckCircle2,
		Users,
		Building2,
		Scale,
		FileSpreadsheet,
		UserCheck
	} from 'lucide-svelte';
	import { ROLE_CONFIGS, type UserRole } from '$lib/auth/rbac';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let email = $state('');
	let password = $state('');
	let loading = $state(false);

	$effect(() => {
		if (form?.email) {
			email = form.email;
		}
	});

	const personaIcons: Record<UserRole, typeof Shield> = {
		Admin: Shield,
		CaptiveStackAdministrator: Scale,
		AssociationAdministrator: Building2,
		AssociationMember: UserCheck,
		AdviserReviewer: FileSpreadsheet
	};
</script>

<svelte:head>
	<title>Sign In | CaptiveStack Access</title>
</svelte:head>

<div class="min-h-[calc(100vh-140px)] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
	<div class="max-w-md w-full mx-auto space-y-8">
		<!-- Brand Header -->
		<div class="text-center space-y-2">
			<div class="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-600 text-white shadow-xs mb-1">
				<Shield class="w-6 h-6" />
			</div>
			<h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
				Sign in to CaptiveStack
			</h1>
			<p class="text-xs sm:text-sm text-slate-600">
				Member-owned captive platform with role-based governance
			</p>
		</div>

		<!-- Error Alert -->
		{#if form?.error}
			<div class="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start space-x-2.5 animate-in fade-in duration-200">
				<AlertCircle class="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
				<span class="leading-relaxed">{form.error}</span>
			</div>
		{/if}

		<!-- Standard Credential Login Form -->
		<div class="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
			<form method="POST" action="?/login" class="space-y-4">
				<input type="hidden" name="redirectTo" value={data.redirectTo} />

				<div class="space-y-1.5">
					<label for="email" class="block text-xs font-semibold text-slate-700">
						Email address
					</label>
					<div class="relative rounded-lg shadow-2xs">
						<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
							<Mail class="w-4 h-4" />
						</div>
						<input
							id="email"
							name="email"
							type="email"
							autocomplete="email"
							required
							bind:value={email}
							placeholder="admin@captivestack.com"
							class="block w-full pl-10 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
						/>
					</div>
				</div>

				<div class="space-y-1.5">
					<div class="flex items-center justify-between">
						<label for="password" class="block text-xs font-semibold text-slate-700">
							Password
						</label>
						{#if data.demoMode && data.demoPasswordHint}
							<span class="text-[11px] text-slate-500 font-mono">Demo: {data.demoPasswordHint}</span>
						{/if}
					</div>
					<div class="relative rounded-lg shadow-2xs">
						<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
							<KeyRound class="w-4 h-4" />
						</div>
						<input
							id="password"
							name="password"
							type="password"
							autocomplete="current-password"
							required
							bind:value={password}
							class="block w-full pl-10 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
						/>
					</div>
				</div>

				<button
					type="submit"
					class="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs transition-all cursor-pointer"
				>
					<span>Sign in with Credentials</span>
					<ArrowRight class="w-4 h-4" />
				</button>
			</form>

			{#if data.demoMode && data.demoRoles.length}
				<div class="relative my-4">
					<div class="absolute inset-0 flex items-center">
						<div class="w-full border-t border-slate-200"></div>
					</div>
					<div class="relative flex justify-center text-xs">
						<span class="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium border border-slate-200 text-[11px]">
							Instant Role Persona Switcher
						</span>
					</div>
				</div>

				<div class="space-y-2">
					<p class="text-[11px] text-slate-500 text-center">
						Click any demo persona to log in immediately with role privileges:
					</p>
					<div class="grid grid-cols-1 gap-2">
						{#each data.demoRoles as item}
							{@const IconComponent = personaIcons[item.role]}
							{@const roleMeta = ROLE_CONFIGS[item.role]}
							<form method="POST" action="?/demoLogin" class="w-full">
								<input type="hidden" name="role" value={item.role} />
								<input type="hidden" name="redirectTo" value={data.redirectTo} />
								<button
									type="submit"
									class="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all text-left group cursor-pointer"
								>
									<div class="flex items-center space-x-3">
										<div class="p-2 rounded-lg bg-white border border-slate-200 text-blue-600 group-hover:text-blue-700 transition-colors shadow-2xs">
											<IconComponent class="w-4 h-4" />
										</div>
										<div class="space-y-0.5">
											<div class="flex items-center space-x-2">
												<span class="text-xs font-bold text-slate-900 font-sans">{item.name}</span>
												<span class="text-[10px] font-mono px-1.5 py-0.2 rounded border {roleMeta.badgeClass}">
													{item.role}
												</span>
											</div>
											<p class="text-[11px] text-slate-500 truncate max-w-[240px]">
												{item.email} &bull; {item.title}
											</p>
										</div>
									</div>
									<ArrowRight class="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
								</button>
							</form>
						{/each}
					</div>
				</div>
			{/if}
		</div>

		<!-- Footer Link Back to Home -->
		<div class="text-center">
			<a href="/" class="text-xs text-slate-500 hover:text-slate-900 transition-colors inline-flex items-center space-x-1 font-medium">
				<span>&larr; Back to CaptiveStack Overview</span>
			</a>
		</div>
	</div>
</div>
