// src/lib/server/errorTracking.ts
import { getSupabaseAdminClient } from '$lib/server/supabaseAdmin';

type ErrorLevel = 'ERROR' | 'WARN';

interface ErrorTrackingContext {
	userId?: string;
	requestId?: string;
	route?: string;
	method?: string;
	[key: string]: unknown;
}

interface ErrorTrackingPayload {
	level: ErrorLevel;
	message: string;
	error?: Error;
	context?: ErrorTrackingContext;
}

function toSafeJsonValue(value: unknown): unknown {
	if (value === null || value === undefined) return null;
	if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
		return value;
	}
	if (value instanceof Error) {
		return {
			name: value.name,
			message: value.message,
			stack: value.stack ?? null
		};
	}
	if (Array.isArray(value)) {
		return value.map((entry) => toSafeJsonValue(entry));
	}
	if (typeof value === 'object') {
		const result: Record<string, unknown> = {};
		for (const [key, entry] of Object.entries(value)) {
			result[key] = toSafeJsonValue(entry);
		}
		return result;
	}
	return String(value);
}

function sanitizeContext(context?: ErrorTrackingContext): Record<string, unknown> {
	if (!context) return {};

	const safeContext = toSafeJsonValue(context);
	return safeContext && typeof safeContext === 'object' && !Array.isArray(safeContext)
		? (safeContext as Record<string, unknown>)
		: {};
}

export async function trackServerError(payload: ErrorTrackingPayload): Promise<void> {
	try {
		const supabaseAdmin = getSupabaseAdminClient() as any;
		const safeContext = sanitizeContext(payload.context);

		const record = {
			source: 'application',
			level: payload.level,
			message: payload.message,
			error_name: payload.error?.name ?? null,
			error_message: payload.error?.message ?? null,
			stack: payload.error?.stack ?? null,
			route: typeof safeContext.route === 'string' ? safeContext.route : null,
			method: typeof safeContext.method === 'string' ? safeContext.method : null,
			request_id: typeof safeContext.requestId === 'string' ? safeContext.requestId : null,
			user_id: typeof safeContext.userId === 'string' ? safeContext.userId : null,
			context: safeContext
		};

		const { error } = await supabaseAdmin.from('app_error_events').insert(record);
		if (error) {
			console.error('Failed to persist app error event', error);
		}
	} catch (trackingError) {
		console.error('Failed to initialize app error tracking', trackingError);
	}
}
