<script lang="ts">
	import { browser } from '$app/environment';
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

	// question: {
	//     [x: string]: any;
	// };
	// comments: never[];
	// comment_count: number | null;
	// session: Session | null;
	// flags: {
	//     userHasAnswered: false;
	//     userSignedIn: any;
	// };
	// links?: undefined;
	// links_count?: undefined;

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
	let question: string = '';
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
		console.log(link);
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
</script>

<svelte:window bind:innerWidth />

<div class="tabs">
	{#if innerWidth > 575}
		<button
			class="tab-links {selectedTab === 'comments' && 'tab-active'}"
			on:click={() => (selectedTab = 'comments')}
		>
			<span style="text-wrap: nowrap">
				{#if _data.comment_count > 0}
					{_data.comment_count}
				{/if}
				{_data.comment_count === 1 ? 'Comment' : 'Comments'}
			</span>
		</button>
		<button
			class="tab-links {selectedTab === 'visuals' && 'tab-active'}"
			on:click={() => (selectedTab = 'visuals')}
		>
			Visuals
		</button>
		<button
			class="tab-links {selectedTab === 'articles' && 'tab-active'}"
			on:click={() => (selectedTab = 'articles')}
		>
			Articles
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
			<span style="text-align: center; text-wrap: nowrap"
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
	<article
		class="flexr {selectedTab === 'comments' && 'first'} container-js"
		id="comments"
		bind:this={commentContainerElement}
	>
		{#if innerWidth > 575 && _data.comments.length >= 5}
			<h3
				class=" {isFixed
					? 'scroll-js pos-fixed'
					: isStop
					? 'scroll-js stop'
					: 'scroll-js'} {_data.comment_count <= 5 ? 'hidden' : ''}"
			>
				<p
					bind:this={commentScrollElement}
					id="comments-scroller"
					class="tab-side-bar vertical-display"
				>
					<span>c</span><span>o</span><span>m</span><span>m</span><span>e</span><span>n</span><span
						>t</span
					><span>s</span>
				</p>
			</h3>
		{/if}
		<SortComments {data} on:commentsSorted={({ detail }) => sortComments(detail)} />
		<Card style="padding: .5rem; border: none;">
			<!-- Renders for SEO, removed if not answered -->
			<!-- {#if innerWidth < 575 || _data.comments.length <= 5}
				<h3 class="tab-header">Comments</h3>
			{/if} -->
			<Comments questionId={data.id} data={_data} parentType={'question'} {user} />
		</Card>
	</article>

	<article class="flexr {selectedTab === 'articles' && 'first'}">
		<Card style="padding: .5rem; border: none;">
			<h3 class="tab-header">Articles</h3>
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
	</article>
	<article class="flexr {selectedTab === 'visuals' && 'first'}">
		<Card style="padding: .5rem; border: none;">
			<h3 class="tab-header">Visuals</h3>
			<p>nothing right now</p>
		</Card>
	</article>
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

	.tab-side-bar {
		// transform: rotate(270deg);
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
		border-bottom: none !important;
		border-radius: 5px 5px 0 0 !important;
		margin-bottom: 0;
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
		border-top: var(--classic-border) !important;
	}
	/* Style the tab */
	.tabs {
		overflow: hidden;
		display: flex;
		justify-content: space-evenly;
	}

	/* Style the buttons inside the tab */
	.tabs button {
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
	}

	/* Change background color of buttons on hover */
	.tabs button:hover {
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
		.tabs {
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
