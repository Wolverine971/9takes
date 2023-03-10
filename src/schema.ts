export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      comments: {
        Row: {
          author_id: string | null
          comment: string | null
          created_at: string | null
          id: number
          ip: string | null
          parent_id: number | null
        }
        Insert: {
          author_id?: string | null
          comment?: string | null
          created_at?: string | null
          id?: number
          ip?: string | null
          parent_id?: number | null
        }
        Update: {
          author_id?: string | null
          comment?: string | null
          created_at?: string | null
          id?: number
          ip?: string | null
          parent_id?: number | null
        }
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
      }
      questions: {
        Row: {
          author_id: string | null
          context: string | null
          created_at: string
          data: Json | null
          id: number
          img_url: string | null
          name: string | null
          question: string | null
          updated_at: string
          url: string | null
        }
        Insert: {
          author_id?: string | null
          context?: string | null
          created_at?: string
          data?: Json | null
          id?: number
          img_url?: string | null
          name?: string | null
          question?: string | null
          updated_at?: string
          url?: string | null
        }
        Update: {
          author_id?: string | null
          context?: string | null
          created_at?: string
          data?: Json | null
          id?: number
          img_url?: string | null
          name?: string | null
          question?: string | null
          updated_at?: string
          url?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      install_available_extensions_and_test: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
