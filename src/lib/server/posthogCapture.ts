// src/lib/server/posthogCapture.ts
import { PUBLIC_POSTHOG_HOST, PUBLIC_POSTHOG_KEY } from '$env/static/public';

export type ReplyNotificationEventName =
	| 'reply_notification_queued'
	| 'reply_notification_sent'
	| 'reply_notification_failed'
	| 'reply_notification_clicked'
	| 'reply_notification_unsubscribed';

export type ReplyNotificationEventContext = {
	outboxId: number;
	subscriptionId: number;
	questionId: number;
	commentId: number;
	replyCommentId?: number | null;
	attempt?: number;
	failureCategory?:
		| 'suppressed'
		| 'cancelled'
		| 'persistence'
		| 'configuration'
		| 'provider_rate_limited'
		| 'provider_rejected'
		| 'provider_unavailable'
		| 'provider_ambiguous'
		| 'unknown';
};

type CaptureOptions = {
	insertIdSuffix?: string;
	fetchImpl?: typeof fetch;
};

type RegistrationCompletedContext = {
	userId: string;
	enneagramType?: number | null;
};

const POSTHOG_HOST = (PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com').replace(/\/$/, '');

export function buildReplyNotificationPostHogPayload(
	event: ReplyNotificationEventName,
	context: ReplyNotificationEventContext,
	insertIdSuffix = 'once'
) {
	const properties: Record<string, string | number | boolean> = {
		distinct_id: `reply-notification:${context.outboxId}`,
		$process_person_profile: false,
		$insert_id: `${event}:${context.outboxId}:${insertIdSuffix}`,
		outbox_id: context.outboxId,
		subscription_id: context.subscriptionId,
		question_id: context.questionId,
		comment_id: context.commentId,
		delivery_channel: 'email'
	};

	if (context.replyCommentId != null) properties.reply_comment_id = context.replyCommentId;
	if (context.attempt != null) properties.attempt = context.attempt;
	if (context.failureCategory) properties.failure_category = context.failureCategory;

	return { api_key: PUBLIC_POSTHOG_KEY, event, properties };
}

export async function captureReplyNotificationEvent(
	event: ReplyNotificationEventName,
	context: ReplyNotificationEventContext,
	options: CaptureOptions = {}
): Promise<boolean> {
	if (!PUBLIC_POSTHOG_KEY) return false;

	const payload = buildReplyNotificationPostHogPayload(event, context, options.insertIdSuffix);
	const forbiddenKey = Object.keys(payload.properties).find((key) =>
		/(email|fingerprint|token|ip_address|user_agent)/i.test(key)
	);
	if (forbiddenKey) {
		console.warn('Skipped unsafe reply-notification analytics payload', { event, forbiddenKey });
		return false;
	}

	try {
		const response = await (options.fetchImpl ?? fetch)(`${POSTHOG_HOST}/capture/`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload)
		});
		if (!response.ok) {
			console.warn('Reply-notification analytics capture failed', {
				event,
				status: response.status
			});
			return false;
		}
		return true;
	} catch {
		console.warn('Reply-notification analytics capture failed', { event, status: 'network' });
		return false;
	}
}

export function buildRegistrationCompletedPostHogPayload(context: RegistrationCompletedContext) {
	const properties: Record<string, string | number | boolean> = {
		distinct_id: context.userId,
		$process_person_profile: true,
		$insert_id: `registration_completed:${context.userId}`,
		flow: 'register',
		account_state: 'pending_confirmation',
		has_enneagram_type: context.enneagramType != null,
		server_confirmed: true
	};

	if (
		context.enneagramType != null &&
		Number.isSafeInteger(context.enneagramType) &&
		context.enneagramType >= 1 &&
		context.enneagramType <= 9
	) {
		properties.enneagram_type = context.enneagramType;
	}

	return { api_key: PUBLIC_POSTHOG_KEY, event: 'registration_completed', properties };
}

export async function captureRegistrationCompleted(
	context: RegistrationCompletedContext,
	options: Pick<CaptureOptions, 'fetchImpl'> = {}
): Promise<boolean> {
	if (!PUBLIC_POSTHOG_KEY || !context.userId.trim()) return false;

	const payload = buildRegistrationCompletedPostHogPayload(context);
	const forbiddenKey = Object.keys(payload.properties).find((key) =>
		/(email|fingerprint|token|ip_address|user_agent)/i.test(key)
	);
	if (forbiddenKey) {
		console.warn('Skipped unsafe registration analytics payload', { forbiddenKey });
		return false;
	}

	try {
		const response = await (options.fetchImpl ?? fetch)(`${POSTHOG_HOST}/capture/`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload)
		});
		if (!response.ok) {
			console.warn('Registration analytics capture failed', { status: response.status });
			return false;
		}
		return true;
	} catch {
		console.warn('Registration analytics capture failed', { status: 'network' });
		return false;
	}
}
