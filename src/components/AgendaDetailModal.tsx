"use client";

import { createPortal } from "react-dom";
import { X, Calendar, Clock, MapPin, User, AlignLeft, Image as ImageIcon } from "lucide-react";
import { useEffect, useState } from "react";

// Helper URL untuk bucket 'events'
const getEventImageUrl = (path: string | null) => {
  if (!path) return null;
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/events/${path}`;
};

interface AgendaDetailModalProps {
  agenda: any;
  onClose: () => void;
}

export function AgendaDetailModal({ agenda, onClose }: AgendaDetailModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  if (!mounted) return null;

  const startDate = new Date(agenda.start_datetime);
  const dateStr = startDate.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const timeStart = startDate.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  const timeEnd = new Date(agenda.end_datetime).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

  return createPortal(
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 z-10 flex flex-col max-h-[90vh]">
        {/* Header Modal */}
        <div className="px-6 py-4 border-b flex justify-between items-start bg-blue-50 border-blue-100">
          <div className="pr-4">
            <h3 className="font-bold text-lg text-blue-900 leading-tight">{agenda.title}</h3>
            <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
              <Calendar size={12} /> {dateStr}
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-black/5 transition-colors text-slate-500 shrink-0">
            <X size={20} />
          </button>
        </div>

        {/* Body Scrollable */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Poster / Gambar */}
          {agenda.image_path && (
            <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 mb-4">
              <img src={getEventImageUrl(agenda.image_path)!} alt={agenda.title} className="w-full h-auto object-cover max-h-[300px]" />
            </div>
          )}

          {/* Informasi Waktu & Tempat */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <p className="text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center gap-1">
                <Clock size={10} /> Waktu
              </p>
              <p className="text-sm font-semibold text-slate-700">
                {timeStart} - {timeEnd} WIB
              </p>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <p className="text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center gap-1">
                <MapPin size={10} /> Lokasi
              </p>
              <p className="text-sm font-semibold text-slate-700 truncate">{agenda.location}</p>
            </div>
          </div>

          {/* PIC */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-orange-50 border border-orange-100 text-orange-800">
            <User size={18} />
            <div className="text-sm">
              <span className="block text-[10px] font-bold uppercase opacity-70">Penanggung Jawab</span>
              <span className="font-semibold">{agenda.pic_name}</span>
            </div>
          </div>

          {/* Deskripsi */}
          <div>
            <div className="flex items-center gap-2 text-slate-800 font-bold text-sm mb-2">
              <AlignLeft size={16} /> Deskripsi Kegiatan
            </div>
            <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{agenda.short_description || "Tidak ada deskripsi detail."}</div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
