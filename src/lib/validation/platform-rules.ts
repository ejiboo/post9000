import type { SocialPlatform } from '@/types/database';

interface ValidationRule {
  maxLength: number;
  maxMedia: number;
  mediaTypes: string[];
  maxHashtags?: number;
  maxMentions?: number;
}

export const PLATFORM_RULES: Record<SocialPlatform, ValidationRule> = {
  twitter: {
    maxLength: 280,
    maxMedia: 4,
    mediaTypes: ['image/jpeg', 'image/png', 'image/gif', 'video/mp4'],
    maxHashtags: 30,
  },
  facebook: {
    maxLength: 63206,
    maxMedia: 10,
    mediaTypes: ['image/*', 'video/*'],
  },
  instagram: {
    maxLength: 2200,
    maxMedia: 10,
    mediaTypes: ['image/jpeg', 'image/png', 'video/mp4'],
    maxHashtags: 30,
  },
  linkedin: {
    maxLength: 3000,
    maxMedia: 9,
    mediaTypes: ['image/*', 'video/*'],
  },
  tiktok: {
    maxLength: 2200,
    maxMedia: 1,
    mediaTypes: ['video/mp4'],
    maxHashtags: 30,
  },
  pinterest: {
    maxLength: 500,
    maxMedia: 1,
    mediaTypes: ['image/*'],
  }
};

export function validatePost(platform: SocialPlatform, content: string, mediaUrls: string[]) {
  const rules = PLATFORM_RULES[platform];
  const errors: string[] = [];

  if (content.length > rules.maxLength) {
    errors.push(`Content exceeds maximum length of ${rules.maxLength} characters for ${platform}`);
  }

  if (mediaUrls.length > rules.maxMedia) {
    errors.push(`Too many media items. ${platform} allows maximum of ${rules.maxMedia}`);
  }

  // Add more platform-specific validations here

  return errors;
} 