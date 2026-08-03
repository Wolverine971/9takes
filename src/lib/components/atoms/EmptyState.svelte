<!-- src/lib/components/atoms/EmptyState.svelte -->
<script lang="ts">
	// src/lib/components/atoms/EmptyState.svelte
	//
	// Canonical empty-state atom. Locked spec at /styleguide §11.
	// Use for "no results", "first-visit", "nothing here yet" surfaces —
	// question search, blog search, admin lists, etc.
	//
	// Usage:
	//   <EmptyState title="No questions yet" body="Be the first to drop one." />
	//
	//   <EmptyState
	//     title="No results"
	//     body="Try a different search term."
	//   >
	//     {#snippet cta()}
	//       <Button size="sm" onclick={clearFilters}>Clear filters</Button>
	//     {/snippet}
	//   </EmptyState>
	//
	//   <EmptyState title="Empty" >{#snippet icon()}<MyIcon />{/snippet}</EmptyState>
	import type { Snippet } from 'svelte';
	import StatusState from './StatusState.svelte';

	type Props = {
		title: string;
		body?: string;
		icon?: Snippet;
		cta?: Snippet;
		size?: 'default' | 'compact';
		align?: 'center' | 'start';
		headingLevel?: 'h2' | 'h3' | 'h4';
		showIcon?: boolean;
		class?: string;
	};

	let {
		title,
		body,
		icon,
		cta,
		size = 'default',
		align = 'center',
		headingLevel = 'h3',
		showIcon = true,
		class: extraClass = ''
	}: Props = $props();
</script>

<StatusState
	tone="empty"
	{title}
	{body}
	{icon}
	{cta}
	{size}
	{align}
	{headingLevel}
	{showIcon}
	class={extraClass}
/>
