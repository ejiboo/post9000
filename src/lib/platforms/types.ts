export interface MediaUpload {
  url: string;
  type: 'image' | 'video';
  altText?: string;
}

export interface PostContent {
  text: string;
  media?: MediaUpload[];
  hashtags?: string[];
  mentions?: string[];
  location?: string;
}

export interface PostResult {
  id: string;
  platform: string;
  url?: string;
  status: 'success' | 'error';
  error?: string;
}

export interface PlatformApi {
  createPost(content: PostContent): Promise<PostResult>;
  validateContent?(content: PostContent): string[];
} 