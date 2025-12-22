import { createClient } from '@/lib/supabase/server'
import { formatCurrency, formatDate } from '@/lib/utils'
import { MonthFilter } from '@/components/MonthFilter'
import { ExportButton } from '@/components/ExportButton' // <--- IMPORT INI
import Link from 'next/link'
import { ArrowLeft, Building2 } from 'lucide-react'

// Tipe props di Next.js 15 harus Promise untuk searchParams
export default async function LaporanPage(props: {
  searchParams: Promise<{ month?: string; year?: string }>
}) {
  const searchParams = await props.searchParams;

  const supabase = await createClient()

  // 2. Tentukan Rentang Tanggal
  const now = new Date()
  const month = Number(searchParams.month) || now.getMonth() + 1
  const year = Number(searchParams.year) || now.getFullYear()

  // Format tanggal untuk query SQL (YYYY-MM-DD)
  const startDate = new Date(year, month - 1, 1).toLocaleDateString('en-CA') 
  const endDate = new Date(year, month, 0).toLocaleDateString('en-CA')

  // 3. Fetch Data Sesuai Rentang
  const { data: transactions } = await supabase
    .from('transactions')
    .select('*, transaction_categories(name)')
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: true })

  // 4. Hitung Rekapitulasi Bulan Ini
  const totalIncome = transactions
    ?.filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + Number(curr.amount), 0) || 0

  const totalExpense = transactions
    ?.filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + Number(curr.amount), 0) || 0

  const surplus = totalIncome - totalExpense

  return (
    <div className="min-h-screen bg-slate-50 font-poppins text-slate-900">
      
      {/* Navbar Simple */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-6 h-16 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-blue-700 transition-colors">
            <ArrowLeft size={18} /> <span className="text-sm font-medium">Kembali ke Beranda</span>
          </Link>
          <div className="flex items-center gap-2 font-bold text-slate-800">
             <Building2 size={18} className="text-blue-700"/> Laporan Kas Masjid
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-10">
        
        {/* Header Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
            <h1 className="text-2xl font-bold text-slate-800">Buku Besar Transaksi</h1>
            <div className="flex gap-3 relative z-50 items-stretch h-12">
                <MonthFilter />
                
                <ExportButton 
                  transactions={transactions || []} 
                  month={month} 
                  year={year} 
                />
            </div>
        </div>

        {/* Summary Cards Bulan Ini */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm border-l-4 border-l-emerald-500">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pemasukan Bulan Ini</p>
                <p className="text-xl font-bold text-emerald-600 mt-1 font-mono">{formatCurrency(totalIncome)}</p>
            </div>
            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm border-l-4 border-l-rose-500">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pengeluaran Bulan Ini</p>
                <p className="text-xl font-bold text-rose-600 mt-1 font-mono">{formatCurrency(totalExpense)}</p>
            </div>
            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm border-l-4 border-l-blue-600">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Surplus / Defisit</p>
                <p className={`text-xl font-bold mt-1 font-mono ${surplus >= 0 ? 'text-blue-600' : 'text-rose-600'}`}>
                    {surplus >= 0 ? '+' : ''}{formatCurrency(surplus)}
                </p>
            </div>
        </div>

        {/* Main Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-100 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider">
                        <tr>
                            <th className="py-4 px-6 w-16 text-center">No</th>
                            <th className="py-4 px-4 w-32">Tanggal</th>
                            <th className="py-4 px-4 w-40">Kategori</th>
                            <th className="py-4 px-4">Uraian Transaksi</th>
                            <th className="py-4 px-4 text-right w-32">Masuk</th>
                            <th className="py-4 px-6 text-right w-32">Keluar</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {transactions?.map((trx, index) => (
                            <tr key={trx.id} className="hover:bg-blue-50/20 transition-colors">
                                <td className="py-3 px-6 text-center text-xs text-slate-400 font-mono">{index + 1}</td>
                                <td className="py-3 px-4 text-sm text-slate-600 whitespace-nowrap">{formatDate(trx.date)}</td>
                                <td className="py-3 px-4">
                                    <span className={`inline-block px-2 py-1 rounded text-[10px] font-bold uppercase ${trx.type === 'income' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                                        {trx.transaction_categories?.name}
                                    </span>
                                </td>
                                <td className="py-3 px-4 text-sm font-medium text-slate-800">{trx.description || '-'}</td>
                                <td className="py-3 px-4 text-right font-mono text-sm text-emerald-600 font-semibold bg-emerald-50/10">
                                    {trx.type === 'income' ? formatCurrency(trx.amount) : '-'}
                                </td>
                                <td className="py-3 px-6 text-right font-mono text-sm text-rose-600 font-semibold bg-rose-50/10">
                                    {trx.type === 'expense' ? formatCurrency(trx.amount) : '-'}
                                </td>
                            </tr>
                        ))}
                        
                        {transactions?.length === 0 && (
                             <tr>
                                <td colSpan={6} className="py-12 text-center text-slate-400">
                                    Tidak ada transaksi tercatat pada periode ini.
                                </td>
                             </tr>
                        )}
                    </tbody>
                    
                    {transactions && transactions.length > 0 && (
                        <tfoot className="bg-slate-50 border-t border-slate-200 font-bold text-slate-800">
                            <tr>
                                <td colSpan={4} className="py-4 px-6 text-right uppercase text-xs tracking-wider">Total Periode Ini</td>
                                <td className="py-4 px-4 text-right font-mono text-sm text-emerald-700">{formatCurrency(totalIncome)}</td>
                                <td className="py-4 px-6 text-right font-mono text-sm text-rose-700">{formatCurrency(totalExpense)}</td>
                            </tr>
                        </tfoot>
                    )}
                </table>
            </div>
        </div>
      </main>
    </div>
  )
}