# Platform Integration Checklist

## General Requirements
- [ ] Create developer accounts for all target platforms
- [ ] Enable 2FA on all developer accounts
- [ ] Collect API credentials for each platform (store in Supabase vault)

---

## Platform-Specific Setup

### Meta (Facebook/Instagram/Reels)
1. **API Access**
   - Create Facebook Developer account: [developers.facebook.com](https://developers.facebook.com)
   - Create new App > Select "Business" type
   - Required Permissions:
     - `pages_manage_posts`
     - `instagram_basic`
     - `instagram_content_publish`
   - Add Facebook Login product to app
   - Enable Instagram Graph API

2. **Post Requirements**
   - Max caption length: 2200 characters
   - Hashtags: Max 30, placed in caption
   - Mentions: @username format
   - Media: 
     - Images: JPEG/PNG (min 320px width)
     - Reels: MP4 (3-60 seconds)

---

### YouTube Shorts
1. **API Access**
   - Enable YouTube Data API v3: [console.cloud.google.com](https://console.cloud.google.com)
   - OAuth 2.0 credentials with:
     - `https://www.googleapis.com/auth/youtube.upload`
     - `https://www.googleapis.com/auth/youtube`
   - Verify app in API Console

2. **Post Requirements**
   - Max length: 60 seconds
   - Resolution: 1920x1080 (9:16 vertical)
   - Title: Max 100 characters
   - Description: Max 5000 characters
   - Hashtags: First 3 in description get special treatment

---

### X (Twitter)
1. **API Access**
   - Apply for Elevated Access: [developer.twitter.com](https://developer.twitter.com)
   - Required Scopes:
     - `tweet.write`
     - `users.read`
     - `tweet.read`
   - Generate OAuth 2.0 Client ID and Secret

2. **Post Requirements**
   - Max text length: 280 characters
   - Threads supported via chain posting
   - Media: Up to 4 images/GIFs or 1 video
   - Hashtags: Recommended 1-2 per tweet

---

### TikTok
1. **API Access**
   - Business Account required: [developers.tiktok.com](https://developers.tiktok.com)
   - Create app with "Content Posting" permission
   - Required Scopes:
     - `video.upload`
     - `user.info.basic`
   - Client Key and Client Secret required

2. **Post Requirements**
   - Video format: MP4, MOV (9:16 aspect ratio)
   - Length: 3-60 seconds
   - Hashtags: Max 100 characters total
   - Sound: Must use commercial rights music

---

### LinkedIn
1. **API Access**
   - Request API access: [learn.microsoft.com](https://learn.microsoft.com)
   - Required Scopes:
     - `w_member_social`
     - `r_liteprofile`
   - Organization admin approval required
   - Generate Access Token with OAuth 2.0

2. **Post Requirements**
   - Text: Max 3000 characters
   - No hashtags in title
   - Media: PDF, PNG, JPG, MP4
   - Must include company page URN

---

### Pinterest
1. **API Limitations**
   - No direct pin creation API
   - Requires manual copy-paste flow
   - Can generate rich pins via URL

2. **Post Formatting**
   - Description: Max 500 characters
   - Hashtags: Max 20 (place at end)
   - Link required for all posts
   - Image: 1000x1500px (2:3 ratio)

---

## Implementation Checklist
- [ ] Create platform configuration files in `/lib/social`
- [ ] Implement OAuth flow for each platform
- [ ] Add error handling for API rate limits
- [ ] Create post validation schemas per platform
- [ ] Develop copy-paste templates for unsupported APIs
- [ ] Implement media transcoding for format requirements
- [ ] Add platform connection status indicators
- [ ] Create API usage monitoring dashboard

## Critical Security Notes
1. Store all API keys in Supabase Vault
2. Never expose secrets to client-side
3. Implement refresh token rotation
4. Use platform-specific sandbox environments first
5. Encrypt stored access tokens

## Testing Requirements
- [ ] Verify post preview accuracy per platform
- [ ] Test API failure fallback modes
- [ ] Validate media transcoding quality
- [ ] Check timezone handling for scheduled posts
- [ ] Test all OAuth authorization flows 