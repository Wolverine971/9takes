<!-- src/lib/components/charts/LineChart.svelte -->
<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import * as d3 from 'd3';

	export let data: { x: string | number; y: number; label?: string }[];
	export let title: string = '';
	export let xLabel: string = '';
	export let yLabel: string = '';
	export let height: number = 300;
	export let color: string = '#3b82f6';
	export let showPoints: boolean = true;
	export let showGrid: boolean = true;
	export let showSummary: boolean = true;
	export let showTrend: boolean = true;
	export let animate: boolean = true;

	let container: HTMLDivElement;
	let mounted = false;
	let tooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, any> | null = null;

	// Computed summary stats
	$: summaryStats = data?.length
		? {
				total: data.reduce((sum, d) => sum + d.y, 0),
				avg: Math.round(data.reduce((sum, d) => sum + d.y, 0) / data.length),
				peak: Math.max(...data.map((d) => d.y)),
				min: Math.min(...data.map((d) => d.y)),
				peakDate: data.find((d) => d.y === Math.max(...data.map((d) => d.y)))?.label || ''
			}
		: { total: 0, avg: 0, peak: 0, min: 0, peakDate: '' };

	// Calculate trend (compare last 7 days to previous 7 days)
	$: trend = (() => {
		if (!data || data.length < 14) return { change: 0, direction: 'flat' };
		const recent = data.slice(-7).reduce((sum, d) => sum + d.y, 0);
		const previous = data.slice(-14, -7).reduce((sum, d) => sum + d.y, 0);
		if (previous === 0) return { change: 0, direction: 'flat' };
		const change = ((recent - previous) / previous) * 100;
		return {
			change: Math.abs(change).toFixed(1),
			direction: change > 5 ? 'up' : change < -5 ? 'down' : 'flat'
		};
	})();

	onMount(() => {
		mounted = true;
		// Create tooltip once
		tooltip = d3
			.select('body')
			.append('div')
			.attr('class', 'chart-tooltip-enhanced')
			.style('opacity', 0)
			.style('position', 'absolute')
			.style('background', 'rgba(15, 23, 42, 0.95)')
			.style('color', '#f8fafc')
			.style('border', '1px solid rgba(148, 163, 184, 0.2)')
			.style('border-radius', '8px')
			.style('padding', '10px 14px')
			.style('font-size', '12px')
			.style('font-family', 'system-ui, -apple-system, sans-serif')
			.style('pointer-events', 'none')
			.style('z-index', '10000')
			.style('box-shadow', '0 10px 25px -5px rgba(0, 0, 0, 0.3)')
			.style('backdrop-filter', 'blur(8px)');
		drawChart();
	});

	onDestroy(() => {
		if (tooltip) {
			tooltip.remove();
		}
	});

	$: if (mounted && data) {
		drawChart();
	}

	function drawChart() {
		if (!container || !data?.length) return;

		// Clear previous chart
		d3.select(container).selectAll('*').remove();

		const margin = { top: 24, right: 24, bottom: 40, left: 48 };
		const width = container.clientWidth - margin.left - margin.right;
		const chartHeight = height - margin.top - margin.bottom;

		// Create SVG with proper viewBox for responsiveness
		const svg = d3
			.select(container)
			.append('svg')
			.attr('width', '100%')
			.attr('height', height)
			.attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height}`)
			.attr('class', 'line-chart-enhanced');

		// Add gradient definition
		const defs = svg.append('defs');

		const gradient = defs
			.append('linearGradient')
			.attr('id', `area-gradient-${color.replace('#', '')}`)
			.attr('x1', '0%')
			.attr('y1', '0%')
			.attr('x2', '0%')
			.attr('y2', '100%');

		gradient.append('stop').attr('offset', '0%').attr('stop-color', color).attr('stop-opacity', 0.3);

		gradient
			.append('stop')
			.attr('offset', '100%')
			.attr('stop-color', color)
			.attr('stop-opacity', 0.02);

		// Add glow filter for points
		const filter = defs.append('filter').attr('id', 'glow').attr('x', '-50%').attr('y', '-50%').attr('width', '200%').attr('height', '200%');
		filter.append('feGaussianBlur').attr('stdDeviation', '2').attr('result', 'coloredBlur');
		const feMerge = filter.append('feMerge');
		feMerge.append('feMergeNode').attr('in', 'coloredBlur');
		feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

		const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

		// Parse data and create scales
		const parsedData = data.map((d) => ({
			x: typeof d.x === 'string' ? +d.x : d.x,
			y: d.y,
			label: d.label || d.x.toString()
		}));

		// Determine if x values are dates (timestamps)
		const isDateScale = parsedData.length > 0 && parsedData[0].x > 1000000000000;

		const xScale = isDateScale
			? d3
					.scaleTime()
					.domain(d3.extent(parsedData, (d) => new Date(d.x)) as [Date, Date])
					.range([0, width])
			: d3
					.scaleLinear()
					.domain(d3.extent(parsedData, (d) => d.x) as [number, number])
					.range([0, width]);

		const yMax = d3.max(parsedData, (d) => d.y) as number;
		const yScale = d3
			.scaleLinear()
			.domain([0, yMax * 1.1])
			.range([chartHeight, 0]);

		// Add grid if enabled
		if (showGrid) {
			// Y grid - horizontal lines
			g.selectAll('.grid-y')
				.data(yScale.ticks(5))
				.enter()
				.append('line')
				.attr('class', 'grid-line')
				.attr('x1', 0)
				.attr('x2', width)
				.attr('y1', (d) => yScale(d))
				.attr('y2', (d) => yScale(d))
				.attr('stroke', 'var(--border-color, #e2e8f0)')
				.attr('stroke-width', 1)
				.attr('opacity', 0.4)
				.attr('stroke-dasharray', '4,4');
		}

		// Create line generator
		const line = d3
			.line<(typeof parsedData)[0]>()
			.x((d) => xScale(isDateScale ? new Date(d.x) : d.x))
			.y((d) => yScale(d.y))
			.curve(d3.curveMonotoneX);

		// Add area under the line with gradient
		const area = d3
			.area<(typeof parsedData)[0]>()
			.x((d) => xScale(isDateScale ? new Date(d.x) : d.x))
			.y0(chartHeight)
			.y1((d) => yScale(d.y))
			.curve(d3.curveMonotoneX);

		const areaPath = g
			.append('path')
			.datum(parsedData)
			.attr('class', 'area')
			.attr('d', area)
			.style('fill', `url(#area-gradient-${color.replace('#', '')})`);

		// Add line with animation
		const linePath = g
			.append('path')
			.datum(parsedData)
			.attr('class', 'line')
			.attr('d', line)
			.style('fill', 'none')
			.style('stroke', color)
			.style('stroke-width', 2.5)
			.style('stroke-linecap', 'round')
			.style('stroke-linejoin', 'round');

		if (animate) {
			const totalLength = linePath.node()?.getTotalLength() || 0;
			linePath
				.attr('stroke-dasharray', `${totalLength} ${totalLength}`)
				.attr('stroke-dashoffset', totalLength)
				.transition()
				.duration(1200)
				.ease(d3.easeCubicOut)
				.attr('stroke-dashoffset', 0);

			areaPath.style('opacity', 0).transition().delay(600).duration(600).style('opacity', 1);
		}

		// Add X axis
		const xAxis = isDateScale
			? d3.axisBottom(xScale as d3.ScaleTime<number, number>).tickFormat((d) => d3.timeFormat('%b %d')(d as Date)).ticks(6)
			: d3.axisBottom(xScale as d3.ScaleLinear<number, number>).tickFormat(d3.format('.0f'));

		g.append('g')
			.attr('class', 'x-axis')
			.attr('transform', `translate(0,${chartHeight})`)
			.call(xAxis)
			.selectAll('text')
			.style('font-size', '11px')
			.style('fill', 'var(--text-secondary, #64748b)');

		// Add Y axis
		const yAxis = d3.axisLeft(yScale).ticks(5).tickFormat(d3.format('.0s'));
		g.append('g')
			.attr('class', 'y-axis')
			.call(yAxis)
			.selectAll('text')
			.style('font-size', '11px')
			.style('fill', 'var(--text-secondary, #64748b)');

		// Style axis lines
		g.selectAll('.x-axis path, .y-axis path').style('stroke', 'var(--border-color, #e2e8f0)');
		g.selectAll('.x-axis line, .y-axis line').style('stroke', 'var(--border-color, #e2e8f0)');

		// Add axis labels
		if (xLabel) {
			g.append('text')
				.attr('class', 'axis-label')
				.attr('transform', `translate(${width / 2}, ${chartHeight + margin.bottom - 5})`)
				.style('text-anchor', 'middle')
				.style('font-size', '11px')
				.style('fill', 'var(--text-secondary, #64748b)')
				.text(xLabel);
		}

		if (yLabel) {
			g.append('text')
				.attr('class', 'axis-label')
				.attr('transform', 'rotate(-90)')
				.attr('y', 0 - margin.left)
				.attr('x', 0 - chartHeight / 2)
				.attr('dy', '1em')
				.style('text-anchor', 'middle')
				.style('font-size', '11px')
				.style('fill', 'var(--text-secondary, #64748b)')
				.text(yLabel);
		}

		// Find peak point
		const peakPoint = parsedData.reduce((max, d) => (d.y > max.y ? d : max), parsedData[0]);

		// Add peak marker
		if (showPoints && peakPoint) {
			g.append('circle')
				.attr('class', 'peak-marker')
				.attr('cx', xScale(isDateScale ? new Date(peakPoint.x) : peakPoint.x))
				.attr('cy', yScale(peakPoint.y))
				.attr('r', 6)
				.style('fill', color)
				.style('stroke', 'white')
				.style('stroke-width', 2)
				.style('filter', 'url(#glow)');

			// Peak label
			g.append('text')
				.attr('class', 'peak-label')
				.attr('x', xScale(isDateScale ? new Date(peakPoint.x) : peakPoint.x))
				.attr('y', yScale(peakPoint.y) - 12)
				.style('text-anchor', 'middle')
				.style('font-size', '10px')
				.style('font-weight', '600')
				.style('fill', color)
				.text(peakPoint.y.toLocaleString());
		}

		// Add interactive overlay for hover
		const bisect = d3.bisector<(typeof parsedData)[0], number>((d) => d.x).left;

		// Focus elements
		const focusLine = g
			.append('line')
			.attr('class', 'focus-line')
			.style('stroke', color)
			.style('stroke-width', 1)
			.style('stroke-dasharray', '4,4')
			.style('opacity', 0);

		const focusCircle = g
			.append('circle')
			.attr('class', 'focus-circle')
			.attr('r', 5)
			.style('fill', color)
			.style('stroke', 'white')
			.style('stroke-width', 2)
			.style('opacity', 0);

		// Overlay for mouse tracking
		g.append('rect')
			.attr('class', 'overlay')
			.attr('width', width)
			.attr('height', chartHeight)
			.style('fill', 'none')
			.style('pointer-events', 'all')
			.on('mousemove', function (event) {
				if (!tooltip) return;

				const [mouseX] = d3.pointer(event);
				const x0 = isDateScale
					? (xScale as d3.ScaleTime<number, number>).invert(mouseX).getTime()
					: (xScale as d3.ScaleLinear<number, number>).invert(mouseX);

				const i = bisect(parsedData, x0, 1);
				const d0 = parsedData[i - 1];
				const d1 = parsedData[i];

				if (!d0 && !d1) return;

				const d = !d1 ? d0 : !d0 ? d1 : x0 - d0.x > d1.x - x0 ? d1 : d0;

				const xPos = xScale(isDateScale ? new Date(d.x) : d.x);
				const yPos = yScale(d.y);

				focusLine.attr('x1', xPos).attr('x2', xPos).attr('y1', 0).attr('y2', chartHeight).style('opacity', 0.5);

				focusCircle.attr('cx', xPos).attr('cy', yPos).style('opacity', 1);

				// Parse the label to get date
				const dateStr = d.label.split(':')[0] || '';

				tooltip
					.html(
						`<div style="font-weight: 600; margin-bottom: 4px; color: ${color}">${d.y.toLocaleString()}</div>
					 <div style="font-size: 11px; color: #94a3b8">${dateStr}</div>`
					)
					.style('left', event.pageX + 15 + 'px')
					.style('top', event.pageY - 10 + 'px')
					.style('opacity', 1);
			})
			.on('mouseout', function () {
				focusLine.style('opacity', 0);
				focusCircle.style('opacity', 0);
				if (tooltip) {
					tooltip.style('opacity', 0);
				}
			});
	}

	function handleResize() {
		if (mounted) {
			drawChart();
		}
	}
</script>

<svelte:window on:resize={handleResize} />

<div class="chart-container-enhanced">
	{#if title || showTrend || showSummary}
		<div class="chart-header">
			<div class="chart-title-row">
				{#if title}
					<h3 class="chart-title">{title}</h3>
				{/if}
				{#if showTrend && trend.direction !== 'flat'}
					<div class="trend-badge" class:up={trend.direction === 'up'} class:down={trend.direction === 'down'}>
						<span class="trend-icon">{trend.direction === 'up' ? '↑' : '↓'}</span>
						<span class="trend-value">{trend.change}%</span>
						<span class="trend-label">vs prev 7d</span>
					</div>
				{/if}
			</div>
			{#if showSummary && summaryStats.total > 0}
				<div class="summary-row">
					<div class="summary-stat">
						<span class="summary-value">{summaryStats.total.toLocaleString()}</span>
						<span class="summary-label">Total</span>
					</div>
					<div class="summary-stat">
						<span class="summary-value">{summaryStats.avg.toLocaleString()}</span>
						<span class="summary-label">Daily Avg</span>
					</div>
					<div class="summary-stat highlight" style="--accent-color: {color}">
						<span class="summary-value">{summaryStats.peak.toLocaleString()}</span>
						<span class="summary-label">Peak</span>
					</div>
				</div>
			{/if}
		</div>
	{/if}
	<div bind:this={container} class="chart"></div>
</div>

<style>
	.chart-container-enhanced {
		width: 100%;
		background: var(--card-background, #fff);
		border-radius: 12px;
		overflow: hidden;
	}

	.chart-header {
		padding: 16px 16px 8px;
	}

	.chart-title-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		margin-bottom: 12px;
	}

	.chart-title {
		margin: 0;
		font-size: 1rem;
		font-weight: 600;
		color: var(--text-primary, #1e293b);
	}

	.trend-badge {
		display: flex;
		align-items: center;
		gap: 4px;
		padding: 4px 10px;
		border-radius: 20px;
		font-size: 11px;
		font-weight: 500;
	}

	.trend-badge.up {
		background: rgba(16, 185, 129, 0.1);
		color: #059669;
	}

	.trend-badge.down {
		background: rgba(239, 68, 68, 0.1);
		color: #dc2626;
	}

	.trend-icon {
		font-size: 12px;
		font-weight: 700;
	}

	.trend-value {
		font-weight: 600;
	}

	.trend-label {
		color: var(--text-secondary, #64748b);
		font-weight: 400;
	}

	.summary-row {
		display: flex;
		gap: 24px;
	}

	.summary-stat {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.summary-stat.highlight .summary-value {
		color: var(--accent-color, var(--primary, #3b82f6));
	}

	.summary-value {
		font-size: 1.125rem;
		font-weight: 700;
		color: var(--text-primary, #1e293b);
		line-height: 1.2;
	}

	.summary-label {
		font-size: 0.7rem;
		color: var(--text-secondary, #64748b);
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.chart {
		width: 100%;
		overflow: hidden;
		padding: 0 8px 8px;
	}

	:global(.line-chart-enhanced) {
		width: 100%;
		height: auto;
	}

	/* Responsive adjustments */
	@media (max-width: 768px) {
		.chart-header {
			padding: 12px 12px 6px;
		}

		.chart-title {
			font-size: 0.9rem;
		}

		.summary-row {
			gap: 16px;
		}

		.summary-value {
			font-size: 1rem;
		}

		.trend-badge {
			font-size: 10px;
			padding: 3px 8px;
		}
	}

	@media (max-width: 480px) {
		.chart-title-row {
			flex-direction: column;
			align-items: flex-start;
			gap: 8px;
		}

		.summary-row {
			flex-wrap: wrap;
			gap: 12px;
		}
	}
</style>
