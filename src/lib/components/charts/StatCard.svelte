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
		padding: 12px 14px;
		background: var(--card-background, #fff);
		border: 1px solid var(--border-color, #e2e8f0);
		border-radius: 10px;
		transition: all 0.15s ease;
		text-decoration: none;
		color: inherit;
	}

	.stat-card.clickable:hover {
		border-color: var(--primary, #3b82f6);
		box-shadow: 0 4px 12px -2px rgba(59, 130, 246, 0.15);
		transform: translateY(-1px);
	}

	/* Color variants */
	.stat-primary {
		background: linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(99, 102, 241, 0.02));
		border-color: rgba(99, 102, 241, 0.2);
	}

	.stat-primary .stat-value {
		color: #6366f1;
	}

	.stat-success {
		background: linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(16, 185, 129, 0.02));
		border-color: rgba(16, 185, 129, 0.2);
	}

	.stat-success .stat-value {
		color: #059669;
	}

	.stat-warning {
		background: linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(245, 158, 11, 0.02));
		border-color: rgba(245, 158, 11, 0.2);
	}

	.stat-warning .stat-value {
		color: #d97706;
	}

	.stat-danger {
		background: linear-gradient(135deg, rgba(239, 68, 68, 0.08), rgba(239, 68, 68, 0.02));
		border-color: rgba(239, 68, 68, 0.2);
	}

	.stat-danger .stat-value {
		color: #dc2626;
	}

	.stat-content {
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-width: 0;
		flex: 1;
	}

	.stat-header {
		display: flex;
		align-items: center;
		gap: 5px;
	}

	.stat-icon {
		font-size: 0.875rem;
		line-height: 1;
	}

	.stat-label {
		font-size: 0.625rem;
		font-weight: 600;
		color: var(--text-secondary, #64748b);
		text-transform: uppercase;
		letter-spacing: 0.3px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.stat-body {
		display: flex;
		align-items: baseline;
		gap: 6px;
		flex-wrap: wrap;
	}

	.stat-value {
		font-size: 1.375rem;
		font-weight: 700;
		color: var(--text-primary, #1e293b);
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
		gap: 2px;
		font-size: 0.6875rem;
		font-weight: 600;
		padding: 2px 5px;
		border-radius: 4px;
	}

	.stat-trend.up {
		background: rgba(16, 185, 129, 0.1);
		color: #059669;
	}

	.stat-trend.down {
		background: rgba(239, 68, 68, 0.1);
		color: #dc2626;
	}

	.trend-value {
		font-weight: 500;
	}

	.stat-sub {
		font-size: 0.625rem;
		color: var(--text-secondary, #64748b);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.sparkline-container {
		width: 50px;
		height: 20px;
		flex-shrink: 0;
	}

	.sparkline {
		width: 100%;
		height: 100%;
	}

	.sparkline-line {
		fill: none;
		stroke: var(--primary, #3b82f6);
		stroke-width: 1.5;
		stroke-linecap: round;
		stroke-linejoin: round;
		stroke-dasharray: 200;
		stroke-dashoffset: 200;
		transition: stroke-dashoffset 0s;
	}

	.sparkline-line.animate {
		stroke-dashoffset: 0;
		transition: stroke-dashoffset 1s ease-out;
	}

	.stat-success .sparkline-line {
		stroke: #10b981;
	}

	.stat-warning .sparkline-line {
		stroke: #f59e0b;
	}

	.stat-danger .sparkline-line {
		stroke: #ef4444;
	}

	/* Tablet */
	@media (max-width: 1024px) {
		.stat-card {
			padding: 10px 12px;
		}

		.stat-value {
			font-size: 1.25rem;
		}
	}

	/* Mobile */
	@media (max-width: 768px) {
		.stat-card {
			padding: 10px;
			gap: 8px;
			border-radius: 8px;
		}

		.stat-icon {
			font-size: 0.8125rem;
		}

		.stat-label {
			font-size: 0.5625rem;
		}

		.stat-value {
			font-size: 1.125rem;
		}

		.stat-sub {
			font-size: 0.5625rem;
		}

		.stat-trend {
			font-size: 0.625rem;
			padding: 1px 4px;
		}

		.sparkline-container {
			width: 40px;
			height: 16px;
		}
	}

	/* Extra small screens */
	@media (max-width: 480px) {
		.stat-card {
			padding: 8px;
			gap: 6px;
		}

		.stat-header {
			gap: 4px;
		}

		.stat-icon {
			font-size: 0.75rem;
		}

		.stat-label {
			font-size: 0.5rem;
			letter-spacing: 0.2px;
		}

		.stat-value {
			font-size: 1rem;
		}

		.stat-sub {
			font-size: 0.5rem;
		}

		.sparkline-container {
			width: 36px;
			height: 14px;
		}
	}
</style>
