// src/routes/api/adder/+server.ts
import { json } from '@sveltejs/kit';
import { dev } from '$app/environment';
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

		if (dev) {
			return json({
				message: 'Development mode - visitor data not recorded'
			});
		}

		// Validate request body
		const validatedData = visitorSchema.parse(body);
		const fingerprint = validatedData.fp;

		logger.info('Fingerprint acknowledged without database write', { fingerprint });
		return json({
			ok: true
		});
	} catch (e) {
		if (e instanceof z.ZodError) {
			logger.warn('Invalid visitor data', {
				errors: e.errors
			});
			return json({ error: 'Invalid visitor data' }, { status: 400 });
		}
		logger.error('Error in POST /api/adder', e as Error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
});
