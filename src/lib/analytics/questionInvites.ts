// src/lib/analytics/questionInvites.ts
import { capture } from '$lib/analytics/posthog';

export const QUESTION_INVITE_PARAM = 'via';
export const QUESTION_SHARE_NUDGE_DELAY_MS = 8_000;

const OWNED_INVITES_STORAGE_KEY = '9takes:question-invites:v1';
const LANDING_STORAGE_PREFIX = '9takes:question-invite-landing:';
const MAX_OWNED_INVITES = 20;
const INVITE_TTL_MS = 30 * 24 * 60 * 60 * 1_000;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export type QuestionInviteSource = 'homepage-answer' | 'question-answer' | 'question-toolbar';
export type QuestionInviteShareMethod = 'native' | 'clipboard';

type OwnedQuestionInvite = {
	inviteId: string;
	questionUrl: string;
	source: QuestionInviteSource;
	sharedAt: number;
	returnTrackedAt: number | null;
};

type ShareQuestionInviteInput = {
	baseUrl: string;
	title: string;
	text: string;
	inviteId?: string;
	share?: (data: ShareData) => Promise<void>;
	writeClipboard?: (text: string) => Promise<void>;
};

export type ShareQuestionInviteResult =
	| {
			status: 'shared';
			method: QuestionInviteShareMethod;
			inviteId: string;
			inviteUrl: string;
	  }
	| {
			status: 'aborted' | 'failed';
			inviteId: string;
			inviteUrl: string;
	  };

type CaptureQuestionInvitePageViewInput = {
	currentUrl: string | URL;
	questionId: number;
	questionUrl: string;
	localStorage?: Storage;
	sessionStorage?: Storage;
	now?: number;
};

function isAbortError(error: unknown): boolean {
	return Boolean(
		error && typeof error === 'object' && 'name' in error && error.name === 'AbortError'
	);
}

function readOwnedInvites(storage: Storage, now = Date.now()): OwnedQuestionInvite[] {
	try {
		const raw = storage.getItem(OWNED_INVITES_STORAGE_KEY);
		if (!raw) return [];

		const parsed = JSON.parse(raw);
		if (!Array.isArray(parsed)) return [];

		return parsed.filter((candidate): candidate is OwnedQuestionInvite => {
			if (!candidate || typeof candidate !== 'object') return false;
			const record = candidate as Partial<OwnedQuestionInvite>;
			return Boolean(
				normalizeQuestionInviteId(record.inviteId) &&
				typeof record.questionUrl === 'string' &&
				(record.source === 'homepage-answer' ||
					record.source === 'question-answer' ||
					record.source === 'question-toolbar') &&
				typeof record.sharedAt === 'number' &&
				now - record.sharedAt <= INVITE_TTL_MS &&
				(record.returnTrackedAt === null || typeof record.returnTrackedAt === 'number')
			);
		});
	} catch {
		return [];
	}
}

function writeOwnedInvites(storage: Storage, invites: OwnedQuestionInvite[]): void {
	try {
		storage.setItem(OWNED_INVITES_STORAGE_KEY, JSON.stringify(invites.slice(0, MAX_OWNED_INVITES)));
	} catch {
		// Attribution must never prevent sharing in restricted storage modes.
	}
}

export function normalizeQuestionInviteId(value: unknown): string | null {
	if (typeof value !== 'string') return null;
	const normalized = value.trim().toLowerCase();
	return UUID_PATTERN.test(normalized) ? normalized : null;
}

export function createQuestionInviteId(): string {
	return globalThis.crypto.randomUUID();
}

export function buildQuestionInviteUrl(baseUrl: string, inviteId: string): string {
	const normalizedInviteId = normalizeQuestionInviteId(inviteId);
	if (!normalizedInviteId) throw new Error('Invalid question invite id');

	const inviteUrl = new URL(baseUrl);
	inviteUrl.searchParams.set(QUESTION_INVITE_PARAM, normalizedInviteId);
	return inviteUrl.toString();
}

export function getQuestionInviteId(currentUrl: string | URL): string | null {
	try {
		const url = currentUrl instanceof URL ? currentUrl : new URL(currentUrl);
		return normalizeQuestionInviteId(url.searchParams.get(QUESTION_INVITE_PARAM));
	} catch {
		return null;
	}
}

export function questionShareNudgeWasSeen(storage: Storage, storageKey: string): boolean {
	try {
		return storage.getItem(storageKey) === 'seen';
	} catch {
		return false;
	}
}

export function markQuestionShareNudgeSeen(storage: Storage, storageKey: string): void {
	try {
		storage.setItem(storageKey, 'seen');
	} catch {
		// Dismissal still works in memory when browser storage is unavailable.
	}
}

export function shouldQueueQuestionShareNudge({
	matchesDesktop,
	alreadySeen
}: {
	matchesDesktop: boolean;
	alreadySeen: boolean;
}): boolean {
	return matchesDesktop && !alreadySeen;
}

export async function shareQuestionInvite({
	baseUrl,
	title,
	text,
	inviteId = createQuestionInviteId(),
	share,
	writeClipboard
}: ShareQuestionInviteInput): Promise<ShareQuestionInviteResult> {
	const normalizedInviteId = normalizeQuestionInviteId(inviteId);
	if (!normalizedInviteId) throw new Error('Invalid question invite id');

	const inviteUrl = buildQuestionInviteUrl(baseUrl, normalizedInviteId);

	if (share) {
		try {
			await share({ title, text, url: inviteUrl });
			return { status: 'shared', method: 'native', inviteId: normalizedInviteId, inviteUrl };
		} catch (error) {
			if (isAbortError(error)) {
				return { status: 'aborted', inviteId: normalizedInviteId, inviteUrl };
			}
		}
	}

	if (writeClipboard) {
		try {
			await writeClipboard(inviteUrl);
			return { status: 'shared', method: 'clipboard', inviteId: normalizedInviteId, inviteUrl };
		} catch {
			// Fall through to a non-throwing failure result for the UI to handle.
		}
	}

	return { status: 'failed', inviteId: normalizedInviteId, inviteUrl };
}

export function rememberOwnedQuestionInvite(
	invite: {
		inviteId: string;
		questionUrl: string;
		source: QuestionInviteSource;
		sharedAt?: number;
	},
	storage: Storage = window.localStorage
): void {
	const inviteId = normalizeQuestionInviteId(invite.inviteId);
	if (!inviteId) return;

	const sharedAt = invite.sharedAt ?? Date.now();
	const existing = readOwnedInvites(storage, sharedAt).filter(
		(record) => record.inviteId !== inviteId
	);
	writeOwnedInvites(storage, [
		{
			inviteId,
			questionUrl: invite.questionUrl,
			source: invite.source,
			sharedAt,
			returnTrackedAt: null
		},
		...existing
	]);
}

export function getRecipientQuestionInviteId(
	currentUrl: string | URL = window.location.href,
	storage: Storage = window.localStorage
): string | null {
	const inviteId = getQuestionInviteId(currentUrl);
	if (!inviteId) return null;
	return readOwnedInvites(storage).some((record) => record.inviteId === inviteId) ? null : inviteId;
}

/**
 * Records one recipient landing per browser session, or one later return by
 * the browser that created the invite. Only the opaque invite UUID is emitted.
 */
export async function captureQuestionInvitePageView({
	currentUrl,
	questionId,
	questionUrl,
	localStorage = window.localStorage,
	sessionStorage = window.sessionStorage,
	now = Date.now()
}: CaptureQuestionInvitePageViewInput): Promise<void> {
	const inviteId = getQuestionInviteId(currentUrl);
	const ownedInvites = readOwnedInvites(localStorage, now);
	const ownedInvite = inviteId
		? ownedInvites.find((record) => record.inviteId === inviteId)
		: ownedInvites.find((record) => record.questionUrl === questionUrl);

	if (ownedInvite) {
		if (ownedInvite.returnTrackedAt !== null) return;

		const updatedInvites = ownedInvites.map((record) =>
			record.inviteId === ownedInvite.inviteId ? { ...record, returnTrackedAt: now } : record
		);
		writeOwnedInvites(localStorage, updatedInvites);
		await capture('question_invite_sharer_returned', {
			invite_id: ownedInvite.inviteId,
			question_id: questionId,
			question_url: questionUrl,
			source: ownedInvite.source
		});
		return;
	}

	if (!inviteId) return;

	const landingStorageKey = `${LANDING_STORAGE_PREFIX}${inviteId}`;
	try {
		if (sessionStorage.getItem(landingStorageKey) === 'seen') return;
		sessionStorage.setItem(landingStorageKey, 'seen');
	} catch {
		// If session storage is unavailable, capture the landing best-effort.
	}

	const url = currentUrl instanceof URL ? currentUrl : new URL(currentUrl);
	await capture('question_invite_recipient_landed', {
		invite_id: inviteId,
		question_id: questionId,
		question_url: questionUrl,
		landing_path: url.pathname
	});
}
