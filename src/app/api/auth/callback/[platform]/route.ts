import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { cookies } from 'next/headers';
import { OAUTH_CONFIGS } from "@/lib/oauth/config";
import { supabase } from "@/lib/supabase/client";
import type { SocialPlatform } from "@/types/database";
import type { OAuthState } from "@/lib/oauth/types";

export async function GET(
  request: Request,
  { params }: { params: { platform: SocialPlatform } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      return new NextResponse(`OAuth Error: ${error}`, { status: 400 });
    }

    if (!code || !state) {
      return new NextResponse("Missing required parameters", { status: 400 });
    }

    // Verify state from cookie using next/headers
    const cookieStore = cookies();
    const storedState = cookieStore.get('oauth_state')?.value;
    
    if (!storedState || storedState !== state) {
      return new NextResponse("Invalid state", { status: 400 });
    }

    const { platform, redirectUrl } = JSON.parse(
      Buffer.from(state, 'base64').toString()
    ) as OAuthState;

    const config = OAUTH_CONFIGS[platform];
    if (!config) {
      return new NextResponse(`Platform ${platform} not supported`, { status: 400 });
    }

    // Exchange code for tokens
    const tokenResponse = await fetch(config.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(
          `${config.clientId}:${config.clientSecret}`
        ).toString('base64')}`
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: config.redirectUri
      })
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for tokens');
    }

    const tokens = await tokenResponse.json();

    // Store the connection in Supabase
    const { error: dbError } = await supabase
      .from('platform_connections')
      .upsert({
        user_id: userId,
        platform,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_at: tokens.expires_in 
          ? new Date(Date.now() + tokens.expires_in * 1000).toISOString()
          : null
      })
      .select()
      .single();

    if (dbError) throw dbError;

    // Redirect back to the settings page
    const response = NextResponse.redirect(new URL(redirectUrl, request.url));
    response.cookies.delete('oauth_state');
    return response;
  } catch (error) {
    console.error('Error handling OAuth callback:', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 