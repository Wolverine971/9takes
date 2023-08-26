<script lang="ts">
	import PeopleSuggestions from '$lib/components/blog/SuggestionsPeople.svelte';

	import type { PageData } from './$types';
	import type { SvelteComponentTyped } from 'svelte/internal';
	import PeopleBlogPageHead from '$lib/components/blog/PeopleBlogPageHead.svelte';
	import ArticleTitle from '$lib/components/blog/ArticleTitle.svelte';
	import ArticleSubTitle from '$lib/components/blog/ArticleSubTitle.svelte';
	import ArticleDescription from '$lib/components/blog/ArticleDescription.svelte';
	import EmailSignup from '$lib/components/molecules/Email-Signup.svelte';
	export let data: PageData;
	type C = $$Generic<typeof SvelteComponentTyped<any, any, any>>;
	$: component = data.component as unknown as C;
</script>

<div style="align-items: inherit;">
	<PeopleBlogPageHead data={data.metadata} />
	<ArticleTitle title={data.metadata.title} />
	<!-- <ArticleDescription description={data.metadata.description} /> -->
	<ArticleSubTitle metaData={data.metadata} />
</div>

<svelte:component this={component} />

<hr style="margin: 5rem;" />

<PeopleSuggestions suggestions={data?.suggestions} />

<div class="join">
	{#if !data?.session?.user}
		<EmailSignup cta={'We are making something 👷🔨 join the waitlist'} />
	{/if}
</div>

<style lang="scss">
	@import '../../../../scss/index.scss';
	tr {
		border: var(--classic-border);
		text-align: center;
	}
	td {
		border: var(--classic-border);
		text-align: center;
	}
	th {
		border: var(--classic-border);
		text-align: center;
	}
</style>
