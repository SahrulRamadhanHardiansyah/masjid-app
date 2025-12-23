import { createClient } from "@/lib/supabase/server";
import { createTransaction } from "@/lib/actions/finance";
import { PlusCircle, Calendar, Camera } from "lucide-react";
import { TransactionControls } from "@/components/TransactionControls";
import { AddCategoryModal } from "@/components/AddCategoryModal";
import { ExportButton } from "@/components/ExportButtons";
import { TransactionHistoryTable } from "@/components/TransactionHistoryTable";

export default async function KeuanganPage(props: { searchParams: Promise<{ page?: string; sort?: string }> }) {
  const searchParams = await props.searchParams;
  const supabase = await createClient();

  const page = Number(searchParams.page) || 1;
  const sort = searchParams.sort || "latest";
  const itemsPerPage = 10;
  const from = (page - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;

  const { data: categories } = await supabase.from("transaction_categories").select("*");

  let query = supabase.from("transactions").select("*, transaction_categories(name)", { count: "exact" });

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
    default:
      query = query.order("date", { ascending: false });
  }

  const { data: transactions, count } = await query.range(from, to);

  const totalCount = count || 0;
  const hasNextPage = totalCount > to + 1;
  const hasPrevPage = page > 1;

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500 w-full max-w-full">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Manajemen Keuangan</h1>
          <p className="text-sm text-slate-500 mt-1">Catat dan kelola arus kas masjid beserta bukti transaksi.</p>
        </div>
        <div className="flex items-center gap-2">
          <ExportButton />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Kolom Kiri: Form Input */}
        <div className="lg:col-span-1 min-w-0 w-full">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm lg:sticky lg:top-24 overflow-hidden w-full">
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
              className="p-4 md:p-6 space-y-4 md:space-y-5"
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
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Bukti / Nota (Opsional)</label>
                <div className="relative group">
                  <div className="absolute left-3 top-3 text-slate-400 group-hover:text-emerald-600 transition-colors">
                    <Camera size={16} />
                  </div>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    className="w-full text-sm border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-slate-700 file:mr-4 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer transition-all"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">*Maksimal ukuran 2MB. Format: JPG, PNG.</p>
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
        <div className="lg:col-span-2 space-y-4 min-w-0">
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

          <TransactionHistoryTable transactions={transactions || []} />

          <div className="text-center text-xs text-slate-400 font-medium">Halaman {page}</div>
        </div>
      </div>
    </div>
  );
}
