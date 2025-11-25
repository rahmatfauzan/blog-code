import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);

  const code = searchParams.get("code");
  // REVISI: Default ke dashboard agar OAuth (Google) langsung masuk aplikasi
  const next = searchParams.get("next") ?? "/dashboard";

  const error = searchParams.get("error");
  const error_description = searchParams.get("error_description");

  if (error) {
    return NextResponse.redirect(
      `${origin}/verify/error?error=${error}&description=${error_description}`
    );
  }

  if (code) {
    const supabase = await createClient();

    // Tukar Code menjadi Session
    const { error: sessionError } = await supabase.auth.exchangeCodeForSession(
      code
    );

    if (!sessionError) {
      return NextResponse.redirect(`${origin}${next}`);
    }

    return NextResponse.redirect(`${origin}/verify/error?error=invalid_token`);
  }

  return NextResponse.redirect(`${origin}/login?error=unknown`);
}
