<!-- src/lib/components/enneagramTest/ChoiceCard.svelte -->
<!--
  A tappable card for the Enneagram test's self-pick steps (emotion, strength,
  type, tiebreak). Pass `pressed` for multi-select cards so screen readers
  announce the toggle state; leave it out for one-tap choices.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		onclick: () => void;
		pressed?: boolean;
		disabled?: boolean;
		children: Snippet;
	};

	let { onclick, pressed, disabled = false, children }: Props = $props();
</script>

<button type="button" class="choice" aria-pressed={pressed} {disabled} {onclick}>
	{@render children()}
</button>

<style>
	.choice {
		display: flex;
		flex-direction: column;
		gap: 0.65rem;
		width: 100%;
		margin: 0;
		padding: 1rem 1.1rem;
		text-align: left;
		font: inherit;
		color: var(--ink-bright);
		background: var(--stone-warm);
		border: 1px solid var(--stone-mid);
		/* lint-radius-role: card */
		border-radius: 16px;
		cursor: pointer;
		transition:
			border-color 0.15s ease,
			background-color 0.15s ease;
	}

	.choice:hover {
		border-color: var(--stone-edge);
	}

	.choice:focus-visible {
		outline: 2px solid var(--lamp-glow);
		outline-offset: 2px;
	}

	.choice[aria-pressed='true'] {
		border-color: var(--lamp-glow);
		background: linear-gradient(var(--lamp-soft), var(--lamp-soft)), var(--stone-warm);
		box-shadow: inset 0 0 0 1px var(--lamp-glow);
	}

	.choice:disabled {
		cursor: default;
		opacity: 0.6;
	}

	@media (prefers-reduced-motion: reduce) {
		.choice {
			transition: none;
		}
	}
</style>
