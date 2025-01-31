import type { PostContent, PostResult, PlatformApi } from './types';

interface FacebookApiConfig {
  accessToken: string;
  apiVersion?: string;
}

export class FacebookApi implements PlatformApi {
  private baseUrl: string;
  private accessToken: string;

  constructor({ accessToken, apiVersion = 'v18.0' }: FacebookApiConfig) {
    this.baseUrl = `https://graph.facebook.com/${apiVersion}`;
    this.accessToken = accessToken;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    url.searchParams.append('access_token', this.accessToken);

    const response = await fetch(url, options);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Facebook API error: ${error.error.message}`);
    }

    return response.json();
  }

  async createPost(content: PostContent): Promise<PostResult> {
    try {
      // Get the user's pages first
      const { data: pages } = await this.getPages();
      if (!pages?.length) {
        throw new Error('No Facebook pages found');
      }

      const page = pages[0]; // Use the first page
      const result = await this.createPagePost(page.id, content);

      return {
        id: result.id,
        platform: 'facebook',
        url: `https://facebook.com/${result.id}`,
        status: 'success'
      };
    } catch (error) {
      return {
        id: '',
        platform: 'facebook',
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async getPages() {
    return this.request('/me/accounts');
  }

  private async createPagePost(pageId: string, content: PostContent) {
    if (!content.media?.length) {
      return this.request(`/${pageId}/feed`, {
        method: 'POST',
        body: JSON.stringify({ message: content.text }),
      });
    }

    // If we have media, we need to upload it first
    const attachments = await Promise.all(
      content.media.map(m => this.uploadMedia(pageId, m.url))
    );

    return this.request(`/${pageId}/feed`, {
      method: 'POST',
      body: JSON.stringify({
        message: content.text,
        attached_media: attachments.map(id => ({ media_fbid: id })),
      }),
    });
  }

  private async uploadMedia(pageId: string, url: string) {
    const { id } = await this.request(`/${pageId}/photos`, {
      method: 'POST',
      body: JSON.stringify({
        url,
        published: false,
      }),
    });

    return id;
  }
} 