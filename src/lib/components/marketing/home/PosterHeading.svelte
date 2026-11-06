<!-- src/lib/components/marketing/home/PosterHeading.svelte -->
<!-- Cold Light poster headline: condensed caps (Anton) over an italic serif tail (Playfair). -->
<script lang="ts">
	let {
		big,
		ital,
		id,
		level = 2
	}: { big: string; ital: string; id?: string; level?: 2 | 3 } = $props();
</script>

<svelte:element this={`h${level}`} class="poster" {id}>
	<span class="big">{big}</span>
	<span class="ital">{ital}</span>
</svelte:element>

<style>
	.poster {
		--poster-big: clamp(56px, 7vw, 96px);
		--poster-ital: clamp(36px, 4.2vw, 58px);
		margin: 0;
		font-weight: 400;
		line-height: 0.9;
	}
	.big {
		display: block;
		font-family: var(--font-shout);
		font-weight: 400;
		font-size: var(--poster-big);
		text-transform: uppercase;
		color: var(--text);
	}
	.ital {
		display: block;
		margin-top: -0.03em;
		font-family: var(--font-voice);
		font-style: italic;
		font-weight: 400;
		font-size: var(--poster-ital);
		line-height: 1;
		color: var(--highlight);
	}
</style>
