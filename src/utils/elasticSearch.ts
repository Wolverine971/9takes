// src/utils/elasticSearch.ts
export const typeaheadQuery = ({
	index,
	field,
	text,
	size = 10,
	match = 'phrase_prefix'
}: {
	index: string;
	field: string;
	text: string;
	size: number;
	match?: 'phrase_prefix' | 'prefix';
}) => {
	const query =
		match === 'prefix'
			? {
					prefix: {
						[field]: {
							value: text
						}
					}
				}
			: {
					match_phrase_prefix: {
						[field]: {
							query: text
						}
					}
				};
	return {
		index,
		body: {
			query
		},
		size
	};
};
