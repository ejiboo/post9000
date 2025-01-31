import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { error } = await supabase
      .from('platform_connections')
      .delete()
      .eq('id', params.id)
      .eq('user_id', userId);

    if (error) throw error;

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting platform connection:', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 