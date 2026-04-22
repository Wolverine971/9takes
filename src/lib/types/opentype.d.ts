// src/lib/types/opentype.d.ts
declare module 'opentype.js' {
	export interface Font {
		getAdvanceWidth(text: string, fontSize: number, options?: Record<string, unknown>): number;
		getPath(
			text: string,
			x: number,
			y: number,
			fontSize: number,
			options?: Record<string, unknown>
		): {
			toPathData(decimalPlaces?: number): string;
		};
	}

	export function parse(buffer: ArrayBuffer): Font;
}
