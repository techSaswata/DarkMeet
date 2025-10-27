import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// Save/Update settings
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    if (!data.user_id) {
      return NextResponse.json({ message: "User ID required" }, { status: 400 });
    }
    if (!supabaseAdmin) {
      return NextResponse.json({ message: "Supabase admin client missing" }, { status: 500 });
    }
    // Save all settings fields
    const { error } = await supabaseAdmin
      .from("user_settings")
      .upsert([data], { onConflict: "user_id" });
    if (error) {
      return NextResponse.json({ message: "Database error", error }, { status: 500 });
    }
    return NextResponse.json({ message: "Settings saved" });
  } catch (err) {
    return NextResponse.json({ message: "Invalid request", error: err }, { status: 400 });
  }
}

// Get settings
export async function GET(req: NextRequest) {
  try {
    const user_id = new URL(req.url).searchParams.get("user_id");
    if (!user_id) {
      return NextResponse.json({ message: "User ID required" }, { status: 400 });
    }
    if (!supabaseAdmin) {
      return NextResponse.json({ message: "Supabase admin client missing" }, { status: 500 });
    }
    const { data, error } = await supabaseAdmin
      .from("user_settings")
      .select("*")
      .eq("user_id", user_id)
      .single();
    if (error || !data) {
      return NextResponse.json({ message: "Settings not found", error }, { status: 404 });
    }
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ message: "Invalid request", error: err }, { status: 400 });
  }
}
