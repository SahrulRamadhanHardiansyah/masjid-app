import { createClient } from '@/lib/supabase/server'
import { formatCurrency, formatDate } from '@/lib/utils'
import Link from 'next/link'
import { ArrowRight, Lock } from 'lucide-react'

export default async function PublicPage() {
  const supabase = await createClient()
  
  // Data Publik
  const { data: transactions } = await supabase
    .from('transactions')
    .select('*, transaction_categories(name)')
    .order('date', { ascending: false })
    .limit(8)

  const { data: income } = await supabase.from('transactions').select('amount').eq('type', 'income')
  const { data: expense } = await supabase.from('transactions').select('amount').eq('type', 'expense')
  const totalBalance = (income?.reduce((a, b) => a + Number(b.amount), 0) || 0) - (expense?.reduce((a, b) => a + Number(b.amount), 0) || 0)

  return (
    <div className="min-h-screen bg-gray-50 font-poppins">
      {/* Navbar Transparan */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">M</div>
            <span className="font-bold text-xl text-slate-800 tracking-tight">Masjid Al-Ikhlas</span>
          </div>
          <Link href="/login" className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors">
            <Lock size={16} /> Login Pengurus
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500 rounded-full blur-[128px] opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-[128px] opacity-20 transform -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <span className="inline-block py-1 px-3 rounded-full bg-slate-800 border border-slate-700 text-emerald-400 text-xs font-semibold tracking-wider mb-6">TRANSPARANSI UMAT</span>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">Laporan Keuangan & Agenda <br/> <span className="text-emerald-400">Masjid Al-Ikhlas</span></h1>
          <p className="text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Menyajikan data keuangan yang transparan, akuntabel, dan real-time untuk kemaslahatan umat dan kenyamanan jamaah.
          </p>
          
          <div className="inline-block p-1 bg-slate-800/50 rounded-2xl backdrop-blur-sm border border-slate-700">
             <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-4 px-8 rounded-xl text-center shadow-lg">
                <p className="text-emerald-100 text-sm font-medium mb-1">Total Saldo Kas Saat Ini</p>
                <p className="text-4xl font-bold tracking-tight">{formatCurrency(totalBalance)}</p>
             </div>
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 -mt-12 relative z-20 pb-20">
        {/* Table Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-white">
            <h2 className="text-lg font-bold text-slate-800">Laporan Arus Kas Terkini</h2>
            <button className="text-sm text-emerald-600 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
               Lihat Semua <ArrowRight size={16} />
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 text-xs uppercase text-slate-500 font-semibold">
                  <th className="py-4 px-6">Tanggal</th>
                  <th className="py-4 px-4">Kategori</th>
                  <th className="py-4 px-4">Uraian</th>
                  <th className="py-4 px-6 text-right">Nominal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {transactions?.map((trx) => (
                  <tr key={trx.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 text-sm text-slate-500 font-medium whitespace-nowrap">{formatDate(trx.date)}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${trx.type === 'income' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-orange-50 text-orange-700 border border-orange-100'}`}>
                        {trx.transaction_categories?.name}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm font-medium text-slate-800">{trx.description || '-'}</td>
                    <td className={`py-4 px-6 text-right font-bold font-mono text-sm ${trx.type === 'income' ? 'text-emerald-600' : 'text-orange-600'}`}>
                      {trx.type === 'income' ? '+' : '-'} {formatCurrency(trx.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
           <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-2">💰 Donasi Online</h3>
              <p className="text-sm text-slate-500">Salurkan infak anda melalui transfer bank BSI 1234-5678-90 a.n Masjid Al-Ikhlas.</p>
           </div>
           <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-2">📅 Agenda Rutin</h3>
              <p className="text-sm text-slate-500">Kajian rutin setiap malam Ahad dan Subuh berjamaah.</p>
           </div>
           <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-2">📞 Hubungi Kami</h3>
              <p className="text-sm text-slate-500">Sekretariat Masjid: 0812-3456-7890 (WhatsApp Available)</p>
           </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-100 py-8 text-center">
        <p className="text-slate-400 text-sm">&copy; {new Date().getFullYear()} Sistem Informasi Masjid Al-Ikhlas. Dibuat untuk Umat.</p>
      </footer>
    </div>
  )
}