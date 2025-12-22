"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("APLIKASI ERROR:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-poppins">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-slate-100 text-center relative overflow-hidden">
        {/* Dekorasi Background */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-500 to-orange-500"></div>

        {/* Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 text-red-600 rounded-full mb-6">
          <AlertTriangle size={32} />
        </div>

        {/* Text Content */}
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Terjadi Kesalahan Sistem</h2>
        <p className="text-sm text-slate-500 mb-8 leading-relaxed">Mohon maaf, terjadi kendala saat memproses permintaan Anda. Kami telah mencatat laporan ini.</p>

        {/* Actions Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={reset} className="flex-1 inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-lg font-medium transition-all active:scale-95">
            <RotateCcw size={16} /> Coba Lagi
          </button>

          <Link href="/" className="flex-1 inline-flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-lg font-medium transition-colors active:scale-95">
            <Home size={16} /> Ke Beranda
          </Link>
        </div>

        {process.env.NODE_ENV === "development" && (
          <div className="mt-8 p-3 bg-slate-50 rounded text-left border border-slate-200 overflow-x-auto">
            <p className="text-[10px] font-mono text-red-500 whitespace-pre-wrap">{error.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
