<script lang="ts">
	import Card from '$lib/components/atoms/card.svelte';
	import BlogComments from '$lib/components/blog/BlogComments.svelte';
	import DownIcon from '$lib/components/icons/downIcon.svelte';
	import { notifications } from '$lib/components/molecules/notifications';
	import MasterCommentIcon from '$lib/components/icons/masterCommentIcon.svelte';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let comment: any;
	export let parentType: string;
	export let slug: string;
	export let session: any;

	export let userHasAnswered: any;

	let _commentComment: any = null;
	if (comment?.id) {
		_commentComment = Object.assign({}, comment);
	}

	$: comment, matchData();

	const matchData = () => {
		_commentComment = Object.assign({}, comment);
	};

	let loading: boolean = false;
	let innerWidth = 0;

	const lastDate = comment?.comments?.length
		? comment?.comments[comment?.comments?.length - 1]?.created_at || null
		: null;

	const loadMore = async () => {
		if (!session?.user?.id) {
			notifications.info('Must register or login to see nested comments', 3000);
			return;
		}
		loading = true;
		await fetch(`/comments/?type=${'comment'}&parentId=${comment.id}&lastDate=${lastDate}`)
			.then((response) => response.json())
			.then((newcommentData) => {
				if (!_commentComment.comments) {
					_commentComment.comments = [];
				}
				_commentComment.comments = [..._commentComment.comments, ...newcommentData];
				loading = false;
			});
	};
</script>

<svelte:window bind:innerWidth />

<Card style="margin: .5rem 0; padding: .5rem;">
	{#if innerWidth > 500}
		<div class="comment-meta">
			<span style="min-width:30px"
				>{new Date(_commentComment.created_at).toLocaleDateString('en-US')}
			</span>
		</div>
	{/if}
	<div class="user-comment">
		<div style={innerWidth > 500 ? 'width: 95%;' : 'flex-direction: column; width: 100%;'}>
			<p class="comment-box">
				<a
					class="profile-avatar {_commentComment?.profiles?.external_id ? '' : 'disabled'}"
					href={_commentComment?.profiles?.external_id
						? `/users/${_commentComment.profiles.external_id}`
						: ''}>{_commentComment?.profiles?.enneagram || 'Rando'}</a
				>: {_commentComment.comment}
			</p>
			{#if innerWidth < 500}
				<hr class="rounded" />
				<div style="display: flex; align-items: center; gap: 0.5rem;">
					<div class="comment-meta">
						<span style="min-width:30px"
							>{new Date(_commentComment.created_at).toLocaleDateString('en-US')}
						</span>
					</div>
				</div>
			{/if}
		</div>
	</div>

	{#if _commentComment?.comments?.length}
		<div style="margin-left:10px;">
			<BlogComments
				{slug}
				comments={comment.comments}
				{session}
				parentType={'comment'}
				{userHasAnswered}
			/>
		</div>
	{/if}
	{#if _commentComment.comment_count && !_commentComment?.comments?.length}
		<button type="button" class="drop-down" on:click={loadMore} title="Load more comments">
			{comment.comment_count}
			{#if loading}
				<div class="loader" />
			{:else}
				<MasterCommentIcon
					iconStyle={'padding: 0.25rem;'}
					height={'1rem'}
					fill={'#5407d9'}
					type={'multiple'}
				/>
				<DownIcon iconStyle={'padding: 0.25rem;'} height={'1rem'} fill={''} />
			{/if}
		</button>
	{/if}
</Card>

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
		background-color: var(--color-paladin-2);
		border-radius: 5px;
		border: 1px solid var(--color-paladin-4);

		&:hover {
			background-color: var(--color-paladin-4);
		}
	}
	.comment-box {
		width: -webkit-fill-available;
		border-radius: 5px;
		margin: 0.25rem;
		padding: 0.5rem;
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
		margin-right: 1rem;
	}
	.profile-avatar {
		min-width: 30px;
		padding: 0.2rem;

		align-self: center;
		align-items: center;
		border: 1px solid var(--color-p-origin-v);
		font-weight: bolder;
		min-width: 3rem;
		text-align: center;
		aspect-ratio: 1/1;
		border-radius: 5px;
		transition: all 0.5s;
		-moz-transition: all 0.5s; /* Firefox 4 */
		-webkit-transition: all 0.5s; /* Safari and Chrome */
		-o-transition: all 0.5s; /* Opera */
		cursor: pointer;
		word-break: keep-all;

		&:hover {
			border: 1px solid var(--color-p-origin);
		}
	}
	
	
	
	

	
</style>
