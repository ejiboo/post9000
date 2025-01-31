export type SocialPlatform = 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'tiktok' | 'pinterest';

export interface Post {
  id: string;
  user_id: string;
  content: string;
  media_urls?: string[];
  platforms: SocialPlatform[];
  scheduled_for?: string;
  status: 'pending' | 'posted' | 'failed';
  created_at: string;
  hashtags?: string[];
  location?: string;
  mentions?: string[];
}

export interface PlatformConnection {
  id: string;
  user_id: string;
  platform: SocialPlatform;
  access_token: string;
  refresh_token?: string;
  expires_at?: string;
  created_at: string;
} 