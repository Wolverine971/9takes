// src/utils/demo.ts
type DemoValue = Record<string, unknown>;

export function mapDemoValues<T extends DemoValue | DemoValue[] | null>(values: T): T {
	if (!values) {
		return values;
	}

	if (Array.isArray(values)) {
		if (!values.length) {
			return values;
		}

		return values.map((value) => {
			const original = value as DemoValue;
			const mapped: DemoValue = {};
			for (const key of Object.keys(original)) {
				if (key.includes('_demo')) {
					mapped[key.replace('_demo', '')] = original[key];
				} else {
					mapped[key] = original[key];
				}
			}
			return mapped;
		}) as T;
	}

	const original = values as DemoValue;
	const mapped: DemoValue = {};
	for (const key of Object.keys(original)) {
		if (key.includes('_demo')) {
			mapped[key.replace('_demo', '')] = original[key];
		} else {
			mapped[key] = original[key];
		}
	}
	return mapped as T;
}
