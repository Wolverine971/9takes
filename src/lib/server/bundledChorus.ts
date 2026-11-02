// src/lib/server/bundledChorus.ts
import { bundledChorusPrompt } from '$lib/data/chorusStarter';
import { enneagramTypeProfiles } from '$lib/data/enneagramTypeProfiles';
import type { NineTake } from './nineTakes';

/** Only questions with bundled examples get takes here. Eligibility is checked by callers. */
export function bundledChorusTakes(questionUrl: string): NineTake[] | null {
	const prompt = bundledChorusPrompt(questionUrl);
	if (!prompt) return null;
	return prompt.examples.map((take, index) => ({
		type: index + 1,
		archetype: enneagramTypeProfiles[index + 1].archetype,
		take,
		source: 'ai'
	}));
}
