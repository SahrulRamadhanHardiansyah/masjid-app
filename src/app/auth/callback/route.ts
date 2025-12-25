import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const token_hash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type");
  const next = requestUrl.searchParams.get("next") || "/dashboard";

  if (token_hash && type) {
    const supabase = createClient();

    const { error } = await (
      await supabase
    ).auth.verifyOtp({
      type: type as any,
      token_hash,
    });

    if (error) {
      console.error("Verification error:", error);
      return NextResponse.redirect(new URL("/login?error=verification-failed", request.url));
    }
  }

  return NextResponse.redirect(new URL(next, request.url));
}
