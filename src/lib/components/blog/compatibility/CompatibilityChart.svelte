<!-- src/lib/components/blog/compatibility/CompatibilityChart.svelte -->
<!--
  9x9 Enneagram compatibility chart. Each cell names the pairing's fault line
  and links to its full read (CompatibilityReads). The chart mirrors across the
  diagonal; same-type pairings sit on the shaded diagonal.
  Content: $lib/data/enneagramCompatibility.
-->
<script lang="ts">
	import {
		COMPATIBILITY_TYPE_NAMES,
		ENNEAGRAM_TYPES,
		getCompatibilityPairing,
		pairingAnchor
	} from '$lib/data/enneagramCompatibility';

	const rows = ENNEAGRAM_TYPES.map((row) => ({
		type: row,
		cells: ENNEAGRAM_TYPES.map((col) => {
			const pairing = getCompatibilityPairing(row, col);
			return {
				col,
				same: row === col,
				anchor: pairingAnchor(pairing),
				faultLine: pairing.faultLine
			};
		})
	}));
</script>

<div class="compat-chart" id="compatibility-chart">
	<table>
		<caption
			>Enneagram compatibility chart: the fault line for each of the 45 type pairings. Same-type
			pairings sit on the shaded diagonal.</caption
		>
		<thead>
			<tr>
				<th scope="col">Type</th>
				{#each ENNEAGRAM_TYPES as type (type)}
					<th scope="col">{type}<span class="tname">{COMPATIBILITY_TYPE_NAMES[type]}</span></th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each rows as row (row.type)}
				<tr>
					<th scope="row"
						>{row.type}<span class="tname">{COMPATIBILITY_TYPE_NAMES[row.type]}</span></th
					>
					{#each row.cells as cell (cell.col)}
						<td class:same={cell.same}><a href={`#${cell.anchor}`}>{cell.faultLine}</a></td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	.compat-chart {
		--blog-link-color: var(--ink-bright);
		overflow-x: auto;
		margin: 1.5rem 0;
		-webkit-overflow-scrolling: touch;
	}

	.compat-chart table {
		display: table;
		width: 100%;
		min-width: 50rem;
		margin: 0;
		table-layout: fixed;
		overflow: visible;
		font-size: 0.8125rem;
		line-height: 1.3;
	}

	.compat-chart caption {
		caption-side: bottom;
		padding-top: 0.5rem;
		text-align: left;
		font-size: 0.875rem;
		color: var(--ink-dim);
	}

	.compat-chart th,
	.compat-chart td {
		min-width: 0;
		padding: 0.45rem 0.35rem;
		text-align: center;
		vertical-align: middle;
		white-space: normal;
		hyphens: auto;
		-webkit-hyphens: auto;
		overflow-wrap: break-word;
	}

	.compat-chart thead th:first-child {
		width: 6.5rem;
	}

	.compat-chart tbody th {
		position: sticky;
		left: 0;
		z-index: 1;
		text-align: left;
	}

	.compat-chart .tname {
		display: block;
		font-size: 0.6875rem;
		font-weight: 400;
		color: var(--ink-mid);
		hyphens: none;
	}

	.compat-chart td.same {
		background-color: color-mix(in srgb, var(--lamp-glow) 14%, transparent);
	}
</style>
