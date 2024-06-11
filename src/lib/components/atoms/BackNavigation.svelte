<script lang="ts">
	import { onMount } from 'svelte';
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	let navSteps: { name: string; url: string }[] = [];
	onMount(async () => {
		if ($page.route.id) {
			await displayRoute();
		}
	});
	// $: if ($afterNavigate) displayRoute();

	afterNavigate(() => {
		displayRoute();
	});

	const displayRoute = async () => {
		if ($page.route.id) {
			const tempSteps = $page.route.id.split('/').filter((x) => {
				if (!!x) {
					if (x === 'users' || x === 'unsubscribe' || x === 'type' || x === 'subtopic') {
						if ($page.route.id?.includes('/admin')) {
							return true;
						}
						return false;
					}
					return true;
				}
				return false;
			});

			if (tempSteps) {
				const tempNavSteps = tempSteps.map((step, i) => {
					let url = getHref(i + 1, tempSteps);
					return {
						name: step.split('-').join(' '),
						url
					};
				});

				// tempNavSteps.shift();
				tempNavSteps.pop();
				navSteps = tempNavSteps;
			}
		}
	};

	const getHref = (index: number, steps: string[]) => {
		const newPath = steps.slice(0, index).join('/');
		return '/' + newPath;
	};
</script>

{#if navSteps.length}
	<div style="max-width: 64rem; margin: auto;">
		<div class="back-nav" style="width: 100%">
			{#each navSteps as step}
				<a href={step.url} class="marquee-text">{step.name}</a>
				<span class="marquee-text">></span>
			{/each}
			<!-- <div class="track-horizontal-alt" style="">
		<span style="width:50%; flex: 1">
			
		</span>
	</div> -->
		</div>
	</div>
{/if}

<style lang="scss">
	.marquee-text {
		color: var(--color-paladin-3) !important;
		text-transform: uppercase;
		flex: none;
		font-size: 1.2rem;
		margin: 2rem;
	}
	a::after {
		margin: 0 0.2rem;
	}
	.back-nav {
		z-index: 200;
		width: 100%;
		height: 2rem;
		border-bottom: 2px solid var(--color-paladin-3);
		justify-content: flex-start;
		align-items: center;
		display: flex;
		overflow: hidden;
	}

	.track-horizontal-alt {
		// border-top: 1px solid grey;
		// border-bottom: 1px solid grey;
		// position: absolute;
		white-space: nowrap;
		will-change: transform;
		// animation: back-nav-alt 15s linear infinite;
		/* manipulate the speed of the marquee by changing "40s" line above*/
		display: inline-flex;
		justify-content: center;
		gap: 3rem;
		align-items: center;
		overflow: hidden;
	}

	@keyframes back-nav-alt {
		from {
			transform: translateX(-50%);
		}
		to {
			transform: translateX(0%);
		}
	}

	@media (max-width: 500px) {
		.marquee-text {
			margin: 0.8rem;
		}

		.back-nav {
			border-top: 1px solid var(--color-paladin-3);
			border-bottom: 1px solid var(--color-paladin-3);
			padding: 0.5rem;
			margin: 1rem;
			height: 3rem;
		}
	}
</style>
