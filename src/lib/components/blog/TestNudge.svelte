<!-- src/lib/components/blog/TestNudge.svelte -->
<!--
  One line near the top of a page that sends readers who don't know their type
  to /enneagram-test. The full TestYourTypeCTA sits below the article, where
  about one reader in five scrolls; this is for everyone else. Plain props only,
  so it also works inside markdown posts.
-->
<script lang="ts">
	import { resolve } from '$app/paths';

	interface Props {
		/** The question that leads the line. */
		lead?: string;
		linkLabel?: string;
		/** Where it sits, for click tracking (e.g. "corner_top", "type_hub"). */
		placement?: string;
	}

	let {
		lead = 'Not sure which type you are?',
		linkLabel = 'Take the free test',
		placement = 'article_top'
	}: Props = $props();
</script>

<p class="test-nudge">
	<span class="lead">{lead}</span>
	<a href={resolve('/enneagram-test')} data-track="test-nudge" data-placement={placement}
		>{linkLabel}<span aria-hidden="true">&nbsp;&rarr;</span></a
	>
	<span class="detail">5 to 10 minutes, no email.</span>
</p>

<style>
	.test-nudge {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.25rem 0.5rem;
		margin: 1.25rem 0;
		padding: 0.7rem 0.95rem;
		border: 1px solid var(--rule);
		border-left: 3px solid var(--highlight);
		border-radius: 10px;
		background: var(--surface);
		font-size: var(--font-size-sm);
		line-height: 1.45;
		color: var(--text);
	}

	.lead {
		font-weight: 600;
	}

	a {
		font-weight: 700;
		color: var(--highlight);
		text-decoration: underline;
		text-underline-offset: 3px;
	}

	.detail {
		color: var(--text-muted);
	}
</style>
