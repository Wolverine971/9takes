<script lang="ts">
	import BlogInteract from '$lib/components/blog/BlogInteract.svelte';

	import BlogComments from '$lib/components/blog/BlogComments.svelte';
	import PeopleSuggestions from '$lib/components/blog/SuggestionsPeople.svelte';

	import type { PageData } from './$types';
	import type { SvelteComponent } from 'svelte';
	import PeopleBlogPageHead from '$lib/components/blog/PeopleBlogPageHead.svelte';
	import ArticleTitle from '$lib/components/blog/ArticleTitle.svelte';
	import ArticleSubTitle from '$lib/components/blog/ArticleSubTitle.svelte';
	import EmailSignup from '$lib/components/molecules/Email-Signup.svelte';
	export let data: PageData;
	type C = $$Generic<typeof SvelteComponent<any, any, any>>;
	$: component = data.component as unknown as C;
	import { invalidate } from '$app/navigation';

	let comments = data.comments;
	let userHasAnswered = data.flags.userHasAnswered;

	const commentAdded = (detail: any) => {
		comments = [...detail, ...comments];
		userHasAnswered = true;
	};
</script>

<article
	itemscope
	itemtype="https://schema.org/BlogPosting"
	style="margin-top: 0; padding-top: 0;"
	class="blog"
>
	<div style="align-items: inherit;">
		<PeopleBlogPageHead data={data.metadata} />
		<ArticleTitle title={data.metadata.title} />
		<!-- <ArticleDescription description={data.metadata.description} /> -->
		<ArticleSubTitle metaData={data.metadata} />
	</div>
	<svelte:component this={component} />
</article>
<hr style="margin: 5rem;" />
<h3 title="Comments">What was missed? Do you disagree? Give us your thoughts. 🙏</h3>
<div>
	<BlogComments
		slug={data.slug}
		{comments}
		session={data.session}
		parentType={'famous-enneagram-types'}
		{userHasAnswered}
	/>
	<BlogInteract
		{data}
		parentType={'famous-enneagram-types'}
		on:commentAdded={({ detail }) => commentAdded(detail)}
		user={data?.session?.user}
	/>
</div>

<hr style="margin: 5rem;" />

<PeopleSuggestions suggestions={data?.suggestions} />

<div class="join">
	{#if !data?.session?.user}
		<EmailSignup cta={'We are making something 👷🔨 join the waitlist'} />
	{/if}
</div>

<style lang="scss">
	@import '../../../../scss/index.scss';
</style>
