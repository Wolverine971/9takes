<!-- src/lib/components/molecules/WordCloud.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';

	type WordCloudDatum = {
		text: string;
		value: number;
	};

	type PositionedWord = WordCloudDatum & {
		size: number;
		x: number;
		y: number;
	};

	let {
		words = [],
		width = 800,
		height = 400
	}: {
		words?: WordCloudDatum[];
		width?: number;
		height?: number;
	} = $props();

	let svg: SVGSVGElement | undefined;
	let d3: typeof import('d3') | undefined;
	let cloudFactory: typeof import('d3-cloud').default | undefined;
	let librariesReady = $state(false);

	onMount(async () => {
		// Dynamically import d3 libraries
		const [d3Module, cloudModule] = await Promise.all([import('d3'), import('d3-cloud')]);
		d3 = d3Module;
		cloudFactory = cloudModule.default;
		librariesReady = true;
	});

	$effect(() => {
		if (!librariesReady || !d3 || !cloudFactory || !svg) {
			return;
		}

		const layoutWords: PositionedWord[] = words.map((word) => ({
			...word,
			size: word.value,
			x: 0,
			y: 0
		}));

		const layout = cloudFactory<PositionedWord>()
			.size([width, height])
			.words(layoutWords)
			.padding(0)
			.rotate(() => 0) // Always return 0 to keep words horizontal
			.font('Space Grotesk')
			.fontSize((word) => Math.sqrt(word.size) * 5)
			.on('end', draw);

		layout.start();
	});

	function draw(layoutWords: PositionedWord[]) {
		if (!d3 || !svg) {
			return;
		}

		const d3Module = d3;
		const palette = [
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
		];
		const color = (index: number) => palette[Math.min(index, palette.length - 1)];

		d3Module
			.select(svg)
			.attr('viewBox', [0, 0, width, height])
			.attr('font-family', 'Space Grotesk')
			.attr('text-anchor', 'middle')
			.selectAll('g')
			.data([null])
			.join('g')
			.attr('transform', `translate(${width / 2},${height / 2})`)
			.selectAll<SVGTextElement, PositionedWord>('text')
			.data(layoutWords)
			.join('text')
			.style('font-size', (word) => `${word.size}px`)
			.style('fill', (_word, index) => color(index))
			.attr('transform', (word) => `translate(${word.x},${word.y})`)
			.text((word) => word.text)
			.on('mouseover', function (this: SVGTextElement) {
				d3Module.select(this).style('font-weight', 'bold');
			})
			.on('mouseout', function (this: SVGTextElement) {
				d3Module.select(this).style('font-weight', 'normal');
			});
	}
</script>

<div class="h-full w-full rounded-xl bg-gray-100">
	<svg bind:this={svg} />
</div>
