"use client";

import { useState, useTransition, useEffect } from "react"; // Tambah useEffect
import { createPortal } from "react-dom"; // Tambah createPortal
import { useRouter } from "next/navigation";
import { createCategory } from "@/lib/actions/category";
import { Loader2, Plus, X } from "lucide-react";

export function AddCategoryModal() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false); // State untuk cek mounting
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Pastikan kode ini berjalan di client agar document.body tersedia
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (formData: FormData) => {
    try {
      await createCategory(formData);
      startTransition(() => {
        router.refresh();
        setOpen(false);
      });
    } catch (error) {
      console.error("Error creating category:", error);
      alert("Gagal menambah kategori");
    }
  };

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="text-[10px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 bg-blue-50 px-2 py-1 rounded transition-colors">
        <Plus size={12} /> Tambah
      </button>

      {open &&
        mounted &&
        createPortal(
          <div className="fixed inset-0 z-[999] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl w-full max-w-sm border border-slate-100 shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
              {/* Header */}
              <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-bold text-slate-800 text-sm">Tambah Kategori Baru</h3>
                <button type="button" onClick={() => setOpen(false)} className="text-slate-400 hover:text-rose-500 transition-colors">
                  <X size={18} />
                </button>
              </div>

              <form action={handleSubmit} className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Nama Kategori</label>
                  <input
                    name="name"
                    required
                    placeholder="Contoh: Parkir, Sedekah Subuh"
                    className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2.5 text-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Tipe Transaksi</label>
                  <select name="type" className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2.5 text-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white">
                    <option value="income">Pemasukan (+)</option>
                    <option value="expense">Pengeluaran (-)</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button" // Wajib type="button"
                    onClick={() => setOpen(false)}
                    className="flex-1 py-2.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold uppercase tracking-wide hover:bg-slate-200 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg text-xs font-bold uppercase tracking-wide hover:bg-blue-700 transition-colors disabled:opacity-70 flex items-center justify-center gap-2 shadow-md shadow-blue-600/20"
                  >
                    {isPending ? <Loader2 size={14} className="animate-spin" /> : "Simpan"}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body // Target Portal
        )}
    </>
  );
}
