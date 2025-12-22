   import { createClient } from '@/lib/supabase/server'
   import { formatCurrency } from '@/lib/utils'
   import { Wallet, ArrowUpRight, ArrowDownRight, TrendingUp, PieChart as PieIcon } from 'lucide-react'
   import { DashboardFilter } from '@/components/DashboardFilter'
   import { TrendChart, CategoryPieChart } from '@/components/DashboardCharts'

   export default async function DashboardPage(props: {
   searchParams: Promise<{ month?: string; year?: string }>
   }) {
   const searchParams = await props.searchParams
   const supabase = await createClient()

   // 1. Tentukan Rentang Filter
   const now = new Date()
   const month = Number(searchParams.month) || now.getMonth() + 1
   const year = Number(searchParams.year) || now.getFullYear()

   const startDate = new Date(year, month - 1, 1).toLocaleDateString('en-CA') 
   const endDate = new Date(year, month, 0).toLocaleDateString('en-CA')
   
   // Nama Bulan untuk UI
   const monthName = new Date(year, month - 1, 1).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })

   // 2. Fetch Data (Filtered)
   const { data: transactions } = await supabase
      .from('transactions')
      .select('*, transaction_categories(name)')
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true })

   // 3. Hitung Agregasi Kartu (Card Summary)
   const incomeTrx = transactions?.filter(t => t.type === 'income') || []
   const expenseTrx = transactions?.filter(t => t.type === 'expense') || []

   const totalIncome = incomeTrx.reduce((acc, curr) => acc + Number(curr.amount), 0)
   const totalExpense = expenseTrx.reduce((acc, curr) => acc + Number(curr.amount), 0)
   const balance = totalIncome - totalExpense

   // 4. Proses Data untuk Grafik Trend (Harian) 
   // Grouping data by date
   const chartMap = new Map()
   transactions?.forEach(t => {
      const day = new Date(t.date).getDate() // Ambil tanggalnya saja (1-31)
      if (!chartMap.has(day)) {
         chartMap.set(day, { date: day.toString(), income: 0, expense: 0 })
      }
      const current = chartMap.get(day)
      if (t.type === 'income') current.income += Number(t.amount)
      else current.expense += Number(t.amount)
   })
   const trendData = Array.from(chartMap.values()).sort((a, b) => Number(a.date) - Number(b.date))

   // 5. Proses Data untuk Grafik Kategori (Distribution) 
   const catMap = new Map()
   transactions?.forEach(t => {
      // Kita gabung Income & Expense atau bisa dipisah. Disini kita visualisasikan SEMUA kategori
      const catName = t.transaction_categories?.name || 'Lainnya'
      if (!catMap.has(catName)) {
         catMap.set(catName, { name: catName, value: 0 })
      }
      catMap.get(catName).value += Number(t.amount)
   })
   const categoryData = Array.from(catMap.values())

   return (
      <div className="space-y-6 animate-in fade-in duration-500">
         
         {/* Header & Filter */}
         <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
         <div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Dashboard Analitik</h2>
            <p className="text-sm text-slate-500 mt-1">
               Periode laporan: <span className="font-semibold text-blue-600">{monthName}</span>
            </p>
         </div>
         <DashboardFilter />
         </div>
         
         {/* Summary Cards */}
         <div className="grid gap-4 md:grid-cols-3">
         {/* Card Saldo */}
         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
               <Wallet size={64} className="text-blue-600" />
            </div>
            <p className="text-sm font-medium text-slate-500 mb-1">Surplus / Defisit (Periode Ini)</p>
            <h3 className={`text-3xl font-bold tracking-tight ${balance >= 0 ? 'text-blue-700' : 'text-rose-600'}`}>
               {balance >= 0 ? '+' : ''}{formatCurrency(balance)}
            </h3>
            <p className="text-xs text-slate-400 mt-2">Selisih pemasukan dan pengeluaran</p>
         </div>
         
         {/* Card Pemasukan */}
         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
               <p className="text-sm font-medium text-slate-500 mb-1">Total Pemasukan</p>
               <h3 className="text-2xl font-bold text-slate-800">{formatCurrency(totalIncome)}</h3>
               <span className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <ArrowUpRight size={12} /> {incomeTrx.length} Transaksi
               </span>
            </div>
            <div className="bg-emerald-50 p-3 rounded-full text-emerald-600">
               <TrendingUp size={24} />
            </div>
         </div>

         {/* Card Pengeluaran */}
         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
               <p className="text-sm font-medium text-slate-500 mb-1">Total Pengeluaran</p>
               <h3 className="text-2xl font-bold text-slate-800">{formatCurrency(totalExpense)}</h3>
               <span className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                  <ArrowDownRight size={12} /> {expenseTrx.length} Transaksi
               </span>
            </div>
            <div className="bg-rose-50 p-3 rounded-full text-rose-600">
               <ArrowDownRight size={24} />
            </div>
         </div>
         </div>
         
         {/* Charts Section */}
         <div className="grid lg:grid-cols-3 gap-6">
            
            {/* Grafik Trend */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
               <div className="flex items-center gap-2 mb-6">
                  <div className="bg-blue-50 p-1.5 rounded text-blue-600"><TrendingUp size={18} /></div>
                  <h3 className="font-bold text-slate-800">Arus Kas Harian</h3>
               </div>
               <TrendChart data={trendData} />
            </div>

            {/* Grafik Kategori */}
            <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
               <div className="flex items-center gap-2 mb-6">
                  <div className="bg-purple-50 p-1.5 rounded text-purple-600"><PieIcon size={18} /></div>
                  <h3 className="font-bold text-slate-800">Distribusi Kategori</h3>
               </div>
               <CategoryPieChart data={categoryData} />
            </div>

         </div>

         {/* Recent Transactions Mini Table */}
         <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
               <h3 className="font-bold text-slate-800 text-sm">Aktivitas Terakhir di Bulan Ini</h3>
            </div>
            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead className="bg-white text-xs text-slate-500 uppercase">
                     <tr>
                        <th className="px-6 py-3 font-medium">Tanggal</th>
                        <th className="px-6 py-3 font-medium">Kategori</th>
                        <th className="px-6 py-3 font-medium text-right">Nominal</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-sm">
                     {transactions?.slice(0, 5).map(trx => (
                        <tr key={trx.id} className="hover:bg-slate-50">
                           <td className="px-6 py-3 text-slate-600">{new Date(trx.date).toLocaleDateString('id-ID')}</td>
                           <td className="px-6 py-3">{trx.transaction_categories?.name}</td>
                           <td className={`px-6 py-3 text-right font-medium ${trx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                              {trx.type === 'income' ? '+' : '-'} {formatCurrency(trx.amount)}
                           </td>
                        </tr>
                     ))}
                     {transactions?.length === 0 && (
                        <tr><td colSpan={3} className="px-6 py-8 text-center text-slate-400">Belum ada data</td></tr>
                     )}
                  </tbody>
               </table>
            </div>
         </div>

      </div>
   )
   }