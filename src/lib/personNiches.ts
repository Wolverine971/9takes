// Legacy field guess from DB `type` tags. Only used for people the v3 taxonomy hasn't labeled
// yet (see homePathFor in peopleTaxonomy.ts).
import { normalizePeopleTypes } from './peopleTypes';
import { CLUSTER_FIELDS } from './personClusterTags.js';

export type GroupablePerson = { slug: string; type?: unknown };

const key = (value: string) => value.replace(/[^a-z0-9]/gi, '').toLowerCase();
const FIELD_BY_RAW = new Map(
	CLUSTER_FIELDS.flatMap((field) => field.rawTypes.map((raw) => [key(raw), field] as const))
);
/** Authored occupations determine home and crossover fields. Fame alone only
 * supplies a home when no specific occupation is available. */
export function fieldsForPerson(person: GroupablePerson): string[] {
	const types = normalizePeopleTypes(person.type).map(key);
	const fields = new Set<string>();
	// Legacy profiles often list athlete after celebrity or creator.
	if (types.includes('athlete')) fields.add('athletes');
	const historical = types.includes('historical');
	if (historical && types[0] === 'historical' && types.includes('historicalscientist'))
		fields.add('history');
	const personKey = key(person.slug.normalize('NFD'));
	for (const type of types) {
		if (type === 'celebrity' || type === 'historical') continue;
		const definition = FIELD_BY_RAW.get(type);
		if (!definition || definition.excludeSlugs.some((slug) => key(slug) === personKey)) continue;
		fields.add(historical && definition.field === 'politics-public' ? 'history' : definition.field);
	}
	if (historical) fields.add('history');
	if (!fields.size && types.includes('celebrity')) fields.add('film-tv');
	return [...fields];
}

export function getTypeHubGroupSlug(person: GroupablePerson): string {
	return fieldsForPerson(person)[0] ?? 'other';
}
