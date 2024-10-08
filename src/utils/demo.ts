/* eslint-disable @typescript-eslint/no-explicit-any */
export const mapDemoValues = (values: { [x: string]: any }[] | { [x: string]: any } | null) => {
	if (!values) {
		return null;
	}
	if (Array.isArray(values)) {
		if (!values?.length) {
			return [];
		}
		return values.map((value) => {
			const newValue: any = {};
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
		const newValue: any = {};
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
