import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { OAUTH_CONFIGS } from "@/lib/oauth/config";
import type { SocialPlatform } from "@/types/database";

export async function GET(
  request: Request,
  { params }: { params: { platform: SocialPlatform } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const platform = params.platform;
    const config = OAUTH_CONFIGS[platform];

    if (!config) {
      return new NextResponse(`Platform ${platform} not supported`, { status: 400 });
    }

    // Generate random state for security
    const state = Buffer.from(JSON.stringify({
      platform,
      redirectUrl: '/settings'
    })).toString('base64');

    // Store state in cookie for verification
    const response = NextResponse.redirect(new URL(
      `${config.authorizeUrl}?` + new URLSearchParams({
        response_type: 'code',
        client_id: config.clientId,
        redirect_uri: config.redirectUri,
        scope: config.scopes.join(' '),
        state
      })
    ));

    response.cookies.set('oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 10 // 10 minutes
    });

    return response;
  } catch (error) {
    console.error('Error initiating OAuth:', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 