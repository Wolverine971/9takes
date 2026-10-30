// src/lib/analytics/emailSignupContext.ts
// Shared, allowlisted metadata for linking a saved signup to its browser journey.
export const EMAIL_SIGNUP_SURFACES = [
	'strategic_question',
	'email_signup',
	'email_invite',
	'enneagram_sidebar',
	'blog_purpose'
] as const;

export type EmailSignupSurface = (typeof EMAIL_SIGNUP_SURFACES)[number];
export type EmailSignupAnalyticsContext = {
	distinctId: string;
	sessionId?: string;
	surface: EmailSignupSurface;
	sourcePath?: string;
};

const UUID_PATTERN = /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i;

export function parseEmailSignupAnalytics(value: unknown): EmailSignupAnalyticsContext | null {
	try {
		const input = typeof value === 'string' ? JSON.parse(value) : value;
		if (!input || typeof input !== 'object' || Array.isArray(input)) return null;
		if (typeof input.distinctId !== 'string' || !UUID_PATTERN.test(input.distinctId)) return null;
		if (!EMAIL_SIGNUP_SURFACES.includes(input.surface)) return null;
		return {
			distinctId: input.distinctId,
			surface: input.surface,
			...(typeof input.sessionId === 'string' && UUID_PATTERN.test(input.sessionId)
				? { sessionId: input.sessionId }
				: {}),
			// Never forward a query string, fragment, email address, or arbitrary form content.
			...(typeof input.sourcePath === 'string' && /^\/[a-zA-Z0-9/_-]{0,499}$/.test(input.sourcePath)
				? { sourcePath: input.sourcePath }
				: {})
		};
	} catch {
		return null;
	}
}
