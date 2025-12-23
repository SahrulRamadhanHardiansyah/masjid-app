import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { MobileSidebar } from "@/components/MobileSidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="flex h-screen bg-slate-50 font-poppins text-slate-900 overflow-hidden">
      {/* Sidebar Desktop (Hidden on Mobile) */}
      <Sidebar user={user} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-8 flex justify-between items-center flex-shrink-0 z-10 shadow-sm">
          <div className="flex items-center gap-3">
            {/* Tombol Menu Mobile (Visible only on Mobile) */}
            <MobileSidebar user={user} />

            <h1 className="text-sm font-medium text-slate-500 truncate max-w-[200px] md:max-w-none">
              <span className="hidden md:inline">Sistem Informasi </span>Masjid Manarul Islam<span className="hidden md:inline"> Bangil</span>
            </h1>
          </div>

          <div className="text-xs md:text-sm font-semibold text-blue-900 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="hidden md:inline">{new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "short", year: "numeric" })}</span>
            <span className="md:hidden">{new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short" })}</span>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <div className="max-w-6xl mx-auto">{children}</div>
        </div>
      </main>
    </div>
  );
}
