'use client';

import { useState, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import type { SocialPlatform } from '@/types/database';
import PostPreview from './PostPreview';

interface PostFormData {
  content: string;
  platforms: SocialPlatform[];
  mediaUrls: string[];
  hashtags: string;
  location?: string;
  scheduledFor?: string;
}

export default function PostForm() {
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<PostFormData>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const content = useWatch({ control, name: 'content', defaultValue: '' });
  const hashtags = useWatch({ control, name: 'hashtags', defaultValue: '' });
  const mediaUrls = useWatch({ control, name: 'mediaUrls', defaultValue: [] });
  const selectedPlatforms = useWatch({ control, name: 'platforms', defaultValue: [] });

  const platforms: SocialPlatform[] = ['facebook', 'instagram', 'twitter', 'linkedin', 'tiktok', 'pinterest'];

  const onSubmit = async (data: PostFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      reset();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          {error && (
            <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Choose Platforms</label>
              <div className="mt-2 flex flex-wrap gap-4">
                {platforms.map((platform) => (
                  <label key={platform} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      value={platform}
                      {...register('platforms', { required: 'Select at least one platform' })}
                      className="rounded border-gray-300"
                    />
                    <span className="ml-2 text-sm capitalize">{platform}</span>
                  </label>
                ))}
              </div>
              {errors.platforms && (
                <p className="mt-1 text-sm text-red-600">{errors.platforms.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Content</label>
              <textarea
                {...register('content', { required: 'Content is required' })}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="What's on your mind?"
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Media URLs</label>
              <input
                type="text"
                {...register('mediaUrls')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter URLs separated by commas"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Hashtags</label>
              <input
                type="text"
                {...register('hashtags')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="#example #post"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Schedule Post</label>
              <input
                type="datetime-local"
                {...register('scheduledFor')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                isLoading 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isLoading ? 'Creating Post...' : 'Create Post'}
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <h2 className="text-lg font-semibold">Preview</h2>
          {selectedPlatforms.length > 0 ? (
            selectedPlatforms.map((platform) => (
              <PostPreview
                key={platform}
                platform={platform}
                content={content}
                hashtags={hashtags}
                mediaUrls={mediaUrls ? mediaUrls.split(',').map(url => url.trim()) : []}
              />
            ))
          ) : (
            <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-500">
              Select platforms to see preview
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 