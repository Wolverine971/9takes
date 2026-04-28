<!-- src/lib/components/atoms/BackNavigation.svelte -->
<script lang="ts">
	import { page } from '$app/stores';
	import { browser } from '$app/environment';

	interface NavStep {
		name: string;
		url: string;
	}

	let navSteps: NavStep[] = [];

	function getHref(index: number, steps: string[]): string {
		return '/' + steps.slice(0, index).join('/');
	}

	function buildNavSteps(pathname: string): NavStep[] {
		if (!pathname) return [];

		const isAdminRoute = pathname.includes('/admin');
		const pathSegments = pathname.split('/').filter((segment) => {
			if (!segment) return false;
			if (['users', 'unsubscribe', 'type', 'subtopic'].includes(segment)) {
				return isAdminRoute;
			}
			return true;
		});

		return pathSegments.slice(0, -1).map((segment, i) => ({
			name: segment === 'questions' ? 'Question List' : segment.replace(/-/g, ' '),
			url: getHref(i + 1, pathSegments)
		}));
	}

	function goBack() {
		if (browser) {
			window.history.back();
		}
	}

	// Get the previous page from navSteps
	$: previousPage = navSteps.length > 0 ? navSteps[navSteps.length - 1] : null;

	$: navSteps = $page?.url?.pathname ? buildNavSteps($page.url.pathname) : [];
</script>

{#if navSteps.length}
	<div class="xs:px-1 mx-auto w-full max-w-4xl px-2">
		<div
			class="flex min-h-12 items-center border-b border-[var(--border-color)] transition-transform hover:-translate-x-0.5 hover:bg-[var(--primary-subtle)] active:-translate-x-1"
		>
			<button
				class="mr-1 flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent p-2 text-[var(--text-secondary)] transition-colors duration-200 hover:text-[var(--primary)]"
				on:click={goBack}
				aria-label="Go back"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
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
				<a
					href={previousPage.url}
					class="flex min-h-11 max-w-[calc(100%-50px)] items-center overflow-hidden text-ellipsis whitespace-nowrap rounded-md px-2 py-2 capitalize text-[var(--text-secondary)] no-underline transition-colors duration-200 hover:text-[var(--primary)]"
				>
					{previousPage.name}
				</a>
			{/if}
		</div>
	</div>
{/if}

<style>
	@media (max-width: 480px) {
		.xs\:px-1 {
			padding-left: 0.25rem;
			padding-right: 0.25rem;
		}
	}
</style>
