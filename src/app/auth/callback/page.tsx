"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client"; // Pastikan ini mengarah ke client component supabase Anda
import { Loader2 } from "lucide-react";

export default function AuthCallbackPage() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const handleAuth = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (session) {
        router.replace("/dashboard");
        router.refresh();
      } else if (error) {
        console.error("Auth Error:", error);
        router.replace("/login?error=auth-failed");
      } else {
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
          if (event === "SIGNED_IN" && session) {
            router.replace("/dashboard");
            router.refresh();
          }
        });
        return () => subscription.unsubscribe();
      }
    };

    handleAuth();
  }, [router, supabase]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-500">
        <div className="bg-white p-4 rounded-full shadow-lg">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
        <div className="text-center">
          <h3 className="font-bold text-slate-800 text-lg">Memproses Verifikasi...</h3>
          <p className="text-sm text-slate-500">Mohon tunggu sebentar, Anda akan diarahkan otomatis.</p>
        </div>
      </div>
    </div>
  );
}
