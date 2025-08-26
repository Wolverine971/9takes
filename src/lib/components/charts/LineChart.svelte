<!-- src/lib/components/charts/LineChart.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';

	export let data: { x: string | number; y: number; label?: string }[];
	export let title: string = '';
	export let xLabel: string = '';
	export let yLabel: string = '';
	export let height: number = 300;
	export let color: string = '#3b82f6';
	export let showPoints: boolean = true;
	export let showGrid: boolean = true;

	let container: HTMLDivElement;
	let mounted = false;

	onMount(() => {
		mounted = true;
		drawChart();
	});

	$: if (mounted && data) {
		drawChart();
	}

	function drawChart() {
		if (!container || !data?.length) return;

		// Clear previous chart
		d3.select(container).selectAll('*').remove();

		const margin = { top: 20, right: 30, bottom: 50, left: 50 };
		const width = container.clientWidth - margin.left - margin.right;
		const chartHeight = height - margin.top - margin.bottom;

		// Create SVG
		const svg = d3
			.select(container)
			.append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height)
			.attr('class', 'line-chart');

		const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

		// Parse data and create scales
		const parsedData = data.map((d) => ({
			x: typeof d.x === 'string' ? +d.x : d.x,
			y: d.y,
			label: d.label || d.x.toString()
		}));

		// Determine if x values are dates (timestamps)
		const isDateScale = parsedData.length > 0 && parsedData[0].x > 1000000000000; // Check if timestamp

		const xScale = isDateScale
			? d3
					.scaleTime()
					.domain(d3.extent(parsedData, (d) => new Date(d.x)) as [Date, Date])
					.range([0, width])
			: d3
					.scaleLinear()
					.domain(d3.extent(parsedData, (d) => d.x) as [number, number])
					.range([0, width]);

		const yScale = d3
			.scaleLinear()
			.domain([0, d3.max(parsedData, (d) => d.y) as number])
			.range([chartHeight, 0]);

		// Create line generator
		const line = d3
			.line<(typeof parsedData)[0]>()
			.x((d) => xScale(isDateScale ? new Date(d.x) : d.x))
			.y((d) => yScale(d.y))
			.curve(d3.curveMonotoneX);

		// Add grid if enabled
		if (showGrid) {
			// X grid
			const xTicks = isDateScale ? xScale.ticks(5).map((d) => d.getTime()) : xScale.ticks();

			g.selectAll('.grid-x')
				.data(xTicks)
				.enter()
				.append('line')
				.attr('class', 'grid-line')
				.attr('x1', (d) => xScale(isDateScale ? new Date(d) : d))
				.attr('x2', (d) => xScale(isDateScale ? new Date(d) : d))
				.attr('y1', 0)
				.attr('y2', chartHeight)
				.attr('stroke', 'var(--border-color)')
				.attr('stroke-width', 0.5)
				.attr('opacity', 0.3);

			// Y grid
			g.selectAll('.grid-y')
				.data(yScale.ticks())
				.enter()
				.append('line')
				.attr('class', 'grid-line')
				.attr('x1', 0)
				.attr('x2', width)
				.attr('y1', (d) => yScale(d))
				.attr('y2', (d) => yScale(d))
				.attr('stroke', 'var(--border-color)')
				.attr('stroke-width', 0.5)
				.attr('opacity', 0.3);
		}

		// Add X axis
		const xAxis = isDateScale
			? d3.axisBottom(xScale).tickFormat(d3.timeFormat('%m/%d')).ticks(5)
			: d3.axisBottom(xScale).tickFormat(d3.format('.0f'));

		g.append('g')
			.attr('class', 'x-axis')
			.attr('transform', `translate(0,${chartHeight})`)
			.call(xAxis);

		// Add Y axis
		const yAxis = d3.axisLeft(yScale);
		g.append('g').attr('class', 'y-axis').call(yAxis);

		// Add axis labels
		if (xLabel) {
			g.append('text')
				.attr('class', 'axis-label')
				.attr('transform', `translate(${width / 2}, ${chartHeight + margin.bottom - 10})`)
				.style('text-anchor', 'middle')
				.style('font-size', '12px')
				.style('fill', 'var(--text-secondary)')
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
				.style('font-size', '12px')
				.style('fill', 'var(--text-secondary)')
				.text(yLabel);
		}

		// Add area under the line
		const area = d3
			.area<(typeof parsedData)[0]>()
			.x((d) => xScale(isDateScale ? new Date(d.x) : d.x))
			.y0(chartHeight)
			.y1((d) => yScale(d.y))
			.curve(d3.curveMonotoneX);

		g.append('path')
			.datum(parsedData)
			.attr('class', 'area')
			.attr('d', area)
			.style('fill', color)
			.style('opacity', 0.2);

		// Add line
		g.append('path')
			.datum(parsedData)
			.attr('class', 'line')
			.attr('d', line)
			.style('fill', 'none')
			.style('stroke', color)
			.style('stroke-width', 2);

		// Add points if enabled
		if (showPoints) {
			const tooltip = d3
				.select('body')
				.append('div')
				.attr('class', 'chart-tooltip')
				.style('opacity', 0)
				.style('position', 'absolute')
				.style('background', 'var(--card-background)')
				.style('border', '1px solid var(--border-color)')
				.style('border-radius', '4px')
				.style('padding', '8px')
				.style('font-size', '12px')
				.style('pointer-events', 'none')
				.style('z-index', '1000');

			g.selectAll('.dot')
				.data(parsedData)
				.enter()
				.append('circle')
				.attr('class', 'dot')
				.attr('cx', (d) => xScale(isDateScale ? new Date(d.x) : d.x))
				.attr('cy', (d) => yScale(d.y))
				.attr('r', 4)
				.style('fill', color)
				.style('stroke', 'white')
				.style('stroke-width', 2)
				.style('cursor', 'pointer')
				.on('mouseover', function (event, d) {
					d3.select(this).attr('r', 6);
					tooltip.transition().duration(200).style('opacity', 0.9);
					tooltip
						.html(`${d.label}: ${d.y.toLocaleString()}`)
						.style('left', event.pageX + 10 + 'px')
						.style('top', event.pageY - 28 + 'px');
				})
				.on('mouseout', function () {
					d3.select(this).attr('r', 4);
					tooltip.transition().duration(500).style('opacity', 0);
				});
		}

		// Style axis text
		g.selectAll('.x-axis text, .y-axis text')
			.style('font-size', '11px')
			.style('fill', 'var(--text-secondary)');

		g.selectAll('.x-axis path, .y-axis path, .x-axis line, .y-axis line').style(
			'stroke',
			'var(--border-color)'
		);
	}

	// Redraw on resize
	function handleResize() {
		if (mounted) {
			drawChart();
		}
	}
</script>

<svelte:window on:resize={handleResize} />

<div class="chart-container">
	{#if title}
		<h3 class="chart-title">{title}</h3>
	{/if}
	<div bind:this={container} class="chart"></div>
</div>

<style>
	.chart-container {
		width: 100%;
		margin-bottom: 1rem;
	}

	.chart-title {
		margin: 0 0 1rem 0;
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--text-primary);
	}

	.chart {
		width: 100%;
		overflow: hidden;
	}

	:global(.line-chart) {
		width: 100%;
		height: auto;
	}

	:global(.chart-tooltip) {
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
	}

	/* Responsive adjustments */
	@media (max-width: 768px) {
		.chart-title {
			font-size: 1rem;
		}
	}
</style>
