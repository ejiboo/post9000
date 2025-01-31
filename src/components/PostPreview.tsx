'use client';

import { useMemo } from 'react';
import type { SocialPlatform } from '@/types/database';

interface PostPreviewProps {
  content: string;
  platform: SocialPlatform;
  hashtags: string;
  mediaUrls: string[];
}

const PLATFORM_LIMITS = {
  twitter: 280,
  facebook: 63206,
  instagram: 2200,
  linkedin: 3000,
  tiktok: 2200,
  pinterest: 500
} as const;

export default function PostPreview({ content, platform, hashtags, mediaUrls }: PostPreviewProps) {
  const formattedContent = useMemo(() => {
    const hashtagArray = hashtags
      .split(' ')
      .filter(tag => tag.startsWith('#'))
      .join(' ');

    const fullContent = `${content}\n\n${hashtagArray}`;
    const limit = PLATFORM_LIMITS[platform];

    return fullContent.length > limit 
      ? fullContent.slice(0, limit - 3) + '...'
      : fullContent;
  }, [content, hashtags, platform]);

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold capitalize">{platform}</h3>
        <span className="text-sm text-gray-500">
          {formattedContent.length}/{PLATFORM_LIMITS[platform]}
        </span>
      </div>

      <div className="prose prose-sm max-w-none">
        <p className="whitespace-pre-wrap">{formattedContent}</p>
      </div>

      {mediaUrls.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-2">
          {mediaUrls.map((url, index) => (
            <div key={index} className="relative pt-[100%]">
              <img
                src={url}
                alt={`Preview ${index + 1}`}
                className="absolute inset-0 w-full h-full object-cover rounded"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Invalid+URL';
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 