import { supabase } from '@/lib/supabase/client';
import { createPlatformApi } from '@/lib/platforms/factory';
import { validatePost } from '@/lib/validation/platform-rules';
import type { PostContent, PostResult } from '@/lib/platforms/types';
import type { Database } from '@/types/database';
import type { SocialPlatform } from '@/types/database';

type Post = Database['public']['Tables']['posts']['Insert'];

export class PostService {
  private readonly userId: string;
  private readonly maxRetries = 3;
  private readonly retryDelay = 1000; // 1 second

  constructor(userId: string) {
    this.userId = userId;
  }

  async createPost(content: PostContent, platforms: SocialPlatform[], scheduledFor?: Date) {
    // Validate content for all selected platforms
    const validationErrors = platforms.flatMap(platform => 
      validatePost(platform, content.text, content.media?.map(m => m.url) || [])
    );

    if (validationErrors.length > 0) {
      throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
    }

    // Create post record in database
    const { data: post, error: dbError } = await supabase
      .from('posts')
      .insert({
        user_id: this.userId,
        content: content.text,
        media_urls: content.media?.map(m => m.url),
        platforms,
        scheduled_for: scheduledFor?.toISOString(),
        hashtags: content.hashtags,
        status: scheduledFor ? 'pending' : 'processing'
      })
      .select()
      .single();

    if (dbError) throw dbError;

    // If scheduled, we're done for now
    if (scheduledFor) {
      return post;
    }

    // Post to each platform with retries
    const results = await Promise.allSettled(
      platforms.map(platform => this.postToPlatform(platform, content, post.id))
    );

    // Update post status based on results
    const allSuccess = results.every(r => r.status === 'fulfilled');
    const status = allSuccess ? 'posted' : 'failed';

    await supabase
      .from('posts')
      .update({ status })
      .eq('id', post.id);

    return {
      ...post,
      status,
      results: results.map((result, index) => ({
        platform: platforms[index],
        status: result.status,
        error: result.status === 'rejected' ? result.reason.message : undefined
      }))
    };
  }

  private async postToPlatform(
    platform: SocialPlatform,
    content: PostContent,
    postId: string,
    attempt = 1
  ): Promise<PostResult> {
    try {
      // Get platform connection
      const { data: connection, error: connError } = await supabase
        .from('platform_connections')
        .select('access_token')
        .eq('user_id', this.userId)
        .eq('platform', platform)
        .single();

      if (connError) throw connError;

      const api = createPlatformApi(platform, connection.access_token);
      return await api.createPost(content);
    } catch (error) {
      if (attempt < this.maxRetries) {
        // Wait before retrying
        await new Promise(resolve => 
          setTimeout(resolve, this.retryDelay * attempt)
        );
        return this.postToPlatform(platform, content, postId, attempt + 1);
      }
      throw error;
    }
  }

  async getScheduledPosts() {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', this.userId)
      .eq('status', 'pending')
      .order('scheduled_for', { ascending: true });

    if (error) throw error;
    return data;
  }

  async processScheduledPost(postId: string) {
    const { data: post, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', postId)
      .single();

    if (error) throw error;

    const content: PostContent = {
      text: post.content,
      media: post.media_urls?.map(url => ({ url, type: this.guessMediaType(url) })),
      hashtags: post.hashtags,
    };

    return this.createPost(content, post.platforms);
  }

  private guessMediaType(url: string): 'image' | 'video' {
    const ext = url.split('.').pop()?.toLowerCase();
    return ['mp4', 'mov', 'avi'].includes(ext || '') ? 'video' : 'image';
  }
} 