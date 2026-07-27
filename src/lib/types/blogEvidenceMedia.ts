// src/lib/types/blogEvidenceMedia.ts
export type BlogEvidenceKind = 'quote-portrait' | 'source-portrait' | 'moment';

export type BlogEvidenceRightsStatus = 'licensed' | 'public-domain' | 'fair-use' | 'permission';

export interface BlogEvidenceSource {
	name: string;
	url: string;
	author?: string;
	publisher?: string;
	date_published?: string;
	locator?: string;
}

export interface BlogEvidenceRights {
	status: BlogEvidenceRightsStatus;
	creator: string;
	rights_holder?: string;
	license?: string;
	license_url?: string;
	attribution: string;
	modifications: string[];
	retrieved_at: string;
	fair_use?: {
		purpose: string;
		nature: string;
		amount: string;
		market_effect: string;
		risk: 'low' | 'medium' | 'high';
		legal_review: 'not-required' | 'recommended' | 'required';
	};
}

export interface BlogEvidenceMedia {
	id: string;
	blog_slug: string;
	kind: BlogEvidenceKind;
	label: string;
	image: {
		src: string;
		alt: string;
		width: number;
		height: number;
		object_position?: string;
		source: BlogEvidenceSource;
		rights: BlogEvidenceRights;
	};
	quote?: {
		text: string;
		speaker: string;
		speaker_role?: string;
		source: BlogEvidenceSource;
	};
	caption?: string;
	context?: string;
	presentation?: {
		variant?: 'feature' | 'compact' | 'portrait';
		portrait_side?: 'left' | 'right';
	};
}
