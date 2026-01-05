// src/lib/types/questions.ts
// Type definitions for questions and comments system

// =============================================================================
// User Types
// =============================================================================

export interface User {
	id: string;
	email?: string;
}

export interface Profile {
	external_id: string;
	enneagram: number | null;
}

// =============================================================================
// Comment Types
// =============================================================================

export interface CommentLike {
	id: number;
	comment_id: number;
	user_id: string;
}

export interface Comment {
	id: number;
	comment: string;
	author_id: string | null;
	parent_id: number;
	parent_type: 'question' | 'comment';
	created_at: string;
	modified_at: string | null;
	removed: boolean;
	es_id: string | null;
	fingerprint: string | null;
	comment_count: number;
	ip?: string;
	profiles?: Profile | null;
	profiles_demo?: Profile | null;
	comment_like?: CommentLike[];
	comment_like_demo?: CommentLike[];
	comments?: Comment[];
}

export interface AIComment {
	id: number;
	question_id: number;
	enneagram: number;
	enneagram_type: number;
	comment: string;
	created_at: string;
}

// =============================================================================
// Question Types
// =============================================================================

export interface Subscription {
	id: number;
	question_id: number;
	user_id: string;
}

export interface Question {
	id: number;
	question: string;
	question_formatted?: string;
	url: string;
	context?: string;
	author_id?: string;
	created_at: string;
	modified_at?: string;
	removed: boolean;
	flagged: boolean;
	comment_count: number;
	es_id?: string;
	img_url?: string;
	subscriptions?: Subscription[];
	subscriptions_demo?: Subscription[];
}

export interface QuestionCategory {
	id: number;
	category_name: string;
}

export interface QuestionTag {
	id: number;
	question_id: number;
	tag_id: number;
	question_categories: QuestionCategory;
}

export interface Link {
	id: number;
	url: string;
	domain_id: number;
	question_id: number;
	meta_title?: string;
	meta_description?: string;
	meta_image?: string;
	clicks: number;
	created_at: string;
	updated_at: string;
}

export interface FlagReason {
	id: number;
	reason: string;
}

// =============================================================================
// Page Data Types
// =============================================================================

export interface QuestionFlags {
	userHasAnswered: boolean;
	userSignedIn: boolean;
}

export interface QuestionPageData {
	question: Question;
	comments: Comment[];
	removedComments: Comment[];
	comment_count: number;
	removed_comment_count: number;
	questionTags: QuestionTag[];
	user: User | null;
	flags: QuestionFlags;
	aiComments: AIComment[] | null;
	ai_comments?: AIComment[] | null;
	links: Link[] | null;
	links_count: number;
	flagReasons: FlagReason[];
}

export interface QuestionsListData {
	user: User | null;
	canAskQuestion: boolean;
	subcategoryTags: QuestionCategory[];
	questionsAndTags: QuestionWithTag[];
	totalQuestions: number;
	totalAnswers: number;
	currentPage: number;
	hasMore: boolean;
	selectedCategory: string | null;
}

export interface QuestionWithTag {
	id: number;
	url: string;
	question: string;
	question_formatted?: string;
	comment_count: number;
	created_at: string;
	tag_id?: number;
	tag_name?: string;
}

// =============================================================================
// Component Props Types
// =============================================================================

export interface CommentProps {
	user: User | null;
	comment: Comment;
	parentData: QuestionPageData;
	questionId: number;
}

export interface CommentsProps {
	parentType: 'question' | 'comment';
	user: User | null;
	questionId: number;
	comments: Comment[];
	comment_count: number;
	parentData: QuestionPageData | Comment;
	key?: number;
	onCommentsUpdate?: (comments: Comment[]) => void;
}

export interface InteractProps {
	parentType: 'question' | 'comment';
	data: QuestionPageData;
	user: User | null;
	questionId: number;
	qrCodeUrl: string;
	qrCodeSize: string;
}

export interface QuestionContentProps {
	data: QuestionPageData;
	user: User | null;
}

export interface SortCommentsProps {
	data: QuestionPageData;
	size?: 'large' | 'medium' | 'small';
}

export interface AICommentsProps {
	parentType: 'question' | 'comment';
	data: QuestionPageData;
	showAiComments?: boolean;
}

// =============================================================================
// API Response Types
// =============================================================================

export interface CommentCreateData {
	comment: string;
	parent_id: number;
	author_id: string | null;
	comment_count: number;
	ip: string;
	parent_type: 'question' | 'comment';
	es_id: string | null;
	fingerprint: string | null;
}

export interface OGData {
	title?: string;
	description?: string;
	image?: string;
	url?: string;
}
