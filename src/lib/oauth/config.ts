import type { SocialPlatform } from '@/types/database';
import type { OAuthConfig } from './types';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const OAUTH_CONFIGS: Partial<Record<SocialPlatform, OAuthConfig>> = {
  twitter: {
    clientId: process.env.TWITTER_CLIENT_ID!,
    clientSecret: process.env.TWITTER_CLIENT_SECRET!,
    authorizeUrl: 'https://twitter.com/i/oauth2/authorize',
    tokenUrl: 'https://api.twitter.com/2/oauth2/token',
    scopes: ['tweet.read', 'tweet.write', 'users.read'],
    redirectUri: `${BASE_URL}/api/auth/callback/twitter`
  },
  facebook: {
    clientId: process.env.FACEBOOK_CLIENT_ID!,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    authorizeUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
    tokenUrl: 'https://graph.facebook.com/v18.0/oauth/access_token',
    scopes: ['pages_show_list', 'pages_read_engagement', 'pages_manage_posts'],
    redirectUri: `${BASE_URL}/api/auth/callback/facebook`
  },
  instagram: {
    clientId: process.env.INSTAGRAM_CLIENT_ID!,
    clientSecret: process.env.INSTAGRAM_CLIENT_SECRET!,
    authorizeUrl: 'https://api.instagram.com/oauth/authorize',
    tokenUrl: 'https://api.instagram.com/oauth/access_token',
    scopes: ['basic', 'publish_content'],
    redirectUri: `${BASE_URL}/api/auth/callback/instagram`
  },
  linkedin: {
    clientId: process.env.LINKEDIN_CLIENT_ID!,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
    authorizeUrl: 'https://www.linkedin.com/oauth/v2/authorization',
    tokenUrl: 'https://www.linkedin.com/oauth/v2/accessToken',
    scopes: ['w_member_social'],
    redirectUri: `${BASE_URL}/api/auth/callback/linkedin`
  }
}; 