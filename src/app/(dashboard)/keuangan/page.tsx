import { createClient } from '@/lib/supabase/server'
import { createTransaction } from '@/lib/actions/finance'
import { formatCurrency, formatDate } from '@/lib/utils'
import { PlusCircle, Search } from 'lucide-react'

export default async function KeuanganPage() {
  const supabase = await createClient()
  
  const { data: categories } = await supabase.from('transaction_categories').select('*')
  
  const { data: transactions } = await supabase
    .from('transactions')
    .select('*, transaction_categories(name)')
    .order('date', { ascending: false })

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
         <div>
            <h1 className="text-3xl font-bold text-slate-800">Keuangan</h1>
            <p className="text-slate-500 mt-1">Kelola pemasukan dan pengeluaran kas masjid.</p>
         </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
          {/* Kolom Kiri: Form Input */}
          <div className="lg:col-span-1">
             <div className="bg-white p-6 rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 sticky top-24">
                <div className="flex items-center gap-2 mb-6 text-emerald-700">
                    <PlusCircle size={24} />
                    <h2 className="text-lg font-bold">Input Transaksi</h2>
                </div>
                
                <form action={createTransaction} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-2">Tanggal Transaksi</label>
                    <input type="date" name="date" required className="w-full border border-gray-300 rounded-lg p-3 text-slate-700 focus:border-emerald-500 focus:ring-emerald-500" defaultValue={new Date().toISOString().split('T')[0]} />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-2">Jenis Transaksi</label>
                    <div className="grid grid-cols-2 gap-3">
                        <label className="cursor-pointer">
                            <input type="radio" name="type" value="income" className="peer sr-only" defaultChecked />
                            <div className="text-center py-2 rounded-lg border border-gray-200 peer-checked:bg-emerald-50 peer-checked:border-emerald-500 peer-checked:text-emerald-700 transition-all text-sm font-medium">
                                Pemasukan
                            </div>
                        </label>
                        <label className="cursor-pointer">
                            <input type="radio" name="type" value="expense" className="peer sr-only" />
                            <div className="text-center py-2 rounded-lg border border-gray-200 peer-checked:bg-red-50 peer-checked:border-red-500 peer-checked:text-red-700 transition-all text-sm font-medium">
                                Pengeluaran
                            </div>
                        </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-2">Kategori</label>
                    <select name="category_id" className="w-full border border-gray-300 rounded-lg p-3 text-slate-700 bg-white">
                      {categories?.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-2">Nominal (Rp)</label>
                    <div className="relative">
                        <span className="absolute left-3 top-3 text-slate-400 font-semibold">Rp</span>
                        <input type="number" name="amount" placeholder="0" required min="1" className="w-full border border-gray-300 rounded-lg py-3 pl-10 pr-3 text-slate-700 font-mono font-medium" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-2">Keterangan</label>
                    <textarea name="description" rows={3} placeholder="Contoh: Sumbangan hamba Allah..." className="w-full border border-gray-300 rounded-lg p-3 text-slate-700 resize-none"></textarea>
                  </div>

                  <button type="submit" className="w-full bg-emerald-600 text-white py-3.5 rounded-xl hover:bg-emerald-700 font-semibold shadow-lg shadow-emerald-600/20 transition-all transform active:scale-95">
                    Simpan Transaksi
                  </button>
                </form>
             </div>
          </div>

          {/* Kolom Kanan: Tabel Data */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="font-bold text-slate-700">Riwayat Transaksi</h3>
                    <div className="relative hidden sm:block">
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        <input type="text" placeholder="Cari data..." className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:w-64 transition-all w-48" />
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-slate-500 font-semibold tracking-wider">
                        <tr>
                        <th className="p-4 pl-6">Tanggal</th>
                        <th className="p-4">Kategori</th>
                        <th className="p-4">Keterangan</th>
                        <th className="p-4 pr-6 text-right">Jumlah</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {transactions?.map((trx) => (
                        <tr key={trx.id} className="hover:bg-gray-50 transition-colors">
                            <td className="p-4 pl-6 text-sm text-slate-600 font-medium whitespace-nowrap">{formatDate(trx.date)}</td>
                            <td className="p-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${trx.type === 'income' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                                {trx.transaction_categories?.name}
                            </span>
                            </td>
                            <td className="p-4 text-sm text-slate-500 max-w-xs truncate">{trx.description || '-'}</td>
                            <td className={`p-4 pr-6 text-right font-bold font-mono text-sm ${trx.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                            {trx.type === 'income' ? '+' : '-'} {formatCurrency(trx.amount)}
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
                {transactions?.length === 0 && (
                    <div className="p-12 text-center text-slate-400 flex flex-col items-center">
                        <Search size={48} className="text-slate-200 mb-4" />
                        <p>Belum ada data transaksi yang tercatat.</p>
                    </div>
                )}
            </div>
          </div>
      </div>
    </div>
  )
}