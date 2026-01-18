<!-- src/lib/components/charts/StatCard.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';

	export let label: string;
	export let value: number | string;
	export let subValue: string = '';
	export let icon: string = '';
	export let trend: 'up' | 'down' | 'neutral' | null = null;
	export let trendValue: string = '';
	export let color: 'default' | 'primary' | 'success' | 'warning' | 'danger' = 'default';
	export let sparklineData: number[] = [];
	export let href: string = '';

	// Generate sparkline path
	$: sparklinePath = (() => {
		if (sparklineData.length < 2) return '';
		const max = Math.max(...sparklineData);
		const min = Math.min(...sparklineData);
		const range = max - min || 1;
		const width = 60;
		const height = 24;
		const padding = 2;

		const points = sparklineData.map((val, i) => {
			const x = (i / (sparklineData.length - 1)) * width;
			const y = height - padding - ((val - min) / range) * (height - padding * 2);
			return `${x},${y}`;
		});

		return `M${points.join(' L')}`;
	})();

	let mounted = false;
	onMount(() => {
		mounted = true;
	});

	const colorClasses: Record<string, string> = {
		default: '',
		primary: 'stat-primary',
		success: 'stat-success',
		warning: 'stat-warning',
		danger: 'stat-danger'
	};
</script>

<svelte:element
	this={href ? 'a' : 'div'}
	class="stat-card {colorClasses[color]}"
	class:clickable={href}
	{href}
>
	<div class="stat-content">
		<div class="stat-header">
			{#if icon}
				<span class="stat-icon">{icon}</span>
			{/if}
			<span class="stat-label">{label}</span>
		</div>
		<div class="stat-body">
			<span class="stat-value" class:animate={mounted}
				>{typeof value === 'number' ? value.toLocaleString() : value}</span
			>
			{#if trend}
				<span class="stat-trend" class:up={trend === 'up'} class:down={trend === 'down'}>
					{trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
					{#if trendValue}
						<span class="trend-value">{trendValue}</span>
					{/if}
				</span>
			{/if}
		</div>
		{#if subValue}
			<span class="stat-sub">{subValue}</span>
		{/if}
	</div>

	{#if sparklineData.length > 1}
		<div class="sparkline-container">
			<svg viewBox="0 0 60 24" class="sparkline" preserveAspectRatio="none">
				<path d={sparklinePath} class="sparkline-line" class:animate={mounted} />
			</svg>
		</div>
	{/if}
</svelte:element>

<style>
	.stat-card {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
		padding: 14px 16px;
		background: var(--void-surface);
		border: 1px solid var(--void-elevated);
		border-radius: 10px;
		transition: all 0.2s ease;
		text-decoration: none;
		color: inherit;
	}

	.stat-card:hover {
		border-color: var(--void-highlight);
	}

	.stat-card.clickable:hover {
		border-color: var(--shadow-monarch);
		box-shadow: var(--glow-sm);
		transform: translateY(-2px);
	}

	/* Color variants */
	.stat-primary {
		background: linear-gradient(
			135deg,
			rgba(124, 58, 237, 0.15) 0%,
			rgba(124, 58, 237, 0.05) 100%
		);
		border-color: rgba(124, 58, 237, 0.3);
	}

	.stat-primary:hover {
		border-color: var(--shadow-monarch);
		box-shadow: var(--glow-sm);
	}

	.stat-primary .stat-value {
		color: var(--shadow-monarch-light);
	}

	.stat-success {
		background: linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.05) 100%);
		border-color: rgba(16, 185, 129, 0.3);
	}

	.stat-success:hover {
		border-color: var(--success);
	}

	.stat-success .stat-value {
		color: var(--success-text);
	}

	.stat-warning {
		background: linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(245, 158, 11, 0.05) 100%);
		border-color: rgba(245, 158, 11, 0.3);
	}

	.stat-warning:hover {
		border-color: var(--warning);
	}

	.stat-warning .stat-value {
		color: var(--warning);
	}

	.stat-danger {
		background: linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.05) 100%);
		border-color: rgba(239, 68, 68, 0.3);
	}

	.stat-danger:hover {
		border-color: var(--error);
	}

	.stat-danger .stat-value {
		color: #f87171;
	}

	.stat-content {
		display: flex;
		flex-direction: column;
		gap: 4px;
		min-width: 0;
		flex: 1;
	}

	.stat-header {
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.stat-icon {
		font-size: 1rem;
		line-height: 1;
	}

	.stat-label {
		font-size: 0.6875rem;
		font-weight: 600;
		color: var(--text-secondary);
		text-transform: uppercase;
		letter-spacing: 0.3px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.stat-body {
		display: flex;
		align-items: baseline;
		gap: 8px;
		flex-wrap: wrap;
	}

	.stat-value {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--text-primary);
		line-height: 1.1;
		opacity: 0;
		transform: translateY(4px);
		transition: all 0.4s ease;
	}

	.stat-value.animate {
		opacity: 1;
		transform: translateY(0);
	}

	.stat-trend {
		display: flex;
		align-items: center;
		gap: 3px;
		font-size: 0.75rem;
		font-weight: 600;
		padding: 3px 6px;
		border-radius: 6px;
	}

	.stat-trend.up {
		background: var(--success-light);
		color: var(--success-text);
	}

	.stat-trend.down {
		background: var(--error-light);
		color: #f87171;
	}

	.trend-value {
		font-weight: 500;
	}

	.stat-sub {
		font-size: 0.6875rem;
		color: var(--text-secondary);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.sparkline-container {
		width: 55px;
		height: 22px;
		flex-shrink: 0;
	}

	.sparkline {
		width: 100%;
		height: 100%;
	}

	.sparkline-line {
		fill: none;
		stroke: var(--shadow-monarch-light);
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
		stroke-dasharray: 200;
		stroke-dashoffset: 200;
		transition: stroke-dashoffset 0s;
		filter: drop-shadow(0 0 3px var(--shadow-monarch-glow));
	}

	.sparkline-line.animate {
		stroke-dashoffset: 0;
		transition: stroke-dashoffset 1s ease-out;
	}

	.stat-success .sparkline-line {
		stroke: var(--success-text);
		filter: drop-shadow(0 0 3px rgba(16, 185, 129, 0.5));
	}

	.stat-warning .sparkline-line {
		stroke: var(--warning);
		filter: drop-shadow(0 0 3px rgba(245, 158, 11, 0.5));
	}

	.stat-danger .sparkline-line {
		stroke: #f87171;
		filter: drop-shadow(0 0 3px rgba(239, 68, 68, 0.5));
	}

	/* Tablet */
	@media (max-width: 1024px) {
		.stat-card {
			padding: 12px 14px;
		}

		.stat-value {
			font-size: 1.375rem;
		}
	}

	/* Mobile */
	@media (max-width: 768px) {
		.stat-card {
			padding: 12px;
			gap: 8px;
			border-radius: 8px;
		}

		.stat-icon {
			font-size: 0.875rem;
		}

		.stat-label {
			font-size: 0.5625rem;
		}

		.stat-value {
			font-size: 1.25rem;
		}

		.stat-sub {
			font-size: 0.5625rem;
		}

		.stat-trend {
			font-size: 0.6875rem;
			padding: 2px 5px;
		}

		.sparkline-container {
			width: 45px;
			height: 18px;
		}
	}

	/* Extra small screens */
	@media (max-width: 480px) {
		.stat-card {
			padding: 10px;
			gap: 6px;
		}

		.stat-header {
			gap: 4px;
		}

		.stat-icon {
			font-size: 0.8125rem;
		}

		.stat-label {
			font-size: 0.5rem;
			letter-spacing: 0.2px;
		}

		.stat-value {
			font-size: 1.125rem;
		}

		.stat-sub {
			font-size: 0.5rem;
		}

		.sparkline-container {
			width: 40px;
			height: 16px;
		}
	}
</style>
