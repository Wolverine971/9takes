export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      addresses: {
        Row: {
          address_line_1: string | null
          address_line_2: string | null
          city: string | null
          country: string | null
          created_at: string
          extra_details: Json | null
          id: number
          latitude: number | null
          longitude: number | null
          name: string | null
          postal_code: string | null
          state: string | null
          updated_at: string | null
        }
        Insert: {
          address_line_1?: string | null
          address_line_2?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          extra_details?: Json | null
          id?: number
          latitude?: number | null
          longitude?: number | null
          name?: string | null
          postal_code?: string | null
          state?: string | null
          updated_at?: string | null
        }
        Update: {
          address_line_1?: string | null
          address_line_2?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          extra_details?: Json | null
          id?: number
          latitude?: number | null
          longitude?: number | null
          name?: string | null
          postal_code?: string | null
          state?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      admin_settings: {
        Row: {
          created_at: string
          id: number
          type: string | null
          value: boolean | null
        }
        Insert: {
          created_at?: string
          id?: number
          type?: string | null
          value?: boolean | null
        }
        Update: {
          created_at?: string
          id?: number
          type?: string | null
          value?: boolean | null
        }
        Relationships: []
      }
      blog_comments: {
        Row: {
          author_id: string | null
          blog_link: string | null
          blog_type: string | null
          comment: string | null
          created_at: string
          fingerprint: string | null
          id: number
          ip: string | null
        }
        Insert: {
          author_id?: string | null
          blog_link?: string | null
          blog_type?: string | null
          comment?: string | null
          created_at?: string
          fingerprint?: string | null
          id?: number
          ip?: string | null
        }
        Update: {
          author_id?: string | null
          blog_link?: string | null
          blog_type?: string | null
          comment?: string | null
          created_at?: string
          fingerprint?: string | null
          id?: number
          ip?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_comments_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_comments_fingerprint_fkey"
            columns: ["fingerprint"]
            isOneToOne: false
            referencedRelation: "visitors"
            referencedColumns: ["fingerprint"]
          },
        ]
      }
      comment_like: {
        Row: {
          comment_id: number | null
          created_at: string | null
          id: number
          user_id: string | null
        }
        Insert: {
          comment_id?: number | null
          created_at?: string | null
          id?: number
          user_id?: string | null
        }
        Update: {
          comment_id?: number | null
          created_at?: string | null
          id?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comment_like_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comment_like_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      comment_like_demo: {
        Row: {
          comment_id: number | null
          created_at: string | null
          id: number
          user_id: string | null
        }
        Insert: {
          comment_id?: number | null
          created_at?: string | null
          id?: number
          user_id?: string | null
        }
        Update: {
          comment_id?: number | null
          created_at?: string | null
          id?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comment_like_demo_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments_demo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comment_like_demo_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles_demo"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          author_id: string | null
          comment: string | null
          comment_count: number | null
          created_at: string | null
          es_id: string | null
          fingerprint: string | null
          id: number
          ip: string | null
          like_count: number | null
          modified_at: string | null
          parent_id: number | null
          parent_type: string | null
          removed: boolean
          removed_at: string | null
        }
        Insert: {
          author_id?: string | null
          comment?: string | null
          comment_count?: number | null
          created_at?: string | null
          es_id?: string | null
          fingerprint?: string | null
          id?: number
          ip?: string | null
          like_count?: number | null
          modified_at?: string | null
          parent_id?: number | null
          parent_type?: string | null
          removed?: boolean
          removed_at?: string | null
        }
        Update: {
          author_id?: string | null
          comment?: string | null
          comment_count?: number | null
          created_at?: string | null
          es_id?: string | null
          fingerprint?: string | null
          id?: number
          ip?: string | null
          like_count?: number | null
          modified_at?: string | null
          parent_id?: number | null
          parent_type?: string | null
          removed?: boolean
          removed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      comments_ai: {
        Row: {
          comment: string | null
          created_at: string
          enneagram_type: string | null
          id: number
          question_id: number | null
        }
        Insert: {
          comment?: string | null
          created_at?: string
          enneagram_type?: string | null
          id?: number
          question_id?: number | null
        }
        Update: {
          comment?: string | null
          created_at?: string
          enneagram_type?: string | null
          id?: number
          question_id?: number | null
        }
        Relationships: []
      }
      comments_ai_demo: {
        Row: {
          comment: string | null
          created_at: string
          enneagram_type: string | null
          id: number
          question_id: number | null
        }
        Insert: {
          comment?: string | null
          created_at?: string
          enneagram_type?: string | null
          id?: number
          question_id?: number | null
        }
        Update: {
          comment?: string | null
          created_at?: string
          enneagram_type?: string | null
          id?: number
          question_id?: number | null
        }
        Relationships: []
      }
      comments_demo: {
        Row: {
          author_id: string | null
          comment: string | null
          comment_count: number | null
          created_at: string | null
          es_id: string | null
          fingerprint: string | null
          id: number
          ip: string | null
          like_count: number | null
          modified_at: string | null
          parent_id: number | null
          parent_type: string | null
        }
        Insert: {
          author_id?: string | null
          comment?: string | null
          comment_count?: number | null
          created_at?: string | null
          es_id?: string | null
          fingerprint?: string | null
          id?: number
          ip?: string | null
          like_count?: number | null
          modified_at?: string | null
          parent_id?: number | null
          parent_type?: string | null
        }
        Update: {
          author_id?: string | null
          comment?: string | null
          comment_count?: number | null
          created_at?: string | null
          es_id?: string | null
          fingerprint?: string | null
          id?: number
          ip?: string | null
          like_count?: number | null
          modified_at?: string | null
          parent_id?: number | null
          parent_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_demo_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles_demo"
            referencedColumns: ["id"]
          },
        ]
      }
      flag_reasons: {
        Row: {
          created_at: string
          deleted_at: string | null
          id: number
          reason: string | null
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          id?: number
          reason?: string | null
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          id?: number
          reason?: string | null
        }
        Relationships: []
      }
      flagged_comments: {
        Row: {
          cleared_at: string | null
          comment_id: number | null
          created_at: string
          description: string | null
          flagged_by: string | null
          id: number
          reason_id: number | null
          removed_at: string | null
        }
        Insert: {
          cleared_at?: string | null
          comment_id?: number | null
          created_at?: string
          description?: string | null
          flagged_by?: string | null
          id?: number
          reason_id?: number | null
          removed_at?: string | null
        }
        Update: {
          cleared_at?: string | null
          comment_id?: number | null
          created_at?: string
          description?: string | null
          flagged_by?: string | null
          id?: number
          reason_id?: number | null
          removed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "flagged_comments_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flagged_comments_flagged_by_fkey"
            columns: ["flagged_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flagged_comments_reason_id_fkey"
            columns: ["reason_id"]
            isOneToOne: false
            referencedRelation: "flag_reasons"
            referencedColumns: ["id"]
          },
        ]
      }
      link_domain_owners: {
        Row: {
          created_at: string | null
          email: string | null
          first_name: string | null
          id: number
          last_name: string | null
          linked_domain_id: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: number
          last_name?: string | null
          linked_domain_id?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: number
          last_name?: string | null
          linked_domain_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "link_domain_owners_linked_domain_id_fkey"
            columns: ["linked_domain_id"]
            isOneToOne: false
            referencedRelation: "link_domains"
            referencedColumns: ["id"]
          },
        ]
      }
      link_domains: {
        Row: {
          created_at: string | null
          domain: string | null
          id: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          domain?: string | null
          id?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          domain?: string | null
          id?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      link_drops: {
        Row: {
          address_id: number | null
          created_at: string
          external_id: string
          id: number
          number_of_drops: number | null
          number_of_hits: number | null
          question_id: number | null
        }
        Insert: {
          address_id?: number | null
          created_at?: string
          external_id: string
          id?: number
          number_of_drops?: number | null
          number_of_hits?: number | null
          question_id?: number | null
        }
        Update: {
          address_id?: number | null
          created_at?: string
          external_id?: string
          id?: number
          number_of_drops?: number | null
          number_of_hits?: number | null
          question_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "link_drops_address_id_fkey"
            columns: ["address_id"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "link_drops_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      links: {
        Row: {
          clicks: number | null
          created_at: string | null
          domain_id: number
          id: number
          meta_description: string | null
          meta_image: string | null
          meta_title: string | null
          question_id: number | null
          updated_at: string | null
          url: string | null
        }
        Insert: {
          clicks?: number | null
          created_at?: string | null
          domain_id: number
          id?: number
          meta_description?: string | null
          meta_image?: string | null
          meta_title?: string | null
          question_id?: number | null
          updated_at?: string | null
          url?: string | null
        }
        Update: {
          clicks?: number | null
          created_at?: string | null
          domain_id?: number
          id?: number
          meta_description?: string | null
          meta_image?: string | null
          meta_title?: string | null
          question_id?: number | null
          updated_at?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "links_domain_id_fkey"
            columns: ["domain_id"]
            isOneToOne: false
            referencedRelation: "link_domains"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "links_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      "new-words": {
        Row: {
          created_at: string | null
          id: number
          stem: string | null
          word: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          stem?: string | null
          word?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          stem?: string | null
          word?: string | null
        }
        Relationships: []
      }
      permissions: {
        Row: {
          can_ask_question: boolean | null
          created_at: string
          id: number
          profile_id: string | null
        }
        Insert: {
          can_ask_question?: boolean | null
          created_at?: string
          id?: number
          profile_id?: string | null
        }
        Update: {
          can_ask_question?: boolean | null
          created_at?: string
          id?: number
          profile_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "permissions_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions_demo: {
        Row: {
          can_ask_question: boolean | null
          created_at: string
          id: number
          profile_id: string | null
        }
        Insert: {
          can_ask_question?: boolean | null
          created_at?: string
          id?: number
          profile_id?: string | null
        }
        Update: {
          can_ask_question?: boolean | null
          created_at?: string
          id?: number
          profile_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "permissions_demo_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles_demo"
            referencedColumns: ["id"]
          },
        ]
      }
      person_suggestions: {
        Row: {
          created_at: string
          email: string | null
          id: number
          person_name: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: number
          person_name?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: number
          person_name?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          admin: boolean | null
          avatar_url: string | null
          canAskQuestion: boolean | null
          created_at: string | null
          email: string | null
          enneagram: string | null
          external_id: string | null
          first_name: string | null
          id: string
          last_name: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          admin?: boolean | null
          avatar_url?: string | null
          canAskQuestion?: boolean | null
          created_at?: string | null
          email?: string | null
          enneagram?: string | null
          external_id?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          admin?: boolean | null
          avatar_url?: string | null
          canAskQuestion?: boolean | null
          created_at?: string | null
          email?: string | null
          enneagram?: string | null
          external_id?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles_demo: {
        Row: {
          admin: boolean | null
          avatar_url: string | null
          canAskQuestion: boolean | null
          created_at: string | null
          email: string | null
          enneagram: string | null
          external_id: string | null
          first_name: string | null
          id: string
          last_name: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          admin?: boolean | null
          avatar_url?: string | null
          canAskQuestion?: boolean | null
          created_at?: string | null
          email?: string | null
          enneagram?: string | null
          external_id?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          admin?: boolean | null
          avatar_url?: string | null
          canAskQuestion?: boolean | null
          created_at?: string | null
          email?: string | null
          enneagram?: string | null
          external_id?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: []
      }
      question_subcategories: {
        Row: {
          id: number
          parent_id: number | null
          subcategory_name: string
        }
        Insert: {
          id?: number
          parent_id?: number | null
          subcategory_name: string
        }
        Update: {
          id?: number
          parent_id?: number | null
          subcategory_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "question_subcategories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "question_subcategories"
            referencedColumns: ["id"]
          },
        ]
      }
      question_tag: {
        Row: {
          subcategory_id: number | null
          tag_id: number
          tag_name: string
        }
        Insert: {
          subcategory_id?: number | null
          tag_id?: number
          tag_name: string
        }
        Update: {
          subcategory_id?: number | null
          tag_id?: number
          tag_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "question_tag_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "question_subcategories"
            referencedColumns: ["id"]
          },
        ]
      }
      question_tags: {
        Row: {
          created_at: string | null
          question_id: number
          tag_id: number
        }
        Insert: {
          created_at?: string | null
          question_id: number
          tag_id: number
        }
        Update: {
          created_at?: string | null
          question_id?: number
          tag_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "question_tags_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "question_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "question_tag"
            referencedColumns: ["tag_id"]
          },
        ]
      }
      question_tags_demo: {
        Row: {
          question_id: number
          tag_id: number
        }
        Insert: {
          question_id: number
          tag_id: number
        }
        Update: {
          question_id?: number
          tag_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "question_tags_demo_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions_demo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "question_tags_demo_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "question_tag"
            referencedColumns: ["tag_id"]
          },
        ]
      }
      questions: {
        Row: {
          author_id: string | null
          comment_count: number | null
          context: string | null
          created_at: string
          data: Json | null
          es_id: string | null
          flagged: boolean | null
          id: number
          img_url: string | null
          name: string | null
          question: string | null
          question_formatted: string | null
          removed: boolean | null
          tagged: boolean | null
          updated_at: string
          url: string | null
        }
        Insert: {
          author_id?: string | null
          comment_count?: number | null
          context?: string | null
          created_at?: string
          data?: Json | null
          es_id?: string | null
          flagged?: boolean | null
          id?: number
          img_url?: string | null
          name?: string | null
          question?: string | null
          question_formatted?: string | null
          removed?: boolean | null
          tagged?: boolean | null
          updated_at?: string
          url?: string | null
        }
        Update: {
          author_id?: string | null
          comment_count?: number | null
          context?: string | null
          created_at?: string
          data?: Json | null
          es_id?: string | null
          flagged?: boolean | null
          id?: number
          img_url?: string | null
          name?: string | null
          question?: string | null
          question_formatted?: string | null
          removed?: boolean | null
          tagged?: boolean | null
          updated_at?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "questions_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      questions_demo: {
        Row: {
          author_id: string | null
          comment_count: number | null
          context: string | null
          created_at: string
          data: Json | null
          es_id: string | null
          id: number
          img_url: string | null
          name: string | null
          question: string | null
          question_formatted: string | null
          removed: boolean | null
          updated_at: string
          url: string | null
        }
        Insert: {
          author_id?: string | null
          comment_count?: number | null
          context?: string | null
          created_at?: string
          data?: Json | null
          es_id?: string | null
          id?: number
          img_url?: string | null
          name?: string | null
          question?: string | null
          question_formatted?: string | null
          removed?: boolean | null
          updated_at?: string
          url?: string | null
        }
        Update: {
          author_id?: string | null
          comment_count?: number | null
          context?: string | null
          created_at?: string
          data?: Json | null
          es_id?: string | null
          id?: number
          img_url?: string | null
          name?: string | null
          question?: string | null
          question_formatted?: string | null
          removed?: boolean | null
          updated_at?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "questions_demo_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles_demo"
            referencedColumns: ["id"]
          },
        ]
      }
      signups: {
        Row: {
          created_at: string | null
          email: string | null
          id: number
          name: string | null
          unsubscribe_id: string | null
          unsubscribe_iv: string | null
          unsubscribed_date: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: number
          name?: string | null
          unsubscribe_id?: string | null
          unsubscribe_iv?: string | null
          unsubscribed_date?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: number
          name?: string | null
          unsubscribe_id?: string | null
          unsubscribe_iv?: string | null
          unsubscribed_date?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string | null
          id: number
          question_id: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          question_id?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          question_id?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions_demo: {
        Row: {
          created_at: string | null
          id: number
          question_id: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          question_id?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          question_id?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_demo_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions_demo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_demo_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles_demo"
            referencedColumns: ["id"]
          },
        ]
      }
      use_demo_table: {
        Row: {
          value: boolean | null
        }
        Insert: {
          value?: boolean | null
        }
        Update: {
          value?: boolean | null
        }
        Relationships: []
      }
      user_socials: {
        Row: {
          created_at: string | null
          facebook: string | null
          id: number
          instagram: string | null
          linkedin: string | null
          medium: string | null
          meetup: string | null
          quora: string | null
          reddit: string | null
          snapchat: string | null
          substack: string | null
          threads: string | null
          tiktok: string | null
          twitter: string | null
          updated_at: string | null
          youtube: string | null
        }
        Insert: {
          created_at?: string | null
          facebook?: string | null
          id?: number
          instagram?: string | null
          linkedin?: string | null
          medium?: string | null
          meetup?: string | null
          quora?: string | null
          reddit?: string | null
          snapchat?: string | null
          substack?: string | null
          threads?: string | null
          tiktok?: string | null
          twitter?: string | null
          updated_at?: string | null
          youtube?: string | null
        }
        Update: {
          created_at?: string | null
          facebook?: string | null
          id?: number
          instagram?: string | null
          linkedin?: string | null
          medium?: string | null
          meetup?: string | null
          quora?: string | null
          reddit?: string | null
          snapchat?: string | null
          substack?: string | null
          threads?: string | null
          tiktok?: string | null
          twitter?: string | null
          updated_at?: string | null
          youtube?: string | null
        }
        Relationships: []
      }
      visitors: {
        Row: {
          created_at: string
          fingerprint: string
          id: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          fingerprint: string
          id?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          fingerprint?: string
          id?: number
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      distinct_question_tags: {
        Row: {
          tag_id: number | null
        }
        Relationships: [
          {
            foreignKeyName: "question_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "question_tag"
            referencedColumns: ["tag_id"]
          },
        ]
      }
      distinct_question_tags_demo: {
        Row: {
          tag_id: number | null
        }
        Relationships: [
          {
            foreignKeyName: "question_tags_demo_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "question_tag"
            referencedColumns: ["tag_id"]
          },
        ]
      }
    }
    Functions: {
      can_see_comments: {
        Args: {
          questionid: number
          userid: string
          userip: string
        }
        Returns: boolean
      }
      can_see_comments_2: {
        Args: {
          questionid: number
          userid: string
          userfingerprint: string
        }
        Returns: boolean
      }
      can_see_comments_3: {
        Args: {
          questionid: number
          userid: string
          userfingerprint: string
        }
        Returns: boolean
      }
      comments_last_30_days: {
        Args: Record<PropertyKey, never>
        Returns: {
          days: string
          number_of_comments: number
          number_modified: number
        }[]
      }
      daily_questions_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          question: string
          id: number
          url: string
          created_at: string
          number_of_comments: number
          number_of_comments_today: number
          number_modified: number
          user_external_id: string
          user_email: string
        }[]
      }
      decrement_like_count: {
        Args: {
          comment_id: number
        }
        Returns: undefined
      }
      get_10_question_tags: {
        Args: Record<PropertyKey, never>
        Returns: {
          question_id: number
          tag_id: number
          id: number
          created_at: string
          updated_at: string
          question: string
          question_formatted: string
          url: string
          img_url: string
          author_id: string
          comment_count: number
          removed: boolean
          es_id: string
          tag_name: string
          subcategory_id: number
          rn: number
        }[]
      }
      get_categories: {
        Args: Record<PropertyKey, never>
        Returns: {
          tag_name: string
          tagid: number
          question_count: number
        }[]
      }
      get_category_questions: {
        Args: {
          slug: string
        }
        Returns: {
          id: number
          created_at: string
          updated_at: string
          question: string
          question_formatted: string
          url: string
          img_url: string
          author_id: string
          comment_count: number
          es_id: string
        }[]
      }
      get_user_question_comments: {
        Args: {
          authorid: string
        }
        Returns: {
          question: string
          question_formatted: string
          url: string
          id: number
          created_at: string
          author_id: string
          comment: string
          comment_count: number
          like_count: number
          ip: string
          es_id: string
          parent_id: number
          parent_type: string
          fingerprint: string
        }[]
      }
      get_user_question_comments2: {
        Args: {
          authorid: string
        }
        Returns: {
          question: string
          question_formatted: string
          url: string
          id: number
          created_at: string
          author_id: string
          comment: string
          comment_count: number
          like_count: number
          ip: string
          es_id: string
          parent_id: number
          parent_type: string
          fingerprint: string
        }[]
      }
      increment_clicks: {
        Args: {
          link_id: number
        }
        Returns: undefined
      }
      increment_comment_count: {
        Args: {
          comment_parent_id: number
        }
        Returns: undefined
      }
      increment_like_count: {
        Args: {
          comment_id: number
        }
        Returns: undefined
      }
      increment_link_hit: {
        Args: {
          link_id: number
        }
        Returns: undefined
      }
      install_available_extensions_and_test: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      question_with_comments:
      | {
        Args: Record<PropertyKey, never>
        Returns: {
          author_id: string | null
          comment_count: number | null
          context: string | null
          created_at: string
          data: Json | null
          es_id: string | null
          flagged: boolean | null
          id: number
          img_url: string | null
          name: string | null
          question: string | null
          question_formatted: string | null
          removed: boolean | null
          tagged: boolean | null
          updated_at: string
          url: string | null
        }[]
      }
      | {
        Args: {
          url: string
        }
        Returns: {
          author_id: string | null
          comment_count: number | null
          context: string | null
          created_at: string
          data: Json | null
          es_id: string | null
          flagged: boolean | null
          id: number
          img_url: string | null
          name: string | null
          question: string | null
          question_formatted: string | null
          removed: boolean | null
          tagged: boolean | null
          updated_at: string
          url: string | null
        }[]
      }
      visitors_last_30_days: {
        Args: Record<PropertyKey, never>
        Returns: {
          days: string
          number_of_visitors: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
  | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
    Database[PublicTableNameOrOptions["schema"]]["Views"])
  : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
    Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
  ? R
  : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
    PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
    PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
  ? R
  : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
  | keyof PublicSchema["Tables"]
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Insert: infer I
  }
  ? I
  : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
    Insert: infer I
  }
  ? I
  : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
  | keyof PublicSchema["Tables"]
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Update: infer U
  }
  ? U
  : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
    Update: infer U
  }
  ? U
  : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
  | keyof PublicSchema["Enums"]
  | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
  ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
  : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never
