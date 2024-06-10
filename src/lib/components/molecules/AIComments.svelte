<script lang="ts">
	import { browser } from '$app/environment';
	import Card from '$lib/components/atoms/card.svelte';
	import DownIcon from '$lib/components/icons/downIcon.svelte';
	import RightIcon from '$lib/components/icons/rightIcon.svelte';

	export let parentType: string = 'comment';

	export let data: any;

	let innerWidth = 0;
	export let showAiComments = true;
</script>

<svelte:window bind:innerWidth />

{#if !browser || (data?.ai_comments?.length && parentType === 'question' && data?.flags?.userHasAnswered)}
	<!-- <h3>Renders for SEO, removed if not answered</h3> -->
	{#if data?.ai_comments?.length}
		<div class="canned-resp-div">
			<div style="display: flex; justify-content: space-between; align-items: center;">
				<div>
					<h2 style="padding: 0; margin:0;">Generic responses</h2>
					<p style="margin: .5rem 0 0 0;">
						Steriotypical responses based on Enneagram types. Don't be basic! 😉
					</p>
				</div>
				<button
					on:click={() => (showAiComments = !showAiComments)}
					class="btn btn-primary"
					title="Show/Hide AI Comments"
					style="display: flex;"
				>
					{#if showAiComments}
						<DownIcon />
					{:else}
						<RightIcon />
					{/if}
				</button>
			</div>
			{#if showAiComments}
				<div>
					{#each data.ai_comments as comment}
						<Card style="margin: .5rem 0; border: 1px solid black;">
							<div
								class="user-comment"
								itemprop="suggestedAnswer acceptedAnswer"
								itemscope
								itemtype="https://schema.org/Answer"
							>
								<div
									style="display: flex; {innerWidth > 500
										? 'width: 95%;'
										: 'flex-direction: column; width: 100%;'}"
								>
									<div style="display: flex; flex-direction: column; width: 100%}">
										<p class="comment-box" id="comment-box{comment.id}">
											<span class="profile-avatar">{comment.enneagram_type}:</span>
											<span class="comment-text" itemprop="text">{comment.comment} </span>
										</p>
									</div>
								</div>
							</div>
						</Card>
					{/each}
				</div>
			{/if}
		</div>
	{/if}
{/if}

<style lang="scss">
	.canned-resp-div {
		border-radius: var(--base-border-radius);
		padding: 0.5rem;
		margin: 0.5rem;
		border: var(--color-paladin-3) 1px solid;
	}
	.comment-text {
		max-height: 3em;
		overflow: hidden;
	}

	.expanded .comment-text {
		max-height: none;
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
		-moz-transition: all 0.5s; /* Firefox 4 */
		-webkit-transition: all 0.5s; /* Safari and Chrome */
		-o-transition: all 0.5s; /* Opera */
		word-break: keep-all;
	}
</style>
