"use client";

import { useState } from "react";
import { Printer, FileSpreadsheet, FileText, ChevronDown } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { formatCurrency, formatDate } from "@/lib/utils";

interface ExportButtonProps {
  transactions: any[];
  month: number;
  year: number;
}

export function ExportButton({ transactions, month, year }: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Judul Laporan
  const monthName = new Date(year, month - 1, 1).toLocaleDateString("id-ID", { month: "long", year: "numeric" });
  const fileName = `Laporan_Kas_Masjid_${monthName.replace(/\s/g, "_")}`;

  // --- LOGIC PDF ---
  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    // Header Dokumen
    doc.setFontSize(16);
    doc.text("LAPORAN KAS MASJID MANARUL ISLAM BANGIL", 105, 15, { align: "center" });
    doc.setFontSize(10);
    doc.text(`Periode: ${monthName}`, 105, 22, { align: "center" });

    // Hitung Total
    const totalIncome = transactions.filter((t) => t.type === "income").reduce((acc, curr) => acc + curr.amount, 0);
    const totalExpense = transactions.filter((t) => t.type === "expense").reduce((acc, curr) => acc + curr.amount, 0);

    // Siapkan Data Tabel
    const tableData = transactions.map((t, index) => [
      index + 1,
      formatDate(t.date),
      t.transaction_categories?.name,
      t.description || "-",
      t.type === "income" ? formatCurrency(t.amount) : "-",
      t.type === "expense" ? formatCurrency(t.amount) : "-",
    ]);

    // Generate Tabel
    autoTable(doc, {
      head: [["No", "Tanggal", "Kategori", "Uraian", "Masuk", "Keluar"]],
      body: tableData,
      startY: 30,
      theme: "grid",
      headStyles: { fillColor: [22, 163, 74], textColor: 255 }, // Warna Hijau Emerald
      styles: { fontSize: 8, cellPadding: 2 },
      columnStyles: {
        4: { halign: "right", fontStyle: "bold", textColor: [22, 163, 74] }, // Kolom Masuk Hijau
        5: { halign: "right", fontStyle: "bold", textColor: [220, 38, 38] }, // Kolom Keluar Merah
      },
      foot: [["", "", "", "TOTAL", formatCurrency(totalIncome), formatCurrency(totalExpense)]],
      footStyles: { fillColor: [241, 245, 249], textColor: 0, fontStyle: "bold" },
    });

    // Footer Tanda Tangan (Opsional)
    const finalY = (doc as any).lastAutoTable.finalY + 20;
    doc.text("Mengetahui,", 140, finalY);
    doc.text("Ketua Takmir", 140, finalY + 25);

    doc.save(`${fileName}.pdf`);
    setIsOpen(false);
  };

  // --- LOGIC EXCEL ---
  const handleDownloadExcel = () => {
    // Format Data agar rapi di Excel
    const data = transactions.map((t, index) => ({
      No: index + 1,
      Tanggal: formatDate(t.date),
      Kategori: t.transaction_categories?.name,
      Uraian: t.description || "-",
      Pemasukan: t.type === "income" ? t.amount : 0,
      Pengeluaran: t.type === "expense" ? t.amount : 0,
    }));

    // Tambahkan baris Total di bawah
    const totalIncome = transactions.filter((t) => t.type === "income").reduce((acc, curr) => acc + curr.amount, 0);
    const totalExpense = transactions.filter((t) => t.type === "expense").reduce((acc, curr) => acc + curr.amount, 0);

    data.push({
      No: "",
      Tanggal: "",
      Kategori: "",
      Uraian: "TOTAL PERIODE INI",
      Pemasukan: totalIncome,
      Pengeluaran: totalExpense,
    } as any);

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan");

    // Atur lebar kolom otomatis
    const wscols = [{ wch: 5 }, { wch: 20 }, { wch: 20 }, { wch: 40 }, { wch: 15 }, { wch: 15 }];
    worksheet["!cols"] = wscols;

    XLSX.writeFile(workbook, `${fileName}.xlsx`);
    setIsOpen(false);
  };

  return (
    <div className="relative h-10 w-full sm:w-auto">
      {" "}
      {/* Pastikan h-10 agar sama dengan filter */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-full bg-white border border-slate-300 text-slate-700 px-4 rounded-lg hover:bg-slate-50 flex items-center justify-center gap-2 font-medium shadow-sm transition-all text-sm"
      >
        <Printer size={16} />
        <span>Export</span>
        <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-1 w-full sm:w-48 bg-white rounded-lg shadow-xl border border-slate-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
          <button onClick={handleDownloadPDF} className="w-full text-left px-4 py-3 hover:bg-slate-50 flex items-center gap-3 text-sm text-slate-700 transition-colors">
            <FileText size={16} className="text-red-500" />
            <span>Download PDF</span>
          </button>
          <div className="h-px bg-slate-100"></div>
          <button onClick={handleDownloadExcel} className="w-full text-left px-4 py-3 hover:bg-slate-50 flex items-center gap-3 text-sm text-slate-700 transition-colors">
            <FileSpreadsheet size={16} className="text-green-600" />
            <span>Download Excel</span>
          </button>
        </div>
      )}
      {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>}
    </div>
  );
}
