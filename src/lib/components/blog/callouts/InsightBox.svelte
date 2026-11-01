<!-- src/lib/components/blog/callouts/InsightBox.svelte -->
<!--
  Insight callout boxes for blog content — key insights, tips, warnings,
  or neutral information. Shell renders through the shared <Callout> base
  (2026-06-10 consolidation); public props are unchanged.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import Callout from './Callout.svelte';

	type Tone = 'success' | 'info' | 'warning' | 'neutral';

	interface Props {
		title?: string;
		tone?: Tone;
		/**
		 * Body content: an HTML string when dynamically mounted from Supabase
		 * content, or the markdown/default content snippet otherwise.
		 */
		children?: Snippet | string;
	}

	let { title = '', tone = 'success', children = '' }: Props = $props();

	// Map this component's historical tone names onto the Callout base tones.
	const TONE_MAP = {
		success: 'success',
		info: 'lamp',
		warning: 'warning',
		neutral: 'neutral'
	} as const;
</script>

<Callout tone={TONE_MAP[tone] ?? 'success'} {title}>
	{#if typeof children === 'string' && children.trim() !== ''}
		{@html children}
	{:else if typeof children === 'function'}
		{@render children()}
	{/if}
</Callout>
