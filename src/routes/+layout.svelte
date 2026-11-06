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
		ChevronRight,
		ArrowRight,
		LogOut,
		LogIn,
		Sparkles
	} from 'lucide-svelte';

	let { children, data }: LayoutProps = $props();

	let mobileMenuOpen = $state(false);

	const navItems = [
		{ label: 'For Associations', href: '/for-associations' },
		{ label: 'For Businesses', href: '/for-business-owners' },
		{ label: 'Readiness Quiz', href: '/readiness' },
		{ label: 'Industries', href: '/industries' },
		{ label: 'Feasibility', href: '/feasibility' },
		{ label: 'Domiciles', href: '/domiciles' },
		{ label: 'About', href: '/about' }
	];

	function closeMenu() {
		mobileMenuOpen = false;
	}
</script>

<svelte:head>
	<title>CaptiveStack | Member-Owned Group Captive Insurance</title>
	<meta
		name="description"
		content="CaptiveStack makes it easy for groups and associations to setup their own insurance company to insure the risks of their members."
	/>
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
		rel="stylesheet"
	/>
	<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
	<meta property="og:site_name" content="CaptiveStack" />
	<meta property="og:title" content="CaptiveStack | Member-Owned Group Captive Insurance" />
	<meta property="og:description" content="CaptiveStack makes it easy for groups and associations to setup their own insurance company to insure the risks of their members." />
	<meta property="og:image" content="https://www.captivestack.com/og-image.svg" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="CaptiveStack | Member-Owned Group Captive Insurance" />
	<meta name="twitter:description" content="CaptiveStack makes it easy for groups and associations to setup their own insurance company to insure the risks of their members." />
	<meta name="twitter:image" content="https://www.captivestack.com/og-image.svg" />
</svelte:head>

<div class="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-blue-100 selection:text-blue-900">
	<!-- Top Announcement Ribbon (TwinFlow Style) -->
	<aside aria-label="Announcement" class="bg-blue-600 text-white px-4 py-1.5 text-xs font-medium">
		<div class="max-w-7xl mx-auto flex items-center justify-between">
			<div class="flex items-center space-x-2">
				<span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-white/20 text-white">
					New
				</span>
				<span class="hidden sm:inline">
					Member-Owned Group Captives • Escape rising commercial insurance premiums and claim denials.
				</span>
				<span class="sm:hidden">
					Member-Owned Group Captives
				</span>
			</div>
			<a
				href="/feasibility"
				class="inline-flex items-center space-x-1 text-white hover:text-blue-100 font-semibold transition-colors"
			>
				<span>Evaluate Your Feasibility</span>
				<ArrowRight class="w-3 h-3" />
			</a>
		</div>
	</aside>

	<!-- Main Responsive Navigation Header (TwinFlow Style) -->
	<header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex items-center justify-between h-16">
				<!-- Brand Identity -->
				<div class="flex items-center space-x-3">
					<a href="/" class="flex items-center space-x-2.5 group focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl p-1">
						<div class="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs group-hover:bg-blue-700 transition-colors">
							<Shield class="w-5 h-5" />
						</div>
						<div class="flex flex-col">
							<div class="flex items-center space-x-1.5">
								<span class="font-extrabold text-xl tracking-tight text-slate-900">
									Captive<span class="text-blue-600">Stack</span>
								</span>
								<span class="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
									Group Captives
								</span>
							</div>
							<span class="text-[10px] text-slate-500 font-medium hidden sm:block -mt-0.5">
								Member-Owned Insurance Platform
							</span>
						</div>
					</a>
				</div>

				<!-- Desktop Navigation Links -->
				<nav class="hidden md:flex items-center space-x-1">
					{#each navItems as item}
						<a
							href={item.href}
							class="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all"
						>
							{item.label}
						</a>
					{/each}
				</nav>

				<!-- Header Right Actions & Identity -->
				<div class="hidden sm:flex items-center space-x-2.5">
					{#if data?.currentUser}
						{#if data.currentUser.role === 'Admin' || data.currentUser.role === 'CaptiveStackAdministrator'}
							<a
								href="/admin/leads"
								class="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 transition-colors shadow-2xs"
							>
								Admin Leads
							</a>
						{/if}
						<a
							href="/portal"
							class="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs text-slate-800 transition-colors"
						>
							<span class="w-2 h-2 rounded-full bg-emerald-500"></span>
							<span class="font-semibold">{data.currentUser.name}</span>
							<span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
								{data.currentUser.role}
							</span>
						</a>

						<a
							href="/logout"
							title="Sign Out"
							class="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
						>
							<LogOut class="w-4 h-4" />
						</a>
					{:else}
						<a
							href="/login"
							class="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-2xs transition-all"
						>
							<LogIn class="w-3.5 h-3.5 text-slate-500" />
							<span>Sign In</span>
						</a>
						<a
							href="/readiness"
							class="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-all"
						>
							<Sparkles class="w-3.5 h-3.5 text-blue-200" />
							<span>Readiness Score</span>
						</a>
					{/if}
				</div>

				<!-- Mobile Hamburger Button -->
				<div class="flex md:hidden items-center space-x-2">
					<button
						type="button"
						onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
						aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
						class="p-2 rounded-xl text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
			<div class="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
				<div class="space-y-1">
					{#each navItems as item}
						<a
							href={item.href}
							onclick={closeMenu}
							class="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
						>
							{item.label}
						</a>
					{/each}
				</div>

				<div class="pt-3 border-t border-slate-200 space-y-2">
					{#if data?.currentUser}
						<div class="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-100 text-xs">
							<div class="flex items-center space-x-2">
								<span class="w-2 h-2 rounded-full bg-emerald-500"></span>
								<span class="font-semibold text-slate-800">{data.currentUser.name}</span>
							</div>
							<span class="text-slate-500 font-mono text-[11px]">{data.currentUser.role}</span>
						</div>

						<div class="grid grid-cols-2 gap-2">
							<a
								href="/portal"
								onclick={closeMenu}
								class="flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white"
							>
								<span>Portal</span>
								<ChevronRight class="w-3.5 h-3.5" />
							</a>
							<a
								href="/logout"
								onclick={closeMenu}
								class="flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200"
							>
								<LogOut class="w-3.5 h-3.5" />
								<span>Sign Out</span>
							</a>
						</div>
					{:else}
						<a
							href="/readiness"
							onclick={closeMenu}
							class="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
						>
							<Sparkles class="w-4 h-4 text-blue-200" />
							<span>Calculate Readiness Score</span>
						</a>
						<a
							href="/login"
							onclick={closeMenu}
							class="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 transition-colors"
						>
							<LogIn class="w-4 h-4 text-slate-500" />
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

	<!-- Global Corporate Footer (TwinFlow Style) -->
	<footer class="mt-auto border-t border-slate-200 bg-white text-slate-600 text-xs">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
			<div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
				<!-- Brand Column -->
				<div class="md:col-span-2 space-y-4">
					<div class="flex items-center space-x-2.5">
						<div class="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
							<Shield class="w-4 h-4" />
						</div>
						<span class="font-extrabold text-lg text-slate-900 tracking-tight">
							Captive<span class="text-blue-600">Stack</span>
						</span>
					</div>
					<p class="text-slate-600 text-xs leading-relaxed max-w-md">
						CaptiveStack makes it easy for groups and associations to setup their own insurance company to insure the risks of their members. We reduce the cost and complexity of captive insurance for small to medium sized organizations.
					</p>
					<div class="flex flex-wrap gap-2 pt-1">
						<span class="px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-medium">
							Association Group Captives
						</span>
						<span class="px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-medium">
							Alternative Risk Transfer (ART)
						</span>
						<span class="px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-medium">
							Bank LOC Replacement
						</span>
					</div>
				</div>

				<!-- Navigation Column -->
				<div>
					<h3 class="font-bold text-slate-900 mb-3 text-xs uppercase tracking-wider">Funnel &amp; Solutions</h3>
					<ul class="space-y-2 text-xs text-slate-600">
						<li>
							<a href="/for-associations" class="hover:text-blue-600 transition-colors font-medium text-slate-900">
								For Associations &amp; Groups
							</a>
						</li>
						<li>
							<a href="/for-business-owners" class="hover:text-blue-600 transition-colors font-medium text-slate-900">
								For Commercial Business Owners
							</a>
						</li>
						<li>
							<a href="/readiness" class="hover:text-blue-600 transition-colors text-blue-600 font-semibold">
								2-Min Readiness Score Quiz
							</a>
						</li>
						<li>
							<a href="/industries" class="hover:text-blue-600 transition-colors">
								Target Industries (6 Guides)
							</a>
						</li>
						<li>
							<a href="/feasibility" class="hover:text-blue-600 transition-colors">
								Group Feasibility Calculator
							</a>
						</li>
						<li>
							<a href="/capital" class="hover:text-blue-600 transition-colors">
								Capital Reserves &amp; Standby Collateral
							</a>
						</li>
						<li>
							<a href="/domiciles" class="hover:text-blue-600 transition-colors">
								Supported Domiciles
							</a>
						</li>
					</ul>
				</div>

				<!-- Member & Governance Column -->
				<div>
					<h3 class="font-bold text-slate-900 mb-3 text-xs uppercase tracking-wider">Member &amp; Governance</h3>
					<ul class="space-y-2.5 text-xs text-slate-600">
						<li>
							<a href="/login" class="hover:text-blue-600 transition-colors">
								Member Portal Access
							</a>
						</li>
						<li>
							<a href="/review" class="hover:text-blue-600 transition-colors">
								Actuarial Review Queue
							</a>
						</li>
						<li>
							<a href="/domiciles" class="hover:text-blue-600 transition-colors">
								Domiciles (VT, UT, DE, Cayman, Bermuda, BC, AB)
							</a>
						</li>
						<li>
							<a href="https://canadiancaptive.com" target="_blank" rel="noopener noreferrer" class="hover:text-blue-600 transition-colors inline-flex items-center gap-1">
								<span>CanadianCaptive.com (Domicile Research)</span>
								<span class="text-[10px]">↗</span>
							</a>
						</li>
					</ul>
				</div>
			</div>

			<!-- Site-Wide Regulatory & Professional Disclaimer -->
			<div class="mb-8 p-5 rounded-2xl bg-slate-100 border border-slate-200 text-slate-600 text-xs leading-relaxed space-y-2">
				<div class="flex items-center gap-2 text-slate-800 font-bold text-xs uppercase tracking-wider">
					<Shield class="w-4 h-4 text-blue-600" />
					<span>Regulatory &amp; Professional Services Disclaimer</span>
				</div>
				<p>
					CaptiveStack provides information, educational resources, and software modeling tools to evaluate captive insurance feasibility and alternative risk financing structures. <strong>CaptiveStack is not an insurance company and does not solicit, underwrite, issue, or offer insurance policies to the public.</strong>
				</p>
				<p>
					Captive insurance company formation, capitalization, and licensing are strictly subject to formal regulatory review and statutory approval by the Department of Insurance or regulatory commission in the chosen domicile (such as Vermont, Utah, Delaware, Cayman Islands, Bermuda, Barbados, British Columbia, or Alberta). Policy issuance and coverage terms are additionally subject to underwriting approval by licensed fronting carriers and commercial reinsurers. Prospective captive owners should consult licensed captive managers, credentialed actuaries, legal counsel, and certified public accountants before initiating formation.
				</p>
			</div>

			<div class="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
				<p>&copy; {new Date().getFullYear()} CaptiveStack Inc. All rights reserved.</p>
				<p class="text-slate-500">
					Member-Owned Group Captives &bull; Alternative Risk Financing &bull; Standby Capital Reserves
				</p>
			</div>
		</div>
	</footer>
</div>
