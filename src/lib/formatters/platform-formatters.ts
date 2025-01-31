import type { SocialPlatform } from '@/types/database';

interface FormatOptions {
  content: string;
  hashtags: string[];
  mentions: string[];
  mediaUrls: string[];
}

const formatters: Record<SocialPlatform, (options: FormatOptions) => string> = {
  twitter: ({ content, hashtags, mentions }) => {
    const tags = hashtags.join(' ');
    const userMentions = mentions.map(m => `@${m}`).join(' ');
    return `${content}\n\n${userMentions} ${tags}`.trim().slice(0, 280);
  },
  
  facebook: ({ content, hashtags }) => {
    const tags = hashtags.join(' ');
    return `${content}\n\n${tags}`;
  },
  
  instagram: ({ content, hashtags }) => {
    const tags = hashtags.join(' ');
    return `${content}\n\n.\n.\n.\n${tags}`;
  },
  
  linkedin: ({ content, hashtags }) => {
    const tags = hashtags.join(' ');
    return `${content}\n\n${tags}`;
  },
  
  tiktok: ({ content, hashtags }) => {
    const tags = hashtags.map(tag => tag.replace('#', '')).join(' ');
    return `${content}\n\n#${tags}`;
  },
  
  pinterest: ({ content, hashtags }) => {
    const tags = hashtags.join(' ');
    return `${content}\n\n${tags}`;
  }
};

export function formatForPlatform(platform: SocialPlatform, options: FormatOptions): string {
  return formatters[platform](options);
} 