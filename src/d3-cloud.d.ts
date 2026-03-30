// src/d3-cloud.d.ts
declare module 'd3-cloud' {
	export interface CloudWord {
		text: string;
		size: number;
		x?: number;
		y?: number;
		rotate?: number;
	}

	export interface CloudLayout<T extends CloudWord> {
		size(dimensions: [number, number]): CloudLayout<T>;
		words(words: T[]): CloudLayout<T>;
		padding(padding: number): CloudLayout<T>;
		rotate(rotation: (word: T) => number): CloudLayout<T>;
		font(font: string): CloudLayout<T>;
		fontSize(size: (word: T) => number): CloudLayout<T>;
		on(event: 'end', callback: (words: T[]) => void): CloudLayout<T>;
		start(): void;
	}

	export default function cloud<T extends CloudWord>(): CloudLayout<T>;
}
