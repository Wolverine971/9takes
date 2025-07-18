// utils/demo.ts
type DemoValue = Record<string, unknown>;

export const mapDemoValues = (values: DemoValue[] | DemoValue | null): DemoValue[] | DemoValue | null => {
	if (!values) {
		return null;
	}
	if (Array.isArray(values)) {
		if (!values?.length) {
			return [];
		}
		return values.map((value) => {
			const newValue: DemoValue = {};
			Object.keys(value).forEach((key) => {
				if (key.includes('_demo')) {
					const newKey = key.replace('_demo', '');
					newValue[newKey] = value[key];
				} else {
					newValue[key] = value[key];
				}
			});
			return newValue;
		});
	} else {
		const newValue: DemoValue = {};
		Object.keys(values).forEach((key) => {
			if (key.includes('_demo')) {
				const newKey = key.replace('_demo', '');
				newValue[newKey] = values[key];
			} else {
				newValue[key] = values[key];
			}
		});
		return newValue;
	}
};
