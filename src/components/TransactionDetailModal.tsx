"use client";

import { createPortal } from "react-dom";
import { X, Calendar, Tag, FileText, Image as ImageIcon } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useEffect, useState } from "react";

const getStorageUrl = (path: string | null) => {
  if (!path) return null;
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/receipts/${path}`;
};

interface TransactionDetailModalProps {
  transaction: any;
  onClose: () => void;
}

export function TransactionDetailModal({ transaction, onClose }: TransactionDetailModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  if (!mounted) return null;

  const categoryName = Array.isArray(transaction.transaction_categories) ? transaction.transaction_categories[0]?.name : transaction.transaction_categories?.name;

  return createPortal(
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose} />

      {/* Konten Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 z-10 flex flex-col max-h-[90vh]">
        {/* Header Warna-warni sesuai tipe */}
        <div className={`px-6 py-4 border-b flex justify-between items-center ${transaction.type === "income" ? "bg-emerald-50 border-emerald-100" : "bg-rose-50 border-rose-100"}`}>
          <div>
            <h3 className={`font-bold text-lg ${transaction.type === "income" ? "text-emerald-700" : "text-rose-700"}`}>Detail {transaction.type === "income" ? "Pemasukan" : "Pengeluaran"}</h3>
            <p className="text-xs text-slate-500">ID: #{transaction.id}</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-black/5 transition-colors text-slate-500">
            <X size={20} />
          </button>
        </div>

        {/* Body (Scrollable) */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Nominal Besar */}
          <div className="text-center">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Total Nominal</p>
            <h2 className={`text-3xl font-bold font-mono ${transaction.type === "income" ? "text-emerald-600" : "text-rose-600"}`}>
              {transaction.type === "income" ? "+" : "-"} {formatCurrency(transaction.amount)}
            </h2>
          </div>

          {/* Grid Informasi Dasar */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div>
              <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                <Calendar size={14} />
                <span className="text-[10px] font-bold uppercase">Tanggal</span>
              </div>
              <p className="text-sm font-medium text-slate-700">{formatDate(transaction.date)}</p>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                <Tag size={14} />
                <span className="text-[10px] font-bold uppercase">Kategori</span>
              </div>
              <p className="text-sm font-medium text-slate-700">{categoryName || "-"}</p>
            </div>
          </div>

          {/* Keterangan */}
          <div>
            <div className="flex items-center gap-1.5 text-slate-400 mb-2">
              <FileText size={16} />
              <span className="text-xs font-bold uppercase">Keterangan</span>
            </div>
            <div className="p-4 rounded-lg border border-slate-200 bg-white text-sm text-slate-600 leading-relaxed min-h-[60px]">{transaction.description || "Tidak ada keterangan tambahan."}</div>
          </div>

          {/* Bukti Foto (Tampil Besar) */}
          <div>
            <div className="flex items-center gap-1.5 text-slate-400 mb-2">
              <ImageIcon size={16} />
              <span className="text-xs font-bold uppercase">Bukti Transaksi</span>
            </div>
            {transaction.image_path ? (
              <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 relative group">
                <img src={getStorageUrl(transaction.image_path) || ""} alt="Bukti Nota" className="w-full h-auto object-contain max-h-[300px] bg-slate-50" />
                <a
                  href={getStorageUrl(transaction.image_path) || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                >
                  <span className="bg-white text-slate-900 px-4 py-2 rounded-full text-xs font-bold shadow-lg transform scale-95 group-hover:scale-100 transition-transform">Buka Gambar Asli</span>
                </a>
              </div>
            ) : (
              <div className="p-6 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 gap-2 bg-slate-50">
                <ImageIcon size={32} className="opacity-30" />
                <span className="text-xs">Tidak ada bukti foto dilampirkan</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
