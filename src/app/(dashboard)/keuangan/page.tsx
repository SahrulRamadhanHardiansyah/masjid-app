import { createClient } from '@/lib/supabase/server'
import { createTransaction } from '@/lib/actions/finance'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Plus } from 'lucide-react'
import { TransactionControls } from '@/components/TransactionControls' // <--- IMPORT INI
import { AddCategoryModal } from '@/components/AddCategoryModal'

export default async function KeuanganPage(props: {
  searchParams: Promise<{ page?: string; sort?: string }>
}) {
  const searchParams = await props.searchParams
  const supabase = await createClient()
  
  // 1. Setup Pagination & Sorting Variables
  const page = Number(searchParams.page) || 1
  const sort = searchParams.sort || 'latest'
  const itemsPerPage = 10

  // Hitung Range untuk Supabase (0-9, 10-19, dst)
  const from = (page - 1) * itemsPerPage
  const to = from + itemsPerPage - 1

  const { data: categories } = await supabase.from('transaction_categories').select('*')
  
  // 2. Build Query Dinamis
  let query = supabase
    .from('transactions')
    .select('*, transaction_categories(name)', { count: 'exact' }) // Tambah count exact

  // Logic Sorting
  switch (sort) {
    case 'oldest':
      query = query.order('date', { ascending: true })
      break
    case 'amount_desc':
      query = query.order('amount', { ascending: false }) // Pengeluaran/Pemasukan Terbesar
      break
    case 'amount_asc':
      query = query.order('amount', { ascending: true })
      break
    case 'desc_asc':
      query = query.order('description', { ascending: true }) // Abjad
      break
    default: // latest
      query = query.order('date', { ascending: false })
  }

  // 3. Execute Query dengan Range
  const { data: transactions, count } = await query.range(from, to)

  const totalCount = count || 0
  const hasNextPage = totalCount > to + 1
  const hasPrevPage = page > 1

  return (
    <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Kolom Kiri: Form - Clean & Minimalist */}
        <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-slate-200 sticky top-24">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-t-lg">
                    <h3 className="font-semibold text-slate-800 text-sm">Transaksi Baru</h3>
                    <div className="bg-blue-100 p-1 rounded">
                        <Plus size={14} className="text-blue-700" />
                    </div>
                </div>
                
                <form action={createTransaction} className="p-5 space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Tanggal</label>
                        <input type="date" name="date" required className="w-full text-sm border border-slate-300 rounded-md px-3 py-2 text-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" defaultValue={new Date().toISOString().split('T')[0]} />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Tipe</label>
                            <select name="type" className="w-full text-sm border border-slate-300 rounded-md px-3 py-2 text-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                                <option value="income">Pemasukan</option>
                                <option value="expense">Pengeluaran</option>
                            </select>
                        </div>
                        <div>
<div>
  <div className="flex items-center justify-between mb-1.5">
    <label className="block text-xs font-semibold text-slate-500 uppercase">
      Kategori
    </label>
    <AddCategoryModal />
  </div>

  <select
    name="category_id"
    className="w-full text-sm border border-slate-300 rounded-md px-3 py-2"
  >
    {categories?.map((c) => (
      <option key={c.id} value={c.id}>
        {c.name}
      </option>
    ))}
  </select>
</div>

                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Nominal (Rp)</label>
                        <input type="number" name="amount" placeholder="0" required min="1" className="w-full text-sm border border-slate-300 rounded-md px-3 py-2 text-slate-700 font-mono focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Keterangan</label>
                        <textarea name="description" rows={3} className="w-full text-sm border border-slate-300 rounded-md px-3 py-2 text-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"></textarea>
                    </div>

                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-md text-sm font-medium transition-colors shadow-sm">
                        Simpan Data
                    </button>
                </form>
            </div>
        </div>

        {/* Kolom Kanan: Tabel - Dense & Information rich */}
        <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Riwayat Keuangan</h2>
                    <p className="text-xs text-slate-500">
                        Menampilkan {from + 1}-{Math.min(to + 1, totalCount)} dari {totalCount} transaksi.
                    </p>
                </div>
                
                {/* KOMPONEN KONTROL BARU */}
                <TransactionControls 
                    hasNextPage={hasNextPage} 
                    hasPrevPage={hasPrevPage} 
                    totalCount={totalCount}
                    currentPage={page}
                />
            </div>

            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm min-h-[400px]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                        <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-32">Tanggal</th>
                        <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-32">Kategori</th>
                        <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Keterangan</th>
                        <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right w-40">Jumlah</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {transactions?.map((trx) => (
                        <tr key={trx.id} className="hover:bg-blue-50/30 transition-colors group">
                            <td className="py-3 px-4 text-sm text-slate-600">{formatDate(trx.date)}</td>
                            <td className="py-3 px-4">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${trx.type === 'income' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>
                                    {trx.transaction_categories?.name}
                                </span>
                            </td>
                            <td className="py-3 px-4 text-sm text-slate-700 font-medium">{trx.description || '-'}</td>
                            <td className={`py-3 px-4 text-right font-mono text-sm font-semibold ${trx.type === 'income' ? 'text-blue-700' : 'text-rose-600'}`}>
                                {trx.type === 'income' ? '+' : '-'} {formatCurrency(trx.amount)}
                            </td>
                        </tr>
                        ))}
                        {transactions?.length === 0 && (
                            <tr>
                                <td colSpan={4} className="py-12 text-center text-slate-400 text-sm">
                                    Belum ada data transaksi untuk filter ini.
                                </td>
                            </tr>
                        )}
                    </tbody>
                    </table>
                </div>
            </div>
            
            <div className="text-center text-xs text-slate-400">
                 Halaman {page}
            </div>
        </div>
    </div>
  )
}