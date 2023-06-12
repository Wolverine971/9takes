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

<div class="navbar-blogs ">
	<a
		href="/"
		class="{!isMobile && 'big-btn'} {$page.url.pathname === '/' && 'active-link'}"
		aria-current={$page.url.pathname === '/' ? 'page' : undefined}>Home</a
	>
	<div class="main-subnav" style="margin: {!isMobile && '1rem'}">
		<!-- <button class="main-subnavbtn" style="background: {isMobile && 'white'};">
			
			
		</button> -->
		<button
			class="main-subnavbtn {!isMobile && 'big-btn'} {!isMobile && 'subnavbtn'}"
			style="background: {isMobile && 'white'}; border: {isMobile && 'none'};"
			>Enneagram Blog<i class="fa fa-caret-down" /></button
		>
		<div class="main-subnav-content {isMobile && 'mobile-card'}">
			<div class="subnav">
				<button class="subnavbtn">Overview<i class="fa fa-caret-down" /></button>
				<div class="subnav-content">
					<!-- <a href="#enneagram">Understanding the Enneagram</a> -->
					<a href="/blog/enneagram/enneagram-lineage">Enneagram Lineage</a>
					<a href="/blog/enneagram/enneagram-tldr">Enneagram TLDR</a>
					<a href="/blog/enneagram/enneagram-concepts">Concepts and Principles</a>
					<a href="/blog/enneagram/enneagram-influences">Enneagram Influences</a>
				</div>
			</div>
			<div class="subnav">
				<button class="subnavbtn">9 Types <i class="fa fa-caret-down" /></button>
				<div class="subnav-content ">
					<a href="/blog/enneagram/enneagram-type-1">Type 1: The Perfectionist</a>
					<a href="/blog/enneagram/enneagram-type-2">Type 2: The Helper</a>
					<a href="/blog/enneagram/enneagram-type-3">Type 3: The Achiever</a>
					<a href="/blog/enneagram/enneagram-type-4">Type 4: The Individualist</a>
					<a href="/blog/enneagram/enneagram-type-5">Type 5: The Investigator</a>
					<a href="/blog/enneagram/enneagram-type-6">Type 6: The Loyalist</a>
					<a href="/blog/enneagram/enneagram-type-7">Type 7: The Enthusiast</a>
					<a href="/blog/enneagram/enneagram-type-8">Type 8: The Challenger</a>
					<a href="/blog/enneagram/enneagram-type-9">Type 9: The Peacemaker</a>
				</div>
			</div>
			<div class="subnav">
				<button class="subnavbtn">Personal Development <i class="fa fa-caret-down" /></button>
				<div class="subnav-content">
					<a href="/blog/enneagram/enneagram-personality-test">Determining your type</a>
					<a href="/blog/enneagram/enneagram-self-development">Self development</a>
					<a href="/blog/enneagram/enneagram-strengths-and-weaknesses">Strengths and weaknesses</a>
					<a href="/blog/enneagram/enneagram-personal-growth">Growth strategies</a>
				</div>
			</div>
			<div class="subnav">
				<button class="subnavbtn">Relationships <i class="fa fa-caret-down" /></button>
				<div class="subnav-content">
					<a href="/blog/enneagram/enneagram-types-in-relationships">Types in relationships</a>
					<a href="/blog/enneagram/enneagram-communication-tips">Communication tips</a>
					<a href="/blog/enneagram/enneagram-communication-styles">Communication styles</a>
				</div>
			</div>
			<div class="subnav">
				<button class="subnavbtn">Workplace <i class="fa fa-caret-down" /></button>
				<div class="subnav-content">
					<a href="/blog/enneagram/enneagram-workplace-team-building">Team building</a>
					<a href="/blog/enneagram/enneagram-types-working-in-teams">Working in teams</a>
					<a href="/blog/enneagram/enneagram-team-dynamics">Team dynamics</a>
					<a href="/blog/enneagram/enneagram-team-diversity">Team diversity</a>
				</div>
			</div>
			<div class="subnav">
				<button class="subnavbtn">Resources <i class="fa fa-caret-down" /></button>
				<div class="subnav-content">
					<a href="/blog/enneagram/enneagram-faqs">FAQs</a>
					<a href="/blog/enneagram/enneagram-books-websites-podcasts"
						>Books, websites, and podcasts</a
					>
					<!-- <a href="#tests">Tests and assessments</a>
					<a href="#coaches">Coaches and trainers</a> -->
				</div>
			</div>
			<div class="subnav">
				<button class="subnavbtn">Situational Topics <i class="fa fa-caret-down" /></button>
				<div class="subnav-content">
					<a href="/blog/enneagram/enneagram-types-at-party">Types at a party</a>
					<a href="/blog/enneagram/enneagram-types-being-ghosted">Impact of ghosting</a>
					<a href="/blog/enneagram/enneagram-types-in-stress">Navigating stress</a>
					<a href="/blog/famous-enneagram-types">Analysis of famous people</a>
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
		border-radius: 5px;
		border: var(--classic-border);
		background-color: white;
	}

	.mobile-card {
		border-radius: 5px;
		border: var(--classic-border);

		.subnav-content {
			border-radius: 5px;
			border: var(--classic-border);
		}
	}
	.arrow {
		fill: var(--color-theme-purple);
	}
	.navbar-blogs {
		overflow: hidden;
		// background-color: #e8edf1;
		border-radius: 5px;
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
		color: var(--color-theme-purple);
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

	.subnav .subnavbtn {
		font-size: 16px;
		border: none;
		outline: none;
		color: var(--color-theme-purple);
		padding: 14px 16px;
		background-color: inherit;
		font-family: inherit;
		margin: 0;
		text-align: left;
		width: 100%;
		z-index: 1234;
	}

	.navbar-blogs a:hover,
	.subnav:hover .subnavbtn {
		background-color: #e8edf1;
		z-index: 1234;
	}

	.subnav-content {
		display: none;
		position: absolute;
		// top: 100px;
		// left: 0;
		background-color: white;
		// width: 100%;
		// display: flex;
		flex-direction: column;
		left: 100%;
		// top: 0;
		z-index: 1234;
	}

	.subnav-content a {
		float: left;
		color: var(--color-theme-purple);
		// text-decoration: none;
		z-index: 1234;
	}

	.subnav-content a:hover {
		background-color: #eee;
		color: black;
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

	.main-subnav .main-subnavbtn {
		// font-size: 16px;
		display: flex;
		align-items: center;
		// border: none;
		outline: none;
		box-sizing: border-box;
		color: var(--color-theme-purple);
		// background: white;
		// padding: 14px 16px;
		// background-color: inherit;
		// font-family: inherit;
		// margin: 0;
		z-index: 1234;
		// float: left;
		font-size: 16px;
		color: var(--color-theme-purple);
		text-align: center;
		padding: 14px 16px;
		// text-decoration: none;
		z-index: 1234;
	}

	.navbar-blogs a:hover,
	.main-subnav:hover .main-subnavbtn {
		// background-color: white;
		z-index: 1234;
	}

	.main-subnav-content {
		display: none;
		position: absolute;
		// left: 0;
		background-color: white;
		// width: 100%;
		// display: flex;
		flex-direction: column;
		z-index: 1234;
	}

	.main-subnav-content a {
		float: left;
		color: var(--color-theme-purple);
		// text-decoration: none;
		z-index: 1234;
	}

	.main-subnav-content a:hover {
		background-color: #eee;
		color: black;
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
