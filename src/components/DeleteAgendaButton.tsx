"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { deleteAgenda } from "@/app/(dashboard)/agenda/actions";

export function DeleteAgendaButton({ id, title }: { id: string; title: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteAgenda(id);
      setIsOpen(false);
    } catch (error) {
      alert("Gagal menghapus agenda");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Hapus Agenda" type="button">
        <Trash2 size={18} />
      </button>

      {isOpen &&
        mounted &&
        createPortal(
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            {/* Backdrop Gelap */}
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setIsOpen(false)} />

            {/* Konten Modal (Putih Penuh) */}
            <div className="relative bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200 border border-slate-100 z-10">
              <div className="flex flex-col items-center text-center">
                <div className="bg-red-100 p-3 rounded-full mb-4">
                  <AlertTriangle size={32} className="text-red-600" />
                </div>

                <h3 className="text-lg font-bold text-slate-800 mb-2">Hapus Kegiatan?</h3>
                <p className="text-sm text-slate-500 mb-6">
                  Anda yakin ingin menghapus kegiatan <br />
                  <span className="font-semibold text-slate-700">"{title}"</span>? <br />
                  Data yang dihapus tidak dapat dikembalikan.
                </p>

                <div className="flex items-center gap-3 w-full">
                  <button onClick={() => setIsOpen(false)} disabled={isDeleting} className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors disabled:opacity-50">
                    Batal
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors shadow-lg shadow-red-600/20 disabled:opacity-70"
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" /> Hapus...
                      </>
                    ) : (
                      "Ya, Hapus"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
