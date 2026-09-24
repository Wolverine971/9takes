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
	createdAt: string;
};
