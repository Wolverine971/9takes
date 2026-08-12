// output/personality-analysis-experiment/batch-type4-next-10/clean-cutouts.mjs
import sharp from 'sharp';

const root = 'output/personality-analysis-experiment/batch-type4-next-10';
const people = [
	'adam-driver',
	'colleen-hoover',
	'frank-ocean',
	'hunter-biden',
	'janelle-monae',
	'jonathan-groff',
	'machine-gun-kelly',
	'maddie-phillips',
	'nicholas-galitzine',
	'oscar-isaac'
];

for (const slug of people) {
	const path = `${root}/${slug}/cutout.png`;
	const { data, info } = await sharp(path)
		.ensureAlpha()
		.raw()
		.toBuffer({ resolveWithObject: true });
	const visited = new Uint8Array(info.width * info.height);
	const components = [];
	for (let y = 0; y < info.height; y += 1) {
		for (let x = 0; x < info.width; x += 1) {
			const start = y * info.width + x;
			if (visited[start] || data[start * 4 + 3] <= 8) continue;
			const queue = [start];
			visited[start] = 1;
			const pixels = [];
			for (let head = 0; head < queue.length; head += 1) {
				const index = queue[head];
				pixels.push(index);
				const px = index % info.width;
				const py = Math.floor(index / info.width);
				for (const neighbor of [index - 1, index + 1, index - info.width, index + info.width]) {
					const nx = neighbor % info.width;
					const ny = Math.floor(neighbor / info.width);
					if (
						neighbor < 0 ||
						neighbor >= visited.length ||
						visited[neighbor] ||
						Math.abs(nx - px) + Math.abs(ny - py) !== 1
					)
						continue;
					if (data[neighbor * 4 + 3] <= 8) continue;
					visited[neighbor] = 1;
					queue.push(neighbor);
				}
			}
			components.push(pixels);
		}
	}
	components.sort((a, b) => b.length - a.length);
	const keep = new Uint8Array(info.width * info.height);
	for (const index of components[0]) keep[index] = 1;
	for (let index = 0; index < keep.length; index += 1) {
		if (!keep[index]) data[index * 4 + 3] = 0;
	}
	await sharp(data, { raw: info }).png().toFile(`${root}/${slug}/cutout-clean.png`);
	console.log(
		slug,
		components.slice(0, 6).map((pixels) => pixels.length)
	);
}
