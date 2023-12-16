<script lang="ts">
	import type { PageData } from './$types';
	import CategoryItem from '$lib/components/molecules/CategoryItem.svelte';

	export let data: PageData;

	const questionUrls: any = {};
	const questionCategories: any = {};

	const categories = data.questionsAndTags?.reduce((acc: any, curr: any) => {
		if (!questionUrls[curr.url]) {
			const key = curr.tag_name;
			const subcategoryId = curr.subcategory_id;
			questionCategories[subcategoryId] =
				questionCategories[subcategoryId] && questionCategories[subcategoryId].length
					? [...questionCategories[subcategoryId], curr]
					: [curr];

			acc[key] = acc[key] || [];
			acc[key].push(curr);
			questionUrls[curr.url] = 1;
		}

		return acc;
	}, {});
</script>

<div>
	{#if Object.keys(questionCategories).length}
		{#each data.questionSubcategories as qcategory}
			{#if qcategory?.question_subcategories?.length !== 0}
				<CategoryItem category={qcategory} questionTags={questionCategories} />
			{/if}
		{/each}
	{/if}
</div>
