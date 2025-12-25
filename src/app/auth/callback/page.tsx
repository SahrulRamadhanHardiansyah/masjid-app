"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    const handleAuth = async () => {
      // 1. Handle hash-based tokens (from email links)
      if (window.location.hash) {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");

        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (!error) {
            router.replace("/dashboard");
            router.refresh();
            return;
          } else {
            console.error("Set session error:", error);
            router.replace("/login?error=session-failed");
            return;
          }
        }
      }

      // 2. Handle query-based tokens (token_hash approach)
      const tokenHash = searchParams.get("token_hash");
      const type = searchParams.get("type");

      if (tokenHash && type) {
        const { error } = await supabase.auth.verifyOtp({
          type: type as any,
          token_hash: tokenHash,
        });

        if (!error) {
          const nextUrl = searchParams.get("next") || "/dashboard";
          router.replace(nextUrl);
          router.refresh();
          return;
        } else {
          console.error("Verification error:", error);
          router.replace("/login?error=verification-failed");
          return;
        }
      }

      // 3. Check for existing session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        const nextUrl = searchParams.get("next") || "/dashboard";
        router.replace(nextUrl);
        router.refresh();
      } else {
        router.replace("/login?error=no-session");
      }
    };

    handleAuth();
  }, [router, searchParams, supabase]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-500">
        <div className="bg-white p-4 rounded-full shadow-lg">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
        <div className="text-center">
          <h3 className="font-bold text-slate-800 text-lg">Memproses Verifikasi...</h3>
          <p className="text-sm text-slate-500">Mohon tunggu, Anda sedang diarahkan.</p>
        </div>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div className="h-screen bg-slate-50" />}>
      <AuthCallbackContent />
    </Suspense>
  );
}
