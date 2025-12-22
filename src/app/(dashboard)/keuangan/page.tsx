import { createClient } from "@/lib/supabase/server";
import { createTransaction } from "@/lib/actions/finance";
import { formatCurrency, formatDate } from "@/lib/utils";
import { PlusCircle, Search, Calendar } from "lucide-react";
import { TransactionControls } from "@/components/TransactionControls";
import { AddCategoryModal } from "@/components/AddCategoryModal";

export default async function KeuanganPage(props: { searchParams: Promise<{ page?: string; sort?: string }> }) {
  const searchParams = await props.searchParams;
  const supabase = await createClient();

  // 1. Setup Pagination & Sorting Variables
  const page = Number(searchParams.page) || 1;
  const sort = searchParams.sort || "latest";
  const itemsPerPage = 10;

  // Hitung Range untuk Supabase
  const from = (page - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;

  const { data: categories } = await supabase.from("transaction_categories").select("*");

  // 2. Build Query Dinamis
  let query = supabase.from("transactions").select("*, transaction_categories(name)", { count: "exact" });

  // Logic Sorting
  switch (sort) {
    case "oldest":
      query = query.order("date", { ascending: true });
      break;
    case "amount_desc":
      query = query.order("amount", { ascending: false });
      break;
    case "amount_asc":
      query = query.order("amount", { ascending: true });
      break;
    case "desc_asc":
      query = query.order("description", { ascending: true });
      break;
    default: // latest
      query = query.order("date", { ascending: false });
  }

  // 3. Execute Query dengan Range
  const { data: transactions, count } = await query.range(from, to);

  const totalCount = count || 0;
  const hasNextPage = totalCount > to + 1;
  const hasPrevPage = page > 1;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Manajemen Keuangan</h1>
          <p className="text-slate-500 mt-1">Catat pemasukan dan pengeluaran kas masjid secara rinci.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Kolom Kiri: Form Input */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm sticky top-24 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
              <div className="bg-emerald-100 p-1.5 rounded-md text-emerald-700">
                <PlusCircle size={18} />
              </div>
              <h3 className="font-semibold text-slate-800">Catat Transaksi</h3>
            </div>

            <form
              action={async (formData) => {
                "use server";
                await createTransaction(formData);
              }}
              className="p-6 space-y-5"
            >
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Tanggal Transaksi</label>
                <div className="relative">
                  <Calendar size={16} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="date"
                    name="date"
                    required
                    className="w-full text-sm border border-slate-300 rounded-lg pl-9 pr-3 py-2.5 text-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                    defaultValue={new Date().toISOString().split("T")[0]}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Tipe</label>
                  <select name="type" className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2.5 text-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-white">
                    <option value="income">Pemasukan (+)</option>
                    <option value="expense">Pengeluaran (-)</option>
                  </select>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-500 uppercase">Kategori</label>
                  </div>
                  <select name="category_id" className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2.5 text-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-white">
                    {categories?.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <div className="mt-2 flex justify-end">
                    <AddCategoryModal />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Nominal (Rp)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-sm">Rp</span>
                  <input
                    type="number"
                    name="amount"
                    placeholder="0"
                    required
                    min="1"
                    className="w-full text-sm border border-slate-300 rounded-lg pl-9 pr-3 py-2.5 text-slate-700 font-mono font-medium focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Keterangan</label>
                <textarea
                  name="description"
                  rows={3}
                  placeholder="Contoh: Sumbangan hamba Allah..."
                  className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2.5 text-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 resize-none transition-all placeholder:text-slate-400"
                ></textarea>
              </div>

              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg text-sm font-semibold transition-all shadow-md shadow-emerald-600/20 active:scale-[0.98]">
                Simpan Transaksi
              </button>
            </form>
          </div>
        </div>

        {/* Kolom Kanan: Tabel Data */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Riwayat Keuangan</h2>
              <p className="text-xs text-slate-500 mt-1">
                Menampilkan{" "}
                <span className="font-semibold text-slate-700">
                  {from + 1}-{Math.min(to + 1, totalCount)}
                </span>{" "}
                dari <span className="font-semibold text-slate-700">{totalCount}</span> transaksi.
              </p>
            </div>
            <TransactionControls hasNextPage={hasNextPage} hasPrevPage={hasPrevPage} totalCount={totalCount} currentPage={page} />
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm min-h-[400px]">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-6 w-32">Tanggal</th>
                    <th className="py-3.5 px-4 w-40">Kategori</th>
                    <th className="py-3.5 px-4">Keterangan</th>
                    <th className="py-3.5 px-6 text-right w-40">Jumlah</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {transactions?.map((trx) => (
                    <tr key={trx.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="py-3.5 px-6 text-slate-600 font-medium whitespace-nowrap">{formatDate(trx.date)}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${
                            trx.type === "income" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-rose-50 text-rose-700 border-rose-100"
                          }`}
                        >
                          {trx.transaction_categories?.name}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 truncate max-w-[200px]" title={trx.description || ""}>
                        {trx.description || "-"}
                      </td>
                      <td className={`py-3.5 px-6 text-right font-mono font-semibold ${trx.type === "income" ? "text-emerald-600" : "text-rose-600"}`}>
                        {trx.type === "income" ? "+" : "-"} {formatCurrency(trx.amount)}
                      </td>
                    </tr>
                  ))}
                  {transactions?.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-16 text-center">
                        <div className="inline-block p-4 bg-slate-50 rounded-full mb-3">
                          <Search size={24} className="text-slate-300" />
                        </div>
                        <p className="text-slate-500 font-medium">Belum ada data transaksi.</p>
                        <p className="text-slate-400 text-xs mt-1">Coba ubah filter atau tambah data baru.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="text-center text-xs text-slate-400 font-medium">Halaman {page}</div>
        </div>
      </div>
    </div>
  );
}
