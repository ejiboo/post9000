'use client';

import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import type { Database } from '@/types/database';

type Post = Database['public']['Tables']['posts']['Row'];

export default function PostsList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch('/api/posts');
        if (!response.ok) throw new Error('Failed to fetch posts');
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load posts');
      } finally {
        setIsLoading(false);
      }
    }

    fetchPosts();
  }, []);

  if (isLoading) {
    return <div className="text-center py-4">Loading posts...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div key={post.id} className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-sm text-gray-500">
                Posted {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
              </p>
              <div className="flex gap-2 mt-1">
                {post.platforms.map((platform) => (
                  <span
                    key={platform}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {platform}
                  </span>
                ))}
              </div>
            </div>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                post.status === 'posted'
                  ? 'bg-green-100 text-green-800'
                  : post.status === 'failed'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {post.status}
            </span>
          </div>
          <p className="whitespace-pre-wrap">{post.content}</p>
          {post.hashtags && post.hashtags.length > 0 && (
            <div className="mt-2 text-blue-600 text-sm">
              {post.hashtags.join(' ')}
            </div>
          )}
          {post.media_urls && post.media_urls.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-2">
              {post.media_urls.map((url, index) => (
                <div key={index} className="relative pt-[100%]">
                  <img
                    src={url}
                    alt={`Media ${index + 1}`}
                    className="absolute inset-0 w-full h-full object-cover rounded"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
} 