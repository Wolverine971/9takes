<!-- src/lib/components/blog/BetaRailCard.svelte -->
<!--
  The beta card for pages that already have a desktop side rail (personality
  pages put it at the top of "More Personalities"). Renders only at rail
  widths; below them ExperimentalTherapyInvite puts the card in the article.
-->
<script lang="ts">
	import { onMount } from 'svelte';
	import ExperimentalTherapyCard from './ExperimentalTherapyCard.svelte';
	import { betaCard } from './betaInviteState.svelte';
	import { BETA_RAIL_MEDIA_QUERY, readBetaSignedUp, type BetaSurface } from '$lib/utils/betaInvite';

	let { surface, personName = null }: { surface: BetaSurface; personName?: string | null } =
		$props();

	let show = $state(false);

	onMount(() => {
		const offer = !readBetaSignedUp() || betaCard.stage === 'done';
		const media = window.matchMedia(BETA_RAIL_MEDIA_QUERY);
		const update = () => (show = offer && media.matches);
		update();
		media.addEventListener('change', update);
		return () => media.removeEventListener('change', update);
	});
</script>

{#if show}
	<div class="beta-rail-card">
		<ExperimentalTherapyCard placement="rail" {surface} {personName} />
	</div>
{/if}

<style>
	.beta-rail-card {
		flex: none;
		margin-bottom: 0.75rem;
	}
</style>
