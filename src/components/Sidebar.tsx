'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logout } from '@/lib/actions/auth'
import { LayoutDashboard, Wallet, Calendar, LogOut, UserCircle, Building2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Sidebar({ user }: { user: any }) {
  const pathname = usePathname()

  // Daftar Menu
  const menus = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/keuangan', label: 'Keuangan', icon: Wallet },
    { href: '/agenda', label: 'Agenda', icon: Calendar },
  ]

  return (
      <aside className="w-64 bg-blue-900 text-white flex-shrink-0 flex flex-col border-r border-blue-800 transition-all duration-300">
      {/* Logo Header */}
      <div className="h-16 flex items-center px-6 border-b border-blue-800 bg-blue-950/30">
        <div className="flex items-center gap-3">
            <div className="bg-white/10 p-1.5 rounded-md">
      {/* Logo Container */}
      <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center shadow-sm">
        <img
          src="https://manarulislambangil.masjidku.web.id/wp-content/uploads/2022/06/LOGO-1.png"
          alt="Logo masjid"
          className="w-7 h-7 object-contain"
        />
      </div>
            </div>
            <span className="font-semibold tracking-wide text-lg">Dashboard</span>
        </div>
      </div>

      {/* Menu Navigasi */}
      <div className="p-4 flex-1">
          <p className="text-xs font-semibold text-blue-300 uppercase tracking-wider mb-3 px-2">Main Menu</p>
          <nav className="space-y-1.5">
            {menus.map((menu) => {
              const isActive = pathname.startsWith(menu.href)
              
              return (
                <Link 
                  key={menu.href} 
                  href={menu.href} 
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group font-medium text-sm",
                    isActive 
                      ? "bg-white text-blue-900 shadow-md translate-x-1" // Style saat AKTIF (Selectable)
                      : "text-blue-100 hover:bg-blue-800 hover:text-white" // Style saat TIDAK AKTIF
                  )}
                >
                  <menu.icon 
                    size={18} 
                    className={cn(
                      "transition-colors",
                      isActive ? "text-blue-700" : "text-blue-300 group-hover:text-white"
                    )} 
                  /> 
                  <span>{menu.label}</span>
                  
                  {/* Indikator Titik (Opsional) */}
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                  )}
                </Link>
              )
            })}
          </nav>
      </div>

      {/* User Footer */}
      <div className="mt-auto p-4 border-t border-blue-800 bg-blue-950/20">
        <div className="flex items-center gap-3 mb-4 px-1">
          <UserCircle size={36} className="text-blue-300" />
          <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">Administrator</p>
              <p className="text-xs text-blue-300 truncate w-32" title={user.email}>{user.email}</p>
          </div>
        </div>
        <form action={logout}>
          <button className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-blue-800/50 hover:bg-rose-600 text-blue-100 hover:text-white rounded-lg transition-all text-xs font-semibold border border-blue-700/50 hover:border-rose-500">
            <LogOut size={16} /> Sign Out
          </button>
        </form>
      </div>
    </aside>
  )
}