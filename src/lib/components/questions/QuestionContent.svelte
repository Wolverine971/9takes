<script lang="ts">
	import { browser } from '$app/environment';
	import CameraIcon from '../icons/cameraIcon.svelte';
	import CommentsIcon from '../icons/commentsIcon.svelte';
	import PostIcon from '../icons/postIcon.svelte';
	import { Comments } from '../molecules';

	export let data: any;
	let question: string = '';
	let selectedTab: string = 'comments';
</script>

<div class="tab">
	<button
		class="tablinks {selectedTab === 'comments' && 'active'}"
		on:click={() => (selectedTab = 'comments')}
		>Comments
		<!-- <img src="/svgs/comment-outline.svg" class="icons" /> -->
		<CommentsIcon
			iconStyle={'margin-left: .5rem'}
			height={'1.5rem'}
			fill={selectedTab === 'comments' ? '#5407d9' : ''}
		/>
	</button>
	<button
		class="tablinks {selectedTab === 'visuals' && 'active'}"
		on:click={() => (selectedTab = 'visuals')}
	>
		Visuals
		<!-- <img src="/svgs/camera.svg" class="icons" /> -->
		<CameraIcon
			iconStyle={'margin-left: .5rem'}
			height={'1.5rem'}
			fill={selectedTab === 'visuals' ? '#5407d9' : ''}
		/>
	</button>
	<button
		class="tablinks {selectedTab === 'articles' && 'active'}"
		on:click={() => (selectedTab = 'articles')}
	>
		Articles
		<!-- <img src="/svgs/post.svg" class="icons" /> -->
		<PostIcon
			iconStyle={'margin-left: .5rem'}
			height={'1.5rem'}
			fill={selectedTab === 'articles' ? '#5407d9' : ''}
		/>
	</button>
</div>
<div class="box">
	<div class="flexr {selectedTab === 'comments' && 'first'}">
		<h3 class="tabHeader">Comments</h3>
		<!-- Renders for SEO, removed if not answered -->
		{#if !browser || data.flags.userHasAnswered}
			<!-- <h3>Renders for SEO, removed if not answered</h3> -->
			{#if data.comments.length}
				<Comments {data} nested={true} parentType={'question'} />
			{:else}
				<p>nothing right now</p>
			{/if}
		{/if}
		{#if data.flags.userHasAnswered && !browser}
			<h3>Renders only if answered</h3>
			<h1>Comments</h1>
			<!-- Renders only if answered -->
			<li>Answer Two</li>
			<li>Answer Three</li>
			<!-- only load first or top comment -->
			{#if data.comments.length}
				<Comments {data} nested={false} parentType={'question'} />
			{/if}
		{/if}
		{#if !data?.comments?.length}
			<p>nothing right now</p>
		{/if}
	</div>

	<div class="flexr {selectedTab === 'articles' && 'first'}">
		<h3 class="tabHeader">Articles</h3>
		<p>nothing right now</p>
	</div>
	<div class="flexr {selectedTab === 'visuals' && 'first'}">
		<h3 class="tabHeader">Visuals</h3>
		<p>nothing right now</p>
	</div>
</div>

<style lang="scss">
	.tabHeader {
		border: 1px solid var(--color-bg-2);
		border-radius: 5px;
		text-align: center;
	}
	.tablinks {
		display: flex;
		margin: 0.25rem;
	}
	.flexr {
		flex: 1 0 100%;
	}
	.first {
		order: -1;
	}
	.box {
		display: flex;
		flex-wrap: wrap;
		flex-direction: row;
	}
	/* Style the tab */
	.tab {
		overflow: hidden;
		display: flex;
	}

	/* Style the buttons inside the tab */
	.tab button {
		background-color: inherit;
		// float: left;
		border: none;
		outline: none;
		cursor: pointer;
		padding: 1rem;
		transition: 0.3s;
		font-size: 1rem;
		border-radius: 5px;
	}

	/* Change background color of buttons on hover */
	.tab button:hover {
		background-color: var(--color-bg-0);
		border-radius: 5px;
	}

	/* Create an active/current tablink class */
	.tab button.active {
		text-decoration: underline;
		border-radius: 5px;
		color: var(--color-theme-purple);
		border: 1px solid var(--color-theme-purple);
	}

	@media (max-width: 768px) {
		.question-form {
			flex-direction: column;
		}
	}
</style>