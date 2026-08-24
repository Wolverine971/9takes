// src/lib/enneagram/selfReportedType.spec.ts
import { describe, expect, it } from 'vitest';
import {
	clearStoredEnneagramType,
	parseEnneagramType,
	readStoredEnneagramType,
	SELF_REPORTED_TYPE_STORAGE_KEY,
	storeEnneagramType
} from './selfReportedType';

describe('self-reported Enneagram type storage', () => {
	it.each([1, '5', 9])('accepts a valid type (%s)', (value) => {
		expect(parseEnneagramType(value)).toBe(Number(value));
	});

	it.each([null, '', 0, 10, 1.5, 'unknown'])('rejects an invalid type (%s)', (value) => {
		expect(parseEnneagramType(value)).toBeNull();
	});

	it('stores, reads, and clears the selection', () => {
		const values = new Map<string, string>();
		const storage = {
			getItem: (key: string) => values.get(key) ?? null,
			setItem: (key: string, value: string) => values.set(key, value),
			removeItem: (key: string) => values.delete(key)
		};

		expect(storeEnneagramType(4, storage)).toBe(true);
		expect(values.get(SELF_REPORTED_TYPE_STORAGE_KEY)).toBe('4');
		expect(readStoredEnneagramType(storage)).toBe(4);

		clearStoredEnneagramType(storage);
		expect(readStoredEnneagramType(storage)).toBeNull();
	});
});
