<script lang="ts">
	import Scribble from '$lib/components/atoms/scribble.svelte';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';

	export let data: PageData;
	let categories: any = data?.categories.map((item: any) => {
		return { ...item, special: false };
	});
	onMount(() => {
		const list = document.querySelector('.js-list');
		const items = document.querySelectorAll('.js-listItem');
		const iw = items.item(0).clientWidth;
		const res = () => {
			const lw = list?.clientWidth;
			const num0 = lw / iw;
			const num1 = Math.floor(num0);
			let num2 = num1;
			if (num0 % 1 < 0.5) num2 = num1 - 1;
			categories = categories.map((item, j) => {
				const flg = (j + num2) % (num1 + num2) === 0;
				if (flg) {
					return { ...item, special: true };
				} else {
					return { ...item, special: false };
				}
			});
		};
		window.addEventListener('resize', () => res());
		res();
	});

	const skipVals = [86, 97, 105, 138, 148, 150];
</script>

<svelte:head>
	<title>9takes | Question Categories</title>
	<meta name="description" content="User generated questions with comments sorted by personality" />
	<link rel="canonical" href="https://9takes.com/questions" />
</svelte:head>

<div>
	<div class="container">
		<ul class="list js-list">
			<!-- Repeating list items for each number, skipping the ones in the 'skip' array -->
			<!-- Manually expanded for demonstration based on the given start and count -->
			<!-- You may need to manually adjust the numbers based on your specific requirements -->

			{#each categories as category, index}
				{#if !skipVals.includes(index)}
					<li class="list__item js-listItem {category.special ? 'list__item--ex' : ''}">
						<div class="list__itemInner">
							<img
								alt="nuthin"
								class="list__image"
								src="https://picsum.photos/id/{index + 1}1/500/500"
								width="400"
								height="400"
							/>
							<span class="list__text">
								<a
									href={`/questions/categories/${category.tag_name.split(' ').join('-')}`}
									class="list_link bold-shadow"
								>
									<span style="text-align: center;">{category.tag_name}</span>
									<span>{category.question_count}</span>
								</a>
							</span>
						</div>
					</li>
				{/if}
			{/each}
		</ul>
	</div>
</div>

<!-- select subcategoryTags.tagname, Count(*) as count from questions
from subcategoryTags
join questions on subcategoryTags.id = questions.subcategoryTagId

D3 view 

https://codepen.io/derekmorash/pen/jyMGaX -->
<style lang="scss">
	:root {
		--threeRoot: 1.73205080757; // sqrt(3);
	}

	// https://codepen.io/ichimonzi/
	// pen/BaMvKJK

	.container {
		height: 100%;
		max-width: 800px;
		margin: 0 auto;
		padding: 0;
	}

	.list_link {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		color: whitesmoke !important;
	}
	.list {
		padding: 0;
		display: grid;
		flex-wrap: wrap;
		grid-template-columns: repeat(auto-fill, 80px); // Increase from 40px to 80px
		padding-top: calc(160px / var(--threeRoot) / 2);
		justify-content: center;
		margin: 40px auto;
		width: calc(100% - 160px);

		&__item {
			cursor: pointer;
			display: grid;
			place-items: center;
			margin-top: calc(-160px / var(--threeRoot) / 2); // Adjusted to match new item size
			grid-column: span 2;
			width: 160px; // Increase from 80px to 160px
			aspect-ratio: var(--threeRoot) / 2;
			height: auto;
			position: relative;
			z-index: 1;
			transform: scale(96%);
			transition: all 2s;
			filter: drop-shadow(0 0 0 #000);

			&:hover {
				transition: transform 0.25s, filter 0.25s;
				z-index: 2;
				transform: scale(2.5) rotate(90deg);
				filter: drop-shadow(0 0 6px #000);
			}

			&--ex {
				grid-column: 2 / 4;
			}
		}

		&__itemInner {
			width: 100%;
			height: 100%;
			display: grid;
			place-items: center;
			clip-path: polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%);
		}

		&__image {
			display: inline-block;
			width: 120%;
			height: 120%;
			object-fit: cover;
			object-position: center;
			transition: all 2s;

			.list__item:hover & {
				transition: all 0.25s;
				transform: rotate(-90deg);
			}
		}

		&__text {
			color: #fff;
			position: absolute;
			font-size: 24px;
			text-shadow: 0 0 3px #000;
			transition: all 2s;

			.list__item:hover & {
				transition: all 0.25s;
				transform: scale(0.5) rotate(-90deg);
			}
		}
	}
</style>
