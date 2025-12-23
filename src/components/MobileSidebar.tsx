"use client";

import { useState } from "react";
import { Menu, X, LogOut, UserCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { MENUS } from "./Sidebar";
import { logout } from "@/lib/actions/auth";

export function MobileSidebar({ user }: { user: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="md:hidden">
      {/* Tombol Hamburger */}
      <button onClick={() => setIsOpen(true)} className="p-2 text-slate-600 hover:bg-slate-100 rounded-md">
        <Menu size={24} />
      </button>

      {/* Overlay Gelap */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-200" onClick={() => setIsOpen(false)} />}

      {/* Drawer / Sidebar Mobile */}
      <div className={cn("fixed inset-y-0 left-0 z-50 w-72 bg-blue-900 text-white shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col", isOpen ? "translate-x-0" : "-translate-x-full")}>
        {/* Header Mobile Sidebar */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-blue-800 bg-blue-950/30">
          <span className="font-semibold text-lg">Menu</span>
          <button onClick={() => setIsOpen(false)} className="text-blue-300 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="p-4 flex-1 overflow-y-auto">
          <nav className="space-y-1.5">
            {MENUS.map((menu) => {
              const isActive = pathname.startsWith(menu.href);
              return (
                <Link
                  key={menu.href}
                  href={menu.href}
                  onClick={() => setIsOpen(false)}
                  className={cn("flex items-center gap-3 px-3 py-3 rounded-lg transition-all font-medium text-sm", isActive ? "bg-white text-blue-900" : "text-blue-100 hover:bg-blue-800")}
                >
                  <menu.icon size={18} className={isActive ? "text-blue-700" : "text-blue-300"} />
                  <span>{menu.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Footer Mobile */}
        <div className="p-4 border-t border-blue-800 bg-blue-950/20">
          <div className="flex items-center gap-3 mb-4">
            <UserCircle size={32} className="text-blue-300" />
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">Administrator</p>
              <p className="text-xs text-blue-300 truncate w-40">{user.email}</p>
            </div>
          </div>
          <form action={logout}>
            <button className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-rose-600 text-white rounded-lg text-xs font-bold">
              <LogOut size={16} /> Sign Out
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
