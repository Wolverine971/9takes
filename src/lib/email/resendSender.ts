// src/lib/email/resendSender.ts
import { env } from '$env/dynamic/private';
import { Resend } from 'resend';

export type ResendSendRequest = {
	to: string;
	subject: string;
	html: string;
	text: string;
	headers?: Record<string, string>;
	idempotencyKey: string;
	emailSendId: string;
};

export type ResendSendResult =
	| { success: true; messageId: string }
	| {
			success: false;
			error: string;
			status: number | null;
			name: string | null;
			retryable: boolean;
	  };

function parseStatus(error: unknown): number | null {
	if (!error || typeof error !== 'object') return null;
	const candidate = error as { statusCode?: unknown; status?: unknown };
	for (const value of [candidate.statusCode, candidate.status]) {
		const parsed = typeof value === 'number' ? value : Number.parseInt(String(value ?? ''), 10);
		if (Number.isFinite(parsed)) return parsed;
	}
	return null;
}

function isRetryable(error: unknown): boolean {
	if (!error || typeof error !== 'object') return false;
	const status = parseStatus(error);
	const name = String((error as { name?: unknown }).name ?? '');
	return (
		status === 429 ||
		(status !== null && status >= 500) ||
		name === 'rate_limit_exceeded' ||
		name === 'api_error'
	);
}

function errorMessage(error: unknown): string {
	if (error && typeof error === 'object' && 'message' in error) {
		return String((error as { message: unknown }).message);
	}
	return String(error || 'Unknown Resend error');
}

export function isResendMarketingProviderEnabled(): boolean {
	return env.EMAIL_MARKETING_PROVIDER?.trim().toLowerCase() === 'resend';
}

export async function sendMarketingEmailWithResend(
	request: ResendSendRequest
): Promise<ResendSendResult> {
	const apiKey = env.RESEND_API_KEY?.trim();
	const from = env.RESEND_MARKETING_FROM?.trim();

	if (!apiKey || !from) {
		return {
			success: false,
			error: 'RESEND_API_KEY and RESEND_MARKETING_FROM are required for Resend marketing delivery',
			status: null,
			name: 'configuration_error',
			retryable: false
		};
	}

	const resend = new Resend(apiKey);
	let lastError: unknown;

	for (let attempt = 0; attempt < 3; attempt += 1) {
		const { data, error } = await resend.emails.send(
			{
				from,
				to: [request.to],
				subject: request.subject,
				html: request.html,
				text: request.text,
				replyTo: 'usersup@9takes.com',
				headers: request.headers,
				tags: [
					{ name: 'delivery_kind', value: 'marketing' },
					{ name: 'email_send_id', value: request.emailSendId }
				]
			},
			{ idempotencyKey: request.idempotencyKey }
		);

		if (!error && data?.id) {
			return { success: true, messageId: data.id };
		}

		lastError = error ?? new Error('Resend returned no message ID');
		if (!isRetryable(lastError) || attempt === 2) break;
		await new Promise((resolve) => setTimeout(resolve, 2 ** attempt * 1000));
	}

	const status = parseStatus(lastError);
	return {
		success: false,
		error: errorMessage(lastError),
		status,
		name:
			lastError && typeof lastError === 'object' && 'name' in lastError
				? String((lastError as { name: unknown }).name)
				: null,
		retryable: isRetryable(lastError)
	};
}
