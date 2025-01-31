import type { SocialPlatform } from '@/types/database';

export interface OAuthState {
  platform: SocialPlatform;
  redirectUrl: string;
}

export interface OAuthConfig {
  clientId: string;
  clientSecret: string;
  authorizeUrl: string;
  tokenUrl: string;
  scopes: string[];
  redirectUri: string;
} 