// routes/api/adder/+server.ts
import { supabase } from '$lib/supabase';
import { error, json } from '@sveltejs/kit';
import { logger, withApiLogging } from '$lib/utils/logger';
import { z } from 'zod';

// Validation schema
const visitorSchema = z.object({
	fp: z.string().min(1).max(100)
});

/** @type {import('./$types').RequestHandler} */
export const POST = withApiLogging(async ({ request }) => {
	try {
		const formData = await request.formData();
		const body = Object.fromEntries(formData);

		// Validate request body
		const validatedData = visitorSchema.parse(body);
		const fingerprint = validatedData.fp;

		const { data: addedVisitor, error: addedVisitorsError } = await supabase
			.from('visitors')
			.upsert({ fingerprint, updated_at: new Date() }, { onConflict: 'fingerprint' })
			.select();

		if (addedVisitorsError) {
			logger.error('Failed to upsert visitor', addedVisitorsError, {
				fingerprint
			});
			throw error(500, 'Failed to record visitor');
		}

		logger.info('Visitor recorded', { fingerprint });
		return json(addedVisitor);
	} catch (e) {
		if (e instanceof z.ZodError) {
			logger.warn('Invalid visitor data', {
				errors: e.errors
			});
			throw error(400, {
				message: 'Invalid visitor data',
				details: e.errors
			});
		}
		if ((e as any).status) {
			throw e; // Re-throw HTTP errors
		}
		logger.error('Error in POST /api/adder', e as Error);
		throw error(500, {
			message: 'Internal server error'
		});
	}
});
