// src/lib/server/ctaExperiments.ts
//
// Records call-to-action copy experiments (cta_experiment_events): which
// variant a visitor saw, opened, and submitted. Instrumentation only, so a
// failed write is logged and swallowed; it must never break the page or the
// signup it describes.
import { getSupabaseAdminClient } from '$lib/server/supabaseAdmin';
import { logger } from '$lib/utils/logger';

export const CTA_EXPERIMENT_EVENTS = ['viewed', 'opened', 'submitted'] as const;
export type CtaExperimentEvent = (typeof CTA_EXPERIMENT_EVENTS)[number];

export type RecordCtaExperimentEventInput = {
	experiment: string;
	variant: string;
	event: CtaExperimentEvent;
	surface?: string | null;
	placement?: string | null;
	path?: string | null;
	fingerprint?: string | null;
};

export async function recordCtaExperimentEvent(
	input: RecordCtaExperimentEventInput,
	deps: { supabase?: any } = {}
): Promise<void> {
	try {
		const supabase = deps.supabase ?? (getSupabaseAdminClient() as any);
		const { error } = await supabase.from('cta_experiment_events').insert({
			experiment: input.experiment.slice(0, 60),
			variant: input.variant.slice(0, 60),
			event: input.event,
			surface: input.surface?.slice(0, 40) ?? null,
			placement: input.placement?.slice(0, 20) ?? null,
			path: input.path?.slice(0, 300) ?? null,
			fingerprint: input.fingerprint?.slice(0, 100) ?? null
		});
		if (error) throw error;
	} catch (error) {
		logger.warn('CTA experiment event not recorded', {
			experiment: input.experiment,
			event: input.event,
			error: error instanceof Error ? error.message : String(error)
		});
	}
}

export type CtaVariantResult = {
	variant: string;
	headline: string;
	viewed: number;
	opened: number;
	submitted: number;
};

/**
 * Per-variant counts for one experiment, all time. "Viewed" counts card
 * impressions (once per page per placement), not unique people, so the rates
 * read as signups per card seen. Returns null when the table can't be read.
 */
export async function loadCtaExperimentResults(
	supabase: any,
	experiment: string,
	variants: readonly { id: string; headline: string }[]
): Promise<CtaVariantResult[] | null> {
	const count = async (variant: string, event: CtaExperimentEvent) => {
		const { count: total, error } = await supabase
			.from('cta_experiment_events')
			.select('id', { count: 'exact', head: true })
			.eq('experiment', experiment)
			.eq('variant', variant)
			.eq('event', event);
		if (error) throw error;
		return total ?? 0;
	};

	try {
		return await Promise.all(
			variants.map(async ({ id, headline }) => {
				const [viewed, opened, submitted] = await Promise.all(
					CTA_EXPERIMENT_EVENTS.map((event) => count(id, event))
				);
				return { variant: id, headline, viewed, opened, submitted };
			})
		);
	} catch (error) {
		logger.warn('CTA experiment results unavailable', {
			experiment,
			error: error instanceof Error ? error.message : String(error)
		});
		return null;
	}
}
