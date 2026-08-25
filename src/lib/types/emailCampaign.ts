// src/lib/types/emailCampaign.ts
export type EmailCampaignMetrics = {
	sent: number;
	opened: number;
	clicked: number;
	unsubscribed: number;
	bounced: number;
};

export type EmailCampaignEnrollmentCounts = {
	total: number;
	active: number;
	processing: number;
	paused: number;
	completed: number;
	exited: number;
	errored: number;
};

export type EmailCampaignMessage = {
	id: string;
	label: string;
	context: string;
	state: 'pilot' | 'candidate' | 'sequence';
	stepNumber: number;
	delayDays: number;
	metrics: EmailCampaignMetrics;
	subject: string;
	preheader: string | null;
	plainText: string;
	previewHtml: string;
};

export type EmailCampaignDetailLink =
	| '/admin/email-dashboard'
	| '/admin/welcome-sequence'
	| '/admin/reactivation-sequence'
	| '/admin/enneagram-campaign';

export type EmailCampaignOverview = {
	id: string;
	key: string;
	displayName: string;
	description: string | null;
	triggerType: string;
	status: string;
	updatedAt: string;
	detailLink: EmailCampaignDetailLink;
	metrics: EmailCampaignMetrics;
	enrollments: EmailCampaignEnrollmentCounts;
	emails: EmailCampaignMessage[];
};
