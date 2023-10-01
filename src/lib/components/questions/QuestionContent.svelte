<script lang="ts">
	import { onMount, afterUpdate } from 'svelte';
	import Card from '$lib/components/atoms/card.svelte';
	import CameraIcon from '$lib/components/icons/cameraIcon.svelte';
	import MasterCommentIcon from '$lib/components/icons/masterCommentIcon.svelte';
	import PostIcon from '$lib/components/icons/postIcon.svelte';
	import { Comments } from '$lib/components/molecules';
	import SortComments from '$lib/components/molecules/SortComments.svelte';

	interface PassedPageData {
		id: number;
		question: string;
		created_at: string;
		updated_at: string;
		data?: any;
		name?: any;
		author_id: string;
		context: string;
		url: string;
		img_url: string;
		es_id: string;
		comment_count: number;
		subscriptions: Subscription[];
		comments: Comment[];
		links: Link[];
		links_count: number;
		flags: Flags;
	}

	interface Flags {
		userHasAnswered: boolean;
		userSignedIn: string;
	}

	interface Link {
		id: number;
		created_at: string;
		updated_at: string;
		url?: string;
		domain_id: number;
		meta_title?: any;
		meta_description?: any;
		meta_image?: any;
		question_id: number;
	}

	interface Comment {
		id: number;
		created_at: string;
		comment: string;
		author_id: string;
		ip: string;
		comment_count: number;
		parent_type: string;
		es_id: string;
		parent_id: number;
		like_count: number;
		profiles: Profiles;
		comment_like: Commentlike[];
	}

	interface Commentlike {
		id: number;
		comment_id: number;
		user_id: string;
	}

	interface Profiles {
		external_id: string;
		enneagram: string;
	}

	interface Subscription {
		id: number;
		question_id: number;
		user_id: string;
	}

	interface SortedComment {
		id: number;
		created_at: string;
		comment: string;
		author_id: string;
		ip: string;
		comment_count: number;
		parent_type: string;
		es_id: string;
		parent_id: number;
		like_count: number;
		profiles: Profiles;
	}

	interface Profiles {
		enneagram: string;
		id: string;
	}

	export let data: any; //: PassedPageData;
	export let user: any;
	let selectedTab: string = 'comments';
	let _data: any;

	$: data, runFunc();

	const runFunc = () => {
		_data = Object.assign({}, data);
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

	const saveClick = async (link: any) => {
		let body = new FormData();
		body.append('linkId', link.id);

		const resp = await fetch('?/linkClick', {
			method: 'POST',
			body
		});
	};

	const sortComments = (data: SortedComment[]) => {
		_data.comments = data;
		_data.comment_count = data.length;
	};

	onMount(() => {
		window.addEventListener('scroll', calculateHeightsAndSetClasses);
	});

	afterUpdate(calculateHeightsAndSetClasses);

	const isInViewport = (element?: Element | null) => {
		if (!element) return false;
		const rect = element.getBoundingClientRect();
		const val =
			rect.left >= 0 && rect.right <= (window.innerWidth || document.documentElement.clientWidth);
		return val;
	};
</script>

<svelte:window bind:innerWidth />

<!-- <hr style="border-top: 1px solid black; width: 100%;" /> -->

<div class="tab-box">
	<div class="tabs">
		{#if innerWidth > 575}
			<a
				href="#comments"
				class="tab-links {selectedTab === 'comments' && 'tab-active'}"
				on:click={() => (selectedTab = 'comments')}
				style:--tag={`a-comment${data.id}`}
			>
				<span style="text-wrap: nowrap" itemprop="answerCount">
					{#if _data.comment_count > 0}
						{_data.comment_count}
					{/if}
					{_data.comment_count === 1 ? 'Comment' : 'Comments'}
				</span>
			</a>
			<a
				href="#visuals"
				class="tab-links {selectedTab === 'visuals' && 'tab-active'}"
				on:click={() => (selectedTab = 'visuals')}
			>
				Visuals
			</a>
			<a
				href="#articles"
				class="tab-links {selectedTab === 'articles' && 'tab-active'}"
				on:click={() => (selectedTab = 'articles')}
			>
				Articles
			</a>
		{:else}
			<a
				href="#comments"
				class="tab-links {selectedTab === 'comments' && 'tab-active'}"
				style="display: flex; flex-direction: row;
				justify-content: center;
				align-items: center;"
				on:click={() => (selectedTab = 'comments')}
				style:--tag={`a-comment${data.id}`}
			>
				<MasterCommentIcon
					iconStyle={''}
					height={'1.5rem'}
					fill={selectedTab === 'comments' ? '#5407d9' : ''}
					type={'multiple'}
				/>
				{#if selectedTab === 'comments'}
					<span style="text-align: center; text-wrap: nowrap; margin-left: 0.5rem;"
						>{#if _data.comment_count > 0}
							{_data.comment_count}
						{/if}
					</span>
				{/if}
			</a>
			<a
				href="#visuals"
				class="tab-links {selectedTab === 'visuals' && 'tab-active'}"
				on:click={() => (selectedTab = 'visuals')}
			>
				<CameraIcon
					iconStyle={''}
					height={'1.5rem'}
					fill={selectedTab === 'visuals' ? '#5407d9' : ''}
				/>
				<!-- {#if selectedTab === 'visuals'}
					<span style="text-align: center;"> Visuals</span>
				{/if} -->
			</a>
			<a
				href="#articles"
				class="tab-links {selectedTab === 'articles' && 'tab-active'}"
				on:click={() => (selectedTab = 'articles')}
			>
				<PostIcon
					iconStyle={''}
					height={'1.5rem'}
					fill={selectedTab === 'articles' ? '#5407d9' : ''}
				/>
				<!-- {#if selectedTab === 'articles'}
					<span style="text-align: center;"> Articles</span>
				{/if} -->
			</a>
		{/if}
	</div>
	<div
		class="slides"
		on:scroll={() => {
			if (isInViewport(document.getElementById('comments'))) {
				const isInView = (selectedTab = 'comments');
				return;
			} else if (isInViewport(document.getElementById('articles'))) {
				const isInView = isInViewport(document.getElementById('articles'));
				selectedTab = 'articles';
				return;
			} else if (isInViewport(document.getElementById('visuals'))) {
				const isInView = isInViewport(document.getElementById('visuals'));
				selectedTab = 'visuals';
				return;
			}
		}}
	>
		<div
			class="flexr {selectedTab === 'comments' && 'first'} container-js"
			id="comments"
			bind:this={commentContainerElement}
		>
			<Card style="padding: .5rem; border: none;">
				{#if innerWidth > 575 && _data.comments.length >= 5}
					<h3
						class=" {isFixed
							? 'scroll-js pos-fixed'
							: isStop
							? 'scroll-js stop'
							: 'scroll-js pos-fixed'} {_data.comment_count <= 5 ? 'hidden' : ''}"
					>
						<p
							bind:this={commentScrollElement}
							id="comments-scroller"
							class="tab-side-bar vertical-display"
						>
							<span>c</span><span>o</span><span>m</span><span>m</span><span>e</span><span>n</span
							><span>t</span><span>s</span>
						</p>
					</h3>
				{/if}
				{#if data?.flags?.userHasAnswered}
					<SortComments {data} on:commentsSorted={({ detail }) => sortComments(detail)} />
				{:else}
					<span class="helper-suggestion">
						{_data.comments.length === 0
							? 'Be the first to answer the question!'
							: 'Must answer question first before you can see the other comments'}
					</span>
				{/if}
				<div style="padding: .5rem; border: none;">
					<Comments questionId={data.id} data={_data} parentType={'question'} {user} />
				</div>
			</Card>
		</div>
		<div class="flexr {selectedTab === 'visuals' && 'first'}" id="visuals">
			<Card style="padding: .5rem; border: none;">
				<p>nothing right now</p>
			</Card>
		</div>

		<div class="flexr {selectedTab === 'articles' && 'first'}" id="articles">
			<Card style="padding: .5rem; border: none;">
				{#if data?.links?.length}
					<ul>
						{#each data?.links as link}
							{#if link}
								<li>
									<a href={link.url} on:click={() => saveClick(link)}>{link.url}</a>
								</li>
							{/if}
						{/each}
					</ul>
				{:else}
					<p>nothing right now</p>
				{/if}
			</Card>
		</div>
	</div>
</div>

<style lang="scss">
	.vertical-display {
		text-combine-upright: all;
		writing-mode: vertical-lr;
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
		margin: 1rem -3rem;
	}

	.stop {
		position: absolute;
		bottom: 0;
		left: -4rem;
		z-index: 123;
		margin: 1rem;
	}

	.tab-header {
		border: 1px solid var(--color-paladin-2);
		border-radius: 5px;
		text-align: center;
	}

	.tab-links {
		display: flex;
		margin: 0.25rem;
		justify-content: center;
		align-items: center;
		width: 20%;
	}

	.tab-active {
		width: 50%;
		border: var(--classic-border) !important;
		border-bottom: none !important;
		border-radius: 5px 5px 0 0 !important;
		margin-bottom: 0;
	}

	.flexr {
		flex: 1 0 100%;
		position: relative;
		scroll-margin-top: 15rem;
	}

	.tab-box {
		display: flex;
		flex-flow: row wrap;
	}

	// :target {
	// 	scroll-margin-top: 200px;
	// }

	/* Style the tab */
	.tabs {
		width: 100%;
		overflow: hidden;
		display: flex;
		justify-content: space-evenly;
	}

	/* Style the buttons inside the tab */
	.tabs a {
		overflow: hidden;
		background-color: inherit;

		// float: left;
		border: none;
		outline: none;
		cursor: pointer;
		padding: 1rem;
		transition: 0.3s;
		font-size: 1rem;
		border-radius: 5px;

		&:hover {
			background-color: var(--color-paladin-1);
			border-radius: 5px;
		}
	}

	.helper-suggestion {
		font-size: 3rem;
	}

	@media (max-width: 768px) {
		.question-form {
			flex-direction: column;
		}
		.helper-suggestion {
			font-size: 2.5rem;
		}
	}

	@media (max-width: 576px) {
		.tabs {
			width: 100%;
			margin: 0.25rem;
			gap: 0.25rem;
		}
		.tabs a {
			padding: 0.5rem;
		}

		.tab-links {
			flex-direction: column;
			align-items: center;
			gap: 0.25rem;
		}

		.question-display {
			width: 80%;
		}
		.helper-suggestion {
			font-size: 2rem;
		}
	}

	@supports (scroll-snap-type) {
		.slider > a {
			display: none;
		}
	}

	.slider {
		width: 300px;
		text-align: center;
		overflow: hidden;
	}

	.slides {
		display: flex;
		overflow-x: auto;
		scroll-snap-type: x mandatory;
		scroll-behavior: smooth;
		-webkit-overflow-scrolling: touch;
		touch-action: pan-x;
		width: 100%;
	}

	.slides::-webkit-scrollbar {
		width: 10px;
		height: 10px;
	}

	.slides::-webkit-scrollbar-thumb {
		background: black;
		border-radius: 10px;
	}

	// .slides::-webkit-scrollbar-track {
	// 	// background: transparent;
	// }

	.slides > div {
		scroll-snap-align: center;

		// transform-origin: center center;
		transition: transform 0.5s;
		position: relative;
	}
</style>
