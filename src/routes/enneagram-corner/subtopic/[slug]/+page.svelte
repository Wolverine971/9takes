<!-- src/routes/enneagram-corner/subtopic/[slug]/+page.svelte -->
<script lang="ts">
	import EnneagramCategoryIntro from '$lib/components/blog/EnneagramCategoryIntro.svelte';
	import EmailSignup from '$lib/components/molecules/Email-Signup.svelte';

	export let data: any;
</script>

<EnneagramCategoryIntro subsection={data.slug} blogs={data.posts} />

<br /><br />
{#if !data?.user}
	<div class="join position-center">
		<EmailSignup />
	</div>
{/if}
