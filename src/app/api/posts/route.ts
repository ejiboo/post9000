import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";
import type { Database } from "@/types/database";

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const {
      content,
      platforms,
      mediaUrls,
      hashtags,
      location,
      scheduledFor
    } = body;

    const post: Database['public']['Tables']['posts']['Insert'] = {
      user_id: userId,
      content,
      platforms,
      media_urls: mediaUrls ? mediaUrls.split(',').map((url: string) => url.trim()) : [],
      hashtags: hashtags ? hashtags.split(' ').filter((tag: string) => tag.startsWith('#')) : [],
      location,
      scheduled_for: scheduledFor || null,
      status: 'pending'
    };

    const { data, error } = await supabase
      .from('posts')
      .insert([post])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating post:', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 