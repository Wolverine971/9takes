<!-- src/routes/enneagram-corner/subtopic/[slug]/+page.svelte -->
<script lang="ts">
	import EnneagramCategoryIntro from '$lib/components/blog/EnneagramCategoryIntro.svelte';
	import EmailSignup from '$lib/components/molecules/Email-Signup.svelte';

	export let data: any;
</script>

<div class="page-wrapper">
	<EnneagramCategoryIntro subsection={data.slug} blogs={data.posts} />

	{#if !data?.user}
		<div class="signup-section">
			<EmailSignup />
		</div>
	{/if}
</div>

<style lang="scss">
	/* Solo Leveling Dark Theme - Subtopic Page */
	.page-wrapper {
		min-height: 100vh;
		background: linear-gradient(180deg, #0a0a0f 0%, #12121a 100%);
		padding-bottom: 4rem;
	}

	.signup-section {
		max-width: 500px;
		margin: 3rem auto 0;
		padding: 0 1.5rem;
	}

	@media (max-width: 640px) {
		.page-wrapper {
			padding-bottom: 3rem;
		}

		.signup-section {
			margin-top: 2rem;
			padding: 0 1rem;
		}
	}
</style>
