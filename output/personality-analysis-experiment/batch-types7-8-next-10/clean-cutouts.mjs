// output/personality-analysis-experiment/batch-types7-8-next-10/clean-cutouts.mjs
import sharp from 'sharp';
import { rename } from 'node:fs/promises';

const root = 'output/personality-analysis-experiment/batch-types7-8-next-10';
const defaultPeople = [
	'shakira',
	'spencer-x',
	'stavros-halkias',
	'steve-irwin',
	'tana-mongeau',
	'travis-kelce',
	'bryce-hall',
	'duke-dennis',
	'idris-elba',
	'jenna-marbles'
];
const requestedPeople = process.argv.slice(2);
const people = requestedPeople.length ? requestedPeople : defaultPeople;

for (const slug of people) {
	const path = `${root}/${slug}/cutout-clean.png`;
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
						Math.abs(nx - px) + Math.abs(ny - py) !== 1 ||
						data[neighbor * 4 + 3] <= 8
					)
						continue;
					visited[neighbor] = 1;
					queue.push(neighbor);
				}
			}
			components.push(pixels);
		}
	}
	components.sort((a, b) => b.length - a.length);
	const keep = new Uint8Array(info.width * info.height);
	for (const index of components[0] ?? []) keep[index] = 1;
	for (let index = 0; index < keep.length; index += 1) {
		if (!keep[index]) data[index * 4 + 3] = 0;
	}
	const temporary = `${root}/${slug}/cutout-clean.tmp.png`;
	await sharp(data, { raw: info }).png().toFile(temporary);
	await rename(temporary, path);
	console.log(
		slug,
		components.slice(0, 4).map((pixels) => pixels.length)
	);
}
