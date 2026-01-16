import { Image } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50 font-poppins">
      {/* Navbar Skeleton */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3 animate-pulse">
            <div className="h-10 w-10 bg-slate-200 rounded-full"></div>
            <div className="h-6 w-48 bg-slate-200 rounded"></div>
          </div>
          <div className="h-9 w-32 bg-slate-200 rounded animate-pulse"></div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Header & Saldo Skeleton */}
        <div className="text-center mb-12 animate-pulse">
          <div className="h-10 w-3/4 md:w-1/2 bg-slate-200 rounded mx-auto mb-4"></div>
          <div className="h-6 w-1/2 bg-slate-200 rounded mx-auto mb-8"></div>
          <div className="inline-block bg-white p-6 rounded-xl border border-slate-200 shadow-sm w-64 h-32">
            <div className="h-4 w-20 bg-slate-200 rounded mx-auto mb-4"></div>
            <div className="h-10 w-40 bg-slate-200 rounded mx-auto"></div>
          </div>
        </div>

        {/* Carousel Placeholder */}
        <div className="w-full h-64 md:h-80 bg-slate-200 rounded-xl mb-12 flex items-center justify-center animate-pulse">
          <Image className="text-slate-300 w-16 h-16" />
        </div>

        {/* Agenda Section Skeleton */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="h-7 w-40 bg-slate-200 rounded animate-pulse"></div>
            <div className="h-5 w-32 bg-slate-200 rounded animate-pulse"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 h-48 animate-pulse">
                <div className="flex justify-between mb-4">
                  <div className="h-14 w-14 bg-slate-200 rounded-lg"></div>
                  <div className="h-8 w-8 bg-slate-200 rounded-full"></div>
                </div>
                <div className="h-6 w-full bg-slate-200 rounded mb-3"></div>
                <div className="h-4 w-2/3 bg-slate-200 rounded mb-2"></div>
                <div className="h-4 w-1/2 bg-slate-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Table/Mutasi Skeleton */}
        <div className="flex items-center justify-between mb-6">
          <div className="h-7 w-40 bg-slate-200 rounded animate-pulse"></div>
          <div className="h-5 w-32 bg-slate-200 rounded animate-pulse"></div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-pulse">
          <div className="border-b border-slate-200 bg-slate-50 h-12 w-full"></div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center px-6 py-4 border-b border-slate-100 last:border-0">
              <div className="h-4 w-24 bg-slate-200 rounded mr-6"></div>
              <div className="h-6 w-20 bg-slate-200 rounded mr-6"></div>
              <div className="h-4 flex-1 bg-slate-200 rounded mr-6"></div>
              <div className="h-4 w-24 bg-slate-200 rounded"></div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}