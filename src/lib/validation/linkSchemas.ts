// src/lib/validation/linkSchemas.ts
import { z } from 'zod';

// links.id is a bigint, and increment_clicks takes a 32-bit integer.
const MAX_LINK_ID = 2_147_483_647;

/** The `linkId` form field posted when a reader opens a link from a question. */
export const linkClickSchema = z.object({
	linkId: z
		.string()
		.regex(/^\d{1,10}$/, 'Invalid link ID')
		.transform(Number)
		.pipe(z.number().int().positive().max(MAX_LINK_ID))
});
