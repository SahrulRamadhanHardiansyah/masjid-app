import Link from "next/link";
import { FileQuestion, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-poppins">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-blue-100 rounded-full blur-xl opacity-50 animate-pulse"></div>
          <div className="relative bg-white p-6 rounded-full shadow-lg border border-slate-100">
            <FileQuestion size={48} className="text-blue-600" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-slate-800">Halaman Tidak Ditemukan</h2>
          <p className="text-slate-500">Maaf, halaman yang Anda cari tidak tersedia atau URL yang Anda masukkan salah.</p>
        </div>

        <Link href="/" className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-md shadow-blue-700/20 active:scale-95">
          <ArrowLeft size={18} /> Kembali ke Beranda
        </Link>

        <p className="text-xs text-slate-400 mt-8">Error Code: 404 • Sistem Informasi Masjid Manarul Islam</p>
      </div>
    </div>
  );
}
