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
	let password = $state('CaptiveStack2026!');
	let loading = $state(false);

	$effect(() => {
		if (form?.email) {
			email = form.email;
		}
	});

	const demoRoles: Array<{
		role: UserRole;
		email: string;
		name: string;
		title: string;
		icon: any;
	}> = [
		{
			role: 'Admin',
			email: 'admin@captivestack.com',
			name: 'System Admin',
			title: 'Full Platform Access & Settings',
			icon: Shield
		},
		{
			role: 'CaptiveStackAdministrator',
			email: 'csa@captivestack.com',
			name: 'Sarah Lin',
			title: 'Chief Underwriting & Capital Gatekeeper',
			icon: Scale
		},
		{
			role: 'AssociationAdministrator',
			email: 'admin@glassco.org',
			name: 'David Vance',
			title: 'GlassCo Exec Director & Group Lead',
			icon: Building2
		},
		{
			role: 'AssociationMember',
			email: 'marcus@autoglasspro.com',
			name: 'Marcus Miller',
			title: 'AutoGlass Pro (11-Step Survey Intake)',
			icon: UserCheck
		},
		{
			role: 'AdviserReviewer',
			email: 'elena@actuarialrisk.com',
			name: 'Dr. Elena Rostova',
			title: 'Lead Actuary & Independent Auditor',
			icon: FileSpreadsheet
		}
	];
</script>

<svelte:head>
	<title>Sign In | CaptiveStack RBAC Authentication</title>
</svelte:head>

<div class="min-h-[calc(100vh-140px)] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
	<div class="max-w-md w-full mx-auto space-y-8">
		<!-- Brand Header -->
		<div class="text-center space-y-2">
			<div class="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-indigo-600 shadow-lg shadow-brand-500/25 mb-1">
				<Shield class="w-6 h-6 text-white" />
			</div>
			<h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
				Sign in to CaptiveStack
			</h1>
			<p class="text-xs sm:text-sm text-slate-400">
				Serverless edge session authentication with Role-Based Access Control
			</p>
		</div>

		<!-- Error Alert -->
		{#if form?.error}
			<div class="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start space-x-2.5 animate-in fade-in duration-200">
				<AlertCircle class="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
				<span class="leading-relaxed">{form.error}</span>
			</div>
		{/if}

		<!-- Standard Credential Login Form -->
		<div class="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 shadow-2xl backdrop-blur-sm space-y-6">
			<form method="POST" action="?/login" class="space-y-4">
				<input type="hidden" name="redirectTo" value={data.redirectTo} />

				<div class="space-y-1.5">
					<label for="email" class="block text-xs font-semibold text-slate-300">
						Email address
					</label>
					<div class="relative rounded-lg shadow-sm">
						<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
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
							class="block w-full pl-10 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
						/>
					</div>
				</div>

				<div class="space-y-1.5">
					<div class="flex items-center justify-between">
						<label for="password" class="block text-xs font-semibold text-slate-300">
							Password
						</label>
						<span class="text-[11px] text-slate-500 font-mono">Demo: CaptiveStack2026!</span>
					</div>
					<div class="relative rounded-lg shadow-sm">
						<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
							<KeyRound class="w-4 h-4" />
						</div>
						<input
							id="password"
							name="password"
							type="password"
							autocomplete="current-password"
							required
							bind:value={password}
							class="block w-full pl-10 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
						/>
					</div>
				</div>

				<button
					type="submit"
					class="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-lg text-sm font-semibold text-white bg-brand-600 hover:bg-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-md shadow-brand-500/20 transition-all cursor-pointer"
				>
					<span>Sign in with Credentials</span>
					<ArrowRight class="w-4 h-4" />
				</button>
			</form>

			<!-- Quick RBAC Test Switcher Header -->
			<div class="relative my-4">
				<div class="absolute inset-0 flex items-center">
					<div class="w-full border-t border-slate-800"></div>
				</div>
				<div class="relative flex justify-center text-xs">
					<span class="px-2.5 py-0.5 rounded-full bg-slate-900 text-slate-400 font-medium border border-slate-800 text-[11px]">
						Instant RBAC Pair-Programming Switcher
					</span>
				</div>
			</div>

			<!-- Instant Demo Role Buttons -->
			<div class="space-y-2">
				<p class="text-[11px] text-slate-400 text-center">
					Click any seeded persona to log in immediately as that RBAC role:
				</p>
				<div class="grid grid-cols-1 gap-2">
					{#each demoRoles as item}
						{@const IconComponent = item.icon}
						{@const roleMeta = ROLE_CONFIGS[item.role]}
						<form method="POST" action="?/demoLogin" class="w-full">
							<input type="hidden" name="role" value={item.role} />
							<input type="hidden" name="redirectTo" value={data.redirectTo} />
							<button
								type="submit"
								class="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/50 transition-all text-left group cursor-pointer"
							>
								<div class="flex items-center space-x-3">
									<div class="p-2 rounded-lg bg-slate-900 text-brand-400 group-hover:text-white transition-colors">
										<IconComponent class="w-4 h-4" />
									</div>
									<div class="space-y-0.5">
										<div class="flex items-center space-x-2">
											<span class="text-xs font-bold text-white font-sans">{item.name}</span>
											<span class="text-[10px] font-mono px-1.5 py-0.2 rounded border {roleMeta.badgeClass}">
												{item.role}
											</span>
										</div>
										<p class="text-[11px] text-slate-400 truncate max-w-[240px]">
											{item.email} &bull; {item.title}
										</p>
									</div>
								</div>
								<ArrowRight class="w-3.5 h-3.5 text-slate-500 group-hover:text-brand-400 transition-colors" />
							</button>
						</form>
					{/each}
				</div>
			</div>
		</div>

		<!-- Footer Link Back to Home -->
		<div class="text-center">
			<a href="/" class="text-xs text-slate-400 hover:text-white transition-colors inline-flex items-center space-x-1">
				<span>&larr; Back to Public Architecture Dashboard</span>
			</a>
		</div>
	</div>
</div>
