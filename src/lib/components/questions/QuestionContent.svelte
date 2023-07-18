<script lang="ts">
	import { browser } from '$app/environment';
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
		console.log('data change');
		_data = Object.assign({}, data);
	};
	let innerWidth: number = 0;
</script>

<svelte:window bind:innerWidth />

<div class="tab">
	{#if innerWidth > 575}
		<button
			class="tab-links {selectedTab === 'comments' && 'active'}"
			on:click={() => (selectedTab = 'comments')}
		>
			Comments
			<MasterCommentIcon
				iconStyle={'margin-left: .5rem'}
				height={'1.5rem'}
				fill={selectedTab === 'comments' ? '#5407d9' : ''}
				type={'multiple'}
			/>
		</button>
		<button
			class="tab-links {selectedTab === 'visuals' && 'active'}"
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
			class="tab-links {selectedTab === 'articles' && 'active'}"
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
			class="tab-links {selectedTab === 'comments' && 'active'}"
			on:click={() => (selectedTab = 'comments')}
		>
			<MasterCommentIcon
				iconStyle={''}
				height={'1.5rem'}
				fill={selectedTab === 'comments' ? '#5407d9' : ''}
				type={'multiple'}
			/>
			<span style="text-align: center;">Comments</span>
		</button>
		<button
			class="tab-links {selectedTab === 'visuals' && 'active'}"
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
			class="tab-links {selectedTab === 'articles' && 'active'}"
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
<div class="box">
	<div class="flexr {selectedTab === 'comments' && 'first'}">
		<h3 class="tabHeader">Comments</h3>
		<!-- Renders for SEO, removed if not answered -->
		<Comments data={_data} nested={true} parentType={'question'} {user} />
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
	.tab-links {
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
		border: var(--classic-border);
	}

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
