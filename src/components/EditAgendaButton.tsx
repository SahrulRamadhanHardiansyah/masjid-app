"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Pencil, X, Save, Loader2, Image as ImageIcon } from "lucide-react";
import { updateAgenda } from "@/app/(dashboard)/agenda/actions";
import { toast } from "sonner";

interface EditProps {
  agenda: {
    id: string;
    title: string;
    start_datetime: string;
    location: string;
    pic_name: string;
    short_description: string;
    image_path?: string | null; // Tambahkan tipe untuk image
  };
}

export function EditAgendaButton({ agenda }: EditProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const startDateObj = new Date(agenda.start_datetime);
  const defaultDate = startDateObj.toISOString().split("T")[0];
  const hours = startDateObj.getHours().toString().padStart(2, "0");
  const minutes = startDateObj.getMinutes().toString().padStart(2, "0");
  const defaultTime = `${hours}:${minutes}`;

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    try {
      await updateAgenda(agenda.id, formData);
      setIsOpen(false);
      toast.success("Agenda berhasil diperbarui");
    } catch (error) {
      toast.error("Gagal mengupdate agenda"); 
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="p-2 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit Agenda" type="button">
        <Pencil size={18} />
      </button>

      {isOpen &&
        mounted &&
        createPortal(
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            {/* Backdrop Gelap */}
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setIsOpen(false)} />

            {/* Konten Modal (Putih Penuh) */}
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100 z-10">
              {/* Header Modal */}
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-bold text-slate-800">Edit Agenda</h3>
                <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-rose-500 transition-colors">
                  <X size={20} />
                </button>
              </div>

              {/* Form Edit */}
              <form action={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Nama Kegiatan</label>
                  <input name="title" defaultValue={agenda.title} required className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 text-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Tanggal</label>
                    <input name="date" type="date" defaultValue={defaultDate} required className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 text-slate-700" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Jam Mulai</label>
                    <input name="time" type="time" defaultValue={defaultTime} required className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 text-slate-700" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Lokasi</label>
                    <input name="location" defaultValue={agenda.location} required className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 text-slate-700" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">PIC</label>
                    <input name="pic_name" defaultValue={agenda.pic_name} required className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 text-slate-700" />
                  </div>
                </div>

                {/* INPUT FILE UNTUK EDIT */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                    Ganti Poster / Foto
                    <span className="text-slate-400 font-normal normal-case ml-1">(Kosongkan jika tidak ingin mengubah)</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute left-3 top-3 text-slate-400 group-hover:text-blue-600 transition-colors">
                      <ImageIcon size={16} />
                    </div>
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      className="w-full text-sm border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-slate-700 file:mr-4 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                    />
                  </div>
                  {agenda.image_path && <p className="text-[10px] text-emerald-600 mt-1 flex items-center gap-1">✓ Saat ini sudah ada gambar tersimpan.</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Deskripsi</label>
                  <textarea name="description" rows={3} defaultValue={agenda.short_description} className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 text-slate-700 resize-none"></textarea>
                </div>

                <div className="pt-2 flex gap-3 sticky bottom-0 bg-white pb-1">
                  <button type="button" onClick={() => setIsOpen(false)} className="flex-1 py-2.5 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors">
                    Batal
                  </button>
                  <button type="submit" disabled={isLoading} className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                    {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
