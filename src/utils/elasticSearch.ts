// src/utils/elasticSearch.ts
export const typeaheadQuery = ({
	index,
	field,
	text,
	size = 10
}: {
	index: string;
	field: string;
	text: string;
	size: number;
}) => {
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
