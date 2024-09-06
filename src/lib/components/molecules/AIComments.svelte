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

	let innerWidth = 0;
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

	let intervalId: number;

	onMount(() => {
		// Auto-rotation logic (commented out as in your original code)
		// if (browser && showAiComments && data?.ai_comments?.length > 1) {
		// 	intervalId = setInterval(moveRight, 5000);
		// }
		// return () => {
		// 	if (intervalId) clearInterval(intervalId);
		// };
	});

	// $: if (showAiComments && data?.ai_comments?.length > 1) {
	// 	if (intervalId) clearInterval(intervalId);
	// 	intervalId = setInterval(moveRight, 5000);
	// } else {
	// 	if (intervalId) clearInterval(intervalId);
	// }
</script>

<svelte:window bind:innerWidth />

{#if !browser || (data?.ai_comments?.length && parentType === 'question' && data?.flags?.userHasAnswered)}
	{#if data?.ai_comments?.length}
		<h2 style="padding: 1rem 0; margin: .5rem 0;">Typical Enneagram Perspectives</h2>
		<div class="canned-resp-div">
			<div style="display: flex; justify-content: space-between; align-items: center;">
				<div />
			</div>
			{#if showAiComments}
				<div class="carousel-container">
					<button class="arrow arrow-left" on:click={moveLeft}>
						<LeftIcon />
					</button>
					<div class="carousel-content">
						{#each [data.ai_comments[active]] as comment (active)}
							<div
								class="carousel-item"
								in:fly={{
									x: direction === 'right' ? 300 : -300,
									duration: 300,
									easing: cubicInOut
								}}
								out:fly={{
									x: direction === 'right' ? -300 : 300,
									duration: 300,
									easing: cubicInOut
								}}
							>
								<Card style="margin: 0 1rem;">
									<div
										class="user-comment"
										itemprop="suggestedAnswer acceptedAnswer"
										itemscope
										itemtype="https://schema.org/Answer"
									>
										<div class="comment-content" style={'width: 100%;'}>
											<span class="comment-text" itemprop="text">{comment.comment}</span>
										</div>
										<span class="profile-avatar">Type {comment.enneagram_type}</span>
									</div>
								</Card>
							</div>
						{/each}
						<div class="carousel-indicator">
							{#each data.ai_comments as _, index}
								<span class={active === index ? 'active' : ''} />
							{/each}
						</div>
					</div>
					<button class="arrow arrow-right" on:click={moveRight}>
						<RightIcon />
					</button>
				</div>
			{/if}
		</div>
	{/if}
{/if}

<style lang="scss">
	@import '../molecules/comment.scss';

	.canned-resp-div {
		border-radius: var(--base-border-radius);
		padding: 0.5rem;
		margin-bottom: 0.5rem;
		border: 1px solid var(--base-grey-1);
	}
	.comment-text {
		max-height: none;
		overflow: visible;
	}

	.profile-avatar {
		min-width: 30px;
		padding: 0.2rem;
		align-self: center;
		align-items: center;
		border: 1px solid var(--color-paladin-3-v);
		font-weight: bolder;
		min-width: 3rem;
		text-align: center;
		aspect-ratio: 1/1;
		border-radius: var(--base-border-radius);
		transition: all 0.5s;
		word-break: keep-all;
	}

	.carousel-container {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		text-overflow: ellipsis;
		height: 120px; // Adjust this value based on your content
	}

	.carousel-content {
		position: relative;
		width: 100%;
		height: 100%;
		overflow: hidden;
	}

	.carousel-item {
		margin: auto;
		height: 80%;
		width: 80%;
	}

	.arrow {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		background: none;
		border: none;
		cursor: pointer;
		z-index: 10;
		color: var(--color-paladin-3);
		transition: color 0.3s ease;

		&:hover {
			color: var(--color-paladin-4);
		}

		&.arrow-left {
			left: 10px;
		}

		&.arrow-right {
			right: 10px;
		}
	}

	.comment-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: 1rem;
	}

	.carousel-indicator {
		display: flex;
		justify-content: center;
		margin-top: 1rem;
		position: absolute;
		bottom: 0;
		right: 0;
		left: 0;

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

	@media (max-width: 500px) {
		.comment-content {
			width: 100%;
		}
	}
</style>
