import { createClient } from '@/lib/supabase/server'
import { formatCurrency } from '@/lib/utils'
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()

  // Logic fetch data
  const { data: income } = await supabase.from('transactions').select('amount').eq('type', 'income')
  const { data: expense } = await supabase.from('transactions').select('amount').eq('type', 'expense')

  const totalIncome = income?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0
  const totalExpense = expense?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0
  const balance = totalIncome - totalExpense

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Ringkasan Masjid</h1>
        <p className="text-slate-500 mt-1">Pantau kondisi keuangan masjid secara real-time.</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        {/* Card Saldo - Primary */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-6 text-white shadow-lg shadow-emerald-200 relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-emerald-100 font-medium text-sm mb-1">Total Saldo Kas</h3>
            <p className="text-3xl font-bold">{formatCurrency(balance)}</p>
          </div>
          <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-4">
            <Wallet size={120} />
          </div>
        </div>
        
        {/* Card Pemasukan */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
             <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                <TrendingUp size={20} />
             </div>
             <span className="text-xs font-semibold px-2 py-1 bg-blue-50 text-blue-600 rounded-full">+ Pemasukan</span>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Total Masuk</h3>
          <p className="text-2xl font-bold text-slate-800 mt-1">{formatCurrency(totalIncome)}</p>
        </div>

        {/* Card Pengeluaran */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
             <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
                <TrendingDown size={20} />
             </div>
             <span className="text-xs font-semibold px-2 py-1 bg-red-50 text-red-600 rounded-full">- Pengeluaran</span>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Total Keluar</h3>
          <p className="text-2xl font-bold text-slate-800 mt-1">{formatCurrency(totalExpense)}</p>
        </div>
      </div>
      
      {/* Area Kosong untuk Grafik nanti */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center py-16">
          <p className="text-slate-400">Area grafik statistik bulanan akan ditampilkan di sini.</p>
      </div>
    </div>
  )
}