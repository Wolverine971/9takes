<!-- src/lib/components/enneagramTest/StepHeader.svelte -->
<!--
  Progress bar + step label + Back for the Enneagram test. The six segments
  are the real steps of DJ's flow (groundwork → tiebreak), so the numbering
  carries information.
-->
<script lang="ts">
	import { STEP_LABELS } from '$lib/enneagramTest/flow';

	type Props = { step: number; onBack?: () => void };

	let { step, onBack }: Props = $props();
</script>

<div class="step-head">
	<div class="progress" aria-hidden="true">
		{#each STEP_LABELS as label, index (label)}
			<span class="seg" class:on={index <= step}></span>
		{/each}
	</div>
	<div class="step-row">
		<p class="step-label">Step {step + 1} · {STEP_LABELS[step]}</p>
		{#if onBack}
			<button type="button" class="back" onclick={onBack}>← Back</button>
		{/if}
	</div>
</div>

<style>
	.step-head {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
	}

	.progress {
		display: grid;
		grid-template-columns: repeat(6, 1fr);
		gap: 4px;
	}

	.seg {
		height: 3px;
		border-radius: 4px;
		background: var(--stone-mid);
	}

	.seg.on {
		background: var(--lamp-glow);
	}

	.step-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
	}

	.step-label {
		margin: 0;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--lamp-glow);
	}

	.back {
		margin: 0;
		padding: 0.35rem 0;
		border: 0;
		background: none;
		color: var(--ink-mid);
		font: inherit;
		font-size: 0.9rem;
		cursor: pointer;
	}

	.back:hover,
	.back:focus-visible {
		color: var(--ink-bright);
	}
</style>
