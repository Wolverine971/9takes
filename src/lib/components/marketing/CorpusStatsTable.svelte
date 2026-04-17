<!-- src/lib/components/marketing/CorpusStatsTable.svelte -->
<!-- Shared 9-row Enneagram-type table for /corpus-stats. Used for both the
	 corpus-wide baseline and each domain breakdown. -->
<script lang="ts">
	type Props = {
		counts: Record<string, number>;
		shares: Record<string, number>;
		diffsPp?: Record<string, number> | null;
		caption?: string;
	};

	let { counts, shares, diffsPp = null, caption }: Props = $props();

	const TYPE_NAMES: Record<number, string> = {
		1: 'Reformer',
		2: 'Helper',
		3: 'Achiever',
		4: 'Individualist',
		5: 'Investigator',
		6: 'Loyalist',
		7: 'Enthusiast',
		8: 'Challenger',
		9: 'Peacemaker'
	};

	const rows = Array.from({ length: 9 }, (_, i) => {
		const t = i + 1;
		const key = String(t);
		return {
			type: t,
			name: TYPE_NAMES[t],
			count: counts[key] ?? 0,
			share: shares[key] ?? 0,
			delta: diffsPp ? (diffsPp[key] ?? 0) : null
		};
	});

	const pct = (n: number) => (n * 100).toFixed(1);
	const fmtDelta = (pp: number) => (pp >= 0 ? `+${pp.toFixed(2)}` : `${pp.toFixed(2)}`);
</script>

<table class="corpus-table">
	{#if caption}
		<caption>{caption}</caption>
	{/if}
	<thead>
		<tr>
			<th scope="col">Type</th>
			<th scope="col">Name</th>
			<th scope="col" class="num">Count</th>
			<th scope="col" class="num">Share</th>
			{#if diffsPp}
				<th scope="col" class="num">Δ vs baseline</th>
			{/if}
		</tr>
	</thead>
	<tbody>
		{#each rows as row}
			<tr>
				<th scope="row">{row.type}</th>
				<td>{row.name}</td>
				<td class="num">{row.count}</td>
				<td class="num">{pct(row.share)}%</td>
				{#if diffsPp && row.delta !== null}
					<td class="num" class:pos={row.delta > 0} class:neg={row.delta < 0}>
						{fmtDelta(row.delta)} pp
					</td>
				{/if}
			</tr>
		{/each}
	</tbody>
</table>

<style>
	.corpus-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.92rem;
		margin: 0.5rem 0 1.25rem;
	}
	.corpus-table caption {
		caption-side: top;
		text-align: left;
		font-family: var(--font-mono);
		font-size: 0.78rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--text-mist);
		padding-bottom: 0.5rem;
	}
	.corpus-table th,
	.corpus-table td {
		padding: 0.55rem 0.75rem;
		border-bottom: 1px solid var(--border-color);
		text-align: left;
		vertical-align: baseline;
	}
	.corpus-table thead th {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--text-mist);
		font-weight: 600;
	}
	.corpus-table tbody th {
		font-weight: 700;
		font-variant-numeric: tabular-nums;
		color: var(--shadow-flame);
	}
	.corpus-table .num {
		text-align: right;
		font-variant-numeric: tabular-nums;
	}
	.corpus-table td.pos {
		color: var(--shadow-flame);
	}
	.corpus-table td.neg {
		color: var(--text-mist);
	}
</style>
