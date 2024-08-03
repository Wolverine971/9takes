<script lang="ts">
	import { fade } from 'svelte/transition';
	import Card from '$lib/components/atoms/card.svelte';
	import CameraIcon from '$lib/components/icons/cameraIcon.svelte';
	import MasterCommentIcon from '$lib/components/icons/masterCommentIcon.svelte';
	import PostIcon from '$lib/components/icons/postIcon.svelte';
	import CommentXMarkIcon from '$lib/components/icons/CommentXMarkIcon.svelte';
	import { Comments } from '$lib/components/molecules';
	import SortComments from '$lib/components/molecules/SortComments.svelte';
	import AIComments from '$lib/components/molecules/AIComments.svelte';
	import ArticleLinks from '$lib/components/molecules/Links.svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let data: any;
	export let user: any;

	let selectedTab: string = 'Comments';
	$: _data = { ...data };

	let innerWidth: number = 0;
	let showAiComments = true;

	const tabs = ['Comments', 'Removed Comments', 'Visuals', 'Articles'];

	function sortComments(sortedComments: any[]) {
		_data.comments = sortedComments;
		_data.comment_count = sortedComments.length;
		showAiComments = false;
	}

	function scrollToSection(sectionId: string) {
		const section = document.getElementById(sectionId);
		section?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'start' });
	}

	function getIconComponent(tab: string) {
		switch (tab) {
			case 'Comments':
				return MasterCommentIcon;
			case 'Removed Comments':
				return CommentXMarkIcon;
			case 'Visuals':
				return CameraIcon;
			case 'Articles':
				return PostIcon;
			default:
				return null;
		}
	}
</script>

<svelte:window bind:innerWidth />

<div class="tab-div-display">
	<div class="tabs">
		{#each tabs as tab}
			<a
				href="#{tab}"
				class="tab-links {selectedTab === tab && 'tab-active primary-btn'}"
				on:click|preventDefault={() => {
					selectedTab = tab;
					scrollToSection(tab);
				}}
				style:--tag={`a-${tab}${_data.id}`}
			>
				{#if innerWidth > 575}
					{#if tab === 'Comments'}
						<span style="text-wrap: nowrap" itemprop="answerCount">
							{_data.comment_count > 0 ? _data.comment_count : ''}
							{_data.comment_count === 1 ? 'Comment' : 'Comments'}
						</span>
					{:else}
						{tab.split('-').join(' ')}
					{/if}
				{:else}
					<svelte:component
						this={getIconComponent(tab)}
						iconStyle={''}
						height={'1.5rem'}
						fill={selectedTab === tab ? '#5407d9' : ''}
						type={tab === 'Comments' ? 'multiple' : undefined}
					/>
				{/if}
			</a>
		{/each}
	</div>

	<div class="slides">
		{#each tabs as section}
			<div class="flexr {selectedTab === section && 'first'}" id={section}>
				<h2>{section.split('-').join(' ')}</h2>
				<Card className="comments-card">
					{#if section === 'Comments'}
						<SortComments
							{data}
							on:commentsSorted={({ detail }) => sortComments(detail)}
							size={'large'}
						/>
						{#if !data?.flags?.userHasAnswered}
							<span class="helper-suggestion" transition:fade>
								{_data.comment_count === 0
									? 'Be the first one to answer ✋'
									: 'Must answer before seeing the comments'}
							</span>
						{/if}
						<AIComments data={_data} parentType={'question'} {showAiComments} />
						<Comments
							questionId={_data.id}
							comments={_data.comments}
							comment_count={_data.comment_count}
							parentType={'question'}
							parentData={_data}
							{user}
							on:commentAdded={() => {
								if (!data?.flags?.userHasAnswered) {
									dispatch('commentAdded');
								}
							}}
						/>
					{:else if section === 'Removed Comments' && _data?.removedComments?.length > 0}
						<Comments
							questionId={_data.id}
							parentData={_data}
							comment_count={_data.removed_comment_count}
							comments={_data.removedComments}
							parentType={'question'}
							{user}
						/>
					{:else if section === 'Visuals'}
						{#if data?.flags?.userHasAnswered}
							<p>nothing right now</p>
						{/if}
					{:else if section === 'Articles'}
						<ArticleLinks
							questionId={data.id}
							data={_data}
							parentType={'question'}
							{user}
							on:commentAdded={() => {
								if (!data?.flags?.userHasAnswered) {
									dispatch('commentAdded');
								}
							}}
						/>
					{/if}
				</Card>
			</div>
		{/each}
	</div>
</div>

<style lang="scss">
	.comments-card {
		border: none;
		margin: 0.5rem;
	}

	.tab-links {
		display: flex;
		margin: 0.5rem;
		justify-content: center;
		align-items: center;
		width: 20%;
		color: var(--color-theme-purple-light);
		border-radius: 5px 5px 0 0;

		&.tab-active {
			width: 50%;
			border: 1px solid var(--color-theme-purple);
			border-bottom: none;
			margin-bottom: 0;
			color: var(--color-theme-purple);
		}
	}

	.tab-div-display {
		display: flex;
		flex-flow: row wrap;
	}

	.tabs {
		width: 100%;
		overflow: hidden;
		display: flex;

		a {
			overflow: hidden;
			background-color: inherit;
			outline: none;
			padding: 0.5rem;
			transition: 0.3s;
			font-size: 1rem;

			&:hover {
				background-color: var(--base-white-outline);
			}
		}
	}

	.helper-suggestion {
		font-size: 3rem;
	}

	.slides {
		display: flex;
		flex-direction: column;
		scroll-snap-type: x mandatory;
		scroll-behavior: smooth;
		-webkit-overflow-scrolling: touch;
		width: 100%;
		min-height: 100vh;

		&::-webkit-scrollbar {
			width: 10px;
			height: 10px;
		}

		&::-webkit-scrollbar-thumb {
			background-color: var(--black);
			border-radius: var(--base-border-radius);
		}

		> div {
			scroll-snap-align: center;
			transition: transform 0.5s;
			position: relative;
		}
	}

	@media (max-width: 768px) {
		.helper-suggestion {
			font-size: 2.5rem;
		}
	}

	@media (max-width: 576px) {
		.tabs {
			gap: 0.25rem;

			a {
				padding: 0.5rem;
			}
		}

		.tab-links {
			flex-direction: column;
			align-items: center;
			gap: 0.25rem;
		}

		.helper-suggestion {
			font-size: 2rem;
		}

		.comments-card {
			padding: 0.2rem !important;
		}
	}
</style>
