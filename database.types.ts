// database.types.ts
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
	// Allows to automatically instantiate createClient with right options
	// instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
	__InternalSupabase: {
		PostgrestVersion: '10.2.0 (e07807d)';
	};
	public: {
		Tables: {
			addresses: {
				Row: {
					address_line_1: string | null;
					address_line_2: string | null;
					city: string | null;
					country: string | null;
					created_at: string;
					extra_details: Json | null;
					id: number;
					latitude: number | null;
					longitude: number | null;
					name: string | null;
					postal_code: string | null;
					state: string | null;
					updated_at: string | null;
				};
				Insert: {
					address_line_1?: string | null;
					address_line_2?: string | null;
					city?: string | null;
					country?: string | null;
					created_at?: string;
					extra_details?: Json | null;
					id?: number;
					latitude?: number | null;
					longitude?: number | null;
					name?: string | null;
					postal_code?: string | null;
					state?: string | null;
					updated_at?: string | null;
				};
				Update: {
					address_line_1?: string | null;
					address_line_2?: string | null;
					city?: string | null;
					country?: string | null;
					created_at?: string;
					extra_details?: Json | null;
					id?: number;
					latitude?: number | null;
					longitude?: number | null;
					name?: string | null;
					postal_code?: string | null;
					state?: string | null;
					updated_at?: string | null;
				};
				Relationships: [];
			};
			admin_settings: {
				Row: {
					created_at: string;
					id: number;
					type: string | null;
					value: boolean | null;
				};
				Insert: {
					created_at?: string;
					id?: number;
					type?: string | null;
					value?: boolean | null;
				};
				Update: {
					created_at?: string;
					id?: number;
					type?: string | null;
					value?: boolean | null;
				};
				Relationships: [];
			};
			blog_comments: {
				Row: {
					author_id: string | null;
					blog_link: string | null;
					blog_type: string | null;
					comment: string | null;
					created_at: string;
					fingerprint: string | null;
					id: number;
					ip: string | null;
				};
				Insert: {
					author_id?: string | null;
					blog_link?: string | null;
					blog_type?: string | null;
					comment?: string | null;
					created_at?: string;
					fingerprint?: string | null;
					id?: number;
					ip?: string | null;
				};
				Update: {
					author_id?: string | null;
					blog_link?: string | null;
					blog_type?: string | null;
					comment?: string | null;
					created_at?: string;
					fingerprint?: string | null;
					id?: number;
					ip?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'blog_comments_author_id_fkey';
						columns: ['author_id'];
						isOneToOne: false;
						referencedRelation: 'profiles';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'blog_comments_fingerprint_fkey';
						columns: ['fingerprint'];
						isOneToOne: false;
						referencedRelation: 'visitors';
						referencedColumns: ['fingerprint'];
					}
				];
			};
			blogs_famous_people_history: {
				Row: {
					changed_at: string;
					changed_by: string | null;
					famous_people_id: number;
					id: number;
					new_content: string | null;
					old_content: string | null;
				};
				Insert: {
					changed_at?: string;
					changed_by?: string | null;
					famous_people_id: number;
					id?: number;
					new_content?: string | null;
					old_content?: string | null;
				};
				Update: {
					changed_at?: string;
					changed_by?: string | null;
					famous_people_id?: number;
					id?: number;
					new_content?: string | null;
					old_content?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'blogs_famous_people_history_famous_people_id_fkey';
						columns: ['famous_people_id'];
						isOneToOne: false;
						referencedRelation: 'blogs_famous_people';
						referencedColumns: ['id'];
					}
				];
			};
			blogs_famous_people: {
				Row: {
					author: string | null;
					changefreq: string | null;
					content: string | null;
					created_at: string;
					date: string | null;
					description: string | null;
					enneagram: string | null;
					id: number;
					instagram: string | null;
					jsonld_snippet: Json | null;
					lastmod: string | null;
					loc: string | null;
					meta_title: string | null;
					person: string | null;
					priority: string | null;
					published: boolean | null;
					suggestions: Json | null;
					tiktok: string | null;
					title: string | null;
					twitter: string | null;
					type: Json | null;
					wikipedia: string | null;
				};
				Insert: {
					author?: string | null;
					changefreq?: string | null;
					content?: string | null;
					created_at?: string;
					date?: string | null;
					description?: string | null;
					enneagram?: string | null;
					id?: number;
					instagram?: string | null;
					jsonld_snippet?: Json | null;
					lastmod?: string | null;
					loc?: string | null;
					meta_title?: string | null;
					person?: string | null;
					priority?: string | null;
					published?: boolean | null;
					suggestions?: Json | null;
					tiktok?: string | null;
					title?: string | null;
					twitter?: string | null;
					type?: Json | null;
					wikipedia?: string | null;
				};
				Update: {
					author?: string | null;
					changefreq?: string | null;
					content?: string | null;
					created_at?: string;
					date?: string | null;
					description?: string | null;
					enneagram?: string | null;
					id?: number;
					instagram?: string | null;
					jsonld_snippet?: Json | null;
					lastmod?: string | null;
					loc?: string | null;
					meta_title?: string | null;
					person?: string | null;
					priority?: string | null;
					published?: boolean | null;
					suggestions?: Json | null;
					tiktok?: string | null;
					title?: string | null;
					twitter?: string | null;
					type?: Json | null;
					wikipedia?: string | null;
				};
				Relationships: [];
			};
			campaigns: {
				Row: {
					campaign_hashtags: string | null;
					campaign_promotion_accounts: string | null;
					color: string;
					created_at: string;
					description: string | null;
					end_date: string;
					id: string;
					name: string;
					start_date: string;
					target_audience: string | null;
					target_hashtags: string | null;
					themes_and_topics: string | null;
					updated_at: string;
				};
				Insert: {
					campaign_hashtags?: string | null;
					campaign_promotion_accounts?: string | null;
					color: string;
					created_at?: string;
					description?: string | null;
					end_date: string;
					id?: string;
					name: string;
					start_date: string;
					target_audience?: string | null;
					target_hashtags?: string | null;
					themes_and_topics?: string | null;
					updated_at?: string;
				};
				Update: {
					campaign_hashtags?: string | null;
					campaign_promotion_accounts?: string | null;
					color?: string;
					created_at?: string;
					description?: string | null;
					end_date?: string;
					id?: string;
					name?: string;
					start_date?: string;
					target_audience?: string | null;
					target_hashtags?: string | null;
					themes_and_topics?: string | null;
					updated_at?: string;
				};
				Relationships: [];
			};
			coaching_waitlist: {
				Row: {
					created_at: string | null;
					email: string;
					enneagram_type: string | null;
					id: string;
					name: string;
					updated_at: string | null;
				};
				Insert: {
					created_at?: string | null;
					email: string;
					enneagram_type?: string | null;
					id?: string;
					name: string;
					updated_at?: string | null;
				};
				Update: {
					created_at?: string | null;
					email?: string;
					enneagram_type?: string | null;
					id?: string;
					name?: string;
					updated_at?: string | null;
				};
				Relationships: [];
			};
			coaching_waitlist_campaigns: {
				Row: {
					campaign_description: string | null;
					campaign_name: string;
					created_at: string | null;
					end_date: string | null;
					id: string;
					start_date: string | null;
					updated_at: string | null;
				};
				Insert: {
					campaign_description?: string | null;
					campaign_name: string;
					created_at?: string | null;
					end_date?: string | null;
					id?: string;
					start_date?: string | null;
					updated_at?: string | null;
				};
				Update: {
					campaign_description?: string | null;
					campaign_name?: string;
					created_at?: string | null;
					end_date?: string | null;
					id?: string;
					start_date?: string | null;
					updated_at?: string | null;
				};
				Relationships: [];
			};
			coaching_waitlist_metadata: {
				Row: {
					created_at: string | null;
					id: string;
					ip_address: string | null;
					source: string | null;
					user_agent: string | null;
					utm_campaign: string | null;
					utm_content: string | null;
					utm_medium: string | null;
					waitlist_id: string;
				};
				Insert: {
					created_at?: string | null;
					id?: string;
					ip_address?: string | null;
					source?: string | null;
					user_agent?: string | null;
					utm_campaign?: string | null;
					utm_content?: string | null;
					utm_medium?: string | null;
					waitlist_id: string;
				};
				Update: {
					created_at?: string | null;
					id?: string;
					ip_address?: string | null;
					source?: string | null;
					user_agent?: string | null;
					utm_campaign?: string | null;
					utm_content?: string | null;
					utm_medium?: string | null;
					waitlist_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'coaching_waitlist_metadata_waitlist_id_fkey';
						columns: ['waitlist_id'];
						isOneToOne: false;
						referencedRelation: 'coaching_waitlist';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'coaching_waitlist_metadata_waitlist_id_fkey';
						columns: ['waitlist_id'];
						isOneToOne: false;
						referencedRelation: 'coaching_waitlist_view';
						referencedColumns: ['id'];
					}
				];
			};
			comment_like: {
				Row: {
					comment_id: number | null;
					created_at: string | null;
					id: number;
					user_id: string | null;
				};
				Insert: {
					comment_id?: number | null;
					created_at?: string | null;
					id?: number;
					user_id?: string | null;
				};
				Update: {
					comment_id?: number | null;
					created_at?: string | null;
					id?: number;
					user_id?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'comment_like_comment_id_fkey';
						columns: ['comment_id'];
						isOneToOne: false;
						referencedRelation: 'comments';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'comment_like_user_id_fkey';
						columns: ['user_id'];
						isOneToOne: false;
						referencedRelation: 'profiles';
						referencedColumns: ['id'];
					}
				];
			};
			comment_like_demo: {
				Row: {
					comment_id: number | null;
					created_at: string | null;
					id: number;
					user_id: string | null;
				};
				Insert: {
					comment_id?: number | null;
					created_at?: string | null;
					id?: number;
					user_id?: string | null;
				};
				Update: {
					comment_id?: number | null;
					created_at?: string | null;
					id?: number;
					user_id?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'comment_like_demo_comment_id_fkey';
						columns: ['comment_id'];
						isOneToOne: false;
						referencedRelation: 'comments_demo';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'comment_like_demo_user_id_fkey';
						columns: ['user_id'];
						isOneToOne: false;
						referencedRelation: 'profiles_demo';
						referencedColumns: ['id'];
					}
				];
			};
			comments: {
				Row: {
					author_id: string | null;
					comment: string | null;
					comment_count: number | null;
					created_at: string | null;
					es_id: string | null;
					fingerprint: string | null;
					id: number;
					ip: string | null;
					like_count: number | null;
					modified_at: string | null;
					parent_id: number | null;
					parent_type: string | null;
					removed: boolean;
					removed_at: string | null;
				};
				Insert: {
					author_id?: string | null;
					comment?: string | null;
					comment_count?: number | null;
					created_at?: string | null;
					es_id?: string | null;
					fingerprint?: string | null;
					id?: number;
					ip?: string | null;
					like_count?: number | null;
					modified_at?: string | null;
					parent_id?: number | null;
					parent_type?: string | null;
					removed?: boolean;
					removed_at?: string | null;
				};
				Update: {
					author_id?: string | null;
					comment?: string | null;
					comment_count?: number | null;
					created_at?: string | null;
					es_id?: string | null;
					fingerprint?: string | null;
					id?: number;
					ip?: string | null;
					like_count?: number | null;
					modified_at?: string | null;
					parent_id?: number | null;
					parent_type?: string | null;
					removed?: boolean;
					removed_at?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'comments_author_id_fkey';
						columns: ['author_id'];
						isOneToOne: false;
						referencedRelation: 'profiles';
						referencedColumns: ['id'];
					}
				];
			};
			comments_ai: {
				Row: {
					comment: string | null;
					created_at: string;
					enneagram_type: string | null;
					id: number;
					question_id: number | null;
				};
				Insert: {
					comment?: string | null;
					created_at?: string;
					enneagram_type?: string | null;
					id?: number;
					question_id?: number | null;
				};
				Update: {
					comment?: string | null;
					created_at?: string;
					enneagram_type?: string | null;
					id?: number;
					question_id?: number | null;
				};
				Relationships: [];
			};
			comments_ai_demo: {
				Row: {
					comment: string | null;
					created_at: string;
					enneagram_type: string | null;
					id: number;
					question_id: number | null;
				};
				Insert: {
					comment?: string | null;
					created_at?: string;
					enneagram_type?: string | null;
					id?: number;
					question_id?: number | null;
				};
				Update: {
					comment?: string | null;
					created_at?: string;
					enneagram_type?: string | null;
					id?: number;
					question_id?: number | null;
				};
				Relationships: [];
			};
			comments_demo: {
				Row: {
					author_id: string | null;
					comment: string | null;
					comment_count: number | null;
					created_at: string | null;
					es_id: string | null;
					fingerprint: string | null;
					id: number;
					ip: string | null;
					like_count: number | null;
					modified_at: string | null;
					parent_id: number | null;
					parent_type: string | null;
				};
				Insert: {
					author_id?: string | null;
					comment?: string | null;
					comment_count?: number | null;
					created_at?: string | null;
					es_id?: string | null;
					fingerprint?: string | null;
					id?: number;
					ip?: string | null;
					like_count?: number | null;
					modified_at?: string | null;
					parent_id?: number | null;
					parent_type?: string | null;
				};
				Update: {
					author_id?: string | null;
					comment?: string | null;
					comment_count?: number | null;
					created_at?: string | null;
					es_id?: string | null;
					fingerprint?: string | null;
					id?: number;
					ip?: string | null;
					like_count?: number | null;
					modified_at?: string | null;
					parent_id?: number | null;
					parent_type?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'comments_demo_author_id_fkey';
						columns: ['author_id'];
						isOneToOne: false;
						referencedRelation: 'profiles_demo';
						referencedColumns: ['id'];
					}
				];
			};
			content: {
				Row: {
					campaign_id: string | null;
					content_hashtags: string | null;
					content_promotion_accounts: string | null;
					content_text: string;
					content_themes: string | null;
					created_at: string;
					id: string;
					platform: string;
					scheduled_date: string;
					status: string;
					updated_at: string;
				};
				Insert: {
					campaign_id?: string | null;
					content_hashtags?: string | null;
					content_promotion_accounts?: string | null;
					content_text: string;
					content_themes?: string | null;
					created_at?: string;
					id?: string;
					platform: string;
					scheduled_date: string;
					status?: string;
					updated_at?: string;
				};
				Update: {
					campaign_id?: string | null;
					content_hashtags?: string | null;
					content_promotion_accounts?: string | null;
					content_text?: string;
					content_themes?: string | null;
					created_at?: string;
					id?: string;
					platform?: string;
					scheduled_date?: string;
					status?: string;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'content_campaign_id_fkey';
						columns: ['campaign_id'];
						isOneToOne: false;
						referencedRelation: 'campaigns';
						referencedColumns: ['id'];
					}
				];
			};
			content_community: {
				Row: {
					author: string | null;
					created_at: string;
					date: string | null;
					description: string | null;
					id: number;
					lastmod: string | null;
					loc: string | null;
					published: boolean | null;
					stageName: string | null;
					title: string | null;
					type: string | null;
				};
				Insert: {
					author?: string | null;
					created_at?: string;
					date?: string | null;
					description?: string | null;
					id?: number;
					lastmod?: string | null;
					loc?: string | null;
					published?: boolean | null;
					stageName?: string | null;
					title?: string | null;
					type?: string | null;
				};
				Update: {
					author?: string | null;
					created_at?: string;
					date?: string | null;
					description?: string | null;
					id?: number;
					lastmod?: string | null;
					loc?: string | null;
					published?: boolean | null;
					stageName?: string | null;
					title?: string | null;
					type?: string | null;
				};
				Relationships: [];
			};
			content_enneagram: {
				Row: {
					author: string | null;
					created_at: string;
					date: string | null;
					description: string | null;
					id: number;
					lastmod: string | null;
					loc: string | null;
					published: boolean | null;
					stageName: string | null;
					title: string | null;
					type: string | null;
				};
				Insert: {
					author?: string | null;
					created_at?: string;
					date?: string | null;
					description?: string | null;
					id?: number;
					lastmod?: string | null;
					loc?: string | null;
					published?: boolean | null;
					stageName?: string | null;
					title?: string | null;
					type?: string | null;
				};
				Update: {
					author?: string | null;
					created_at?: string;
					date?: string | null;
					description?: string | null;
					id?: number;
					lastmod?: string | null;
					loc?: string | null;
					published?: boolean | null;
					stageName?: string | null;
					title?: string | null;
					type?: string | null;
				};
				Relationships: [];
			};
			content_guides: {
				Row: {
					author: string | null;
					created_at: string;
					date: string | null;
					description: string | null;
					id: number;
					lastmod: string | null;
					loc: string | null;
					published: boolean | null;
					stageName: string | null;
					title: string | null;
					type: string | null;
				};
				Insert: {
					author?: string | null;
					created_at?: string;
					date?: string | null;
					description?: string | null;
					id?: number;
					lastmod?: string | null;
					loc?: string | null;
					published?: boolean | null;
					stageName?: string | null;
					title?: string | null;
					type?: string | null;
				};
				Update: {
					author?: string | null;
					created_at?: string;
					date?: string | null;
					description?: string | null;
					id?: number;
					lastmod?: string | null;
					loc?: string | null;
					published?: boolean | null;
					stageName?: string | null;
					title?: string | null;
					type?: string | null;
				};
				Relationships: [];
			};
			content_people: {
				Row: {
					author: string | null;
					created_at: string;
					date: string | null;
					description: string | null;
					id: number;
					lastmod: string | null;
					loc: string | null;
					published: boolean | null;
					stageName: string | null;
					title: string | null;
					type: string | null;
				};
				Insert: {
					author?: string | null;
					created_at?: string;
					date?: string | null;
					description?: string | null;
					id?: number;
					lastmod?: string | null;
					loc?: string | null;
					published?: boolean | null;
					stageName?: string | null;
					title?: string | null;
					type?: string | null;
				};
				Update: {
					author?: string | null;
					created_at?: string;
					date?: string | null;
					description?: string | null;
					id?: number;
					lastmod?: string | null;
					loc?: string | null;
					published?: boolean | null;
					stageName?: string | null;
					title?: string | null;
					type?: string | null;
				};
				Relationships: [];
			};
			email_update_table: {
				Row: {
					created_at: string;
					id: number;
					value: string | null;
				};
				Insert: {
					created_at?: string;
					id?: number;
					value?: string | null;
				};
				Update: {
					created_at?: string;
					id?: number;
					value?: string | null;
				};
				Relationships: [];
			};
			flag_reasons: {
				Row: {
					created_at: string;
					deleted_at: string | null;
					id: number;
					reason: string | null;
				};
				Insert: {
					created_at?: string;
					deleted_at?: string | null;
					id?: number;
					reason?: string | null;
				};
				Update: {
					created_at?: string;
					deleted_at?: string | null;
					id?: number;
					reason?: string | null;
				};
				Relationships: [];
			};
			flagged_comments: {
				Row: {
					cleared_at: string | null;
					comment_id: number | null;
					created_at: string;
					description: string | null;
					flagged_by: string | null;
					id: number;
					reason_id: number | null;
					removed_at: string | null;
				};
				Insert: {
					cleared_at?: string | null;
					comment_id?: number | null;
					created_at?: string;
					description?: string | null;
					flagged_by?: string | null;
					id?: number;
					reason_id?: number | null;
					removed_at?: string | null;
				};
				Update: {
					cleared_at?: string | null;
					comment_id?: number | null;
					created_at?: string;
					description?: string | null;
					flagged_by?: string | null;
					id?: number;
					reason_id?: number | null;
					removed_at?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'flagged_comments_comment_id_fkey';
						columns: ['comment_id'];
						isOneToOne: false;
						referencedRelation: 'comments';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'flagged_comments_flagged_by_fkey';
						columns: ['flagged_by'];
						isOneToOne: false;
						referencedRelation: 'profiles';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'flagged_comments_reason_id_fkey';
						columns: ['reason_id'];
						isOneToOne: false;
						referencedRelation: 'flag_reasons';
						referencedColumns: ['id'];
					}
				];
			};
			link_domain_owners: {
				Row: {
					created_at: string | null;
					email: string | null;
					first_name: string | null;
					id: number;
					last_name: string | null;
					linked_domain_id: number | null;
					updated_at: string | null;
				};
				Insert: {
					created_at?: string | null;
					email?: string | null;
					first_name?: string | null;
					id?: number;
					last_name?: string | null;
					linked_domain_id?: number | null;
					updated_at?: string | null;
				};
				Update: {
					created_at?: string | null;
					email?: string | null;
					first_name?: string | null;
					id?: number;
					last_name?: string | null;
					linked_domain_id?: number | null;
					updated_at?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'link_domain_owners_linked_domain_id_fkey';
						columns: ['linked_domain_id'];
						isOneToOne: false;
						referencedRelation: 'link_domains';
						referencedColumns: ['id'];
					}
				];
			};
			link_domains: {
				Row: {
					created_at: string | null;
					domain: string | null;
					id: number;
					updated_at: string | null;
				};
				Insert: {
					created_at?: string | null;
					domain?: string | null;
					id?: number;
					updated_at?: string | null;
				};
				Update: {
					created_at?: string | null;
					domain?: string | null;
					id?: number;
					updated_at?: string | null;
				};
				Relationships: [];
			};
			link_drops: {
				Row: {
					address_id: number | null;
					created_at: string;
					external_id: string;
					id: number;
					number_of_drops: number | null;
					number_of_hits: number | null;
					question_id: number | null;
				};
				Insert: {
					address_id?: number | null;
					created_at?: string;
					external_id: string;
					id?: number;
					number_of_drops?: number | null;
					number_of_hits?: number | null;
					question_id?: number | null;
				};
				Update: {
					address_id?: number | null;
					created_at?: string;
					external_id?: string;
					id?: number;
					number_of_drops?: number | null;
					number_of_hits?: number | null;
					question_id?: number | null;
				};
				Relationships: [
					{
						foreignKeyName: 'link_drops_address_id_fkey';
						columns: ['address_id'];
						isOneToOne: false;
						referencedRelation: 'addresses';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'link_drops_question_id_fkey';
						columns: ['question_id'];
						isOneToOne: false;
						referencedRelation: 'questions';
						referencedColumns: ['id'];
					}
				];
			};
			links: {
				Row: {
					clicks: number | null;
					created_at: string | null;
					domain_id: number;
					id: number;
					meta_description: string | null;
					meta_image: string | null;
					meta_title: string | null;
					question_id: number | null;
					summary: string | null;
					updated_at: string | null;
					url: string | null;
				};
				Insert: {
					clicks?: number | null;
					created_at?: string | null;
					domain_id: number;
					id?: number;
					meta_description?: string | null;
					meta_image?: string | null;
					meta_title?: string | null;
					question_id?: number | null;
					summary?: string | null;
					updated_at?: string | null;
					url?: string | null;
				};
				Update: {
					clicks?: number | null;
					created_at?: string | null;
					domain_id?: number;
					id?: number;
					meta_description?: string | null;
					meta_image?: string | null;
					meta_title?: string | null;
					question_id?: number | null;
					summary?: string | null;
					updated_at?: string | null;
					url?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'links_domain_id_fkey';
						columns: ['domain_id'];
						isOneToOne: false;
						referencedRelation: 'link_domains';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'links_question_id_fkey';
						columns: ['question_id'];
						isOneToOne: false;
						referencedRelation: 'questions';
						referencedColumns: ['id'];
					}
				];
			};
			'new-words': {
				Row: {
					created_at: string | null;
					id: number;
					stem: string | null;
					word: string | null;
				};
				Insert: {
					created_at?: string | null;
					id?: number;
					stem?: string | null;
					word?: string | null;
				};
				Update: {
					created_at?: string | null;
					id?: number;
					stem?: string | null;
					word?: string | null;
				};
				Relationships: [];
			};
			permissions: {
				Row: {
					can_ask_question: boolean | null;
					created_at: string;
					id: number;
					profile_id: string | null;
				};
				Insert: {
					can_ask_question?: boolean | null;
					created_at?: string;
					id?: number;
					profile_id?: string | null;
				};
				Update: {
					can_ask_question?: boolean | null;
					created_at?: string;
					id?: number;
					profile_id?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'permissions_profile_id_fkey';
						columns: ['profile_id'];
						isOneToOne: false;
						referencedRelation: 'profiles';
						referencedColumns: ['id'];
					}
				];
			};
			permissions_demo: {
				Row: {
					can_ask_question: boolean | null;
					created_at: string;
					id: number;
					profile_id: string | null;
				};
				Insert: {
					can_ask_question?: boolean | null;
					created_at?: string;
					id?: number;
					profile_id?: string | null;
				};
				Update: {
					can_ask_question?: boolean | null;
					created_at?: string;
					id?: number;
					profile_id?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'permissions_demo_profile_id_fkey';
						columns: ['profile_id'];
						isOneToOne: false;
						referencedRelation: 'profiles_demo';
						referencedColumns: ['id'];
					}
				];
			};
			person_suggestions: {
				Row: {
					created_at: string;
					email: string | null;
					id: number;
					person_name: string | null;
				};
				Insert: {
					created_at?: string;
					email?: string | null;
					id?: number;
					person_name?: string | null;
				};
				Update: {
					created_at?: string;
					email?: string | null;
					id?: number;
					person_name?: string | null;
				};
				Relationships: [];
			};
			profiles: {
				Row: {
					admin: boolean | null;
					avatar_url: string | null;
					canAskQuestion: boolean | null;
					created_at: string | null;
					email: string | null;
					enneagram: string | null;
					external_id: string | null;
					first_name: string | null;
					id: string;
					last_name: string | null;
					username: string | null;
					website: string | null;
				};
				Insert: {
					admin?: boolean | null;
					avatar_url?: string | null;
					canAskQuestion?: boolean | null;
					created_at?: string | null;
					email?: string | null;
					enneagram?: string | null;
					external_id?: string | null;
					first_name?: string | null;
					id: string;
					last_name?: string | null;
					username?: string | null;
					website?: string | null;
				};
				Update: {
					admin?: boolean | null;
					avatar_url?: string | null;
					canAskQuestion?: boolean | null;
					created_at?: string | null;
					email?: string | null;
					enneagram?: string | null;
					external_id?: string | null;
					first_name?: string | null;
					id?: string;
					last_name?: string | null;
					username?: string | null;
					website?: string | null;
				};
				Relationships: [];
			};
			profiles_demo: {
				Row: {
					admin: boolean | null;
					avatar_url: string | null;
					canAskQuestion: boolean | null;
					created_at: string | null;
					email: string | null;
					enneagram: string | null;
					external_id: string | null;
					first_name: string | null;
					id: string;
					last_name: string | null;
					username: string | null;
					website: string | null;
				};
				Insert: {
					admin?: boolean | null;
					avatar_url?: string | null;
					canAskQuestion?: boolean | null;
					created_at?: string | null;
					email?: string | null;
					enneagram?: string | null;
					external_id?: string | null;
					first_name?: string | null;
					id?: string;
					last_name?: string | null;
					username?: string | null;
					website?: string | null;
				};
				Update: {
					admin?: boolean | null;
					avatar_url?: string | null;
					canAskQuestion?: boolean | null;
					created_at?: string | null;
					email?: string | null;
					enneagram?: string | null;
					external_id?: string | null;
					first_name?: string | null;
					id?: string;
					last_name?: string | null;
					username?: string | null;
					website?: string | null;
				};
				Relationships: [];
			};
			question_categories: {
				Row: {
					category_name: string;
					id: number;
					level: number | null;
					parent_id: number | null;
				};
				Insert: {
					category_name: string;
					id: number;
					level?: number | null;
					parent_id?: number | null;
				};
				Update: {
					category_name?: string;
					id?: number;
					level?: number | null;
					parent_id?: number | null;
				};
				Relationships: [
					{
						foreignKeyName: 'question_categories_parent_id_fkey';
						columns: ['parent_id'];
						isOneToOne: false;
						referencedRelation: 'question_categories';
						referencedColumns: ['id'];
					}
				];
			};
			question_category_tags: {
				Row: {
					question_id: number;
					tag_id: number;
				};
				Insert: {
					question_id: number;
					tag_id: number;
				};
				Update: {
					question_id?: number;
					tag_id?: number;
				};
				Relationships: [
					{
						foreignKeyName: 'question_category_tags_tag_id_fkey';
						columns: ['tag_id'];
						isOneToOne: false;
						referencedRelation: 'question_categories';
						referencedColumns: ['id'];
					}
				];
			};
			question_keywords: {
				Row: {
					created_at: string;
					id: number;
					keywords: string | null;
					question_id: number | null;
				};
				Insert: {
					created_at?: string;
					id?: number;
					keywords?: string | null;
					question_id?: number | null;
				};
				Update: {
					created_at?: string;
					id?: number;
					keywords?: string | null;
					question_id?: number | null;
				};
				Relationships: [
					{
						foreignKeyName: 'question_keywords_question_id_fkey';
						columns: ['question_id'];
						isOneToOne: false;
						referencedRelation: 'questions';
						referencedColumns: ['id'];
					}
				];
			};
			question_subcategories: {
				Row: {
					id: number;
					parent_id: number | null;
					subcategory_name: string;
				};
				Insert: {
					id?: number;
					parent_id?: number | null;
					subcategory_name: string;
				};
				Update: {
					id?: number;
					parent_id?: number | null;
					subcategory_name?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'question_subcategories_parent_id_fkey';
						columns: ['parent_id'];
						isOneToOne: false;
						referencedRelation: 'question_subcategories';
						referencedColumns: ['id'];
					}
				];
			};
			question_tag: {
				Row: {
					subcategory_id: number | null;
					tag_id: number;
					tag_name: string;
				};
				Insert: {
					subcategory_id?: number | null;
					tag_id?: number;
					tag_name: string;
				};
				Update: {
					subcategory_id?: number | null;
					tag_id?: number;
					tag_name?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'question_tag_subcategory_id_fkey';
						columns: ['subcategory_id'];
						isOneToOne: false;
						referencedRelation: 'question_subcategories';
						referencedColumns: ['id'];
					}
				];
			};
			question_tags: {
				Row: {
					created_at: string | null;
					question_id: number;
					tag_id: number;
				};
				Insert: {
					created_at?: string | null;
					question_id: number;
					tag_id: number;
				};
				Update: {
					created_at?: string | null;
					question_id?: number;
					tag_id?: number;
				};
				Relationships: [
					{
						foreignKeyName: 'question_tags_question_id_fkey';
						columns: ['question_id'];
						isOneToOne: false;
						referencedRelation: 'questions';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'question_tags_tag_id_fkey';
						columns: ['tag_id'];
						isOneToOne: false;
						referencedRelation: 'question_tag';
						referencedColumns: ['tag_id'];
					}
				];
			};
			question_tags_demo: {
				Row: {
					question_id: number;
					tag_id: number;
				};
				Insert: {
					question_id: number;
					tag_id: number;
				};
				Update: {
					question_id?: number;
					tag_id?: number;
				};
				Relationships: [
					{
						foreignKeyName: 'question_tags_demo_question_id_fkey';
						columns: ['question_id'];
						isOneToOne: false;
						referencedRelation: 'questions_demo';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'question_tags_demo_tag_id_fkey';
						columns: ['tag_id'];
						isOneToOne: false;
						referencedRelation: 'question_tag';
						referencedColumns: ['tag_id'];
					}
				];
			};
			questions: {
				Row: {
					author_id: string | null;
					comment_count: number | null;
					context: string | null;
					created_at: string;
					data: Json | null;
					es_id: string | null;
					flagged: boolean | null;
					id: number;
					img_url: string | null;
					last_comment_date: string | null;
					name: string | null;
					question: string | null;
					question_formatted: string | null;
					removed: boolean | null;
					tagged: boolean | null;
					updated_at: string;
					url: string | null;
				};
				Insert: {
					author_id?: string | null;
					comment_count?: number | null;
					context?: string | null;
					created_at?: string;
					data?: Json | null;
					es_id?: string | null;
					flagged?: boolean | null;
					id?: number;
					img_url?: string | null;
					last_comment_date?: string | null;
					name?: string | null;
					question?: string | null;
					question_formatted?: string | null;
					removed?: boolean | null;
					tagged?: boolean | null;
					updated_at?: string;
					url?: string | null;
				};
				Update: {
					author_id?: string | null;
					comment_count?: number | null;
					context?: string | null;
					created_at?: string;
					data?: Json | null;
					es_id?: string | null;
					flagged?: boolean | null;
					id?: number;
					img_url?: string | null;
					last_comment_date?: string | null;
					name?: string | null;
					question?: string | null;
					question_formatted?: string | null;
					removed?: boolean | null;
					tagged?: boolean | null;
					updated_at?: string;
					url?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'questions_author_id_fkey';
						columns: ['author_id'];
						isOneToOne: false;
						referencedRelation: 'profiles';
						referencedColumns: ['id'];
					}
				];
			};
			questions_demo: {
				Row: {
					author_id: string | null;
					comment_count: number | null;
					context: string | null;
					created_at: string;
					data: Json | null;
					es_id: string | null;
					id: number;
					img_url: string | null;
					name: string | null;
					question: string | null;
					question_formatted: string | null;
					removed: boolean | null;
					updated_at: string;
					url: string | null;
				};
				Insert: {
					author_id?: string | null;
					comment_count?: number | null;
					context?: string | null;
					created_at?: string;
					data?: Json | null;
					es_id?: string | null;
					id?: number;
					img_url?: string | null;
					name?: string | null;
					question?: string | null;
					question_formatted?: string | null;
					removed?: boolean | null;
					updated_at?: string;
					url?: string | null;
				};
				Update: {
					author_id?: string | null;
					comment_count?: number | null;
					context?: string | null;
					created_at?: string;
					data?: Json | null;
					es_id?: string | null;
					id?: number;
					img_url?: string | null;
					name?: string | null;
					question?: string | null;
					question_formatted?: string | null;
					removed?: boolean | null;
					updated_at?: string;
					url?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'questions_demo_author_id_fkey';
						columns: ['author_id'];
						isOneToOne: false;
						referencedRelation: 'profiles_demo';
						referencedColumns: ['id'];
					}
				];
			};
			signups: {
				Row: {
					created_at: string | null;
					email: string | null;
					id: number;
					name: string | null;
					unsubscribe_id: string | null;
					unsubscribe_iv: string | null;
					unsubscribed_date: string | null;
				};
				Insert: {
					created_at?: string | null;
					email?: string | null;
					id?: number;
					name?: string | null;
					unsubscribe_id?: string | null;
					unsubscribe_iv?: string | null;
					unsubscribed_date?: string | null;
				};
				Update: {
					created_at?: string | null;
					email?: string | null;
					id?: number;
					name?: string | null;
					unsubscribe_id?: string | null;
					unsubscribe_iv?: string | null;
					unsubscribed_date?: string | null;
				};
				Relationships: [];
			};
			subscriptions: {
				Row: {
					created_at: string | null;
					id: number;
					question_id: number | null;
					user_id: string | null;
				};
				Insert: {
					created_at?: string | null;
					id?: number;
					question_id?: number | null;
					user_id?: string | null;
				};
				Update: {
					created_at?: string | null;
					id?: number;
					question_id?: number | null;
					user_id?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'subscriptions_question_id_fkey';
						columns: ['question_id'];
						isOneToOne: false;
						referencedRelation: 'questions';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'subscriptions_user_id_fkey';
						columns: ['user_id'];
						isOneToOne: false;
						referencedRelation: 'profiles';
						referencedColumns: ['id'];
					}
				];
			};
			subscriptions_demo: {
				Row: {
					created_at: string | null;
					id: number;
					question_id: number | null;
					user_id: string | null;
				};
				Insert: {
					created_at?: string | null;
					id?: number;
					question_id?: number | null;
					user_id?: string | null;
				};
				Update: {
					created_at?: string | null;
					id?: number;
					question_id?: number | null;
					user_id?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'subscriptions_demo_question_id_fkey';
						columns: ['question_id'];
						isOneToOne: false;
						referencedRelation: 'questions_demo';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'subscriptions_demo_user_id_fkey';
						columns: ['user_id'];
						isOneToOne: false;
						referencedRelation: 'profiles_demo';
						referencedColumns: ['id'];
					}
				];
			};
			templates: {
				Row: {
					content_text: string;
					created_at: string;
					id: string;
					purpose_description: string;
					type: string;
					updated_at: string;
				};
				Insert: {
					content_text: string;
					created_at?: string;
					id?: string;
					purpose_description: string;
					type: string;
					updated_at?: string;
				};
				Update: {
					content_text?: string;
					created_at?: string;
					id?: string;
					purpose_description?: string;
					type?: string;
					updated_at?: string;
				};
				Relationships: [];
			};
			use_demo_table: {
				Row: {
					value: boolean | null;
				};
				Insert: {
					value?: boolean | null;
				};
				Update: {
					value?: boolean | null;
				};
				Relationships: [];
			};
			user_socials: {
				Row: {
					created_at: string | null;
					facebook: string | null;
					id: number;
					instagram: string | null;
					linkedin: string | null;
					medium: string | null;
					meetup: string | null;
					quora: string | null;
					reddit: string | null;
					snapchat: string | null;
					substack: string | null;
					threads: string | null;
					tiktok: string | null;
					twitter: string | null;
					updated_at: string | null;
					youtube: string | null;
				};
				Insert: {
					created_at?: string | null;
					facebook?: string | null;
					id?: number;
					instagram?: string | null;
					linkedin?: string | null;
					medium?: string | null;
					meetup?: string | null;
					quora?: string | null;
					reddit?: string | null;
					snapchat?: string | null;
					substack?: string | null;
					threads?: string | null;
					tiktok?: string | null;
					twitter?: string | null;
					updated_at?: string | null;
					youtube?: string | null;
				};
				Update: {
					created_at?: string | null;
					facebook?: string | null;
					id?: number;
					instagram?: string | null;
					linkedin?: string | null;
					medium?: string | null;
					meetup?: string | null;
					quora?: string | null;
					reddit?: string | null;
					snapchat?: string | null;
					substack?: string | null;
					threads?: string | null;
					tiktok?: string | null;
					twitter?: string | null;
					updated_at?: string | null;
					youtube?: string | null;
				};
				Relationships: [];
			};
			visitors: {
				Row: {
					created_at: string;
					fingerprint: string;
					id: number;
					updated_at: string | null;
				};
				Insert: {
					created_at?: string;
					fingerprint: string;
					id?: number;
					updated_at?: string | null;
				};
				Update: {
					created_at?: string;
					fingerprint?: string;
					id?: number;
					updated_at?: string | null;
				};
				Relationships: [];
			};
		};
		Views: {
			coaching_waitlist_view: {
				Row: {
					created_at: string | null;
					email: string | null;
					enneagram_type: string | null;
					id: string | null;
					name: string | null;
					source: string | null;
					utm_campaign: string | null;
					utm_content: string | null;
					utm_medium: string | null;
				};
				Relationships: [];
			};
			distinct_question_categories: {
				Row: {
					tag_id: number | null;
				};
				Relationships: [
					{
						foreignKeyName: 'question_category_tags_tag_id_fkey';
						columns: ['tag_id'];
						isOneToOne: false;
						referencedRelation: 'question_categories';
						referencedColumns: ['id'];
					}
				];
			};
			distinct_question_tags: {
				Row: {
					tag_id: number | null;
				};
				Relationships: [
					{
						foreignKeyName: 'question_tags_tag_id_fkey';
						columns: ['tag_id'];
						isOneToOne: false;
						referencedRelation: 'question_tag';
						referencedColumns: ['tag_id'];
					}
				];
			};
			distinct_question_tags_demo: {
				Row: {
					tag_id: number | null;
				};
				Relationships: [
					{
						foreignKeyName: 'question_tags_demo_tag_id_fkey';
						columns: ['tag_id'];
						isOneToOne: false;
						referencedRelation: 'question_tag';
						referencedColumns: ['tag_id'];
					}
				];
			};
		};
		Functions: {
			can_see_comments: {
				Args: { questionid: number; userid: string; userip: string };
				Returns: boolean;
			};
			can_see_comments_2: {
				Args: { questionid: number; userfingerprint: string; userid: string };
				Returns: boolean;
			};
			can_see_comments_3: {
				Args: { questionid: number; userfingerprint: string; userid: string };
				Returns: boolean;
			};
			comments_last_30_days: {
				Args: Record<PropertyKey, never>;
				Returns: {
					days: string;
					number_modified: number;
					number_of_comments: number;
				}[];
			};
			daily_questions_stats: {
				Args: Record<PropertyKey, never>;
				Returns: {
					created_at: string;
					id: number;
					number_modified: number;
					number_of_comments: number;
					number_of_comments_today: number;
					question: string;
					url: string;
					user_email: string;
					user_external_id: string;
				}[];
			};
			decrement_like_count: {
				Args: { comment_id: number };
				Returns: undefined;
			};
			get_10_question_tags: {
				Args: Record<PropertyKey, never>;
				Returns: {
					author_id: string;
					comment_count: number;
					created_at: string;
					es_id: string;
					id: number;
					img_url: string;
					question: string;
					question_formatted: string;
					question_id: number;
					removed: boolean;
					rn: number;
					subcategory_id: number;
					tag_id: number;
					tag_name: string;
					updated_at: string;
					url: string;
				}[];
			};
			get_all_users: {
				Args: Record<PropertyKey, never>;
				Returns: {
					admin: boolean;
					aud: string;
					confirmation_sent_at: string;
					confirmed_at: string;
					created_at: string;
					email: string;
					enneagram: string;
					external_id: string;
					first_name: string;
					id: string;
					invited_at: string;
					last_name: string;
					last_sign_in_at: string;
					phone: string;
					role: string;
					username: string;
				}[];
			};
			get_categories: {
				Args: Record<PropertyKey, never>;
				Returns: {
					question_count: number;
					tag_name: string;
					tagid: number;
				}[];
			};
			get_category_children_structure: {
				Args: { input_category_name: string };
				Returns: Json;
			};
			get_category_hierarchy: {
				Args: Record<PropertyKey, never>;
				Returns: Json;
			};
			get_category_parent_structure: {
				Args: { input_category_name: string };
				Returns: Json;
			};
			get_category_questions: {
				Args: { slug: string };
				Returns: {
					author_id: string;
					comment_count: number;
					created_at: string;
					es_id: string;
					id: number;
					img_url: string;
					question: string;
					question_formatted: string;
					updated_at: string;
					url: string;
				}[];
			};
			get_children: {
				Args: { parent_id: number };
				Returns: Json;
			};
			get_questions_by_category: {
				Args: { p_category_id: number; p_limit?: number; p_offset?: number };
				Returns: {
					author_id: string;
					comment_count: number;
					created_at: string;
					es_id: string;
					id: number;
					question: string;
					question_formatted: string;
					tag_name: string;
					url: string;
				}[];
			};
			get_questions_page_data: {
				Args: {
					p_category_id?: number;
					p_limit?: number;
					p_offset?: number;
					p_user_id?: string;
				};
				Returns: Json;
			};
			get_user_question_comments: {
				Args: { authorid: string };
				Returns: {
					author_id: string;
					comment: string;
					comment_count: number;
					created_at: string;
					es_id: string;
					fingerprint: string;
					id: number;
					ip: string;
					like_count: number;
					parent_id: number;
					parent_type: string;
					question: string;
					question_formatted: string;
					url: string;
				}[];
			};
			get_user_question_comments2: {
				Args: { authorid: string };
				Returns: {
					author_id: string;
					comment: string;
					comment_count: number;
					created_at: string;
					es_id: string;
					fingerprint: string;
					id: number;
					ip: string;
					like_count: number;
					parent_id: number;
					parent_type: string;
					question: string;
					question_formatted: string;
					url: string;
				}[];
			};
			increment_clicks: {
				Args: { link_id: number };
				Returns: undefined;
			};
			increment_comment_count: {
				Args: { comment_parent_id: number };
				Returns: undefined;
			};
			increment_like_count: {
				Args: { comment_id: number };
				Returns: undefined;
			};
			increment_link_hit: {
				Args: { link_id: number };
				Returns: undefined;
			};
			insert_daily_row: {
				Args: Record<PropertyKey, never>;
				Returns: undefined;
			};
			install_available_extensions_and_test: {
				Args: Record<PropertyKey, never>;
				Returns: boolean;
			};
			parse_json_with_escapes: {
				Args: { json_text: string };
				Returns: Json;
			};
			question_with_comments: {
				Args: Record<PropertyKey, never> | { url: string };
				Returns: {
					author_id: string | null;
					comment_count: number | null;
					context: string | null;
					created_at: string;
					data: Json | null;
					es_id: string | null;
					flagged: boolean | null;
					id: number;
					img_url: string | null;
					last_comment_date: string | null;
					name: string | null;
					question: string | null;
					question_formatted: string | null;
					removed: boolean | null;
					tagged: boolean | null;
					updated_at: string;
					url: string | null;
				}[];
			};
			visitors_last_30_days: {
				Args: Record<PropertyKey, never>;
				Returns: {
					days: string;
					number_of_visitors: number;
				}[];
			};
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
	DefaultSchemaTableNameOrOptions extends
		| keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
				DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
		: never = never
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
			DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
			Row: infer R;
		}
		? R
		: never
	: DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
		? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
				Row: infer R;
			}
			? R
			: never
		: never;

export type TablesInsert<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema['Tables']
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
		: never = never
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Insert: infer I;
		}
		? I
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
		? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
				Insert: infer I;
			}
			? I
			: never
		: never;

export type TablesUpdate<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema['Tables']
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
		: never = never
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Update: infer U;
		}
		? U
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
		? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
				Update: infer U;
			}
			? U
			: never
		: never;

export type Enums<
	DefaultSchemaEnumNameOrOptions extends
		| keyof DefaultSchema['Enums']
		| { schema: keyof DatabaseWithoutInternals },
	EnumName extends DefaultSchemaEnumNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
		: never = never
> = DefaultSchemaEnumNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
	: DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
		? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
		: never;

export type CompositeTypes<
	PublicCompositeTypeNameOrOptions extends
		| keyof DefaultSchema['CompositeTypes']
		| { schema: keyof DatabaseWithoutInternals },
	CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
		: never = never
> = PublicCompositeTypeNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
	: PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
		? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
		: never;

export const Constants = {
	public: {
		Enums: {}
	}
} as const;
