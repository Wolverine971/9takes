// src/lib/types/talkNotes.ts
// Shared shapes for "Talk to DJ" notes (safe to import from client components).

export type TalkNoteStatus = 'new' | 'replied' | 'archived';

export type TalkNoteFilter = 'open' | 'replied' | 'archived' | 'all';

export type AdminTalkNote = {
	id: string;
	body: string;
	inputMode: 'text' | 'voice';
	audioUrl: string | null;
	audioSeconds: number | null;
	email: string | null;
	name: string | null;
	wantsSession: boolean;
	waitlistId: string | null;
	status: TalkNoteStatus;
	replyText: string | null;
	replyAudioUrl: string | null;
	replyUrl: string | null;
	repliedAt: string | null;
	replyEmailSentAt: string | null;
	sourcePath: string | null;
	/** First time DJ saw the note; null = unseen. */
	viewedAt: string | null;
	createdAt: string;
};

export type TalkNotePreview = {
	id: string;
	createdAt: string;
	preview: string;
	body: string;
	inputMode: 'text' | 'voice';
	hasEmail: boolean;
	wantsSession: boolean;
	status: TalkNoteStatus;
	viewedAt: string | null;
};

/** At-a-glance numbers for the admin dashboard and the notes inbox. */
export type TalkNotesOverview = {
	/** Open (unreplied) notes. */
	newCount: number;
	/** Open notes DJ hasn't seen yet: what the nav badge counts. */
	unseenCount: number;
	repliedCount: number;
	archivedCount: number;
	totalCount: number;
	withEmailCount: number;
	sessionRequestCount: number;
	lastNoteAt: string | null;
	latest: TalkNotePreview[];
};
