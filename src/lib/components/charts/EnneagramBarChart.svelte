<!-- src/lib/components/charts/EnneagramBarChart.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';

	export let distribution: Record<number, number> = {};
	export let title: string = 'Type Distribution';
	export let showPercentages: boolean = true;
	export let compact: boolean = false;

	// Enneagram type colors (matching the brand)
	const typeColors: Record<number, string> = {
		1: '#6366f1', // Indigo - The Perfectionist
		2: '#ec4899', // Pink - The Helper
		3: '#f59e0b', // Amber - The Achiever
		4: '#8b5cf6', // Purple - The Individualist
		5: '#3b82f6', // Blue - The Investigator
		6: '#14b8a6', // Teal - The Loyalist
		7: '#f97316', // Orange - The Enthusiast
		8: '#ef4444', // Red - The Challenger
		9: '#22c55e' // Green - The Peacemaker
	};

	const typeNames: Record<number, string> = {
		1: 'Perfectionist',
		2: 'Helper',
		3: 'Achiever',
		4: 'Individualist',
		5: 'Investigator',
		6: 'Loyalist',
		7: 'Enthusiast',
		8: 'Challenger',
		9: 'Peacemaker'
	};

	$: total = Object.values(distribution).reduce((sum, count) => sum + count, 0);
	$: maxCount = Math.max(...Object.values(distribution), 1);

	$: sortedTypes = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((type) => ({
		type,
		count: distribution[type] || 0,
		percentage: total > 0 ? ((distribution[type] || 0) / total) * 100 : 0,
		width: maxCount > 0 ? ((distribution[type] || 0) / maxCount) * 100 : 0,
		color: typeColors[type],
		name: typeNames[type]
	}));

	$: topType = sortedTypes.reduce((max, t) => (t.count > max.count ? t : max), sortedTypes[0]);

	let mounted = false;
	onMount(() => {
		mounted = true;
	});
</script>

<div class="enneagram-chart" class:compact>
	{#if title}
		<div class="chart-header">
			<h3 class="chart-title">{title}</h3>
			<div class="chart-summary">
				<span class="total-users">{total.toLocaleString()} users</span>
				{#if topType.count > 0}
					<span class="top-type" style="--type-color: {topType.color}">
						Top: Type {topType.type}
					</span>
				{/if}
			</div>
		</div>
	{/if}

	<div class="bars-container">
		{#each sortedTypes as item, i}
			<div class="bar-row" style="--delay: {i * 50}ms">
				<div class="bar-label">
					<span class="type-number" style="background: {item.color}">{item.type}</span>
					{#if !compact}
						<span class="type-name">{item.name}</span>
					{/if}
				</div>
				<div class="bar-track">
					<div
						class="bar-fill"
						class:animate={mounted}
						style="--width: {item.width}%; --color: {item.color}"
					></div>
				</div>
				<div class="bar-value">
					<span class="count">{item.count}</span>
					{#if showPercentages && total > 0}
						<span class="percentage">({item.percentage.toFixed(1)}%)</span>
					{/if}
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.enneagram-chart {
		width: 100%;
		background: var(--card-background, #fff);
		border-radius: 12px;
		padding: 16px;
	}

	.enneagram-chart.compact {
		padding: 12px;
	}

	.chart-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 16px;
		flex-wrap: wrap;
		gap: 8px;
	}

	.compact .chart-header {
		margin-bottom: 12px;
	}

	.chart-title {
		margin: 0;
		font-size: 1rem;
		font-weight: 600;
		color: var(--text-primary, #1e293b);
	}

	.compact .chart-title {
		font-size: 0.875rem;
	}

	.chart-summary {
		display: flex;
		align-items: center;
		gap: 12px;
		font-size: 0.75rem;
	}

	.total-users {
		color: var(--text-secondary, #64748b);
	}

	.top-type {
		padding: 2px 8px;
		border-radius: 12px;
		font-weight: 500;
		background: color-mix(in srgb, var(--type-color) 15%, transparent);
		color: var(--type-color);
	}

	.bars-container {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.compact .bars-container {
		gap: 6px;
	}

	.bar-row {
		display: grid;
		grid-template-columns: auto 1fr auto;
		align-items: center;
		gap: 12px;
		animation: fadeIn 0.3s ease-out var(--delay) both;
	}

	.compact .bar-row {
		gap: 8px;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateX(-8px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	.bar-label {
		display: flex;
		align-items: center;
		gap: 8px;
		min-width: 120px;
	}

	.compact .bar-label {
		min-width: 32px;
	}

	.type-number {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
		border-radius: 6px;
		font-size: 0.75rem;
		font-weight: 700;
		color: white;
		flex-shrink: 0;
	}

	.compact .type-number {
		width: 20px;
		height: 20px;
		font-size: 0.7rem;
		border-radius: 4px;
	}

	.type-name {
		font-size: 0.8rem;
		color: var(--text-secondary, #64748b);
		white-space: nowrap;
	}

	.bar-track {
		height: 24px;
		background: var(--hover-background, #f1f5f9);
		border-radius: 6px;
		overflow: hidden;
		position: relative;
	}

	.compact .bar-track {
		height: 18px;
		border-radius: 4px;
	}

	.bar-fill {
		height: 100%;
		width: 0;
		background: linear-gradient(90deg, var(--color), color-mix(in srgb, var(--color) 80%, white));
		border-radius: 6px;
		transition: width 0s;
		position: relative;
	}

	.bar-fill.animate {
		width: var(--width);
		transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1) var(--delay);
	}

	.compact .bar-fill {
		border-radius: 4px;
	}

	.bar-value {
		display: flex;
		align-items: baseline;
		gap: 4px;
		min-width: 70px;
		justify-content: flex-end;
	}

	.compact .bar-value {
		min-width: 50px;
	}

	.count {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-primary, #1e293b);
	}

	.compact .count {
		font-size: 0.75rem;
	}

	.percentage {
		font-size: 0.7rem;
		color: var(--text-secondary, #64748b);
	}

	.compact .percentage {
		font-size: 0.65rem;
	}

	/* Responsive */
	@media (max-width: 640px) {
		.bar-label {
			min-width: 32px;
		}

		.type-name {
			display: none;
		}

		.bar-value {
			min-width: 50px;
		}
	}
</style>
