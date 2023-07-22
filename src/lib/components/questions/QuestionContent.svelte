<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount, afterUpdate } from 'svelte';
	import Card from '../atoms/card.svelte';
	import CameraIcon from '../icons/cameraIcon.svelte';
	import MasterCommentIcon from '../icons/masterCommentIcon.svelte';
	import PostIcon from '../icons/postIcon.svelte';
	import { Comments } from '../molecules';

	export let data: any;
	export let user: any;
	let question: string = '';
	let selectedTab: string = 'comments';
	let _data: any;

	$: data, runFunc();

	const runFunc = () => {
		_data = Object.assign({}, data);
		setTimeout(() => {
			calculateHeightsAndSetClasses();
		}, 500);
	};
	let innerWidth: number = 0;

	let commentScrollElement: HTMLElement | null;
	let commentContainerElement: HTMLElement | null;
	let isFixed = false;
	let isStop = false;

	const calculateHeightsAndSetClasses = () => {
		if (commentScrollElement && commentContainerElement) {
			const elementHeight = commentScrollElement.offsetHeight;
			const containerHeight = commentContainerElement.offsetHeight;
			const distanceToScroll = containerHeight - elementHeight;

			if (distanceToScroll > 0) {
				if (window.scrollY < distanceToScroll) {
					isFixed = true;
					isStop = false;
				} else if (window.scrollY >= distanceToScroll) {
					isFixed = false;
					isStop = true;
				} else {
					isStop = false;
				}
			}
		}
	};

	onMount(() => {
		window.addEventListener('scroll', calculateHeightsAndSetClasses);
	});

	afterUpdate(calculateHeightsAndSetClasses);
</script>

<svelte:window bind:innerWidth />

<div class="tab">
	{#if innerWidth > 575}
		<button
			class="tab-links {selectedTab === 'comments' && 'tab-active'}"
			on:click={() => (selectedTab = 'comments')}
		>
			{#if _data.comment_count > 0}
				{_data.comment_count}
			{/if}
			{_data.comment_count === 1 ? 'Comment' : 'Comments'}
			<MasterCommentIcon
				iconStyle={'margin-left: .5rem'}
				height={'1.5rem'}
				fill={selectedTab === 'comments' ? '#5407d9' : ''}
				type={'multiple'}
			/>
		</button>
		<button
			class="tab-links {selectedTab === 'visuals' && 'tab-active'}"
			on:click={() => (selectedTab = 'visuals')}
		>
			Visuals
			<CameraIcon
				iconStyle={'margin-left: .5rem'}
				height={'1.5rem'}
				fill={selectedTab === 'visuals' ? '#5407d9' : ''}
			/>
		</button>
		<button
			class="tab-links {selectedTab === 'articles' && 'tab-active'}"
			on:click={() => (selectedTab = 'articles')}
		>
			Articles
			<PostIcon
				iconStyle={'margin-left: .5rem'}
				height={'1.5rem'}
				fill={selectedTab === 'articles' ? '#5407d9' : ''}
			/>
		</button>
	{:else}
		<button
			class="tab-links {selectedTab === 'comments' && 'tab-active'}"
			on:click={() => (selectedTab = 'comments')}
		>
			<MasterCommentIcon
				iconStyle={''}
				height={'1.5rem'}
				fill={selectedTab === 'comments' ? '#5407d9' : ''}
				type={'multiple'}
			/>
			<span style="text-align: center;"
				>{#if _data.comment_count > 0}
					{_data.comment_count}
				{/if}
				{_data.comment_count === 1 ? 'Comment' : 'Comments'}
			</span>
		</button>
		<button
			class="tab-links {selectedTab === 'visuals' && 'tab-active'}"
			on:click={() => (selectedTab = 'visuals')}
		>
			<CameraIcon
				iconStyle={''}
				height={'1.5rem'}
				fill={selectedTab === 'visuals' ? '#5407d9' : ''}
			/>
			<span style="text-align: center;"> Visuals</span>
		</button>
		<button
			class="tab-links {selectedTab === 'articles' && 'tab-active'}"
			on:click={() => (selectedTab = 'articles')}
		>
			<PostIcon
				iconStyle={''}
				height={'1.5rem'}
				fill={selectedTab === 'articles' ? '#5407d9' : ''}
			/>
			<span style="text-align: center;"> Articles</span>
		</button>
	{/if}
</div>
<div class="tab-box">
	<div
		class="flexr {selectedTab === 'comments' && 'first'} container-js"
		id="comments"
		bind:this={commentContainerElement}
	>
		{#if innerWidth > 575}
			<div
				class="{isFixed
					? 'scroll-js pos-fixed'
					: isStop
					? 'scroll-js stop'
					: 'scroll-js'} {_data.comment_count <= 5 ? 'hidden' : ''}"
			>
				<h3 bind:this={commentScrollElement} id="comments-scroller" class="tab-side-bar">
					Comments
				</h3>
			</div>
		{/if}
		<Card style="padding: .5rem; border: none;">
			<!-- Renders for SEO, removed if not answered -->
			{#if innerWidth < 575 || _data.comment_count <= 5}
				<h3 class="tab-header">Comments</h3>
			{/if}
			<Comments data={_data} parentType={'question'} {user} />
		</Card>
	</div>

	<div class="flexr {selectedTab === 'articles' && 'first'}">
		<Card style="padding: .5rem; border: none;">
			<h3 class="tab-header">Articles</h3>
			<p>nothing right now</p>
		</Card>
	</div>
	<div class="flexr {selectedTab === 'visuals' && 'first'}">
		<Card style="padding: .5rem; border: none;">
			<h3 class="tab-header">Visuals</h3>
			<p>nothing right now</p>
		</Card>
	</div>
</div>

<style lang="scss">
	.hidden {
		visibility: hidden;
	}
	.container-js {
		position: relative;
	}
	.scroll-js {
		position: relative;
	}

	/* JS applied styles - no touchy! */
	.pos-fixed {
		position: fixed;
		z-index: 123;
		margin: 1rem -4rem;
	}
	.stop {
		position: absolute;
		bottom: 0;
		left: -4rem;
		z-index: 123;
	}

	.tab-side-bar {
		transform: rotate(270deg);
	}
	.tab-header {
		border: 1px solid var(--color-bg-2);
		border-radius: 5px;
		text-align: center;
	}
	.tab-links {
		display: flex;
		margin: 0.25rem;
	}
	.tab-active {
		border: var(--classic-border) !important;
	}

	.flexr {
		flex: 1 0 100%;
		position: relative;
	}
	.first {
		order: -1;
	}
	.tab-box {
		display: flex;
		flex-wrap: wrap;
		flex-direction: row;
	}
	/* Style the tab */
	.tab {
		overflow: hidden;
		display: flex;
		justify-content: space-evenly;
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
	// .tab button.active {
	// 	text-decoration: underline;
	// 	border-radius: 5px;
	// 	color: var(--color-theme-purple);
	// 	border: var(--classic-border);
	// }

	@media (max-width: 768px) {
		.question-form {
			flex-direction: column;
		}
	}

	@media all and (max-width: 576px) {
		.tab {
			margin: 0.25rem;
			gap: 0.25rem;
		}
		.tab-links {
			flex-direction: column;
			align-items: center;
			gap: 0.25rem;
			// margin: 1rem;
			// width: 20%;
		}
		.question-display {
			width: 80%;
		}
	}
</style>
