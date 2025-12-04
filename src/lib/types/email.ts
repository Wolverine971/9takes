// src/lib/types/email.ts
// Email Management System Types

export type RecipientSource = 'profiles' | 'signups' | 'coaching_waitlist';

export interface EmailRecipient {
	id: string;
	email: string;
	name?: string;
	source: RecipientSource;
	source_id: string;
	enneagram?: string;
	unsubscribed?: boolean;
	created_at?: string;
}

export interface EmailCampaign {
	id: string;
	name: string;
	description?: string;
	status: 'draft' | 'active' | 'paused' | 'completed';
	created_by?: string;
	created_at: string;
	updated_at: string;
}

export interface EmailTemplate {
	id: string;
	name: string;
	subject: string;
	html_content: string;
	description?: string;
	is_default: boolean;
	created_by?: string;
	created_at: string;
	updated_at: string;
}

export interface EmailSend {
	id: string;
	campaign_id?: string;
	recipient_email: string;
	recipient_name?: string;
	recipient_source: RecipientSource;
	recipient_source_id: string;
	subject: string;
	html_content: string;
	plain_text_content?: string;
	tracking_id: string;
	status: 'pending' | 'sent' | 'delivered' | 'bounced' | 'failed';
	opened_at?: string;
	open_count: number;
	clicked_at?: string;
	click_count: number;
	unsubscribed_at?: string;
	bounced_at?: string;
	bounce_reason?: string;
	sent_at?: string;
	sent_by?: string;
	created_at: string;
	error_message?: string;
	retry_count: number;
}

export interface EmailTrackingEvent {
	id: string;
	email_send_id: string;
	event_type: 'open' | 'click' | 'unsubscribe' | 'bounce' | 'complaint';
	link_url?: string;
	ip_address?: string;
	user_agent?: string;
	country?: string;
	city?: string;
	created_at: string;
}

export interface EmailDraft {
	id: string;
	subject?: string;
	html_content?: string;
	recipients: EmailRecipient[];
	scheduled_for?: string;
	created_by?: string;
	created_at: string;
	updated_at: string;
}

export interface ScheduledEmail {
	id: string;
	draft_id?: string;
	subject: string;
	html_content: string;
	recipients: EmailRecipient[];
	campaign_id?: string;
	scheduled_for: string;
	status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
	processed_at?: string;
	emails_sent: number;
	emails_failed: number;
	error_log: Array<{ email?: string; error: string }>;
	created_by?: string;
	created_at: string;
}

export interface EmailUnsubscribe {
	id: string;
	email: string;
	source?: string;
	source_id?: string;
	reason?: string;
	unsubscribed_at: string;
}

export interface EmailAnalytics {
	total_sent: number;
	total_opened: number;
	total_clicked: number;
	total_unsubscribed: number;
	total_bounced: number;
	total_failed: number;
	open_rate: number;
	click_rate: number;
}

// API Request/Response types

export interface FetchUsersParams {
	source?: RecipientSource | 'all';
	search?: string;
	page?: number;
	limit?: number;
}

export interface FetchUsersResponse {
	users: EmailRecipient[];
	pagination: {
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	};
}

export interface SendEmailRequest {
	recipients: EmailRecipient[];
	subject: string;
	html_content: string;
	campaign_id?: string;
}

export interface SendEmailResponse {
	success: boolean;
	sent: number;
	failed: number;
	results: Array<{
		email: string;
		success: boolean;
		error?: string;
		tracking_id?: string;
	}>;
}

export interface ScheduleEmailRequest {
	recipients: EmailRecipient[];
	subject: string;
	html_content: string;
	scheduled_for: string;
	campaign_id?: string;
}

export interface GenerateEmailRequest {
	instructions: string;
	context?: {
		recipient_count?: number;
		audience_type?: string;
		tone?: 'professional' | 'friendly' | 'casual';
	};
}

export interface GenerateEmailResponse {
	subject: string;
	html_content: string;
	plain_text: string;
}

export interface SaveDraftRequest {
	id?: string;
	subject?: string;
	html_content?: string;
	recipients?: EmailRecipient[];
	scheduled_for?: string;
}

// UI State types

export interface ComposeState {
	recipients: EmailRecipient[];
	subject: string;
	html_content: string;
	isMinimized: boolean;
	isSending: boolean;
	scheduledFor?: string;
}

export interface UserSelectionState {
	selectedIds: Set<string>;
	selectAll: boolean;
}
