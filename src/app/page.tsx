import { createClient } from "@/lib/supabase/server";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";
import { ArrowRight, Building2, Lock, Calendar, MapPin, Clock } from "lucide-react";
import { ImageCarousel } from "@/components/ImageCarousel";

export default async function PublicPage() {
  const supabase = await createClient();

  const { data: transactions } = await supabase.from("transactions").select("*, transaction_categories(name)").order("date", { ascending: false }).limit(5);

  const { data: income } = await supabase.from("transactions").select("amount").eq("type", "income");
  const { data: expense } = await supabase.from("transactions").select("amount").eq("type", "expense");
  const totalBalance = (income?.reduce((a, b) => a + Number(b.amount), 0) || 0) - (expense?.reduce((a, b) => a + Number(b.amount), 0) || 0);

  const nowISO = new Date().toISOString();
  const { data: events } = await supabase.from("events").select("*").gte("start_datetime", nowISO).order("start_datetime", { ascending: true }).limit(3);

  return (
    <div className="min-h-screen bg-slate-50 font-poppins selection:bg-blue-200">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="https://manarulislambangil.masjidku.web.id/wp-content/uploads/2022/06/LOGO-1.png" alt="logo masjid" className="h-10 w-auto object-contain" />
            <span className="font-bold text-lg text-slate-800 tracking-tight leading-tight">Masjid Manarul Islam Bangil</span>
          </div>
          <Link href="/login" className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-blue-700 transition-colors px-3 py-2 rounded-md hover:bg-blue-50">
            <Lock size={14} /> AREA PENGURUS
          </Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
            Transparansi Keuangan &<br />
            Agenda Masjid
          </h1>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg">Laporan terbuka untuk jamaah. Akuntabel, Real-time, dan Terpercaya.</p>
          <div className="mt-8 inline-block bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Total Saldo</p>
            <p className="text-4xl font-bold text-blue-700 tracking-tight font-mono">{formatCurrency(totalBalance)}</p>
          </div>
        </div>

        <ImageCarousel />

        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-blue-600 rounded-full inline-block"></span>
              Agenda Mendatang
            </h2>
            <Link href="/agenda-kegiatan" className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1 group">
              Lihat Semua Agenda <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {events?.map((evt) => {
              const startDate = new Date(evt.start_datetime);
              const day = startDate.getDate();
              const month = startDate.toLocaleDateString("id-ID", { month: "short" });
              const time = startDate.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

              return (
                <div key={evt.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-4">
                      <div className="bg-blue-50 text-blue-700 border border-blue-100 rounded-lg p-2 text-center min-w-[60px]">
                        <span className="block text-xl font-bold leading-none">{day}</span>
                        <span className="block text-xs font-semibold uppercase">{month}</span>
                      </div>
                      <div className="bg-slate-100 p-1.5 rounded-full text-slate-500">
                        <Calendar size={16} />
                      </div>
                    </div>
                    <h3 className="font-bold text-slate-800 mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors">{evt.title}</h3>
                    <div className="space-y-2 text-sm text-slate-500">
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-blue-600" />
                        <span>{time} WIB</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-blue-600" />
                        <span className="truncate">{evt.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {events?.length === 0 && <div className="col-span-3 text-center py-8 bg-slate-50 rounded-lg border border-dashed border-slate-300 text-slate-500">Belum ada agenda mendatang.</div>}
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-blue-600 rounded-full inline-block"></span>
            Mutasi Terakhir
          </h2>
          <Link href="/laporan" className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1 group">
            Laporan Lengkap <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-4 px-6 w-32">Tanggal</th>
                  <th className="py-4 px-4 w-40">Kategori</th>
                  <th className="py-4 px-4">Deskripsi</th>
                  <th className="py-4 px-6 text-right w-40">Nominal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions?.map((trx) => (
                  <tr key={trx.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6 text-sm text-slate-600 whitespace-nowrap">{formatDate(trx.date)}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium border ${trx.type === "income" ? "bg-white text-emerald-700 border-emerald-200" : "bg-white text-rose-700 border-rose-200"}`}>
                        {trx.transaction_categories?.name}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm font-medium text-slate-900">{trx.description || "-"}</td>
                    <td className={`py-4 px-6 text-right font-bold font-mono text-sm ${trx.type === "income" ? "text-blue-700" : "text-rose-600"}`}>
                      {trx.type === "income" ? "+" : "-"} {formatCurrency(trx.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200 grid md:grid-cols-2 gap-8 text-sm text-slate-500">
          <div>
            <h3 className="font-bold text-slate-800 mb-2">Masjid Manarul Islam Bangil</h3>
            <p>
              Jl. Jaksa Agung Suprapto No.1, Pesanggrahan, Gempeng, Kec. Bangil, Pasuruan <br />
              Kode Pos: 67153
            </p>
          </div>
          <div className="md:text-right">
            <p>&copy; {new Date().getFullYear()} Sistem Informasi Masjid.</p>
            <p className="mt-1 text-slate-400 text-xs">
              Dibuat oleh{" "}
              <a href="https://github.com/SahrulRamadhanHardiansyah" target="_blank" rel="noopener noreferrer" className="font-medium hover:text-blue-600 transition-colors">
                Sahrul Ramadhan
              </a>
              {" dan "}
              <a href="https://github.com/Ibnuubaidillah1009" target="_blank" rel="noopener noreferrer" className="font-medium hover:text-blue-600 transition-colors">
                Ibnu Ubaidillah
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
