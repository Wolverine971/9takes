<script lang="ts">
import type { PageData } from './$types';
import CategoryItem from '$lib/components/molecules/CategoryItem.svelte';

export let data: PageData;

const questionUrls: Record<string, number> = {};
const questionCategories: Record<string, any[]> = {};

const categories = data.questionsAndTags?.reduce((acc: Record<string, any[]>, curr: any) => {
    if (!questionUrls[curr.url]) {
        const key = curr.tag_name;
        const subcategoryId = curr.subcategory_id;
        questionCategories[subcategoryId] = questionCategories[subcategoryId] 
            ? [...questionCategories[subcategoryId], curr]
            : [curr];

        acc[key] = acc[key] || [];
        acc[key].push(curr);
        questionUrls[curr.url] = 1;
    }
    return acc;
}, {});
</script>

<div class="category-list">
    {#if Object.keys(questionCategories).length}
        {#each data.questionSubcategories as qcategory}
            {#if qcategory?.question_subcategories?.length !== 0}
                <CategoryItem category={qcategory} questionTags={questionCategories} />
            {/if}
        {/each}
    {/if}
</div>

<style lang="scss">
.category-list {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    background-color: var(--background-color, #f5f5f5);
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

    @media (max-width: 768px) {
        padding: 1rem;
    }
}
</style>