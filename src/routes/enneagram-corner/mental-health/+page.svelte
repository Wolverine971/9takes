<!-- src/routes/enneagram-corner/mental-health/+page.svelte -->
<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';

	export let data: PageData;

	const hubDescription = `Explore the intersection of Enneagram personality types and mental health. Our comprehensive guides help you understand how each type experiences anxiety, depression, trauma, and other mental health challenges, with tailored strategies for healing and growth.`;

	const categories = [
		{
			title: 'Core Mental Health Guides',
			description: 'Essential resources for understanding mental health through the Enneagram lens',
			blogs: data.mentalHealthBlogs.filter(
				(blog) =>
					blog.slug?.includes('enneagram-and-mental-illness') ||
					blog.slug?.includes('enneagram-anxiety-complete-guide') ||
					blog.slug?.includes('enneagram-therapy-guide')
			)
		},
		{
			title: 'Trauma & Crisis Support',
			description: 'Resources for healing, crisis management, and building resilience',
			blogs: data.mentalHealthBlogs.filter(
				(blog) =>
					blog.slug?.includes('enneagram-trauma-response-guide') ||
					blog.slug?.includes('enneagram-crisis-management-guide')
			)
		},
		{
			title: 'Specialized Topics',
			description: 'In-depth guides on specific mental health areas',
			blogs: data.mentalHealthBlogs.filter(
				(blog) =>
					blog.slug?.includes('enneagram-addiction-recovery-guide') ||
					blog.slug?.includes('enneagram-neurodivergence-guide') ||
					blog.slug?.includes('enneagram-medication-mental-health')
			)
		},
		{
			title: 'Life Stage & Environmental',
			description: 'Mental health across different life contexts',
			blogs: data.mentalHealthBlogs.filter(
				(blog) =>
					blog.slug?.includes('enneagram-parenting-mental-health') ||
					blog.slug?.includes('enneagram-workplace-mental-health')
			)
		},
		{
			title: 'Research & Science',
			description: 'Evidence-based insights and scientific findings',
			blogs: data.mentalHealthBlogs.filter((blog) =>
				blog.slug?.includes('enneagram-science-mental-health')
			)
		}
	];
</script>

<svelte:head>
	<title>Enneagram and Mental Health Hub | 9takes</title>
	<meta name="description" content={hubDescription} />
	<meta property="og:title" content="Enneagram and Mental Health Hub | 9takes" />
	<meta property="og:description" content={hubDescription} />
	<meta property="og:url" content="https://9takes.com/enneagram-corner/mental-health" />
	<meta property="og:type" content="website" />
	<link rel="canonical" href="https://9takes.com/enneagram-corner/mental-health" />
</svelte:head>

<div class="mx-auto max-w-7xl px-6">
	<nav class="mb-8 text-sm text-gray-600">
		<a href="/enneagram-corner" class="text-purple-600 no-underline hover:underline"
			>Enneagram Corner</a
		>
		<span class="mx-2">/</span>
		<span class="font-semibold text-gray-800">Mental Health</span>
	</nav>

	<header
		class="mb-16 rounded-3xl bg-gradient-to-br from-gray-800 to-gray-900 p-12 text-center text-white"
	>
		<h1 class="mb-4 text-4xl font-bold text-white lg:text-5xl">Enneagram and Mental Health</h1>
		<p class="mx-auto mb-8 max-w-3xl text-lg leading-relaxed text-white/95">{hubDescription}</p>

		<div class="mx-auto max-w-2xl rounded-xl border-2 border-white/30 bg-white/10 p-6">
			<p class="mb-2 font-semibold text-white">
				<strong>If you're in crisis, please reach out:</strong>
			</p>
			<ul class="m-0 list-none p-0">
				<li class="my-2 font-medium text-white">
					National Suicide Prevention Lifeline: <strong>988</strong>
				</li>
				<li class="my-2 font-medium text-white">
					Crisis Text Line: Text <strong>HOME</strong> to <strong>741741</strong>
				</li>
				<li class="my-2 font-medium text-white">Emergency Services: <strong>911</strong></li>
			</ul>
		</div>
	</header>

	<section class="mb-16">
		<h2 class="mb-8 text-center text-3xl font-semibold text-gray-800">
			Why Personality Type Matters in Mental Health
		</h2>
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
			<div
				class="rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-purple-200 hover:shadow-lg"
			>
				<h3 class="mb-3 text-lg font-semibold text-purple-600">Personalized Understanding</h3>
				<p class="m-0 text-sm leading-relaxed text-gray-600">
					Each Enneagram type has unique mental health vulnerabilities and strengths, helping you
					understand your specific patterns.
				</p>
			</div>
			<div
				class="rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-purple-200 hover:shadow-lg"
			>
				<h3 class="mb-3 text-lg font-semibold text-purple-600">Targeted Strategies</h3>
				<p class="m-0 text-sm leading-relaxed text-gray-600">
					What works for one type may not work for another. Find coping strategies tailored to your
					personality.
				</p>
			</div>
			<div
				class="rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-purple-200 hover:shadow-lg"
			>
				<h3 class="mb-3 text-lg font-semibold text-purple-600">Earlier Recognition</h3>
				<p class="m-0 text-sm leading-relaxed text-gray-600">
					Understanding your type's warning signs helps you recognize mental health challenges
					before they escalate.
				</p>
			</div>
			<div
				class="rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-purple-200 hover:shadow-lg"
			>
				<h3 class="mb-3 text-lg font-semibold text-purple-600">Better Treatment Outcomes</h3>
				<p class="m-0 text-sm leading-relaxed text-gray-600">
					Type-aware therapy approaches lead to more effective treatment and sustainable recovery.
				</p>
			</div>
		</div>
	</section>

	<section class="mb-16">
		<h2 class="mb-8 text-center text-3xl font-semibold text-gray-800">
			Quick Navigation by Your Type
		</h2>
		<div class="mx-auto grid max-w-2xl grid-cols-3 gap-6">
			{#each Array(9) as _, i}
				<a
					href="#{i + 1}"
					class="flex flex-col items-center rounded-xl border border-gray-200 bg-white p-6 no-underline shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-purple-50 hover:shadow-lg"
				>
					<div class="mb-1 text-3xl font-bold text-purple-600">{i + 1}</div>
					<div class="text-sm text-gray-600">Type {i + 1}</div>
				</a>
			{/each}
		</div>
	</section>

	{#each categories as category}
		<section class="mb-16">
			<h2 class="mb-2 text-3xl font-semibold text-gray-800">{category.title}</h2>
			<p class="mb-6 text-sm text-gray-600">{category.description}</p>
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each category.blogs as blog}
					<article
						class="rounded-xl border border-white/10 bg-gradient-to-br from-gray-900 to-gray-800 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-gradient-to-br hover:from-gray-800 hover:to-gray-700 hover:shadow-lg"
					>
						<a
							href="/enneagram-corner/mental-health/{blog.slug}"
							class="block text-inherit no-underline"
						>
							<h3 class="mb-3 text-lg font-semibold leading-tight text-white">{blog.title}</h3>
							<p class="mb-3 text-sm leading-relaxed text-white/80">{blog.description}</p>
							<span class="text-sm font-medium text-purple-400">Read Guide →</span>
						</a>
					</article>
				{/each}
			</div>
		</section>
	{/each}

	<section class="mb-16">
		<h2 class="mb-4 text-center text-3xl font-semibold text-gray-800">
			Mental Health Resources by Enneagram Type
		</h2>
		<p class="mb-12 text-center text-sm text-gray-600">
			Find all mental health resources specific to your type in one place.
		</p>

		{#each Array(9) as _, i}
			{@const typeNum = i + 1}
			{@const typeBlogs = data.mentalHealthBlogs.filter(
				(blog) => blog.loc && !blog.loc.includes(`type-${typeNum}`) // This would need adjustment based on how type-specific content is marked
			)}
			<div
				id={typeNum.toString()}
				class="mb-8 rounded-xl border border-gray-100 bg-white p-8 shadow-sm"
			>
				<h3 class="mb-6 text-xl font-semibold text-purple-600">
					Type {typeNum} Mental Health Resources
				</h3>
				<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
					<div>
						<h4 class="mb-4 text-lg">Common Vulnerabilities</h4>
						<ul class="m-0 list-disc pl-6">
							{#if typeNum === 1}
								<li class="mb-2 text-sm text-gray-600">Anxiety disorders</li>
								<li class="mb-2 text-sm text-gray-600">Obsessive-compulsive tendencies</li>
								<li class="mb-2 text-sm text-gray-600">Perfectionism-related depression</li>
							{:else if typeNum === 2}
								<li class="mb-2 text-sm text-gray-600">Codependency</li>
								<li class="mb-2 text-sm text-gray-600">Boundary issues</li>
								<li class="mb-2 text-sm text-gray-600">Caregiver burnout</li>
							{:else if typeNum === 3}
								<li class="mb-2 text-sm text-gray-600">Workaholism and burnout</li>
								<li class="mb-2 text-sm text-gray-600">Identity-based depression</li>
								<li class="mb-2 text-sm text-gray-600">Stress-related health issues</li>
							{:else if typeNum === 4}
								<li class="mb-2 text-sm text-gray-600">Major depression</li>
								<li class="mb-2 text-sm text-gray-600">Emotional dysregulation</li>
								<li class="mb-2 text-sm text-gray-600">Identity disturbances</li>
							{:else if typeNum === 5}
								<li class="mb-2 text-sm text-gray-600">Social anxiety</li>
								<li class="mb-2 text-sm text-gray-600">Avoidant patterns</li>
								<li class="mb-2 text-sm text-gray-600">Dissociation</li>
							{:else if typeNum === 6}
								<li class="mb-2 text-sm text-gray-600">Generalized anxiety disorder</li>
								<li class="mb-2 text-sm text-gray-600">Phobias</li>
								<li class="mb-2 text-sm text-gray-600">Hypervigilance</li>
							{:else if typeNum === 7}
								<li class="mb-2 text-sm text-gray-600">ADHD-like symptoms</li>
								<li class="mb-2 text-sm text-gray-600">Addiction vulnerabilities</li>
								<li class="mb-2 text-sm text-gray-600">Masked depression</li>
							{:else if typeNum === 8}
								<li class="mb-2 text-sm text-gray-600">Anger management issues</li>
								<li class="mb-2 text-sm text-gray-600">Vulnerability avoidance</li>
								<li class="mb-2 text-sm text-gray-600">Stress-related illness</li>
							{:else if typeNum === 9}
								<li class="mb-2 text-sm text-gray-600">Clinical depression</li>
								<li class="mb-2 text-sm text-gray-600">Dissociative tendencies</li>
								<li class="mb-2 text-sm text-gray-600">Chronic fatigue</li>
							{/if}
						</ul>
					</div>
					<div>
						<h4 class="mb-4 text-lg">Healing Strengths</h4>
						<ul class="m-0 list-disc pl-6">
							{#if typeNum === 1}
								<li class="mb-2 text-sm text-gray-600">Strong commitment to recovery</li>
								<li class="mb-2 text-sm text-gray-600">Systematic approach to healing</li>
								<li class="mb-2 text-sm text-gray-600">High integrity in treatment</li>
							{:else if typeNum === 2}
								<li class="mb-2 text-sm text-gray-600">Natural support network building</li>
								<li class="mb-2 text-sm text-gray-600">Emotional intelligence</li>
								<li class="mb-2 text-sm text-gray-600">Helping others aids own healing</li>
							{:else if typeNum === 3}
								<li class="mb-2 text-sm text-gray-600">Goal-oriented recovery</li>
								<li class="mb-2 text-sm text-gray-600">Resilience and adaptability</li>
								<li class="mb-2 text-sm text-gray-600">Success-driven healing</li>
							{:else if typeNum === 4}
								<li class="mb-2 text-sm text-gray-600">Deep self-awareness</li>
								<li class="mb-2 text-sm text-gray-600">Creative expression for healing</li>
								<li class="mb-2 text-sm text-gray-600">Authenticity in recovery</li>
							{:else if typeNum === 5}
								<li class="mb-2 text-sm text-gray-600">Research-based approach</li>
								<li class="mb-2 text-sm text-gray-600">Self-sufficiency in healing</li>
								<li class="mb-2 text-sm text-gray-600">Intellectual understanding aids recovery</li>
							{:else if typeNum === 6}
								<li class="mb-2 text-sm text-gray-600">Loyalty to support systems</li>
								<li class="mb-2 text-sm text-gray-600">Thorough treatment planning</li>
								<li class="mb-2 text-sm text-gray-600">Community-oriented recovery</li>
							{:else if typeNum === 7}
								<li class="mb-2 text-sm text-gray-600">Optimistic recovery outlook</li>
								<li class="mb-2 text-sm text-gray-600">Multiple healing modalities</li>
								<li class="mb-2 text-sm text-gray-600">Enthusiasm for growth</li>
							{:else if typeNum === 8}
								<li class="mb-2 text-sm text-gray-600">Strong determination</li>
								<li class="mb-2 text-sm text-gray-600">Leadership in recovery</li>
								<li class="mb-2 text-sm text-gray-600">Protective of healing space</li>
							{:else if typeNum === 9}
								<li class="mb-2 text-sm text-gray-600">Holistic healing approach</li>
								<li class="mb-2 text-sm text-gray-600">Natural mediator in groups</li>
								<li class="mb-2 text-sm text-gray-600">Steady, sustainable recovery</li>
							{/if}
						</ul>
					</div>
				</div>
			</div>
		{/each}
	</section>

	<section
		class="rounded-3xl bg-gradient-to-br from-gray-800 to-gray-900 p-12 text-center text-white"
	>
		<h2 class="mb-4 text-3xl font-semibold text-white">Start Your Mental Health Journey</h2>
		<p class="mb-8 text-sm text-white/95">
			Understanding your Enneagram type is the first step toward personalized mental health care.
		</p>
		<div class="flex flex-wrap justify-center gap-4">
			<a
				href="/enneagram-corner/mental-health/enneagram-anxiety-complete-guide"
				class="rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 px-8 py-3 font-medium text-white no-underline transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-600/30"
			>
				Read Our Anxiety Guide
			</a>
			<a
				href="/questions"
				class="rounded-lg border-2 border-white bg-transparent px-8 py-3 font-medium text-white no-underline transition-all duration-300 hover:bg-white hover:text-gray-800"
			>
				Discover Your Type
			</a>
		</div>
	</section>
</div>
