import { createClient } from "@/lib/supabase/server";
import { createAgenda } from "./actions";
import { MapPin, User, Clock, PlusCircle, AlertCircle } from "lucide-react";
import { DeleteAgendaButton } from "@/components/DeleteAgendaButton";
import { EditAgendaButton } from "@/components/EditAgendaButton";

export default async function AgendaPage() {
  const supabase = await createClient();
  const { data: events } = await supabase.from("events").select("*").order("start_datetime", { ascending: true });

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500 w-full max-w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Manajemen Agenda</h1>
          <p className="text-sm text-slate-500 mt-1">Buat dan kelola jadwal kegiatan masjid untuk jamaah.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
        {/* KOLOM KIRI (Form) */}
        <div className="lg:col-span-1 min-w-0 w-full">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm lg:sticky lg:top-24 overflow-hidden w-full">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
              <div className="bg-blue-100 p-1.5 rounded-md text-blue-700">
                <PlusCircle size={18} />
              </div>
              <h3 className="font-semibold text-slate-800">Tambah Kegiatan</h3>
            </div>

            <form action={createAgenda} className="p-4 md:p-6 space-y-4 md:space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Nama Kegiatan</label>
                <input
                  name="title"
                  required
                  placeholder="Contoh: Kajian Subuh"
                  className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2.5 text-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Tanggal</label>
                  <input name="date" type="date" required className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2.5 text-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Jam Mulai</label>
                  <input name="time" type="time" required className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2.5 text-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Lokasi</label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3 top-3 text-slate-400" />
                  <input name="location" required placeholder="Ruang Utama / Halaman" className="w-full text-sm border border-slate-300 rounded-lg pl-9 pr-3 py-2.5 text-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">PIC</label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-3 text-slate-400" />
                  <input name="pic_name" required placeholder="Nama Ustadz / Panitia" className="w-full text-sm border border-slate-300 rounded-lg pl-9 pr-3 py-2.5 text-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Deskripsi Singkat</label>
                <textarea
                  name="description"
                  rows={3}
                  placeholder="Jelaskan detail kegiatan..."
                  className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2.5 text-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none transition-all placeholder:text-slate-400"
                ></textarea>
              </div>

              <button type="submit" className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-lg text-sm font-semibold transition-all shadow-md shadow-blue-700/20 active:scale-[0.98]">
                Simpan Agenda
              </button>
            </form>
          </div>
        </div>

        {/* KOLOM KANAN (Daftar Agenda) */}
        <div className="lg:col-span-2 space-y-4 min-w-0 w-full">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-700">Daftar Agenda ({events?.length || 0})</h3>
          </div>

          <div className="grid gap-4 w-full">
            {events?.map((item) => {
              const startDate = new Date(item.start_datetime);
              const timeStr = startDate.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
              const isPast = new Date() > startDate;

              return (
                // PERBAIKAN: Tambahkan w-full dan max-w-full pada container card
                <div key={item.id} className={`group bg-white p-4 md:p-5 rounded-xl border transition-all hover:shadow-md w-full max-w-full overflow-hidden ${isPast ? "border-slate-100 opacity-60" : "border-slate-200"}`}>
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-4 w-full">
                    {/* Bagian Konten Kiri (Tanggal & Detail) */}
                    <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0 w-full overflow-hidden">
                      {/* Badge Tanggal */}
                      <div className={`flex flex-col items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl border shrink-0 ${isPast ? "bg-slate-50 border-slate-200 text-slate-400" : "bg-blue-50 border-blue-100 text-blue-700"}`}>
                        <span className="text-base sm:text-lg font-bold leading-none">{startDate.getDate()}</span>
                        <span className="text-[9px] sm:text-[10px] font-bold uppercase">{startDate.toLocaleDateString("id-ID", { month: "short" })}</span>
                      </div>

                      {/* Detail Agenda - PERBAIKAN: Tambah overflow-hidden disini */}
                      <div className="min-w-0 flex-1 overflow-hidden">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h4 className={`font-bold text-base sm:text-lg truncate max-w-full ${isPast ? "text-slate-500" : "text-slate-800"}`}>{item.title}</h4>
                          {isPast && <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-medium shrink-0">Selesai</span>}
                        </div>

                        <p className="text-sm text-slate-500 line-clamp-2 mb-3 break-words pr-2">{item.short_description || "Tidak ada deskripsi."}</p>

                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-medium text-slate-500 w-full">
                          <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded max-w-[100%]">
                            <Clock size={14} className="text-blue-500 shrink-0" /> <span className="truncate">{timeStr} WIB</span>
                          </div>
                          <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded max-w-[100%]">
                            <MapPin size={14} className="text-emerald-500 shrink-0" /> <span className="truncate">{item.location}</span>
                          </div>
                          <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded max-w-[100%]">
                            <User size={14} className="text-orange-500 shrink-0" /> <span className="truncate">{item.pic_name || "-"}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Tombol Aksi */}
                    <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto mt-2 sm:mt-0 justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                      <EditAgendaButton agenda={item} />
                      <DeleteAgendaButton id={item.id} title={item.title} />
                    </div>
                  </div>
                </div>
              );
            })}

            {events?.length === 0 && (
              <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-8 md:p-12 text-center w-full">
                <div className="inline-block p-4 bg-white rounded-full mb-3 shadow-sm">
                  <AlertCircle size={32} className="text-slate-400" />
                </div>
                <h3 className="text-slate-600 font-medium">Belum ada agenda</h3>
                <p className="text-slate-400 text-sm">Silakan tambahkan kegiatan baru melalui form di samping.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
