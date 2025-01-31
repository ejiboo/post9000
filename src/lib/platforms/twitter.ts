import type { PostContent, PostResult, PlatformApi } from './types';

interface TwitterApiConfig {
  accessToken: string;
  apiVersion?: string;
}

export class TwitterApi implements PlatformApi {
  private baseUrl: string;
  private accessToken: string;

  constructor({ accessToken, apiVersion = '2' }: TwitterApiConfig) {
    this.baseUrl = `https://api.twitter.com/${apiVersion}`;
    this.accessToken = accessToken;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Twitter API error: ${response.statusText}`);
    }

    return response.json();
  }

  async createPost(content: PostContent): Promise<PostResult> {
    try {
      // Handle media uploads first if present
      const mediaIds = content.media 
        ? await Promise.all(content.media.map(m => this.uploadMedia(m.url)))
        : [];

      // Create the tweet
      const { data } = await this.request('/tweets', {
        method: 'POST',
        body: JSON.stringify({
          text: content.text,
          ...(mediaIds.length && { media: { media_ids: mediaIds } })
        }),
      });

      return {
        id: data.id,
        platform: 'twitter',
        url: `https://twitter.com/i/web/status/${data.id}`,
        status: 'success'
      };
    } catch (error) {
      return {
        id: '',
        platform: 'twitter',
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async uploadMedia(mediaUrl: string): Promise<string> {
    // Implement media upload logic here
    // Twitter requires a different endpoint for media uploads
    throw new Error('Media upload not implemented yet');
  }
} 