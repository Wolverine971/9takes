<script lang="ts">
	import BlogPageHead from '$lib/components/blog/BlogPageHead.svelte';
	import EnneagramCategoryIntro from '$lib/components/blog/EnneagramCategoryIntro.svelte';
	import EmailSignup from '$lib/components/molecules/Email-Signup.svelte';

	export let data: any;
</script>

<BlogPageHead
	data={{
		title: `9takes Analysis of Famous Enneagram Type ${data.slug}s`,
		description: 'List famous people who have their enneagram type analyzed'
	}}
	slug={'blog/famous-enneagram-types/type/' + data.slug}
/>
<svelte:head>
	<link rel="canonical" href={`https://9takes.com/blog/famous-enneagram-types/type/${data.slug}`} />
</svelte:head>

<EnneagramCategoryIntro subsection={data.slug} blogs={data.posts} />

<br /><br />
{#if !data?.session?.user}
	<div class="join position-center">
		<EmailSignup />
	</div>
{/if}
