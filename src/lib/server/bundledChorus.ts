// src/lib/server/bundledChorus.ts
import { CHORUS_STARTER_SLUG, CHORUS_STARTER_WORDS } from '$lib/data/chorusStarter';
import { enneagramTypeProfiles } from '$lib/data/enneagramTypeProfiles';
import type { NineTake } from './nineTakes';

/** Only this existing public question has bundled examples. Eligibility is checked by callers. */
export function bundledChorusTakes(questionUrl: string): NineTake[] | null {
	if (questionUrl !== CHORUS_STARTER_SLUG) return null;
	return CHORUS_STARTER_WORDS.map((take, index) => ({
		type: index + 1,
		archetype: enneagramTypeProfiles[index + 1].archetype,
		take,
		source: 'ai'
	}));
}
