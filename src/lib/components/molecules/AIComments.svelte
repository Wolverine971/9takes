<!-- AIComments.svelte -->
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
		<h2 class="text-xl font-semibold mb-4 text-neutral-900 py-2 text-center relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-[60px] after:h-0.5 after:bg-primary-500 after:rounded-sm">
			Enneagram Takes (stereotypes)
		</h2>

		<div class="relative flex items-center justify-center overflow-hidden border border-neutral-400 rounded bg-white mb-4 shadow-sm" role="region" aria-live="polite">
			<button
				class="w-10 h-10 sm:w-8 sm:h-8 ml-2 bg-white/80 border-none cursor-pointer text-primary-500 transition-all duration-300 rounded-full flex items-center justify-center z-10 shadow-sm hover:bg-white hover:text-primary-600 hover:scale-110"
				on:click={moveLeft}
				aria-label="Previous perspective"
				title="Previous perspective"
			>
				<LeftIcon />
			</button>

			<div class="flex-1 overflow-hidden">
				<div class="flex transition-transform duration-300 ease-out" style="transform: translateX(-{active * 100}%)">
					{#each data.ai_comments as comment, index}
						<div
							class="flex-none w-full p-4 box-border transition-opacity duration-300 {index === active ? 'opacity-100' : 'opacity-30'}"
							role="tabpanel"
							id={`enneagram-type-${comment.enneagram_type}`}
							aria-labelledby={`enneagram-type-${comment.enneagram_type}-tab`}
							tabindex={index === active ? 0 : -1}
						>
							<Card>
								<div
									class="flex flex-col items-center text-center gap-6 p-4 min-h-[200px] justify-center"
									itemscope
									itemtype="https://schema.org/Answer"
									in:fade={{ duration: 300, delay: 100 }}
								>
									<p class="m-0 leading-relaxed text-lg sm:text-base text-neutral-900 italic" itemprop="text">
										{comment.comment}
									</p>
									<span class="py-2 px-4 border border-primary-100 font-semibold rounded transition-all duration-300 bg-primary-100 text-primary-800">
										Type {comment.enneagram_type}
									</span>
								</div>
							</Card>
						</div>
					{/each}
				</div>
			</div>

			<button
				class="w-10 h-10 sm:w-8 sm:h-8 mr-2 bg-white/80 border-none cursor-pointer text-primary-500 transition-all duration-300 rounded-full flex items-center justify-center z-10 shadow-sm hover:bg-white hover:text-primary-600 hover:scale-110"
				on:click={moveRight}
				aria-label="Next perspective"
				title="Next perspective"
			>
				<RightIcon />
			</button>
		</div>

		<div class="flex justify-center mt-2 gap-2" role="tablist">
			{#each data.ai_comments as comment, index}
				<button
					class="w-2.5 h-2.5 rounded-full border-none p-0 cursor-pointer transition-all duration-300 {active === index ? 'bg-primary-500 scale-110' : 'bg-neutral-400 hover:bg-neutral-600'}"
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