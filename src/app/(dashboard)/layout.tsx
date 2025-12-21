import Link from 'next/link'
import { logout } from '@/lib/actions/auth'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { LayoutDashboard, Wallet, Calendar, LogOut, User } from 'lucide-react'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient() // Logic async/await tetap ada
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div className="flex h-screen bg-gray-50 font-poppins">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900 text-white flex-shrink-0 flex flex-col shadow-xl">
        <div className="p-8 border-b border-slate-800">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <span className="font-bold text-xl text-white">M</span>
             </div>
             <div>
                <h2 className="text-xl font-bold tracking-tight">SIKAM</h2>
                <p className="text-xs text-slate-400">Masjid Al-Ikhlas</p>
             </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-8">
          <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Menu Utama</p>
          
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-emerald-400 transition-all group">
            <LayoutDashboard size={20} className="group-hover:text-emerald-400" /> 
            <span className="font-medium">Dashboard</span>
          </Link>
          
          <Link href="/keuangan" className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-emerald-400 transition-all group">
            <Wallet size={20} className="group-hover:text-emerald-400" /> 
            <span className="font-medium">Keuangan</span>
          </Link>
          
          <Link href="/agenda" className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-emerald-400 transition-all group">
            <Calendar size={20} className="group-hover:text-emerald-400" /> 
            <span className="font-medium">Agenda</span>
          </Link>
        </nav>

        <div className="p-6 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-6 px-2">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                <User size={18} className="text-slate-300"/>
            </div>
            <div>
                <p className="text-sm font-medium text-white">Pengurus</p>
                <p className="text-xs text-slate-500 truncate w-32">{user.email}</p>
            </div>
          </div>
          <form action={logout}>
            <button className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white rounded-lg transition-all text-sm font-medium">
              <LogOut size={18} /> Keluar Aplikasi
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
         {/* Top Header Mobile/Desktop */}
         <header className="bg-white border-b border-gray-200 sticky top-0 z-20 px-8 py-4 flex justify-between items-center shadow-sm">
             <h1 className="text-lg font-semibold text-slate-700">Halaman Pengurus</h1>
             <div className="text-sm text-slate-500">
                {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
             </div>
         </header>
         <div className="p-8 max-w-7xl mx-auto">
            {children}
         </div>
      </main>
    </div>
  )
}