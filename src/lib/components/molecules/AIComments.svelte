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
				<Card style="margin: .5rem 0; padding: .5rem; border: 1px solid black">
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
{:else}
	<p>no comments</p>
{/if}

<style lang="scss">
	.rounded {
		border-radius: 5px;
		width: 80%;
	}
	.drop-down {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
		cursor: pointer;

		background-color: var(--color-paladin-1);
		border-radius: 5px;
		border: 1px solid var(--color-paladin-2);

		&:hover {
			background-color: var(--color-paladin-2);
		}
	}
	.comment-box {
		width: -webkit-fill-available;
		border-radius: 5px;
		margin: 0.25rem;
		padding: 0.5rem;
		max-height: 7em;
		overflow: hidden;
	}

	.comment-text {
		max-height: 3em;
		overflow: hidden;
	}

	.expanded .comment-text {
		max-height: none;
	}

	// .container {
	// 	// width: 300px; /* Adjust width as needed */
	// 	line-height: 1.5em;
	// 	max-height: 4.5em; /* 3 lines */
	// 	overflow: hidden;
	// 	position: relative;
	// }

	.read-more-btn {
		// display: none;
		// position: absolute;
		// bottom: 0;
		// right: 0;
		background-color: #f1f1f1;
		padding: 5px 10px;
		cursor: pointer;
	}

	.comment-box.expanded {
		max-height: none;
	}

	.comment-box.expanded .read-more-btn {
		display: none;
	}

	.user-comment {
		display: flex;
		position: relative;
	}
	.user-comment button {
		border: none;

		transition: 0.3s;
		border-radius: 5px;
		display: flex;
		justify-content: center;
		align-items: center;
		min-width: 35px;
	}
	.comment-meta {
		display: flex;
		justify-content: flex-end;
		margin: -0.5rem auto;
		gap: 1rem;
		margin-right: 4rem;
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
