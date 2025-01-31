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
      .from('platform_connections')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching platform connections:', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 