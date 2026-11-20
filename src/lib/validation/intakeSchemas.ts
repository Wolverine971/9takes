// src/lib/validation/intakeSchemas.ts
// Shape of the client-facing coaching intake form (src/routes/intake/[token]).
import { z } from 'zod';

export const INTAKE_CHOICE_MAX_LENGTH = 50;
export const INTAKE_SHORT_TEXT_MAX_LENGTH = 200;
export const INTAKE_LONG_TEXT_MAX_LENGTH = 5000;

/** Labels used in validation messages, keyed by form field name. */
const FIELD_LABELS = {
	age_range: 'Age range',
	occupation: 'Occupation',
	relationship_status: 'Relationship status',
	living_situation: 'Living situation',
	current_challenges: 'Current challenges',
	desired_outcome: 'Desired outcome',
	previous_attempts: 'Previous attempts',
	urgency_level: 'Urgency',
	suspected_type: 'Enneagram type',
	why_this_type: 'Why this type',
	core_fear: 'Core fear',
	core_desire: 'Core desire',
	childhood_message: 'Childhood message',
	primary_emotion: 'Primary emotion',
	emotion_expression: 'Emotion expression',
	stress_response: 'Stress response',
	comfort_response: 'Comfort response',
	relationship_patterns: 'Relationship patterns',
	communication_style: 'Communication style',
	conflict_style: 'Conflict style',
	short_term_goals: 'Short-term goals',
	long_term_goals: 'Long-term goals',
	specific_scenarios: 'Specific scenarios',
	preferred_session_time: 'Preferred session time',
	timezone: 'Timezone',
	how_heard_about_us: 'How you heard about us'
} as const;

type IntakeField = keyof typeof FIELD_LABELS;

/** Optional text: trimmed, capped, and stored as null when left blank. */
function optionalText(field: IntakeField, max: number) {
	return z
		.string()
		.trim()
		.max(max, `${FIELD_LABELS[field]} must be ${max.toLocaleString('en-US')} characters or fewer`)
		.default('')
		.transform((value) => (value === '' ? null : value));
}

function requiredText(field: IntakeField, max: number) {
	return z
		.string({ required_error: `${FIELD_LABELS[field]} is required` })
		.trim()
		.min(1, `${FIELD_LABELS[field]} is required`)
		.max(max, `${FIELD_LABELS[field]} must be ${max.toLocaleString('en-US')} characters or fewer`);
}

const choice = (field: IntakeField) => optionalText(field, INTAKE_CHOICE_MAX_LENGTH);
const shortText = (field: IntakeField) => optionalText(field, INTAKE_SHORT_TEXT_MAX_LENGTH);
const longText = (field: IntakeField) => optionalText(field, INTAKE_LONG_TEXT_MAX_LENGTH);

/** The 26 answers a client submits. Keys match `consulting_intake_forms` columns. */
export const intakeSubmissionSchema = z.object({
	// Section 1: Background
	age_range: choice('age_range'),
	occupation: shortText('occupation'),
	relationship_status: choice('relationship_status'),
	living_situation: shortText('living_situation'),

	// Section 2: Current situation
	current_challenges: requiredText('current_challenges', INTAKE_LONG_TEXT_MAX_LENGTH),
	desired_outcome: requiredText('desired_outcome', INTAKE_LONG_TEXT_MAX_LENGTH),
	previous_attempts: longText('previous_attempts'),
	urgency_level: z
		.enum(['', 'low', 'medium', 'high', 'critical'], {
			errorMap: () => ({ message: 'Choose an urgency level from the list' })
		})
		.default('')
		.transform((value) => (value === '' ? null : value)),

	// Section 3: Personality assessment
	suspected_type: z
		.string()
		.trim()
		.regex(/^[1-9]?$/, 'Choose an Enneagram type from 1 to 9')
		.default('')
		.transform((value) => (value === '' ? null : Number.parseInt(value, 10))),
	why_this_type: longText('why_this_type'),
	core_fear: longText('core_fear'),
	core_desire: longText('core_desire'),
	childhood_message: longText('childhood_message'),

	// Section 4: Emotional patterns
	primary_emotion: choice('primary_emotion'),
	emotion_expression: longText('emotion_expression'),
	stress_response: longText('stress_response'),
	comfort_response: longText('comfort_response'),

	// Section 5: Relationships
	relationship_patterns: longText('relationship_patterns'),
	communication_style: longText('communication_style'),
	conflict_style: longText('conflict_style'),

	// Section 6: Goals
	short_term_goals: longText('short_term_goals'),
	long_term_goals: longText('long_term_goals'),
	specific_scenarios: longText('specific_scenarios'),

	// Section 7: Logistics
	preferred_session_time: choice('preferred_session_time'),
	timezone: shortText('timezone'),
	how_heard_about_us: shortText('how_heard_about_us')
});

export type IntakeSubmission = z.infer<typeof intakeSubmissionSchema>;

/** Intake links carry the form's id, which is a UUID. */
export const intakeTokenSchema = z.string().uuid();
