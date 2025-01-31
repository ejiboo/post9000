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
      posts: {
        Row: {
          id: string
          user_id: string
          content: string
          media_urls: string[] | null
          platforms: string[]
          scheduled_for: string | null
          status: 'pending' | 'posted' | 'failed'
          created_at: string
          hashtags: string[] | null
          location: string | null
          mentions: string[] | null
        }
        Insert: {
          id?: string
          user_id: string
          content: string
          media_urls?: string[] | null
          platforms: string[]
          scheduled_for?: string | null
          status?: 'pending' | 'posted' | 'failed'
          created_at?: string
          hashtags?: string[] | null
          location?: string | null
          mentions?: string[] | null
        }
        Update: {
          id?: string
          user_id?: string
          content?: string
          media_urls?: string[] | null
          platforms?: string[]
          scheduled_for?: string | null
          status?: 'pending' | 'posted' | 'failed'
          created_at?: string
          hashtags?: string[] | null
          location?: string | null
          mentions?: string[] | null
        }
      }
      platform_connections: {
        Row: {
          id: string
          user_id: string
          platform: string
          access_token: string
          refresh_token: string | null
          expires_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          platform: string
          access_token: string
          refresh_token?: string | null
          expires_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          platform?: string
          access_token?: string
          refresh_token?: string | null
          expires_at?: string | null
          created_at?: string
        }
      }
    }
  }
} 