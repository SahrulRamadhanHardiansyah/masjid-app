"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { UserPlus, X, Loader2 } from "lucide-react";
import { createNewUser } from "@/lib/actions/users";
import { toast } from "sonner";

export function AddUserModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    try {
      await createNewUser(formData);
      setIsOpen(false);
      toast.success("Pengguna berhasil ditambahkan", {
        description: "Email verifikasi telah dikirim ke alamat tersebut.",
      });
    } catch (error: any) {
      toast.error("Gagal membuat pengguna", {
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
        <UserPlus size={18} /> Tambah Pengurus
      </button>

      {isOpen &&
        createPortal(
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
            <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
              <div className="px-6 py-4 border-b flex justify-between items-center bg-slate-50">
                <h3 className="font-bold text-slate-800">Tambah User Baru</h3>
                <button onClick={() => setIsOpen(false)}>
                  <X size={20} className="text-slate-400" />
                </button>
              </div>
              <form action={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nama Lengkap</label>
                  <input name="fullName" required className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" placeholder="Nama Pengurus" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email</label>
                  <input name="email" type="email" required className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" placeholder="email@masjid.com" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Password Awal</label>
                  <input name="password" type="password" required minLength={6} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" placeholder="******" />
                  <p className="text-[10px] text-slate-400 mt-1">Minimal 6 karakter.</p>
                </div>
                <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-bold flex justify-center items-center gap-2">
                  {isLoading && <Loader2 size={16} className="animate-spin" />} Buat User
                </button>
              </form>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
