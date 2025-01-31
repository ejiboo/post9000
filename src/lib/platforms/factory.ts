import { TwitterApi } from './twitter';
import { FacebookApi } from './facebook';
import { InstagramApi } from './instagram';
import type { SocialPlatform } from '@/types/database';

export function createPlatformApi(platform: SocialPlatform, accessToken: string) {
  switch (platform) {
    case 'twitter':
      return new TwitterApi({ accessToken });
    case 'facebook':
      return new FacebookApi({ accessToken });
    case 'instagram':
      return new InstagramApi({ accessToken });
    default:
      throw new Error(`Platform ${platform} not supported yet`);
  }
} 