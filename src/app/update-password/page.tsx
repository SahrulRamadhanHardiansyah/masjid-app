"use client";

import { useState } from "react";
import { updatePassword } from "@/lib/actions/users";
import { useRouter } from "next/navigation";
import { Lock, Loader2 } from "lucide-react";

export default function UpdatePasswordPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    try {
      await updatePassword(formData);
      alert("Password berhasil diubah! Silakan login.");
      router.push("/login");
    } catch (error) {
      alert("Gagal mengubah password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-slate-100">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Buat Password Baru</h1>
        <p className="text-sm text-slate-500 mb-6">Masukkan password baru untuk akun Anda.</p>

        <form action={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Password Baru</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 text-slate-400" size={18} />
              <input name="password" type="password" required minLength={6} className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="******" />
            </div>
          </div>

          <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold transition-all flex justify-center items-center gap-2">
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Simpan Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
