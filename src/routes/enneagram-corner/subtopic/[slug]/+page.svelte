<!-- src/routes/enneagram-corner/subtopic/[slug]/+page.svelte -->
<script lang="ts">
	import type { PageData } from './$types';
	import EnneagramSectionPage from '$lib/components/blog/EnneagramSectionPage.svelte';
	import EmailSignup from '$lib/components/molecules/Email-Signup.svelte';
	import { CORNER_SECTION_COPY } from '$lib/data/enneagramCornerSectionCopy';
	import { getAuthShell } from '$lib/authShell.svelte';

	let { data }: { data: PageData } = $props();
	const authShell = getAuthShell();

	const copy = $derived(CORNER_SECTION_COPY[data.slug] ?? CORNER_SECTION_COPY.overview);
</script>

<EnneagramSectionPage
	view={data.view}
	{copy}
	canonical={`https://9takes.com/enneagram-corner/subtopic/${data.slug}`}
/>

{#if !authShell.user}
	<div class="signup-section">
		<div class="signup-inner">
			<EmailSignup />
		</div>
	</div>
{/if}

<style lang="scss">
	.signup-section {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 48px 4rem;
		background: var(--bg);

		@media (max-width: 768px) {
			padding: 0 20px 3rem;
		}
	}

	.signup-inner {
		max-width: 520px;
	}
</style>
