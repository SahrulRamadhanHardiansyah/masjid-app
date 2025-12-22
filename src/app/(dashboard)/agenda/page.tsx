import { createClient } from '@/lib/supabase/server'
import { createAgenda, deleteAgenda } from './actions'
import { Calendar, MapPin, User, Clock, Trash2, PlusCircle, AlertCircle } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { DeleteAgendaButton } from '@/components/DeleteAgendaButton'
import { EditAgendaButton } from '@/components/EditAgendaButton'

export default async function AgendaPage() {
  const supabase = await createClient()

  // Ambil data dari tabel 'events' agar sinkron dengan halaman public
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .order('start_datetime', { ascending: true })

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header Section */}
      <div className="flex justify-between items-end">
        <div>
           <h1 className="text-3xl font-bold text-slate-800">Manajemen Agenda</h1>
           <p className="text-slate-500 mt-1">Buat dan kelola jadwal kegiatan masjid untuk jamaah.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* KOLOM KIRI: FORM INPUT */}
        <div className="lg:col-span-1">
           <div className="bg-white rounded-xl border border-slate-200 shadow-sm sticky top-24 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                 <div className="bg-blue-100 p-1.5 rounded-md text-blue-700">
                    <PlusCircle size={18} />
                 </div>
                 <h3 className="font-semibold text-slate-800">Tambah Kegiatan Baru</h3>
              </div>

              <form action={createAgenda} className="p-6 space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Nama Kegiatan</label>
                  <input name="title" required placeholder="Contoh: Kajian Subuh" className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2.5 text-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-400" />
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
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Penanggung Jawab (PIC)</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-3 text-slate-400" />
                    <input name="pic_name" required placeholder="Nama Ustadz / Panitia" className="w-full text-sm border border-slate-300 rounded-lg pl-9 pr-3 py-2.5 text-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Deskripsi Singkat</label>
                  <textarea name="description" rows={3} placeholder="Jelaskan detail kegiatan..." className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2.5 text-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"></textarea>
                </div>

                <button type="submit" className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-lg text-sm font-semibold transition-all shadow-md shadow-blue-700/20 active:scale-[0.98]">
                  Simpan Agenda
                </button>
              </form>
           </div>
        </div>

        {/* KOLOM KANAN: LIST CARD */}
        <div className="lg:col-span-2 space-y-4">
           <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-700">Daftar Agenda ({events?.length || 0})</h3>
           </div>

           <div className="grid gap-4">
              {events?.map((item) => {
                 const startDate = new Date(item.start_datetime)
                 const dateStr = startDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
                 const timeStr = startDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
                 
                 const isPast = new Date() > startDate

                 return (
                    <div key={item.id} className={`group bg-white p-5 rounded-xl border transition-all hover:shadow-md ${isPast ? 'border-slate-100 opacity-60' : 'border-slate-200'}`}>
                       <div className="flex items-start justify-between gap-4">
                          
                          {/* Tanggal Badge */}
                          <div className={`flex flex-col items-center justify-center w-14 h-14 rounded-xl border shrink-0 ${isPast ? 'bg-slate-50 border-slate-200 text-slate-400' : 'bg-blue-50 border-blue-100 text-blue-700'}`}>
                             <span className="text-lg font-bold leading-none">{startDate.getDate()}</span>
                             <span className="text-[10px] font-bold uppercase">{startDate.toLocaleDateString('id-ID', { month: 'short' })}</span>
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                             <div className="flex items-center gap-2 mb-1">
                                <h4 className={`font-bold text-lg truncate ${isPast ? 'text-slate-500' : 'text-slate-800'}`}>{item.title}</h4>
                                {isPast && <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-medium">Selesai</span>}
                             </div>
                             
                             <p className="text-sm text-slate-500 line-clamp-2 mb-3">{item.short_description || 'Tidak ada deskripsi.'}</p>
                             
                             <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500">
                                <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded">
                                   <Clock size={14} className="text-blue-500" /> {timeStr} WIB
                                </div>
                                <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded">
                                   <MapPin size={14} className="text-emerald-500" /> {item.location}
                                </div>
                                <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded">
                                   <User size={14} className="text-orange-500" /> {item.pic_name || '-'}
                                </div>
                             </div>
                          </div>

                          {/* Action Buttons: Edit & Delete */}
                          <div className="flex flex-col gap-1">
                              <EditAgendaButton agenda={item} />
                              <DeleteAgendaButton id={item.id} title={item.title} />
                          </div>
                       </div>
                    </div>
                 )
              })}

              {events?.length === 0 && (
                 <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-12 text-center">
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
  )
}