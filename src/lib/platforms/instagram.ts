import type { PostContent, PostResult, PlatformApi } from './types';

interface InstagramApiConfig {
  accessToken: string;
  apiVersion?: string;
}

export class InstagramApi implements PlatformApi {
  private baseUrl: string;
  private accessToken: string;

  constructor({ accessToken, apiVersion = 'v18.0' }: InstagramApiConfig) {
    this.baseUrl = `https://graph.instagram.com/${apiVersion}`;
    this.accessToken = accessToken;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    url.searchParams.append('access_token', this.accessToken);

    const response = await fetch(url, options);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Instagram API error: ${error.error.message}`);
    }

    return response.json();
  }

  async createPost(content: PostContent): Promise<PostResult> {
    try {
      if (!content.media?.length) {
        throw new Error('Instagram posts require at least one media item');
      }

      // Create container for the first media item
      const { id } = await this.request('/media', {
        method: 'POST',
        body: JSON.stringify({
          image_url: content.media[0].url,
          caption: content.text,
        }),
      });

      // Publish the container
      const result = await this.request('/media_publish', {
        method: 'POST',
        body: JSON.stringify({
          creation_id: id,
        }),
      });

      return {
        id: result.id,
        platform: 'instagram',
        url: `https://instagram.com/p/${result.id}`,
        status: 'success'
      };
    } catch (error) {
      return {
        id: '',
        platform: 'instagram',
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async createStory({ mediaUrl }: { mediaUrl: string }) {
    return this.request('/media', {
      method: 'POST',
      body: JSON.stringify({
        image_url: mediaUrl,
        media_type: 'STORIES',
      }),
    });
  }
} 