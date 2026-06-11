<!-- src/lib/components/blog/callouts/InsightBox.svelte -->
<!--
  Insight callout boxes for blog content — key insights, tips, warnings,
  or neutral information. Shell renders through the shared <Callout> base
  (2026-06-10 consolidation); public props are unchanged.
-->
<script lang="ts">
	import Callout from './Callout.svelte';

	type Tone = 'success' | 'info' | 'warning' | 'neutral';

	export let title = '';
	export let tone: Tone = 'success';

	/**
	 * Optional children content (used when dynamically mounted from Supabase content)
	 * Falls back to slot content when not provided
	 */
	export let children: string | ((...args: unknown[]) => unknown) = '';

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
	{:else}
		<slot />
	{/if}
</Callout>
