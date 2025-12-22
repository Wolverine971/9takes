<!-- src/lib/components/molecules/WordCloud.svelte -->
<script>
	import { onMount } from 'svelte';

	export let words = [];
	export let width = 800;
	export let height = 400;

	let svg;
	let d3;
	let cloud;

	onMount(async () => {
		// Dynamically import d3 libraries
		const [d3Module, cloudModule] = await Promise.all([import('d3'), import('d3-cloud')]);
		d3 = d3Module;
		cloud = cloudModule.default;
		const layout = cloud()
			.size([width, height])
			.words(words.map((d) => ({ ...d, text: d.text, size: d.value })))
			.padding(0)
			.rotate(() => 0) // Always return 0 to keep words horizontal
			.font('Noticia Text')
			.fontSize((d) => Math.sqrt(d.size) * 5)
			.on('end', draw);

		layout.start();
	});

	function draw(words) {
		const color = d3
			.scaleLinear()
			.domain([0, 1, 2, 3, 4, 5, 6, 10, 15, 20, 100])
			.range([
				'#ddd',
				'#ccc',
				'#bbb',
				'#aaa',
				'#999',
				'#888',
				'#777',
				'#666',
				'#555',
				'#444',
				'#333'
			]);

		d3.select(svg)
			.attr('viewBox', [0, 0, width, height])
			.attr('font-family', 'Noticia Text')
			.attr('text-anchor', 'middle')
			.selectAll('g')
			.data([null])
			.join('g')
			.attr('transform', `translate(${width / 2},${height / 2})`)
			.selectAll('text')
			.data(words)
			.join('text')
			.style('font-size', (d) => `${d.size}px`)
			.style('fill', (d, i) => color(i))
			.attr('transform', (d) => `translate(${d.x},${d.y})`)
			.text((d) => d.text)
			.on('mouseover', function () {
				d3.select(this).style('font-weight', 'bold');
			})
			.on('mouseout', function () {
				d3.select(this).style('font-weight', 'normal');
			});
	}
</script>

<div class="h-full w-full rounded-lg bg-gray-100">
	<svg bind:this={svg} />
</div>
