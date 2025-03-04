<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';

	export let isMobile = false;

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

	function goBack() {
		if (browser) {
			window.history.back();
		}
	}

	// Get the previous page from navSteps
	$: previousPage = navSteps.length > 0 ? navSteps[navSteps.length - 1] : null;

	afterNavigate(displayRoute);
</script>

<svelte:head>
	{#if navSteps.length}
		{@html `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`}
	{/if}
</svelte:head>

{#if navSteps.length}
	<div class="back-nav-container">
		<div class="back-nav">
			<button class="back-arrow" on:click={goBack} aria-label="Go back">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M19 12H5"></path>
					<path d="M12 19l-7-7 7-7"></path>
				</svg>
			</button>

			{#if previousPage}
				<a href={previousPage.url} class="previous-link">
					{previousPage.name}
				</a>
			{/if}
		</div>
	</div>
{/if}

<style lang="scss">
	.back-nav-container {
		max-width: 64rem;
		margin: 0 auto;
		padding: 0 0.5rem;
		width: 100%;
	}

	.back-nav {
		display: flex;
		align-items: flex-start;
		height: 2rem;
		border-bottom: 1px solid rgba(44, 45, 42, 0.2);
		&:hover {
			background-color: rgba(0, 0, 0, 0.05);
			transform: translateX(-2px);
		}

		&:active {
			transform: translateX(-4px);
		}
	}

	.back-arrow {
		display: flex;
		align-items: center;
		justify-content: center;
		background: none;
		border: none;
		padding: 0.25rem;
		min-width: 32px;
		min-height: 32px;
		color: var(--dark-gray);
		cursor: pointer;
		margin-right: 0.25rem;
		border-radius: 4px;
		transition: background-color 0.2s;
	}

	.previous-link {
		color: var(--dark-gray);
		text-decoration: none;
		text-transform: capitalize;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: calc(100% - 50px);
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		transition: background-color 0.2s;
	}

	@media (max-width: 480px) {
		.back-nav-container {
			padding: 0 0.25rem;
		}

		.back-nav {
			height: 2.25rem;
		}

		.previous-link {
			font-size: 0.85rem;
			padding: 0.25rem;
		}

		.back-arrow {
			padding: 0.125rem;
			min-width: 28px;
			min-height: 28px;

			svg {
				width: 16px;
				height: 16px;
			}
		}
	}
</style>
