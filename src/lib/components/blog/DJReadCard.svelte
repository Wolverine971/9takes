<!-- src/lib/components/blog/DJReadCard.svelte -->
<script lang="ts">
	import { getDJPersonalityRead } from '$lib/data/djPersonalityReads';

	let { readId }: { readId: string } = $props();
	let read = $derived(getDJPersonalityRead(readId));
	let headingId = $derived(read ? `dj-read-${read.id}` : 'dj-read');
</script>

{#if read}
	<section class="dj-read" aria-labelledby={headingId} data-dj-read-id={read.id}>
		<header class="dj-read__header">
			<div>
				<p class="dj-read__eyebrow">DJ'S READ · FIRST-HAND REASONING</p>
				<h3 id={headingId}>{read.person}</h3>
			</div>
			<span class="dj-read__type">{read.proposedType}</span>
		</header>

		<div class="dj-read__meta" aria-label="Reasoning summary">
			<p><span>Confidence</span><strong>{read.confidence}</strong></p>
			<p><span>Strongest alternative</span><strong>{read.strongestAlternative}</strong></p>
		</div>

		<p class="dj-read__thesis">{read.thesis}</p>

		<ol class="dj-read__connections">
			{#each read.claims as claim (claim.label)}
				<li>
					<h4>{claim.label}</h4>
					<p>{claim.compactConnection}</p>
				</li>
			{/each}
		</ol>

		<div class="dj-read__hesitation">
			<span>What makes me hesitate</span>
			<p>{read.compactHesitation}</p>
		</div>

		<a class="dj-read__link" href={`#${read.reasoningAnchor}`}
			>See the evidence and full reasoning</a
		>
	</section>
{/if}
