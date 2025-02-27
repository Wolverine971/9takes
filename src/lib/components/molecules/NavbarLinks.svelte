<script lang="ts">
	import { page } from '$app/stores';
	import { afterUpdate } from 'svelte';
	import { onMount } from 'svelte';

	export let mobile: boolean;
	let isMobile = mobile;

	onMount(() => {
		isMobile = mobile;
	});

	afterUpdate(() => {
		isMobile = mobile;
	});
</script>

<div class="navbar-blogs">
	<a
		href={$page.url.pathname.includes('9takes') ? 'https://9takes.com' : '/'}
		class="{!isMobile && 'big-btn'} {$page.url.pathname === '/' && 'active-link'}"
		aria-current={$page.url.pathname === '/' ? 'page' : undefined}>Home</a
	>
	<div class="main-subnav" style="margin: {!isMobile && '1rem'}">
		<button
			class="main-subNavBtn {!isMobile && 'big-btn'} {!isMobile && 'subNavBtn'}"
			style="background: {isMobile && 'white'}; border: {isMobile && 'none'};"
			>Enneagram Corner<i class="fa fa-caret-down" /></button
		>
		<div class="main-subnav-content {isMobile && 'mobile-card'}">
			<div class="subnav">
				<button class="subNavBtn">Overview<i class="fa fa-caret-down" /></button>
				<div class="subnav-content">
					<!-- <a href="#enneagram">Understanding the Enneagram</a> -->
					<a href="/enneagram-corner/philosophy-psychology-and-the-enneagram"
						>Philosophy and Psychology gave birth to the Enneagram</a
					>
					<a href="/enneagram-corner/enneagram-tldr">Enneagram TLDR</a>
					<a href="/enneagram-corner/enneagram-concepts">Concepts and Principles</a>
					<a href="/enneagram-corner/enneagram-influences">Enneagram Influences</a>
				</div>
			</div>
			<div class="subnav">
				<button class="subNavBtn">9 Types <i class="fa fa-caret-down" /></button>
				<div class="subnav-content">
					<a href="/enneagram-corner/enneagram-type-1">Type 1: The Perfectionist</a>
					<a href="/enneagram-corner/enneagram-type-2">Type 2: The Helper</a>
					<a href="/enneagram-corner/enneagram-type-3">Type 3: The Achiever</a>
					<a href="/enneagram-corner/enneagram-type-4">Type 4: The Individualist</a>
					<a href="/enneagram-corner/enneagram-type-5">Type 5: The Investigator</a>
					<a href="/enneagram-corner/enneagram-type-6">Type 6: The Loyalist</a>
					<a href="/enneagram-corner/enneagram-type-7">Type 7: The Enthusiast</a>
					<a href="/enneagram-corner/enneagram-type-8">Type 8: The Challenger</a>
					<a href="/enneagram-corner/enneagram-type-9">Type 9: The Peacemaker</a>
				</div>
			</div>
			<div class="subnav">
				<button class="subNavBtn">Personal Development <i class="fa fa-caret-down" /></button>
				<div class="subnav-content">
					<a href="/enneagram-corner/enneagram-personality-test">Determining your type</a>
					<a href="/enneagram-corner/enneagram-self-development">Self development</a>
					<a href="/enneagram-corner/enneagram-strengths-and-weaknesses">Strengths and weaknesses</a
					>
					<a href="/enneagram-corner/enneagram-personal-growth">Growth strategies</a>
				</div>
			</div>
			<div class="subnav">
				<button class="subNavBtn">Relationships <i class="fa fa-caret-down" /></button>
				<div class="subnav-content">
					<a href="/enneagram-corner/enneagram-types-in-relationships">Types in relationships</a>
					<a href="/enneagram-corner/enneagram-communication-tips">Communication tips</a>
					<a href="/enneagram-corner/enneagram-communication-styles">Communication styles</a>
				</div>
			</div>
			<div class="subnav">
				<button class="subNavBtn">Workplace <i class="fa fa-caret-down" /></button>
				<div class="subnav-content">
					<a href="/enneagram-corner/enneagram-workplace-team-building">Team building</a>
					<a href="/enneagram-corner/enneagram-types-working-in-teams">Working in teams</a>
					<a href="/enneagram-corner/enneagram-team-dynamics">Team dynamics</a>
					<a href="/enneagram-corner/enneagram-team-diversity">Team diversity</a>
				</div>
			</div>
			<div class="subnav">
				<button class="subNavBtn">Resources <i class="fa fa-caret-down" /></button>
				<div class="subnav-content">
					<a href="/enneagram-corner/enneagram-faqs">FAQs</a>
					<a href="/enneagram-corner/enneagram-books-websites-podcasts"
						>Books, websites, and podcasts</a
					>
					<!-- <a href="#tests">Tests and assessments</a>
					<a href="#coaches">Coaches and trainers</a> -->
				</div>
			</div>
			<div class="subnav">
				<button class="subNavBtn">Situational Topics <i class="fa fa-caret-down" /></button>
				<div class="subnav-content">
					<a href="/enneagram-corner/enneagram-types-at-party">Types at a party</a>
					<a href="/enneagram-corner/enneagram-types-being-ghosted">Impact of ghosting</a>
					<a href="/enneagram-corner/enneagram-types-in-stress">Navigating stress</a>
					<a href="/personality-analysis">Analysis of famous people</a>
				</div>
			</div>
		</div>
	</div>
	<a
		href="/about"
		class="{!isMobile && 'big-btn'} {$page.url.pathname === '/about' && 'active-link'}"
		aria-current={$page.url.pathname === '/about' ? 'page' : undefined}>About</a
	>
</div>

<style lang="scss">
	.big-btn {
		background: no-repeat;
		border-radius: var(--base-border-radius);
		border: var(--classic-border);
		background-color: var(--base-white-outline);
	}

	.mobile-card {
		border-radius: var(--base-border-radius);
		border: var(--classic-border);

		.subnav-content {
			border-radius: var(--base-border-radius);
			border: var(--classic-border);
		}
	}
	.arrow {
		fill: var(--primary);
	}
	.navbar-blogs {
		overflow: hidden;
		border-radius: var(--base-border-radius);
		display: flex;
		justify-content: center;
		align-items: center;

		&:after {
			mix-blend-mode: difference;
		}
	}

	.navbar-blogs a {
		float: left;
		font-size: 16px;
		color: var(--primary);
		text-align: center;
		padding: 14px 16px;
		// text-decoration: none;
		z-index: 1234;
	}

	.subnav {
		float: left;
		overflow: hidden;
		display: flex;
		z-index: 1234;
	}

	.subnav .subNavBtn {
		font-size: 16px;
		border: none;
		outline: none;
		color: var(--primary);
		padding: 14px 16px;
		background-color: inherit;
		font-family: inherit;
		margin: 0;
		text-align: left;
		width: 100%;
		z-index: 1234;
	}

	.navbar-blogs a:hover,
	.subnav:hover .subNavBtn {
		background-color: var(--accent);
		z-index: 1234;
	}

	.subnav-content {
		display: none;
		position: absolute;
		background-color: var(--base-white-outline);
		flex-direction: column;
		left: 100%;
		z-index: 1234;
	}

	.subnav-content a {
		float: left;
		color: var(--primary);
		z-index: 1234;
	}

	.subnav-content a:hover {
		background-color: var(--base-white-outline);
		color: var(--dark-gray);
		z-index: 1234;
	}

	.subnav:hover .subnav-content {
		display: flex;
		z-index: 1234;
	}

	.main-subnav {
		float: left;
		overflow: hidden;
		z-index: 1234;
	}

	.main-subnav .main-subNavBtn {
		display: flex;
		align-items: center;
		outline: none;
		box-sizing: border-box;
		color: var(--primary);

		z-index: 1234;
		// float: left;
		font-size: 16px;
		color: var(--primary);
		text-align: center;
		padding: 14px 16px;
		// text-decoration: none;
		z-index: 1234;
	}

	.navbar-blogs a:hover,
	.main-subnav:hover .main-subNavBtn {
		z-index: 1234;
	}

	.main-subnav-content {
		display: none;
		position: absolute;
		background-color: var(--base-white-outline);
		flex-direction: column;
		z-index: 1234;
	}

	.main-subnav-content a {
		float: left;
		color: var(--primary);
		z-index: 1234;
	}

	.main-subnav-content a:hover {
		background-color: var(--base-white-outline);
		color: var(--dark-gray);
		z-index: 1234;
	}

	.main-subnav:hover .main-subnav-content {
		display: flex;
		z-index: 1234;
	}

	@media (max-width: 500px) {
		.main-subnav-content {
			left: 0;
		}
	}
</style>
