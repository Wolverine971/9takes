<!-- src/lib/components/molecules/AIComments.svelte -->
<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import LeftIcon from '$lib/components/icons/leftIcon.svelte';
	import RightIcon from '$lib/components/icons/rightIcon.svelte';
	import type { QuestionPageData } from '$lib/types/questions';

	export let parentType: 'question' | 'comment' = 'comment';
	export let data: QuestionPageData;
	export let showAiComments = true;

	// State variables
	let active = 0;
	let direction: 'left' | 'right' = 'right';
	let transitioning = false;
	let carouselRef: HTMLElement;

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

	onMount(() => {
		// Auto-rotation could be initialized here if desired
	});
</script>

{#if browser && data?.ai_comments?.length && parentType === 'question' && data?.flags?.userHasAnswered && showAiComments}
	<section class="mb-4 p-1" aria-label="Enneagram personality type perspectives">
		<h3 class="m-2 text-center text-sm font-medium text-slate-400">
			Enneagram Takes (stereotypes)
		</h3>

		<div
			bind:this={carouselRef}
			class="relative flex items-center justify-center overflow-hidden rounded-lg border border-slate-700/30 bg-[#1a1a2e] focus:outline-none focus:ring-2 focus:ring-purple-500/50"
			role="region"
			aria-live="polite"
			aria-roledescription="carousel"
			aria-label="Enneagram personality type perspectives carousel"
		>
			<button
				class="z-10 ml-1 flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full border-none bg-[#252538] text-purple-400 transition-all duration-200 hover:bg-purple-500/20 hover:text-purple-300"
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
							class="box-border w-full flex-none px-2 py-2 transition-opacity duration-300 {index ===
							active
								? 'opacity-100'
								: 'opacity-30'}"
							role="tabpanel"
							id={`enneagram-type-${comment.enneagram_type}`}
							aria-labelledby={`enneagram-type-${comment.enneagram_type}-tab`}
							tabindex={index === active ? 0 : -1}
						>
							<div
								class="flex items-center gap-3"
								itemscope
								itemtype="https://schema.org/Answer"
								in:fade={{ duration: 200, delay: 50 }}
							>
								<span
									class="shrink-0 rounded-md bg-purple-500/20 px-2 py-1 text-xs font-semibold text-purple-300"
								>
									Type {comment.enneagram_type}
								</span>
								<p class="m-0 line-clamp-2 text-sm italic text-slate-300" itemprop="text">
									{comment.comment}
								</p>
							</div>
						</div>
					{/each}
				</div>
			</div>

			<button
				class="z-10 mr-1 flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full border-none bg-[#252538] text-purple-400 transition-all duration-200 hover:bg-purple-500/20 hover:text-purple-300"
				on:click={moveRight}
				aria-label="Next perspective"
				title="Next perspective"
			>
				<RightIcon />
			</button>
		</div>

		<div class="mt-1.5 flex justify-center gap-1.5" role="tablist">
			{#each data.ai_comments as comment, index}
				<button
					class="h-1.5 w-1.5 cursor-pointer rounded-full border-none p-0 transition-all duration-200 {active ===
					index
						? 'bg-purple-500'
						: 'bg-slate-600 hover:bg-slate-500'}"
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
