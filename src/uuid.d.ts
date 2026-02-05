// src/uuid.d.ts
// Type declarations for uuid module
// uuid@9.x provides types but they're not resolved correctly with bundler moduleResolution
declare module 'uuid' {
	export function v1(options?: {
		node?: number[];
		clockseq?: number;
		msecs?: number;
		nsecs?: number;
		random?: number[];
		rng?: () => number[];
	}): string;

	export function v3(name: string | number[], namespace: string | number[]): string;

	export function v4(options?: { random?: number[]; rng?: () => number[] }): string;

	export function v5(name: string | number[], namespace: string | number[]): string;

	export function validate(uuid: string): boolean;
	export function version(uuid: string): number;
	export function parse(uuid: string): Uint8Array;
	export function stringify(arr: Uint8Array): string;

	export const NIL: string;
}
