// src/lib/validation/profileSchemas.ts
import { z } from 'zod';

export const PROFILE_NAME_MAX_LENGTH = 80;

const profileNameSchema = z
	.string()
	.trim()
	.max(PROFILE_NAME_MAX_LENGTH, `Names can be at most ${PROFILE_NAME_MAX_LENGTH} characters`);

/** A self-reported Enneagram type: '1'-'9', or '' for "not set". */
export const profileEnneagramSchema = z
	.string()
	.trim()
	.regex(/^[1-9]?$/, 'Choose an Enneagram type from 1 to 9');

/**
 * The fields a signed-in user may edit on their own profile. Any other submitted
 * field is dropped; the row to update always comes from the session, never the form.
 */
export const profileEditSchema = z.object({
	firstName: profileNameSchema.default(''),
	lastName: profileNameSchema.default(''),
	enneagram: profileEnneagramSchema.default('')
});

export type ProfileEdit = z.infer<typeof profileEditSchema>;

/** Column values for a `profiles` update built from a validated edit. */
export function toProfileUpdate(edit: ProfileEdit) {
	return {
		first_name: edit.firstName,
		last_name: edit.lastName,
		enneagram: edit.enneagram
	};
}
