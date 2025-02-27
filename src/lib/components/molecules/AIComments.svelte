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

	// Auto-rotate comments (can be implemented if desired)
	// let autoRotateInterval: number;
	// function startAutoRotate() {
	//   autoRotateInterval = setInterval(() => {
	//     moveRight();
	//   }, 5000);
	// }
	// function stopAutoRotate() {
	//   clearInterval(autoRotateInterval);
	// }

	onMount(() => {
		// Auto-rotation could be initialized here
		// startAutoRotate();
		// return () => {
		//   stopAutoRotate();
		// };
	});
</script>

<svelte:window on:keydown={handleKeydown} />

{#if browser && data?.ai_comments?.length && parentType === 'question' && data?.flags?.userHasAnswered && showAiComments}
	<section class="enneagram-perspectives" aria-label="Enneagram personality type perspectives">
		<h2 class="section-title">Enneagram Takes (stereotypes)</h2>

		<div class="carousel" role="region" aria-live="polite">
			<button
				class="carousel-arrow carousel-arrow-left"
				on:click={moveLeft}
				aria-label="Previous perspective"
				title="Previous perspective"
			>
				<LeftIcon />
			</button>

			<div class="carousel-content">
				<div class="carousel-track" style="transform: translateX(-{active * 100}%)">
					{#each data.ai_comments as comment, index}
						<div
							class="carousel-item"
							class:active={index === active}
							role="tabpanel"
							id={`enneagram-type-${comment.enneagram_type}`}
							aria-labelledby={`enneagram-type-${comment.enneagram_type}-tab`}
							tabindex={index === active ? 0 : -1}
						>
							<Card>
								<div
									class="comment"
									itemscope
									itemtype="https://schema.org/Answer"
									in:fade={{ duration: 300, delay: 100 }}
								>
									<p class="comment-text" itemprop="text">{comment.comment}</p>
									<span class="comment-type">Type {comment.enneagram_type}</span>
								</div>
							</Card>
						</div>
					{/each}
				</div>
			</div>

			<button
				class="carousel-arrow carousel-arrow-right"
				on:click={moveRight}
				aria-label="Next perspective"
				title="Next perspective"
			>
				<RightIcon />
			</button>
		</div>

		<div class="carousel-indicator" role="tablist">
			{#each data.ai_comments as comment, index}
				<button
					class="indicator-dot"
					class:active={active === index}
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
					<span class="visually-hidden">Type {comment.enneagram_type}</span>
				</button>
			{/each}
		</div>
	</section>
{/if}

<style lang="scss">
	.enneagram-perspectives {
		margin-bottom: 2rem;
	}

	.section-title {
		font-size: 1.25rem;
		font-weight: 600;
		margin-bottom: 1rem;
		color: var(--darkest-gray);
		padding: 0.5rem 0;
		text-align: center;
		position: relative;

		&::after {
			content: '';
			position: absolute;
			bottom: 0;
			left: 50%;
			transform: translateX(-50%);
			width: 60px;
			height: 2px;
			background: var(--accent);
			border-radius: 2px;
		}
	}

	.carousel {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		border: 1px solid var(--medium-gray);
		border-radius: var(--base-border-radius);
		background: white;
		margin-bottom: 1rem;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

		&-content {
			flex: 1;
			overflow: hidden;
		}

		&-track {
			display: flex;
			transition: transform 0.3s ease;
		}

		&-item {
			flex: 0 0 100%;
			padding: 1rem;
			box-sizing: border-box;
			opacity: 0.3;
			transition: opacity 0.3s ease;

			&.active {
				opacity: 1;
			}
		}

		&-arrow {
			background: rgba(255, 255, 255, 0.8);
			border: none;
			cursor: pointer;
			color: var(--accent);
			transition: all 0.3s ease;
			padding: 0.75rem;
			display: flex;
			align-items: center;
			justify-content: center;
			z-index: 1;
			border-radius: 50%;
			width: 40px;
			height: 40px;
			box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

			&:hover {
				background: white;
				color: var(--accent-dark);
				transform: scale(1.1);
			}

			&-left {
				margin-left: 0.5rem;
			}

			&-right {
				margin-right: 0.5rem;
			}

			@media (max-width: 576px) {
				width: 32px;
				height: 32px;
				padding: 0.5rem;
			}
		}

		&-indicator {
			display: flex;
			justify-content: center;
			margin-top: 0.5rem;
			gap: 0.5rem;
		}
	}

	.indicator-dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background-color: var(--medium-gray);
		border: none;
		padding: 0;
		cursor: pointer;
		transition: all 0.3s ease;

		&.active {
			background-color: var(--accent);
			transform: scale(1.2);
		}

		&:hover:not(.active) {
			background-color: var(--dark-gray);
		}
	}

	.comment {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: 1.5rem;
		padding: 1rem;
		min-height: 200px;
		justify-content: center;

		&-text {
			margin: 0;
			line-height: 1.6;
			font-size: 1.1rem;
			color: var(--darkest-gray);
			font-style: italic;

			@media (max-width: 576px) {
				font-size: 1rem;
				line-height: 1.5;
			}
		}

		&-type {
			padding: 0.4rem 1rem;
			border: 1px solid var(--accent-light);
			font-weight: 600;
			border-radius: var(--base-border-radius);
			transition: all 0.3s;
			background: var(--accent-light);
			color: var(--accent-dark);
		}
	}

	.visually-hidden {
		position: absolute;
		width: 1px;
		height: 1px;
		margin: -1px;
		padding: 0;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		border: 0;
	}
</style>
