// output/personality-analysis-experiment/batch-type3-rework-v2/clean-michael-cutout.mjs
import sharp from 'sharp';

const input =
	'output/personality-analysis-experiment/batch-type3-rework-v2/michael-le/cutout-vision.png';
const output = 'output/personality-analysis-experiment/batch-type3-rework-v2/michael-le/cutout.png';
const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const visited = new Uint8Array(info.width * info.height);
const components = [];
const neighbors = [
	[-1, 0],
	[1, 0],
	[0, -1],
	[0, 1]
];

for (let y = 0; y < info.height; y += 1) {
	for (let x = 0; x < info.width; x += 1) {
		const start = y * info.width + x;
		if (visited[start] || data[start * 4 + 3] <= 8) continue;
		visited[start] = 1;
		const queue = [start];
		const pixels = [];
		for (let cursor = 0; cursor < queue.length; cursor += 1) {
			const index = queue[cursor];
			pixels.push(index);
			const px = index % info.width;
			const py = Math.floor(index / info.width);
			for (const [dx, dy] of neighbors) {
				const nx = px + dx;
				const ny = py + dy;
				if (nx < 0 || nx >= info.width || ny < 0 || ny >= info.height) continue;
				const next = ny * info.width + nx;
				if (visited[next] || data[next * 4 + 3] <= 8) continue;
				visited[next] = 1;
				queue.push(next);
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

await sharp(data, { raw: info }).png().toFile(output);
console.log(
	`Kept the primary ${components[0]?.length ?? 0}-pixel component; removed ${Math.max(0, components.length - 1)} isolated components.`
);
