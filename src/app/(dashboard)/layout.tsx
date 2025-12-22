import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/Sidebar' // Import komponen baru

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div className="flex h-screen bg-slate-50 font-poppins text-slate-900 overflow-hidden">
      
      {/* Panggil Sidebar Client Component & Lempar Data User */}
      <Sidebar user={user} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
         {/* Minimalist Header */}
         <header className="h-16 bg-white border-b border-slate-200 px-8 flex justify-between items-center flex-shrink-0 z-10 shadow-sm">
             <h1 className="text-sm font-medium text-slate-500">Sistem Informasi Masjid Manarul Islam Bangil</h1>
             <div className="text-sm font-semibold text-blue-900 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}
             </div>
         </header>

         {/* Scrollable Content Area */}
         <div className="flex-1 overflow-y-auto p-8 scroll-smooth">
            <div className="max-w-6xl mx-auto">
               {children}
            </div>
         </div>
      </main>
    </div>
  )
}