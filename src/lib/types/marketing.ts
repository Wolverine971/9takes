// src/lib/types/marketing.ts

export interface Campaign {
	id: string;
	name: string;
	description?: string;
	start_date: string;
	end_date: string;
	color: string;
	target_audience?: string;
	themes_and_topics?: string;
	target_hashtags?: string;
	campaign_hashtags?: string;
	campaign_promotion_accounts?: string;
	created_at?: string;
	updated_at?: string;
}

export interface ContentItem {
	id: string;
	campaign_id?: string;
	content_text: string;
	scheduled_date: string;
	platform: string;
	status?: 'scheduled' | 'published' | 'posted' | 'pending' | 'draft' | 'cancelled';
	content_promotion_accounts?: string;
	content_hashtags?: string;
	content_themes?: string;
	created_at?: string;
	updated_at?: string;
}

export interface Template {
	id: string;
	content_text: string;
	type: string;
	purpose_description?: string;
	created_at?: string;
	updated_at?: string;
}
