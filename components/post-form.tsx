'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { SocialPlatform } from '@/types/database';

interface PostFormData {
  content: string;
  platforms: SocialPlatform[];
  mediaUrls: string[];
  hashtags: string;
  location?: string;
  scheduledFor?: string;
}

export default function PostForm() {
  const { register, handleSubmit } = useForm<PostFormData>();
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>([]);

  const platforms: SocialPlatform[] = ['facebook', 'instagram', 'twitter', 'linkedin', 'tiktok', 'pinterest'];

  const onSubmit = async (data: PostFormData) => {
    // We'll implement this in the next step
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Platforms</label>
        <div className="mt-2 flex gap-4">
          {platforms.map((platform) => (
            <label key={platform} className="inline-flex items-center">
              <input
                type="checkbox"
                value={platform}
                {...register('platforms')}
                className="rounded border-gray-300"
              />
              <span className="ml-2 text-sm">{platform}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Content</label>
        <textarea
          {...register('content')}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Media URLs</label>
        <input
          type="text"
          {...register('mediaUrls')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          placeholder="Enter URLs separated by commas"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Hashtags</label>
        <input
          type="text"
          {...register('hashtags')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          placeholder="#example #post"
        />
      </div>

      <button
        type="submit"
        className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Create Post
      </button>
    </form>
  );
} 