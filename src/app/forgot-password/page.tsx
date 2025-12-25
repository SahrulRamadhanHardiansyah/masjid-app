"use client";

import { useState } from "react";
import { requestPasswordReset } from "@/lib/actions/users";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setMessage("");
    try {
      await requestPasswordReset(formData);
      setMessage("Link reset password telah dikirim ke email Anda. Silakan cek Inbox/Spam.");
    } catch (error) {
      setMessage("Terjadi kesalahan. Pastikan email terdaftar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-slate-100">
        <Link href="/login" className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 mb-6">
          <ArrowLeft size={16} /> Kembali ke Login
        </Link>

        <h1 className="text-2xl font-bold text-slate-800 mb-2">Lupa Password?</h1>
        <p className="text-sm text-slate-500 mb-6">Masukkan email Anda untuk menerima instruksi reset password.</p>

        {message && <div className={`p-4 rounded-lg text-sm mb-6 ${message.includes("dikirim") ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>{message}</div>}

        <form action={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Email Terdaftar</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 text-slate-400" size={18} />
              <input name="email" type="email" required className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="email@anda.com" />
            </div>
          </div>

          <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold transition-all flex justify-center items-center gap-2 disabled:opacity-70">
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Kirim Link Reset"}
          </button>
        </form>
      </div>
    </div>
  );
}
