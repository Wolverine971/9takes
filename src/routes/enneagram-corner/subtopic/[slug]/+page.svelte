<!-- routes/enneagram-corner/subtopic/[slug]/+page.svelte -->
<script lang="ts">
	import BlogPageHead from '$lib/components/blog/BlogPageHead.svelte';
	import EnneagramCategoryIntro from '$lib/components/blog/EnneagramCategoryIntro.svelte';
	import EmailSignup from '$lib/components/molecules/Email-Signup.svelte';

	export let data: any;
</script>

<EnneagramCategoryIntro subsection={data.slug} blogs={data.posts} />

<br /><br />
{#if !data?.session?.user}
	<div class="join position-center">
		<EmailSignup />
	</div>
{/if}
