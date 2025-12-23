"use client";

import { useState } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Search, Image as ImageIcon, Eye } from "lucide-react";
import { TransactionDetailModal } from "./TransactionDetailModal";

export function TransactionHistoryTable({ transactions }: { transactions: any[] }) {
  const [selectedTransaction, setSelectedTransaction] = useState<any | null>(null);

  return (
    <>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm min-h-[400px]">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-6 w-32 whitespace-nowrap">Tanggal</th>
                <th className="py-3.5 px-4 w-40 whitespace-nowrap">Kategori</th>
                <th className="py-3.5 px-4 min-w-[200px]">Keterangan</th>
                <th className="py-3.5 px-4 w-20 text-center">Bukti</th>
                <th className="py-3.5 px-6 text-right w-40 whitespace-nowrap">Jumlah</th>
                <th className="py-3.5 px-4 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {transactions?.map((trx) => (
                <tr key={trx.id} onClick={() => setSelectedTransaction(trx)} className="hover:bg-blue-50/60 transition-colors group cursor-pointer">
                  <td className="py-3.5 px-6 text-slate-600 font-medium whitespace-nowrap">{formatDate(trx.date)}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border whitespace-nowrap ${
                        trx.type === "income" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-rose-50 text-rose-700 border-rose-100"
                      }`}
                    >
                      {trx.transaction_categories?.name}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 truncate max-w-[150px] sm:max-w-[200px]" title={trx.description || ""}>
                    {trx.description || "-"}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {trx.image_path ? (
                      <div className="inline-flex items-center justify-center text-blue-500 bg-blue-50 p-1 rounded-md">
                        <ImageIcon size={14} />
                      </div>
                    ) : (
                      <span className="text-slate-300 text-xs">-</span>
                    )}
                  </td>

                  <td className={`py-3.5 px-6 text-right font-mono font-semibold whitespace-nowrap ${trx.type === "income" ? "text-emerald-600" : "text-rose-600"}`}>
                    {trx.type === "income" ? "+" : "-"} {formatCurrency(trx.amount)}
                  </td>

                  <td className="py-3.5 px-4 text-center text-slate-300 group-hover:text-blue-500 transition-colors">
                    <Eye size={18} />
                  </td>
                </tr>
              ))}

              {transactions?.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="inline-block p-4 bg-slate-50 rounded-full mb-3">
                      <Search size={24} className="text-slate-300" />
                    </div>
                    <p className="text-slate-500 font-medium">Belum ada data transaksi.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedTransaction && <TransactionDetailModal transaction={selectedTransaction} onClose={() => setSelectedTransaction(null)} />}
    </>
  );
}
