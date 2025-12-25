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
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");

      if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) {
          console.error("Set Session Error:", error);
          router.replace("/login?error=auth-failed");
          return;
        }
      }

      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (session) {
        const nextUrl = searchParams.get("next") || "/dashboard";
        router.replace(nextUrl);
        router.refresh();
      } else if (error) {
        console.error("Auth Error:", error);
        router.replace("/login?error=auth-failed");
      } else {
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
          if (event === "SIGNED_IN" && session) {
            const nextUrl = searchParams.get("next") || "/dashboard";
            router.replace(nextUrl);
            router.refresh();
          }
        });
        return () => subscription.unsubscribe();
      }
    };

    handleAuth();
  }, [router, supabase, searchParams]);

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
