"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { useCallback } from "react";

export function MonthFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const now = new Date();
  const month = Number(searchParams.get("month")) || now.getMonth() + 1;
  const year = Number(searchParams.get("year")) || now.getFullYear();

  const handleNav = useCallback(
    (direction: number) => {
      const date = new Date(year, month - 1 + direction, 1);
      const newMonth = date.getMonth() + 1;
      const newYear = date.getFullYear();

      const params = new URLSearchParams(searchParams.toString());
      params.set("month", newMonth.toString());
      params.set("year", newYear.toString());

      router.push(`?${params.toString()}`);
    },
    [month, year, router, searchParams]
  );

  const label = new Date(year, month - 1, 1).toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });

  return (
    // PERUBAHAN DI SINI: Hapus min-w-[220px], ganti jadi min-w-0 agar fleksibel di grid
    <div className="flex items-center justify-between bg-white border border-slate-300 rounded-lg shadow-sm h-10 w-full sm:w-auto min-w-0 px-1">
      <button onClick={() => handleNav(-1)} className="h-8 w-8 flex-shrink-0 flex items-center justify-center rounded hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors">
        <ChevronLeft size={18} />
      </button>

      <div className="flex items-center justify-center gap-1.5 flex-1 h-full px-1 overflow-hidden">
        <Calendar size={14} className="text-blue-600 flex-shrink-0" />
        {/* Tambahkan truncate agar teks tidak merusak layout jika layar sangat kecil */}
        <span className="text-xs sm:text-sm font-semibold text-slate-700 truncate">{label}</span>
      </div>

      <button onClick={() => handleNav(1)} className="h-8 w-8 flex-shrink-0 flex items-center justify-center rounded hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors">
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
