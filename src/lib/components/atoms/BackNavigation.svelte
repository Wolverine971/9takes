<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';

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
	<div class="xs:px-1 mx-auto w-full max-w-4xl px-2">
		<div
			class="flex h-8 items-start border-b border-gray-800/20 transition-transform hover:-translate-x-0.5 hover:bg-black/5 active:-translate-x-1"
		>
			<button
				class="xs:p-0.5 xs:min-w-7 xs:min-h-7 mr-1 flex min-h-8 min-w-8 cursor-pointer items-center justify-center rounded border-0 bg-transparent p-1 text-gray-600 transition-colors duration-200"
				on:click={goBack}
				aria-label="Go back"
			>
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
					class="xs:w-4 xs:h-4"
				>
					<path d="M19 12H5"></path>
					<path d="M12 19l-7-7 7-7"></path>
				</svg>
			</button>

			{#if previousPage}
				<a
					href={previousPage.url}
					class="xs:text-sm xs:p-1 max-w-[calc(100%-50px)] overflow-hidden text-ellipsis whitespace-nowrap rounded px-2 py-1 capitalize text-gray-600 no-underline transition-colors duration-200"
				>
					{previousPage.name}
				</a>
			{/if}
		</div>
	</div>
{/if}

<style>
	/* Custom styles for extra small screens */
	@media (max-width: 480px) {
		.xs\:px-1 {
			padding-left: 0.25rem;
			padding-right: 0.25rem;
		}

		.xs\:p-0\.5 {
			padding: 0.125rem;
		}

		.xs\:min-w-7 {
			min-width: 1.75rem;
		}

		.xs\:min-h-7 {
			min-height: 1.75rem;
		}

		.xs\:w-4 {
			width: 1rem;
		}

		.xs\:h-4 {
			height: 1rem;
		}

		.xs\:text-sm {
			font-size: 0.85rem;
		}

		.xs\:p-1 {
			padding: 0.25rem;
		}
	}
</style>
