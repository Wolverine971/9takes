// src/lib/types/opentype.d.ts
declare module 'opentype.js' {
	export type PathCommand =
		| { type: 'M' | 'L'; x: number; y: number }
		| { type: 'Q'; x1: number; y1: number; x: number; y: number }
		| { type: 'C'; x1: number; y1: number; x2: number; y2: number; x: number; y: number }
		| { type: 'Z' };

	export interface Path {
		commands: PathCommand[];
		toPathData(decimalPlaces?: number): string;
	}

	export interface Font {
		tables: { gsub?: unknown };
		getAdvanceWidth(text: string, fontSize: number, options?: Record<string, unknown>): number;
		getPath(
			text: string,
			x: number,
			y: number,
			fontSize: number,
			options?: Record<string, unknown>
		): Path;
	}

	export function parse(buffer: ArrayBuffer): Font;
	const opentype: { parse: typeof parse };
	export default opentype;
}
