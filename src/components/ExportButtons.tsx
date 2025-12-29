"use client";

import { useState } from "react";
import { Loader2, FileSpreadsheet, FileText, Download, ChevronDown, Calendar, X } from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getAllTransactionsForExport } from "@/lib/actions/finance";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

export function ExportButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [loadingExcel, setLoadingExcel] = useState(false);
  const [loadingPdf, setLoadingPdf] = useState(false);

  // State untuk Filter Tanggal
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Helper Total
  const calculateTotals = (data: any[]) => {
    let totalIncome = 0;
    let totalExpense = 0;
    data.forEach((row) => {
      if (row.Tipe === "Pemasukan") totalIncome += row.Nominal;
      else totalExpense += row.Nominal;
    });
    return { totalIncome, totalExpense, balance: totalIncome - totalExpense };
  };

  // --- EXCEL ---
  const handleExportExcel = async () => {
    try {
      setLoadingExcel(true);
      const data = await getAllTransactionsForExport(startDate, endDate);

      if (!data || data.length === 0) {
        toast.info("Tidak ada data pada periode tersebut.");
        return;
      }

      const { totalIncome, totalExpense, balance } = calculateTotals(data);
      const cleanData = data.map(({ RawDate, ...rest }) => rest);

      const worksheet = XLSX.utils.json_to_sheet(cleanData);
      const wscols = [{ wch: 15 }, { wch: 20 }, { wch: 15 }, { wch: 40 }, { wch: 20 }];
      worksheet["!cols"] = wscols;

      const periodeText = startDate && endDate ? `Periode: ${startDate} s/d ${endDate}` : `Semua Periode (per ${new Date().toLocaleDateString("id-ID")})`;

      XLSX.utils.sheet_add_aoa(
        worksheet,
        [[""], ["RINGKASAN LAPORAN"], ["Periode Filter", periodeText], ["Total Pemasukan", formatCurrency(totalIncome)], ["Total Pengeluaran", formatCurrency(totalExpense)], ["SALDO PERIODE INI", formatCurrency(balance)]],
        { origin: -1 }
      );

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Keuangan");

      const fileName = `Laporan_${startDate || "All"}_${endDate || "Time"}.xlsx`;
      XLSX.writeFile(workbook, fileName);
      setIsOpen(false);
      toast.success("Laporan Excel berhasil diunduh");
    } catch (error) {
      console.error("Error Excel:", error);
      toast.error("Gagal export Excel");
    } finally {
      setLoadingExcel(false);
    }
  };

  // --- PDF ---
  const handleExportPdf = async () => {
    try {
      setLoadingPdf(true);
      const data = await getAllTransactionsForExport(startDate, endDate);

      if (!data || data.length === 0) {
        toast.info("Tidak ada data pada periode tersebut.");
        return;
      }

      const { totalIncome, totalExpense, balance } = calculateTotals(data);
      const doc = new jsPDF();

      doc.setFontSize(18);
      doc.text("MASJID MANARUL ISLAM BANGIL", 105, 20, { align: "center" });
      doc.setFontSize(12);
      doc.text("Laporan Keuangan Kas Masjid", 105, 30, { align: "center" });

      doc.setFontSize(10);
      let periodeText = `Per Tanggal: ${new Date().toLocaleDateString("id-ID", { dateStyle: "full" })}`;
      if (startDate && endDate) {
        const startStr = new Date(startDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
        const endStr = new Date(endDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
        periodeText = `Periode: ${startStr} - ${endStr}`;
      }
      doc.text(periodeText, 105, 36, { align: "center" });

      doc.setLineWidth(0.5);
      doc.line(15, 42, 195, 42);

      const tableBody = data.map((row) => [row.Tanggal, row.Kategori, row.Tipe === "Pemasukan" ? "(+)" : "(-)", row.Keterangan, formatCurrency(row.Nominal)]);

      autoTable(doc, {
        startY: 45,
        head: [["Tanggal", "Kategori", "Tipe", "Keterangan", "Nominal"]],
        body: tableBody,
        theme: "grid",
        headStyles: { fillColor: [22, 163, 74] },
        styles: { fontSize: 8, cellPadding: 2 },
        columnStyles: {
          0: { cellWidth: 25 },
          1: { cellWidth: 30 },
          2: { cellWidth: 15, halign: "center" },
          3: { cellWidth: "auto" },
          4: { cellWidth: 30, halign: "right" },
        },
      });

      let finalY = (doc as any).lastAutoTable.finalY + 10;
      if (finalY > 240) {
        doc.addPage();
        finalY = 20;
      }

      const summaryX = 120;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("Total Pemasukan:", summaryX, finalY);
      doc.text(formatCurrency(totalIncome), 195, finalY, { align: "right" });
      doc.text("Total Pengeluaran:", summaryX, finalY + 6);
      doc.text(formatCurrency(totalExpense), 195, finalY + 6, { align: "right" });

      doc.line(summaryX, finalY + 8, 195, finalY + 8);
      doc.setFont("helvetica", "bold");
      doc.text("SALDO PERIODE:", summaryX, finalY + 14);
      doc.text(formatCurrency(balance), 195, finalY + 14, { align: "right" });

      const signY = finalY + 40 > 270 ? 40 : finalY + 40;
      if (signY === 40) doc.addPage();

      doc.setFont("helvetica", "normal");
      doc.text(`Bangil, ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}`, 140, signY);
      doc.text("Bendahara Masjid,", 140, signY + 6);
      doc.text("( ....................................... )", 140, signY + 30);

      doc.save(`Laporan_${startDate || "All"}_${endDate || "Time"}.pdf`);
      setIsOpen(false);
      toast.success("Laporan PDF berhasil diunduh");
    } catch (error) {
      console.error("Error PDF:", error);
      toast.error("Gagal export PDF");
    } finally {
      setLoadingPdf(false);
    }
  };

  return (
    <div className="relative h-10 w-full sm:w-auto">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-full bg-white border border-slate-300 text-slate-700 px-4 rounded-lg hover:bg-slate-50 flex items-center justify-center gap-2 font-medium shadow-sm transition-all text-sm"
      >
        <Download size={16} />
        <span>Export</span>
        <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>

          {/* PERBAIKAN FINAL POSISI MODAL */}
          {/* Mobile: left-0 (Menempel Kiri), Desktop: right-0 (Menempel Kanan) */}
          <div className="absolute left-0 sm:left-auto sm:right-0 mt-1 w-72 bg-white rounded-xl shadow-xl border border-slate-100 z-20 animate-in fade-in zoom-in-95 duration-200 overflow-hidden origin-top-left sm:origin-top-right">
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Filter Periode</h3>
            </div>

            <div className="p-4 space-y-3">
              <div>
                <label className="text-xs text-slate-500 font-medium mb-1 block">Dari Tanggal</label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full text-xs border border-slate-300 rounded px-2 py-1.5 focus:ring-1 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-xs text-slate-500 font-medium mb-1 block">Sampai Tanggal</label>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full text-xs border border-slate-300 rounded px-2 py-1.5 focus:ring-1 focus:ring-blue-500" />
              </div>

              {(startDate || endDate) && (
                <button
                  onClick={() => {
                    setStartDate("");
                    setEndDate("");
                  }}
                  className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1 w-full justify-end"
                >
                  <X size={12} /> Hapus Filter (Download Semua)
                </button>
              )}
            </div>

            <div className="p-2 bg-slate-50 border-t border-slate-100 grid grid-cols-2 gap-2">
              <button
                onClick={handleExportExcel}
                disabled={loadingExcel || loadingPdf}
                className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-700 bg-white border border-emerald-200 hover:bg-emerald-50 rounded-lg transition-colors disabled:opacity-50"
              >
                {loadingExcel ? <Loader2 size={14} className="animate-spin" /> : <FileSpreadsheet size={14} />}
                Excel
              </button>
              <button
                onClick={handleExportPdf}
                disabled={loadingExcel || loadingPdf}
                className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-700 bg-white border border-rose-200 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-50"
              >
                {loadingPdf ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} />}
                PDF
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
