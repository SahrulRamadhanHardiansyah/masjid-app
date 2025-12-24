  import { createClient } from '@/lib/supabase/server'
  import Link from 'next/link'
  import { ArrowLeft, Building2, Calendar, Clock, MapPin, User, SearchX } from 'lucide-react'
  import { AgendaFilter } from '@/components/AgendaFilter' 

  export default async function AgendaPage(props: {
    searchParams: Promise<{ date?: string }>
  }) {
    const searchParams = await props.searchParams
    const supabase = await createClient()

    const filterDate = searchParams.date
    
    let query = supabase
      .from('events')
      .select('*')
      .order('start_datetime', { ascending: true })

    if (filterDate) {
      const startOfDay = `${filterDate}T00:00:00`
      const endOfDay = `${filterDate}T23:59:59`
      
      query = query
        .gte('start_datetime', startOfDay)
        .lte('start_datetime', endOfDay)
    } else {
      const nowISO = new Date().toISOString()
      query = query.gte('start_datetime', nowISO)
    }

    const { data: events } = await query

    return (
      <div className="min-h-screen bg-slate-50 font-poppins text-slate-900">
        
        {/* Navbar Simple */}
        <nav className="bg-white border-b border-slate-200 sticky top-0 z-30">
          <div className="max-w-5xl mx-auto px-6 h-16 flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-blue-700 transition-colors">
              <ArrowLeft size={18} /> <span className="text-sm font-medium">Kembali ke Beranda</span>
            </Link>
            <div className="flex items-center gap-2 font-bold text-slate-800">
              Agenda Masjid
            </div>
          </div>
        </nav>

        <main className="max-w-5xl mx-auto px-6 py-10">
          
          <div className="text-center mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">Jadwal Kegiatan Masjid</h1>
              <p className="text-slate-500">Ikuti berbagai kegiatan keagamaan dan sosial yang diselenggarakan.</p>
          </div>

          {/* Masukkan Filter Component di sini */}
          <AgendaFilter />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events?.map((evt) => {
                  const startDate = new Date(evt.start_datetime)
                  const endDate = new Date(evt.end_datetime)
                  
                  const dateStr = startDate.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
                  const timeStart = startDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
                  const timeEnd = endDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })

                  return (
                      <div key={evt.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-lg transition-all flex flex-col h-full group">
                          {/* Header Warna Biru */}
                          <div className="bg-blue-600 p-4 text-white">
                              <div className="flex items-center gap-2 text-sm font-medium opacity-90">
                                  <Calendar size={16} />
                                  {dateStr}
                              </div>
                          </div>

                          <div className="p-6 flex-1 flex flex-col">
                              <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-blue-700 transition-colors">
                                  {evt.title}
                              </h3>
                              
                              <p className="text-slate-500 text-sm mb-6 flex-1 leading-relaxed">
                                  {evt.short_description || 'Tidak ada deskripsi.'}
                              </p>

                              <div className="space-y-3 pt-4 border-t border-slate-100 text-sm text-slate-600">
                                  <div className="flex items-start gap-3">
                                      <Clock size={18} className="text-blue-600 shrink-0 mt-0.5" />
                                      <span>{timeStart} - {timeEnd} WIB</span>
                                  </div>
                                  <div className="flex items-start gap-3">
                                      <MapPin size={18} className="text-blue-600 shrink-0 mt-0.5" />
                                      <span>{evt.location}</span>
                                  </div>
                                  <div className="flex items-start gap-3">
                                      <User size={18} className="text-blue-600 shrink-0 mt-0.5" />
                                      <span className="font-medium text-slate-800">PIC: {evt.pic_name}</span>
                                  </div>
                              </div>
                          </div>
                      </div>
                  )
              })}

              {/* Tampilan jika data kosong (Filtered atau memang kosong) */}
              {events?.length === 0 && (
                  <div className="col-span-full py-16 text-center bg-white rounded-xl border border-slate-200 border-dashed">
                      <div className="inline-block p-4 bg-slate-50 rounded-full mb-4">
                          <SearchX size={48} className="text-slate-300" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-700">Tidak Ada Agenda Ditemukan</h3>
                      <p className="text-slate-500 max-w-md mx-auto mt-2">
                          {filterDate 
                              ? `Tidak ada kegiatan yang terjadwal pada tanggal ${new Date(filterDate).toLocaleDateString('id-ID', { dateStyle: 'long' })}.` 
                              : 'Saat ini belum ada jadwal kegiatan mendatang.'}
                      </p>
                      {filterDate && (
                          <Link href="/agenda-kegiatan" className="inline-block mt-4 text-blue-600 font-medium hover:underline">
                              Tampilkan Semua Agenda
                          </Link>
                      )}
                  </div>
              )}
          </div>

        </main>
      </div>
    )
  }