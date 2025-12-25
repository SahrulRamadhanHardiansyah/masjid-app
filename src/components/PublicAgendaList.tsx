"use client";

import { useState } from "react";
import { Calendar, Clock, MapPin, User, Image as ImageIcon } from "lucide-react";
import { AgendaDetailModal } from "./AgendaDetailModal";

export function PublicAgendaList({ events }: { events: any[] }) {
  const [selectedAgenda, setSelectedAgenda] = useState<any | null>(null);

  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((evt) => {
          const startDate = new Date(evt.start_datetime);
          const endDate = new Date(evt.end_datetime);
          const dateStr = startDate.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
          const timeStart = startDate.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
          const timeEnd = endDate.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

          return (
            <div
              key={evt.id}
              onClick={() => setSelectedAgenda(evt)}
              className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-lg transition-all flex flex-col h-full group cursor-pointer hover:-translate-y-1"
            >
              {/* Header Warna Biru */}
              <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm font-medium opacity-90">
                  <Calendar size={16} />
                  {dateStr}
                </div>
                {/* Indikator ada foto */}
                {evt.image_path && <ImageIcon size={16} className="opacity-70" />}
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-blue-700 transition-colors line-clamp-2">{evt.title}</h3>

                <p className="text-slate-500 text-sm mb-6 flex-1 leading-relaxed line-clamp-3">{evt.short_description || "Klik untuk melihat detail kegiatan."}</p>

                <div className="space-y-3 pt-4 border-t border-slate-100 text-sm text-slate-600">
                  <div className="flex items-start gap-3">
                    <Clock size={18} className="text-blue-600 shrink-0 mt-0.5" />
                    <span>
                      {timeStart} - {timeEnd} WIB
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-blue-600 shrink-0 mt-0.5" />
                    <span className="truncate">{evt.location}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <User size={18} className="text-blue-600 shrink-0 mt-0.5" />
                    <span className="font-medium text-slate-800 truncate">PIC: {evt.pic_name}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 text-center text-xs font-bold text-blue-600 uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">Lihat Detail &rarr;</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Render Modal */}
      {selectedAgenda && <AgendaDetailModal agenda={selectedAgenda} onClose={() => setSelectedAgenda(null)} />}
    </>
  );
}
