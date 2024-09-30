<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';
	import Card from '$lib/components/atoms/card.svelte';
	import DownIcon from '$lib/components/icons/downIcon.svelte';
	import RightIcon from '$lib/components/icons/rightIcon.svelte';
	import LeftIcon from '$lib/components/icons/leftIcon.svelte';

	export let parentType: string = 'comment';
	export let data: any;
	export let showAiComments = true;

	let active = 0;
	let direction: 'left' | 'right' = 'right';
	let transitioning = false;

	function moveLeft() {
		if (transitioning) return;
		direction = 'left';
		transitioning = true;
		active = active === 0 ? data.ai_comments.length - 1 : active - 1;
		setTimeout(() => (transitioning = false), 300);
	}

	function moveRight() {
		if (transitioning) return;
		direction = 'right';
		transitioning = true;
		active = (active + 1) % data.ai_comments.length;
		setTimeout(() => (transitioning = false), 300);
	}

	onMount(() => {
		// Auto-rotation logic can be added here if needed
	});
</script>

{#if browser && data?.ai_comments?.length && parentType === 'question' && data?.flags?.userHasAnswered}
	<section class="enneagram-perspectives">
		<h2 style="padding: .5rem 0;">Enneagram Takes (stereotypes)</h2>
		{#if showAiComments}
			<div class="carousel">
				<button
					class="carousel__arrow carousel__arrow--left"
					on:click={moveLeft}
					aria-label="Previous perspective"
				>
					<LeftIcon />
				</button>
				<div class="carousel__content">
					<div class="carousel__track" style="transform: translateX(-{active * 100}%)">
						{#each data.ai_comments as comment, index}
							<div class="carousel__item" class:active={index === active}>
								<Card>
									<div class="comment" itemscope itemtype="https://schema.org/Answer">
										<p class="comment__text" itemprop="text">{comment.comment}</p>
										<span class="comment__type">Type {comment.enneagram_type}</span>
									</div>
								</Card>
							</div>
						{/each}
					</div>
				</div>
				<button
					class="carousel__arrow carousel__arrow--right"
					on:click={moveRight}
					aria-label="Next perspective"
				>
					<RightIcon />
				</button>
			</div>
			<div class="carousel__indicator">
				{#each data.ai_comments as _, index}
					<span class={active === index ? 'active' : ''} />
				{/each}
			</div>
		{/if}
	</section>
{/if}

<style lang="scss">
	.enneagram-perspectives {
		margin-bottom: 2rem;

		h2 {
			margin-bottom: 1rem;
			font-size: 1.5rem;
			font-weight: 600;
		}
	}

	.carousel {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		border: 1px solid;
		border-radius: 5px;

		&__content {
			flex: 1;
			overflow: hidden;
		}

		&__track {
			display: flex;
			transition: transform 0.3s ease;
		}

		&__item {
			flex: 0 0 100%;
			padding: 0 1rem;
			box-sizing: border-box;
			opacity: 0.3;
			transition: opacity 0.3s ease;

			&.active {
				opacity: 1;
			}
		}

		&__arrow {
			background: none;
			border: none;
			cursor: pointer;
			color: var(--color-paladin-3);
			transition: color 0.3s ease;
			padding: 0.5rem;
			display: flex;
			align-items: center;
			justify-content: center;
			z-index: 1;

			&:hover {
				color: var(--color-paladin-4);
			}

			&--left {
				margin-right: 0.5rem;
			}

			&--right {
				margin-left: 0.5rem;
			}
		}

		&__indicator {
			display: flex;
			justify-content: center;
			margin-top: 1rem;

			span {
				width: 8px;
				height: 8px;
				border-radius: 50%;
				background-color: var(--color-paladin-3);
				margin: 0 5px;
				opacity: 0.5;
				transition: opacity 0.3s ease;

				&.active {
					opacity: 1;
				}
			}
		}
	}

	.comment {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: 1rem;
		padding: 1rem;

		&__text {
			margin: 0;
			line-height: 1.6;
		}

		&__type {
			padding: 0.2rem 0.5rem;
			border: 1px solid var(--color-paladin-3-v);
			font-weight: 600;
			border-radius: var(--base-border-radius);
			transition: all 0.5s;
		}
	}

	@media (max-width: 768px) {
		.carousel {
			&__arrow {
				position: absolute;
				top: 50%;
				transform: translateY(-50%);

				&--left {
					left: 0;
				}

				&--right {
					right: 0;
				}
			}

			&__item {
				padding: 0 2rem;
			}
		}
	}
</style>
