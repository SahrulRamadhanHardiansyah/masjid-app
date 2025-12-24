import { createClient } from "@/lib/supabase/server";
import { formatCurrency, formatDate } from "@/lib/utils";
import { MonthFilter } from "@/components/MonthFilter";
import { ExportButton } from "@/components/ExportButton";
import Link from "next/link";
import { ArrowLeft, Building2 } from "lucide-react";

export default async function LaporanPage(props: { searchParams: Promise<{ month?: string; year?: string }> }) {
  const searchParams = await props.searchParams;
  const supabase = await createClient();

  const now = new Date();
  const month = Number(searchParams.month) || now.getMonth() + 1;
  const year = Number(searchParams.year) || now.getFullYear();

  const startDate = new Date(year, month - 1, 1).toLocaleDateString("en-CA");
  const endDate = new Date(year, month, 0).toLocaleDateString("en-CA");

  const { data: transactions } = await supabase.from("transactions").select("*, transaction_categories(name)").gte("date", startDate).lte("date", endDate).order("date", { ascending: true });

  const totalIncome = transactions?.filter((t) => t.type === "income").reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;
  const totalExpense = transactions?.filter((t) => t.type === "expense").reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;
  const surplus = totalIncome - totalExpense;

  return (
    <div className="min-h-screen bg-slate-50 font-poppins text-slate-900 w-full max-w-full pb-10">
      {/* Navbar Simple - Sticky Top */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 md:px-6 h-14 md:h-16 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-blue-700 transition-colors group">
            <div className="p-1 rounded-full group-hover:bg-blue-50 transition-colors">
              <ArrowLeft size={18} />
            </div>
            <span className="text-xs md:text-sm font-medium">Kembali</span>
          </Link>
          <div className="flex items-center gap-2 font-bold text-slate-800 text-sm md:text-base">
            <Building2 size={18} className="text-blue-700" />
            <span>Laporan Kas</span>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Header Controls (PERBAIKAN UTAMA DI SINI) */}
        <div className="flex flex-col gap-4 mb-6">
          {/* Judul & Periode (Mobile) */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div>
              <h1 className="text-lg md:text-2xl font-bold text-slate-800">Buku Besar Transaksi</h1>
              <p className="text-xs text-slate-500 mt-1 md:hidden">Periode: {new Date(year, month - 1).toLocaleDateString("id-ID", { month: "long", year: "numeric" })}</p>
            </div>

            {/* Periode (Desktop Only) */}
            <div className="hidden md:block text-sm text-slate-500">
              Periode: <span className="font-semibold text-slate-700">{new Date(year, month - 1).toLocaleDateString("id-ID", { month: "long", year: "numeric" })}</span>
            </div>
          </div>

          {/* Controls Container */}
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            {/* Filter Bulan (Full width di mobile, auto di desktop) */}
            <div className="w-full sm:w-auto">
              <MonthFilter />
            </div>

            {/* Tombol Export (Full width di mobile, auto di desktop) */}
            <div className="w-full sm:w-auto sm:ml-auto">
              {" "}
              {/* sm:ml-auto agar di desktop dia geser ke kanan mentok */}
              <ExportButton month={month} year={year} transactions={transactions || []} />
            </div>
          </div>
        </div>

        {/* ... (Sisa kode Summary Cards dan Table TIDAK PERLU DIUBAH, sudah bagus) ... */}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-emerald-500 relative overflow-hidden">
            <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Pemasukan</p>
            <p className="text-lg md:text-xl font-bold text-emerald-600 font-mono truncate" title={formatCurrency(totalIncome)}>
              {formatCurrency(totalIncome)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-rose-500 relative overflow-hidden">
            <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Pengeluaran</p>
            <p className="text-lg md:text-xl font-bold text-rose-600 font-mono truncate" title={formatCurrency(totalExpense)}>
              {formatCurrency(totalExpense)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-blue-600 relative overflow-hidden">
            <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Saldo Akhir</p>
            <p className={`text-lg md:text-xl font-bold font-mono truncate ${surplus >= 0 ? "text-blue-600" : "text-rose-600"}`} title={formatCurrency(surplus)}>
              {surplus >= 0 ? "+" : ""} {formatCurrency(surplus)}
            </p>
          </div>
        </div>

        {/* Main Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="overflow-x-auto w-full scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
            <table className="w-full text-left min-w-[800px]">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-4 w-14 text-center">No</th>
                  <th className="py-4 px-4 w-32">Tanggal</th>
                  <th className="py-4 px-4 w-40">Kategori</th>
                  <th className="py-4 px-4 min-w-[200px]">Uraian</th>
                  <th className="py-4 px-4 text-right w-36">Masuk</th>
                  <th className="py-4 px-6 text-right w-36">Keluar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {transactions?.map((trx, index) => (
                  <tr key={trx.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 text-center text-xs text-slate-400 font-mono">{index + 1}</td>
                    <td className="py-3 px-4 text-xs md:text-sm text-slate-600 whitespace-nowrap">{formatDate(trx.date)}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase whitespace-nowrap ${
                          trx.type === "income" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-rose-50 text-rose-700 border border-rose-100"
                        }`}
                      >
                        {trx.transaction_categories?.name}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs md:text-sm font-medium text-slate-700">{trx.description || "-"}</td>
                    <td className="py-3 px-4 text-right font-mono text-xs md:text-sm text-emerald-600 font-semibold">{trx.type === "income" ? formatCurrency(trx.amount) : "-"}</td>
                    <td className="py-3 px-6 text-right font-mono text-xs md:text-sm text-rose-600 font-semibold">{trx.type === "expense" ? formatCurrency(trx.amount) : "-"}</td>
                  </tr>
                ))}
                {transactions?.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Building2 size={32} className="opacity-20" />
                        <p>Tidak ada transaksi tercatat pada periode ini.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
              {transactions && transactions.length > 0 && (
                <tfoot className="bg-slate-50 border-t border-slate-200 font-bold text-slate-800">
                  <tr>
                    <td colSpan={4} className="py-4 px-6 text-right uppercase text-[10px] md:text-xs tracking-wider text-slate-500">
                      Total Periode Ini
                    </td>
                    <td className="py-4 px-4 text-right font-mono text-xs md:text-sm text-emerald-700 whitespace-nowrap bg-emerald-50/30">{formatCurrency(totalIncome)}</td>
                    <td className="py-4 px-6 text-right font-mono text-xs md:text-sm text-rose-700 whitespace-nowrap bg-rose-50/30">{formatCurrency(totalExpense)}</td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>

        <div className="md:hidden mt-3 flex items-center justify-center gap-2 text-[10px] text-slate-400 animate-pulse">
          <span>← Geser tabel untuk detail →</span>
        </div>
      </main>
    </div>
  );
}
