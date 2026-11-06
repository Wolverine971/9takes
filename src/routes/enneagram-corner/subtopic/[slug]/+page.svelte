<!-- src/routes/enneagram-corner/subtopic/[slug]/+page.svelte -->
<script lang="ts">
	import type { PageData } from './$types';
	import EnneagramCategoryIntro from '$lib/components/blog/EnneagramCategoryIntro.svelte';
	import EmailSignup from '$lib/components/molecules/Email-Signup.svelte';
	import { getAuthShell } from '$lib/authShell.svelte';

	let { data }: { data: PageData } = $props();
	const authShell = getAuthShell();
</script>

<div class="page-wrapper">
	<EnneagramCategoryIntro subsection={data.slug} blogs={data.posts} />

	{#if !authShell.user}
		<div class="signup-section">
			<EmailSignup />
		</div>
	{/if}
</div>

<style lang="scss">
	/* Subtopic page shell (Cold Light) */
	.page-wrapper {
		min-height: 100vh;
		background: var(--bg);
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
