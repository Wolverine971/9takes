<!-- src/lib/components/blog/HornevianMatrix.svelte -->
<!--
  9takes — Hornevian Triads / Social Styles 3×3 hero asset.
  Rows = social style (how you go after needs).
  Columns = core want / center (what you go after).
  Used in /enneagram-corner/enneagram-social-styles and reusable in any
  Enneagram post that needs to visualize the Horney groupings.
-->
<script lang="ts">
	type Cell = { type: number; label: string; href: string };
	type Row = { style: string; move: string; lostCenter: string; cells: Cell[] };

	const columns = [
		{ want: 'Attention', center: 'Heart' },
		{ want: 'Security', center: 'Head' },
		{ want: 'Autonomy', center: 'Body' }
	];

	const rows: Row[] = [
		{
			style: 'Assertive',
			move: 'moves against',
			lostCenter: 'heart',
			cells: [
				{ type: 3, label: 'Three', href: '/enneagram-corner/enneagram-type-3' },
				{ type: 7, label: 'Seven', href: '/enneagram-corner/enneagram-type-7' },
				{ type: 8, label: 'Eight', href: '/enneagram-corner/enneagram-type-8' }
			]
		},
		{
			style: 'Compliant',
			move: 'moves toward',
			lostCenter: 'head',
			cells: [
				{ type: 2, label: 'Two', href: '/enneagram-corner/enneagram-type-2' },
				{ type: 6, label: 'Six', href: '/enneagram-corner/enneagram-type-6' },
				{ type: 1, label: 'One', href: '/enneagram-corner/enneagram-type-1' }
			]
		},
		{
			style: 'Withdrawn',
			move: 'moves away',
			lostCenter: 'body',
			cells: [
				{ type: 4, label: 'Four', href: '/enneagram-corner/enneagram-type-4' },
				{ type: 5, label: 'Five', href: '/enneagram-corner/enneagram-type-5' },
				{ type: 9, label: 'Nine', href: '/enneagram-corner/enneagram-type-9' }
			]
		}
	];
</script>

<figure class="hornevian">
	<div class="hornevian__legend">
		<span class="hornevian__legend-label">Row =</span> how you go after what you want
		<span class="hornevian__legend-sep">·</span>
		<span class="hornevian__legend-label">Column =</span> what you're going after
	</div>

	<div class="hornevian__grid" role="table" aria-label="Enneagram social styles by core want">
		<div class="hornevian__corner" role="columnheader" aria-label="Social style"></div>
		{#each columns as col (col.want)}
			<div class="hornevian__col-head" role="columnheader">
				<span class="hornevian__want">Wants {col.want}</span>
				<span class="hornevian__center">{col.center} center</span>
			</div>
		{/each}

		{#each rows as row (row.style)}
			<div class="hornevian__row-head" role="rowheader">
				<span class="hornevian__style">{row.style}</span>
				<span class="hornevian__move">{row.move}</span>
			</div>
			{#each row.cells as cell (cell.type)}
				<a
					class="hornevian__cell"
					href={cell.href}
					role="cell"
					aria-label="Type {cell.type} the {cell.label} — {row.style} style, wants {columns[
						row.cells.indexOf(cell)
					].want.toLowerCase()}"
				>
					<span class="hornevian__num">{cell.type}</span>
					<span class="hornevian__name">The {cell.label}</span>
				</a>
			{/each}
		{/each}
	</div>

	<figcaption class="hornevian__caption">
		The Hornevian Triads (Social Styles) × the three core wants. Two types in the same row use the
		same strategy. Two types in the same column want the same prize.
	</figcaption>
</figure>

<style lang="scss">
	.hornevian {
		margin: 2rem 0 2.5rem;
		padding: 1.5rem 1.5rem 1.75rem;
		border-radius: 1rem;
		background: linear-gradient(135deg, var(--surface) 0%, var(--bg) 50%, var(--bg) 100%);
		border: 1px solid color-mix(in srgb, var(--accent) 35%, transparent);
		box-shadow: var(--shadow-md);
	}

	.hornevian__legend {
		font-size: var(--font-size-sm);
		color: var(--text-faint);
		text-align: center;
		margin-bottom: 1rem;
		line-height: 1.5;
	}

	.hornevian__legend-label {
		color: var(--text-muted);
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		font-size: var(--font-size-xs);
	}

	.hornevian__legend-sep {
		margin: 0 0.5rem;
		color: var(--text-faint);
		opacity: 0.5;
	}

	.hornevian__grid {
		display: grid;
		grid-template-columns: minmax(7rem, 1fr) repeat(3, 1.4fr);
		gap: 6px;
	}

	.hornevian__corner {
		background: transparent;
	}

	.hornevian__col-head {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 0.6rem 0.4rem;
		text-align: center;
		border-radius: 0.625rem;
		background: color-mix(in srgb, var(--accent) 10%, transparent);
		border: 1px solid var(--rule);
	}

	.hornevian__want {
		font-size: var(--font-size-sm);
		font-weight: 700;
		color: var(--text);
		line-height: 1.2;
	}

	.hornevian__center {
		font-size: var(--font-size-xs);
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--text-faint);
		margin-top: 0.2rem;
	}

	.hornevian__row-head {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;
		padding: 0.75rem 0.85rem;
		border-radius: 0.625rem;
		background: linear-gradient(
			90deg,
			color-mix(in srgb, var(--accent) 16%, transparent) 0%,
			color-mix(in srgb, var(--accent) 4%, transparent) 100%
		);
		border: 1px solid var(--rule);
		border-left: 4px solid var(--accent);
	}

	.hornevian__style {
		font-size: var(--font-size-base);
		font-weight: 700;
		color: var(--text);
		line-height: 1.2;
	}

	.hornevian__move {
		font-size: var(--font-size-xs);
		color: var(--text-faint);
		margin-top: 0.2rem;
		font-style: italic;
	}

	.hornevian__cell {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 0.85rem 0.5rem;
		text-align: center;
		text-decoration: none;
		border-radius: 0.625rem;
		background: var(--surface);
		border: 1px solid color-mix(in srgb, var(--text-faint) 18%, transparent);
		transition:
			background 0.18s ease,
			border-color 0.18s ease,
			transform 0.18s ease;

		&:hover {
			background: color-mix(in srgb, var(--accent) 16%, var(--surface));
			border-color: color-mix(in srgb, var(--highlight) 35%, transparent);
			transform: translateY(-1px);
		}

		&:focus-visible {
			outline: 2px solid var(--highlight);
			outline-offset: 2px;
		}
	}

	.hornevian__num {
		font-size: 1.85rem;
		font-weight: 800;
		color: var(--highlight);
		line-height: 1;
		font-feature-settings: 'tnum';
	}

	.hornevian__name {
		font-size: var(--font-size-xs);
		color: var(--text-muted);
		margin-top: 0.3rem;
		letter-spacing: 0.02em;
	}

	.hornevian__caption {
		margin-top: 1.1rem;
		font-size: var(--font-size-sm);
		line-height: 1.55;
		color: var(--text-faint);
		text-align: center;
		font-style: italic;
	}

	@media (max-width: 640px) {
		.hornevian {
			padding: 1rem 0.85rem 1.25rem;
		}

		.hornevian__grid {
			grid-template-columns: minmax(5.5rem, 0.9fr) repeat(3, 1fr);
			gap: 4px;
		}

		.hornevian__col-head {
			padding: 0.4rem 0.25rem;
		}

		.hornevian__want {
			font-size: var(--font-size-xs);
		}

		.hornevian__center {
			font-size: var(--font-size-xs);
		}

		.hornevian__row-head {
			padding: 0.55rem 0.5rem;
			border-left-width: 3px;
		}

		.hornevian__style {
			font-size: var(--font-size-sm);
		}

		.hornevian__move {
			font-size: var(--font-size-xs);
		}

		.hornevian__cell {
			padding: 0.6rem 0.3rem;
		}

		.hornevian__num {
			font-size: 1.5rem;
		}

		.hornevian__name {
			font-size: var(--font-size-xs);
		}

		.hornevian__legend {
			font-size: var(--font-size-xs);
		}
	}
</style>
