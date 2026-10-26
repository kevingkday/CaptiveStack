<script lang="ts">
	import '../app.css';
	import type { LayoutProps } from './$types';
	import {
		Shield,
		Layers,
		Users,
		FileText,
		Landmark,
		Menu,
		X,
		Activity,
		Database,
		ChevronRight,
		ExternalLink,
		CheckCircle2,
		LogOut,
		User as UserIcon,
		LogIn
	} from 'lucide-svelte';

	let { children, data }: LayoutProps = $props();

	let mobileMenuOpen = $state(false);

	const navItems = [
		{ label: 'Pilot Programs', href: '/#programs', icon: Layers },
		{ label: 'Capital & LOC', href: '/#capital', icon: Landmark },
		{ label: 'Feasibility Engine', href: '/#feasibility', icon: Activity },
		{ label: 'Member Surveys', href: '/#surveys', icon: FileText },
		{ label: 'RBAC Roles', href: '/#rbac', icon: Users }
	];

	function closeMenu() {
		mobileMenuOpen = false;
	}
</script>

<svelte:head>
	<title>CaptiveStack | Alternative Risk Transfer & Group Captive Formation</title>
	<meta
		name="description"
		content="Serverless edge platform for forming trade association group captives, replacing bank Letters of Credit with pooled capital reserves."
	/>
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-brand-500 selection:text-white">
	<!-- Top Notification / Edge Status Ribbon -->
	<aside aria-label="Edge Runtime Announcement" class="bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 border-b border-slate-800/80 px-4 py-1.5 text-xs">
		<div class="max-w-7xl mx-auto flex items-center justify-between">
			<div class="flex items-center space-x-2">
				<span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
					<span class="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
					Edge Active
				</span>
				<span class="text-slate-400 hidden sm:inline">
					Cloudflare Pages &amp; Workers &bull; D1 SQLite &bull; Zero Disk Storage Architecture
				</span>
				<span class="text-slate-400 sm:hidden">
					Cloudflare D1 &bull; Edge v2
				</span>
			</div>
			<div class="flex items-center space-x-3 text-slate-400">
				<span class="hidden md:inline font-mono text-[11px] text-slate-400">
					LOC Alternative: Eagle1 &amp; GlassCo
				</span>
				<span class="inline-flex items-center text-slate-300 font-mono text-[11px] bg-slate-800/60 px-2 py-0.5 rounded border border-slate-700/50">
					<Database class="w-3 h-3 mr-1 text-brand-400" />
					D1: DB
				</span>
			</div>
		</div>
	</aside>

	<!-- Main Responsive Navigation Header -->
	<header class="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/90 shadow-lg shadow-black/20">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex items-center justify-between h-16">
				<!-- Brand Identity -->
				<div class="flex items-center space-x-3">
					<a href="/" class="flex items-center space-x-2.5 group focus:outline-none focus:ring-2 focus:ring-brand-500 rounded-lg p-1">
						<div class="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center shadow-md shadow-brand-500/25 group-hover:scale-105 transition-transform duration-200">
							<Shield class="w-5 h-5 text-white" />
						</div>
						<div class="flex flex-col">
							<div class="flex items-center space-x-1.5">
								<span class="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
									CaptiveStack
								</span>
								<span class="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">
									v2.0
								</span>
							</div>
							<span class="text-[10px] text-slate-400 tracking-wide font-medium hidden sm:block">
								Alternative Risk Transfer Engine
							</span>
						</div>
					</a>
				</div>

				<!-- Desktop Navigation Links -->
				<nav class="hidden md:flex items-center space-x-1 lg:space-x-2">
					{#each navItems as item}
						{@const IconComponent = item.icon}
						<a
							href={item.href}
							class="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/70 transition-colors"
						>
							<IconComponent class="w-4 h-4 text-slate-400 group-hover:text-brand-400" />
							<span>{item.label}</span>
						</a>
					{/each}
				</nav>

				<!-- Header Right Actions & Identity -->
				<div class="hidden sm:flex items-center space-x-3">
					{#if data?.currentUser}
						<a
							href="/portal"
							class="flex items-center space-x-2 px-2.5 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 transition-colors"
						>
							<span class="w-2 h-2 rounded-full bg-emerald-400"></span>
							<span class="font-medium text-white">{data.currentUser.name}</span>
							<span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-brand-500/10 text-brand-300 border border-brand-500/30">
								{data.currentUser.role}
							</span>
						</a>

						<a
							href="/logout"
							title="Sign Out"
							class="p-2 rounded-lg text-slate-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
						>
							<LogOut class="w-4 h-4" />
						</a>
					{:else}
						<a
							href="/login"
							class="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white shadow-sm shadow-brand-500/20 transition-all hover:shadow-brand-500/30"
						>
							<LogIn class="w-3.5 h-3.5" />
							<span>Sign In</span>
						</a>
					{/if}
				</div>

				<!-- Mobile Hamburger Button -->
				<div class="flex md:hidden items-center space-x-2">
					<button
						type="button"
						onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
						aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
						class="p-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/80 focus:outline-none focus:ring-2 focus:ring-brand-500"
					>
						{#if mobileMenuOpen}
							<X class="w-6 h-6" />
						{:else}
							<Menu class="w-6 h-6" />
						{/if}
					</button>
				</div>
			</div>
		</div>

		<!-- Mobile Navigation Drawer -->
		{#if mobileMenuOpen}
			<div class="md:hidden border-t border-slate-800 bg-slate-950/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-2 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150">
				<div class="space-y-1">
					{#each navItems as item}
						{@const IconComponent = item.icon}
						<a
							href={item.href}
							onclick={closeMenu}
							class="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-base font-medium text-slate-200 hover:text-white hover:bg-slate-800/80 transition-colors"
						>
							<div class="p-1.5 rounded-md bg-slate-900 text-brand-400">
								<IconComponent class="w-5 h-5" />
							</div>
							<span>{item.label}</span>
						</a>
					{/each}
				</div>

				<div class="pt-4 border-t border-slate-800/80 space-y-3">
					{#if data?.currentUser}
						<div class="flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
							<div class="flex items-center space-x-2">
								<span class="w-2 h-2 rounded-full bg-emerald-400"></span>
								<span class="font-medium text-white">{data.currentUser.name}</span>
							</div>
							<span class="font-mono text-brand-300">{data.currentUser.role}</span>
						</div>

						<div class="grid grid-cols-2 gap-2">
							<a
								href="/portal"
								onclick={closeMenu}
								class="flex items-center justify-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-brand-600 text-white"
							>
								<span>Portal</span>
								<ChevronRight class="w-3.5 h-3.5" />
							</a>
							<a
								href="/logout"
								onclick={closeMenu}
								class="flex items-center justify-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-rose-500/10 text-rose-300 border border-rose-500/30"
							>
								<LogOut class="w-3.5 h-3.5" />
								<span>Sign Out</span>
							</a>
						</div>
					{:else}
						<a
							href="/login"
							onclick={closeMenu}
							class="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-brand-600 hover:bg-brand-500 text-white shadow-md transition-colors"
						>
							<LogIn class="w-4 h-4" />
							<span>Sign In with Credentials</span>
						</a>
					{/if}
				</div>
			</div>
		{/if}
	</header>

	<!-- Main Body Content -->
	<main class="flex-1">
		{@render children()}
	</main>

	<!-- Global Corporate Footer -->
	<footer class="mt-auto border-t border-slate-800/80 bg-slate-950 text-slate-400 text-xs">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
			<div class="grid grid-cols-1 md:grid-cols-4 gap-8">
				<div class="md:col-span-2 space-y-3">
					<div class="flex items-center space-x-2">
						<div class="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center text-white">
							<Shield class="w-4 h-4" />
						</div>
						<span class="font-bold text-base text-white tracking-tight">CaptiveStack v2</span>
					</div>
					<p class="text-slate-400 text-xs leading-relaxed max-w-md">
						Next-generation edge infrastructure for trade association group captives, alternative risk transfer (ART) programs, and capital formation. Replaces stateful Blazor architecture with zero-disk serverless edge runtimes.
					</p>
					<div class="flex flex-wrap gap-2 pt-1 font-mono text-[11px]">
						<span class="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
							Cloudflare D1 SQLite
						</span>
						<span class="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
							Drizzle ORM
						</span>
						<span class="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
							SvelteKit 2 Runes
						</span>
						<span class="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
							R2 Presigned Storage
						</span>
					</div>
				</div>

				<div>
					<h3 class="font-semibold text-slate-200 mb-3 text-xs uppercase tracking-wider">Pilot Captives</h3>
					<ul class="space-y-2">
						<li>
							<a href="/#programs" class="hover:text-brand-400 transition-colors flex items-center space-x-1">
								<span>Eagle1 Hole-in-One Prize Pool</span>
							</a>
						</li>
						<li>
							<a href="/#programs" class="hover:text-brand-400 transition-colors flex items-center space-x-1">
								<span>GlassCo Replacement Warranty</span>
							</a>
						</li>
						<li>
							<a href="/#capital" class="hover:text-brand-400 transition-colors">
								LOC Replacement Facility ($2.0M+)
							</a>
						</li>
						<li>
							<a href="/#feasibility" class="hover:text-brand-400 transition-colors">
								Actuarial Combined Ratio Engine
							</a>
						</li>
					</ul>
				</div>

				<div>
					<h3 class="font-semibold text-slate-200 mb-3 text-xs uppercase tracking-wider">RBAC Security</h3>
					<ul class="space-y-2 font-mono text-[11px]">
						<li class="text-slate-300">&bull; Admin</li>
						<li class="text-slate-300">&bull; CaptiveStackAdministrator</li>
						<li class="text-slate-300">&bull; AssociationAdministrator</li>
						<li class="text-slate-300">&bull; AssociationMember</li>
						<li class="text-slate-300">&bull; AdviserReviewer</li>
					</ul>
				</div>
			</div>

			<div class="mt-8 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400">
				<p>&copy; {new Date().getFullYear()} CaptiveStack Inc. (formerly captive8.ai). All rights reserved.</p>
				<p class="mt-2 sm:mt-0 font-mono text-slate-400">
					Edge-Native &bull; No Stateful WebSockets &bull; Zero Local Disk Storage
				</p>
			</div>
		</div>
	</footer>
</div>
