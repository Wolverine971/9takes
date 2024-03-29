<script lang="ts">
	import Interact from '$lib/components/molecules/Interact.svelte';
	import QuestionContent from '$lib/components/questions/QuestionContent.svelte';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import QRCode from 'qrcode';
	import { invalidateAll } from '$app/navigation';

	/** @type {import('./$types').PageData} */
	export let data: PageData;

	let dataForChild = Object.assign({}, data.question, {
		comments: data.comments,
		comment_count: data.comment_count,
		ai_comments: data.ai_comments,
		links: data.links,
		links_count: data.links_count,
		flags: data.flags
	});

	const opts = {
		errorCorrectionLevel: 'H',
		type: 'image/jpeg',
		quality: 0.7,
		margin: 1,
		color: {
			dark: '#5407d9',
			light: ''
		}
	};

	const addComment = async (newData: any) => {
		setTimeout(async () => {
			await fetch(`/comments/?type=question&parentId=${data?.question?.id}`)
				.then((response) => response.json())
				.then((commentData) => {
					if (!commentData?.message) {
						dataForChild = Object.assign({}, data.question, {
							comments: commentData,
							comment_count: data.comment_count ? (data.comment_count += 1) : 1,
							ai_comments: data.ai_comments,
							links: data.links,
							links_count: data.links_count,
							flags: Object.assign({}, data.flags, { userHasAnswered: true })
						});
					}
				});
		}, 500);
		invalidateAll();
	};

	const autoGrow = (element: HTMLElement | null) => {
		if (element) {
			element.style.height = '1rem';
			element.style.height = element.scrollHeight + 'px';
		}
	};

	onMount(() => {
		// autoGrow(document.getElementById('question-box'));
		// window.addEventListener('resize', (event) => {
		// 	autoGrow(document.getElementById('question-box'));
		// });
		QRCode.toDataURL(
			`https://9takes.com/questions/${data?.question?.url}`,
			opts,
			function (err, url) {
				if (err) throw err;

				var img = document.getElementById('qr-image');
				img.src = url;
			}
		);
	});

	const calcSize = (text: string) => {
		if (text.length < 45) {
			return innerWidth > 400 ? '2.3rem' : '1.9rem';
		} else if (text.length < 60) {
			return innerWidth > 400 ? '2.2rem' : '1.8rem';
		} else if (text.length < 80) {
			return innerWidth > 400 ? '2.1rem' : '1.7rem';
		} else if (text.length < 105) {
			return innerWidth > 400 ? '2rem' : '1.6rem';
		} else if (text.length < 115) {
			return innerWidth > 400 ? '1.9rem' : '1.5rem';
		} else if (text.length < 130) {
			return innerWidth > 400 ? '1.8rem' : '1.4rem';
		} else if (text.length < 150) {
			return innerWidth > 400 ? '1.7rem' : '1.3rem';
		} else if (text.length < 200) {
			return innerWidth > 400 ? '1.6rem' : '1.2rem';
		} else if (text.length < 220) {
			return innerWidth > 400 ? '1.5rem' : '1.1rem';
		} else if (text.length < 240) {
			return innerWidth > 400 ? '1.4rem' : '1rem';
		} else if (text.length < 290) {
			return innerWidth > 400 ? '1.3rem' : '0.9rem';
		} else if (text.length < 380) {
			return innerWidth > 400 ? '0.75rem' : '0.8rem';
		} else {
			return innerWidth > 400 ? '0.5rem' : '0.7rem';
		}
	};
	let innerWidth = 0;
</script>

<svelte:window bind:innerWidth />

<svelte:head>
	<title>{`9takes | ${data.question.question_formatted || data.question.question}`}</title>
	<meta
		name="description"
		content={`9takes Question | ${data.question.question_formatted || data.question.question}`}
	/>
	<link rel="canonical" href={`https://9takes.com/questions/${data.question.url}`} />
</svelte:head>

<!-- Question always renders -->
<article itemscope itemtype="https://schema.org/Question">
	<!-- <section>
		
	</section> -->
	<div>
		<div style="display: flex; justify-content: center; align-items:center;">
			<h1
				class="question-box"
				id="question-box"
				style="overflow:hidden; font-size: {calcSize(data.question.question)}"
				style:--tag={`h-question-${data.question.id}`}
				itemprop="name"
			>
				{data.question.question_formatted || data.question.question}
			</h1>
			<img id="qr-image" src="" alt="QR Code" style="width: {innerWidth > 400 ? '20%' : '30%'};" />
		</div>

		<!-- oninput="auto_grow(this)" -->
		<!-- {data.question.question} -->
		<Interact
			{data}
			questionId={data.question.id}
			parentType={'question'}
			on:commentAdded={({ detail }) => addComment(detail)}
			user={data?.session?.user}
		/>
	</div>
</article>
<aside>
	{#if data.questionTags}
		{#if innerWidth > 1200}
			<h3 class="tags-heading">Related question <br />categories</h3>
		{/if}
		{#each data.questionTags as tag}
			<a
				href={`/questions/categories/${tag.question_tag.tag_name.split(' ').join('-')}`}
				class="tag"
				style="text-decoration: none; color: hsl(222, 15%, 19%);"
				rel="tag"
			>
				{tag.question_tag.tag_name}
			</a>
		{/each}
	{/if}
</aside>

{#if dataForChild}
	<QuestionContent
		data={dataForChild}
		user={data?.session?.user}
		on:commentAdded={({ detail }) => {
			invalidateAll();
		}}
	/>
{/if}

<style lang="scss">
	.question-box {
		width: -webkit-fill-available;
		border-radius: 5px;
		// height: 24px;
		// padding: 0.5rem 1rem;
		color: hsl(222, 15%, 19%);
		font-size: 1.2rem;
		// box-sizing: content-box;

		margin: 0.25rem;
	}
	aside {
	}

	.tags-heading {
		margin-left: 0.25rem;
		margin-bottom: 0;
		padding-bottom: 0;
	}

	.tag {
		display: flex;
		text-wrap: nowrap;
		align-items: center;
		justify-content: center;
		border-radius: 5px;
		font-size: 0.8rem;
		margin: 0.25rem;
		padding: 0.25rem;
		border: var(--classic-border);
		width: fit-content;
		cursor: pointer;
		&:hover {
			background-color: var(--color-paladin-2);
		}
	}
	aside {
		position: relative;
		right: 0;
		display: flex;
		overflow: auto;
	}

	@media (min-width: 1200px) {
		aside {
			position: fixed !important;
			margin-left: 955px;
			right: auto;
			display: block;
			margin-top: 0.5rem;
			padding: 0.5rem;
		}
	}

	// @media (max-width: 700px) {

	// }
</style>
