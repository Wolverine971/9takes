<!-- src/lib/components/blog/compatibility/CompatibilityReads.svelte -->
<!--
  The full read for all 45 Enneagram pairings, grouped under the lower type
  number. Renders bare h3/h4/p siblings (no wrapper) so the article's prose
  styles apply exactly as they did when this lived in the markdown, and the
  heading ids match the chart links and older inbound #fragment links.
  Content: $lib/data/enneagramCompatibility.
-->
<script lang="ts">
	import {
		ENNEAGRAM_TYPES,
		pairingAnchor,
		pairingHeading,
		pairingsListedUnder,
		slugifyHeading,
		typeGroupHeading
	} from '$lib/data/enneagramCompatibility';
	import PairingText from './PairingText.svelte';

	const groups = ENNEAGRAM_TYPES.map((type) => ({
		heading: typeGroupHeading(type),
		pairings: pairingsListedUnder(type)
	}));
</script>

{#each groups as group (group.heading)}
	<h3 id={slugifyHeading(group.heading)}>{group.heading}</h3>

	{#each group.pairings as pairing (pairingAnchor(pairing))}
		<h4 id={pairingAnchor(pairing)}>{pairingHeading(pairing)}</h4>
		<p><PairingText text={pairing.draw} /></p>
		<p><PairingText text={pairing.crack} /></p>
		<p><strong>What makes it work:</strong> <PairingText text={pairing.works} /></p>
	{/each}
{/each}
