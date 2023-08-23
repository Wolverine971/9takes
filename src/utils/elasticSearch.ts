export const typeaheadQuery = (index: string, field: string, text: string, size: number = 10) => {
	return {
		index,
		body: {
			query: {
				match_phrase_prefix: {
					[field]: {
						query: text
					}
				}
			}
		},
		size
	};
};
