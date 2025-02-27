<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/stores';

	interface NavStep {
		name: string;
		url: string;
	}

	let navSteps: NavStep[] = [];

	$: jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: navSteps.map((step, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: step.name,
			item: `https://9takes.com${step.url}`
		}))
	};

	function getHref(index: number, steps: string[]): string {
		return '/' + steps.slice(0, index).join('/');
	}

	function displayRoute(): void {
		if ($page.route.id) {
			const tempSteps = $page.route.id.split('/').filter((x) => {
				if (!x) return false;
				if (['users', 'unsubscribe', 'type', 'subtopic'].includes(x)) {
					return $page.route.id?.includes('/admin');
				}
				return true;
			});

			navSteps = tempSteps.slice(0, -1).map((step, i) => ({
				name: step === 'questions' ? 'Question List' : step.replace(/-/g, ' '),
				url: getHref(i + 1, tempSteps)
			}));
		}
	}

	afterNavigate(displayRoute);
</script>

<svelte:head>
	{#if navSteps.length}
		{@html `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`}
	{/if}
</svelte:head>

{#if navSteps.length}
	<div class="breadcrumb-container">
		<div class="back-nav">
			{#each navSteps as step, index}
				<a href={step.url} class="marquee-text">{step.name}</a>
				{#if index < navSteps.length - 1}
					<span class="marquee-text separator">></span>
				{/if}
			{/each}
		</div>
	</div>
{/if}

<style lang="scss">
	.breadcrumb-container {
		max-width: 64rem;
		margin: auto;
		padding: 0 2rem;
	}

	.back-nav {
		width: 100%;
		height: 2rem;
		border-bottom: 1px solid rgba(44, 45, 42, 0.25);
		display: flex;
		align-items: center;
		overflow: hidden;
	}

	.marquee-text {
		color: var(--dark-gray);
		text-transform: uppercase;
		font-size: 1.2rem;
		margin: 0 0.5rem;

		&.separator {
			margin: 0 0.2rem;
		}
	}

	@media (max-width: 500px) {
		.back-nav {
			border-bottom: 1px solid var(--dark-gray);
			padding: 0.5rem;
			margin: 0 0 0 1rem;
			height: 3rem;
			width: 90%;
		}
		.breadcrumb-container {
			padding: 0;
		}

		.marquee-text {
			margin: 0 0.4rem;
		}
	}
</style>
