export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
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
          id: number
          ip: string | null
        }
        Insert: {
          author_id?: string | null
          blog_link?: string | null
          blog_type?: string | null
          comment?: string | null
          created_at?: string
          id?: number
          ip?: string | null
        }
        Update: {
          author_id?: string | null
          blog_link?: string | null
          blog_type?: string | null
          comment?: string | null
          created_at?: string
          id?: number
          ip?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_comments_author_id_fkey"
            columns: ["author_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
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
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comment_like_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
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
            referencedRelation: "comments_demo"
            referencedColumns: ["id"]
          }
        ]
      }
      comments: {
        Row: {
          author_id: string | null
          comment: string | null
          comment_count: number | null
          created_at: string | null
          es_id: string | null
          id: number
          ip: string | null
          like_count: number | null
          parent_id: number | null
          parent_type: string | null
        }
        Insert: {
          author_id?: string | null
          comment?: string | null
          comment_count?: number | null
          created_at?: string | null
          es_id?: string | null
          id?: number
          ip?: string | null
          like_count?: number | null
          parent_id?: number | null
          parent_type?: string | null
        }
        Update: {
          author_id?: string | null
          comment?: string | null
          comment_count?: number | null
          created_at?: string | null
          es_id?: string | null
          id?: number
          ip?: string | null
          like_count?: number | null
          parent_id?: number | null
          parent_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_author_id_fkey"
            columns: ["author_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      comments_demo: {
        Row: {
          author_id: string | null
          comment: string | null
          comment_count: number | null
          created_at: string | null
          es_id: string | null
          id: number
          ip: string | null
          like_count: number | null
          parent_id: number | null
          parent_type: string | null
        }
        Insert: {
          author_id?: string | null
          comment?: string | null
          comment_count?: number | null
          created_at?: string | null
          es_id?: string | null
          id?: number
          ip?: string | null
          like_count?: number | null
          parent_id?: number | null
          parent_type?: string | null
        }
        Update: {
          author_id?: string | null
          comment?: string | null
          comment_count?: number | null
          created_at?: string | null
          es_id?: string | null
          id?: number
          ip?: string | null
          like_count?: number | null
          parent_id?: number | null
          parent_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_demo_author_id_fkey"
            columns: ["author_id"]
            referencedRelation: "profiles_demo"
            referencedColumns: ["id"]
          }
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
            referencedRelation: "link_domains"
            referencedColumns: ["id"]
          }
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
            referencedRelation: "link_domains"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "links_question_id_fkey"
            columns: ["question_id"]
            referencedRelation: "questions"
            referencedColumns: ["id"]
          }
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
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
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
            referencedRelation: "profiles_demo"
            referencedColumns: ["id"]
          }
        ]
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
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
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
            referencedRelation: "question_subcategories"
            referencedColumns: ["id"]
          }
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
            referencedRelation: "question_subcategories"
            referencedColumns: ["id"]
          }
        ]
      }
      question_tags: {
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
            foreignKeyName: "question_tags_question_id_fkey"
            columns: ["question_id"]
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "question_tags_tag_id_fkey"
            columns: ["tag_id"]
            referencedRelation: "question_tag"
            referencedColumns: ["tag_id"]
          }
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
            referencedRelation: "questions_demo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "question_tags_demo_tag_id_fkey"
            columns: ["tag_id"]
            referencedRelation: "question_tag"
            referencedColumns: ["tag_id"]
          }
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
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
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
          updated_at?: string
          url?: string | null
        }
        Relationships: []
      }
      signups: {
        Row: {
          created_at: string | null
          email: string | null
          id: number
          name: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: number
          name?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: number
          name?: string | null
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
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
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
            referencedRelation: "questions_demo"
            referencedColumns: ["id"]
          }
        ]
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
            referencedRelation: "question_tag"
            referencedColumns: ["tag_id"]
          }
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
            referencedRelation: "question_tag"
            referencedColumns: ["tag_id"]
          }
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
      decrement_like_count: {
        Args: {
          comment_id: number
        }
        Returns: undefined
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
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
