<script lang="ts">
	import { browser } from '$app/environment';
	import Card from '../atoms/card.svelte';

	export let parentType: string = 'comment';

	export let data: any;
	export let user: any;
	export let questionId: number;

	let innerWidth = 0;
</script>

<svelte:window bind:innerWidth />

{#if !browser || (data?.ai_comments?.length && parentType === 'question' && data?.flags?.userHasAnswered)}
	<!-- <h3>Renders for SEO, removed if not answered</h3> -->
	{#if data?.ai_comments?.length}
		<div>
			{#each data.ai_comments as comment}
				<Card style="margin: .5rem 0; border: 1px solid black">
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
	{:else}
		<p>nothing right now</p>
	{/if}
{/if}

<style lang="scss">
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
		border-radius: 5px;
		transition: all 0.5s;
		-moz-transition: all 0.5s; /* Firefox 4 */
		-webkit-transition: all 0.5s; /* Safari and Chrome */
		-o-transition: all 0.5s; /* Opera */
		// cursor: pointer;
		word-break: keep-all;
	}
</style>
