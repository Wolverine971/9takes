<!-- src/lib/components/molecules/AIComments.svelte -->
<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';
	import Card from '$lib/components/atoms/card.svelte';
	import LeftIcon from '$lib/components/icons/leftIcon.svelte';
	import RightIcon from '$lib/components/icons/rightIcon.svelte';

	export let parentType: string = 'comment';
	export let data: any;
	export let showAiComments = true;

	// State variables
	let active = 0;
	let direction: 'left' | 'right' = 'right';
	let transitioning = false;

	// Navigation functions
	function moveLeft() {
		if (transitioning || !data?.ai_comments?.length) return;
		direction = 'left';
		transitioning = true;
		active = active === 0 ? data.ai_comments.length - 1 : active - 1;
		setTimeout(() => (transitioning = false), 300);
	}

	function moveRight() {
		if (transitioning || !data?.ai_comments?.length) return;
		direction = 'right';
		transitioning = true;
		active = (active + 1) % data.ai_comments.length;
		setTimeout(() => (transitioning = false), 300);
	}

	// Handle keyboard navigation
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'ArrowLeft') {
			moveLeft();
		} else if (event.key === 'ArrowRight') {
			moveRight();
		}
	}

	onMount(() => {
		// Auto-rotation could be initialized here if desired
	});
</script>

<svelte:window on:keydown={handleKeydown} />

{#if browser && data?.ai_comments?.length && parentType === 'question' && data?.flags?.userHasAnswered && showAiComments}
	<section class="mb-8" aria-label="Enneagram personality type perspectives">
		<h2
			class="relative mb-4 py-2 text-center text-xl font-semibold text-neutral-900 after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-[60px] after:-translate-x-1/2 after:rounded-sm after:bg-primary-500 after:content-['']"
		>
			Enneagram Takes (stereotypes)
		</h2>

		<div
			class="relative mb-4 flex items-center justify-center overflow-hidden rounded border border-neutral-400 bg-white shadow-sm"
			role="region"
			aria-live="polite"
		>
			<button
				class="z-10 ml-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-none bg-white/80 text-primary-500 shadow-sm transition-all duration-300 hover:scale-110 hover:bg-white hover:text-primary-600 sm:h-8 sm:w-8"
				on:click={moveLeft}
				aria-label="Previous perspective"
				title="Previous perspective"
			>
				<LeftIcon />
			</button>

			<div class="flex-1 overflow-hidden">
				<div
					class="flex transition-transform duration-300 ease-out"
					style="transform: translateX(-{active * 100}%)"
				>
					{#each data.ai_comments as comment, index}
						<div
							class="box-border w-full flex-none p-4 transition-opacity duration-300 {index ===
							active
								? 'opacity-100'
								: 'opacity-30'}"
							role="tabpanel"
							id={`enneagram-type-${comment.enneagram_type}`}
							aria-labelledby={`enneagram-type-${comment.enneagram_type}-tab`}
							tabindex={index === active ? 0 : -1}
						>
							<Card>
								<div
									class="flex min-h-[200px] flex-col items-center justify-center gap-6 p-4 text-center"
									itemscope
									itemtype="https://schema.org/Answer"
									in:fade={{ duration: 300, delay: 100 }}
								>
									<p
										class="m-0 text-lg italic leading-relaxed text-neutral-900 sm:text-base"
										itemprop="text"
									>
										{comment.comment}
									</p>
									<span
										class="rounded border border-primary-100 bg-primary-100 px-4 py-2 font-semibold text-primary-800 transition-all duration-300"
									>
										Type {comment.enneagram_type}
									</span>
								</div>
							</Card>
						</div>
					{/each}
				</div>
			</div>

			<button
				class="z-10 mr-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-none bg-white/80 text-primary-500 shadow-sm transition-all duration-300 hover:scale-110 hover:bg-white hover:text-primary-600 sm:h-8 sm:w-8"
				on:click={moveRight}
				aria-label="Next perspective"
				title="Next perspective"
			>
				<RightIcon />
			</button>
		</div>

		<div class="mt-2 flex justify-center gap-2" role="tablist">
			{#each data.ai_comments as comment, index}
				<button
					class="h-2.5 w-2.5 cursor-pointer rounded-full border-none p-0 transition-all duration-300 {active ===
					index
						? 'scale-110 bg-primary-500'
						: 'bg-neutral-400 hover:bg-neutral-600'}"
					on:click={() => {
						direction = index > active ? 'right' : 'left';
						active = index;
					}}
					role="tab"
					id={`enneagram-type-${comment.enneagram_type}-tab`}
					aria-controls={`enneagram-type-${comment.enneagram_type}`}
					aria-selected={active === index}
					tabindex={active === index ? 0 : -1}
				>
					<span class="sr-only">Type {comment.enneagram_type}</span>
				</button>
			{/each}
		</div>
	</section>
{/if}
