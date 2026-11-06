// src/lib/components/marketing/home/homeAnalytics.ts
// Homepage funnel analytics: ids, slugs and placements only, never the visitor's answer text.
import type { Attachment } from 'svelte/attachments';
import { on } from 'svelte/events';
import {
	captureHomepageLinkClicked,
	captureHomepagePractice,
	type HomepagePracticeStep
} from '$lib/analytics/marketingEvents';

export const HOME_SURFACE = 'homepage';
// The live question (q203) shares its id with the old "friendship" practice set, so the
// homepage_practice_* events keep the same practice_id across homepage redesigns.
const LIVE_PRACTICE_ID = 'friendship';

export function trackHomePractice(
	step: HomepagePracticeStep,
	liveSlug: string | null | undefined,
	placement?: string
) {
	void captureHomepagePractice({
		surface: HOME_SURFACE,
		step,
		practiceId: LIVE_PRACTICE_ID,
		liveSlug,
		placement
	});
}

/** One listener on the page root reports clicks on any [data-track] element. */
export function trackHomeClicks(liveSlug: () => string | null): Attachment<HTMLElement> {
	return (element) =>
		on(element, 'click', (event: MouseEvent) => {
			const target = (event.target as Element | null)?.closest<HTMLElement>('[data-track]');
			if (!target) return;
			const placement = target.dataset.placement ?? 'unknown';
			if (target.dataset.track === 'handoff')
				trackHomePractice('handoff_clicked', liveSlug(), placement);
			else if (target.dataset.track === 'link')
				void captureHomepageLinkClicked({
					surface: HOME_SURFACE,
					placement,
					destination: target.getAttribute('href') ?? ''
				});
		});
}
