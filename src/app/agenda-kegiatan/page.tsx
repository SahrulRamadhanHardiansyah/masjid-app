import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";
import { AgendaFilter } from "@/components/AgendaFilter";
import { PublicAgendaList } from "@/components/PublicAgendaList";

export default async function AgendaPage(props: { searchParams: Promise<{ date?: string }> }) {
  const searchParams = await props.searchParams;
  const supabase = await createClient();
  const filterDate = searchParams.date;

  let query = supabase
    .from("events")
    .select("*") // Image path otomatis terambil
    .order("start_datetime", { ascending: true });

  if (filterDate) {
    const startOfDay = `${filterDate}T00:00:00`;
    const endOfDay = `${filterDate}T23:59:59`;
    query = query.gte("start_datetime", startOfDay).lte("start_datetime", endOfDay);
  } else {
    const nowISO = new Date().toISOString();
    query = query.gte("start_datetime", nowISO);
  }

  const { data: events } = await query;

  return (
    <div className="min-h-screen bg-slate-50 font-poppins text-slate-900">
      {/* Navbar Simple */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-6 h-16 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-blue-700 transition-colors">
            <ArrowLeft size={18} /> <span className="text-sm font-medium">Kembali ke Beranda</span>
          </Link>
          <div className="flex items-center gap-2 font-bold text-slate-800">Agenda Masjid</div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">Jadwal Kegiatan Masjid</h1>
          <p className="text-slate-500">Ikuti berbagai kegiatan keagamaan dan sosial yang diselenggarakan.</p>
        </div>

        <AgendaFilter />

        {/* Gunakan Component Client List untuk Grid & Modal */}
        {events && events.length > 0 ? (
          <PublicAgendaList events={events} />
        ) : (
          // State Kosong
          <div className="py-16 text-center bg-white rounded-xl border border-slate-200 border-dashed">
            <div className="inline-block p-4 bg-slate-50 rounded-full mb-4">
              <SearchX size={48} className="text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-700">Tidak Ada Agenda Ditemukan</h3>
            <p className="text-slate-500 max-w-md mx-auto mt-2">{filterDate ? `Tidak ada kegiatan pada tanggal tersebut.` : "Saat ini belum ada jadwal kegiatan mendatang."}</p>
            {filterDate && (
              <Link href="/agenda-kegiatan" className="inline-block mt-4 text-blue-600 font-medium hover:underline">
                Tampilkan Semua Agenda
              </Link>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
