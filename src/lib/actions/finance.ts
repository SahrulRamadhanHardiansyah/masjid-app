"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// --- CREATE TRANSACTION ---
export async function createTransaction(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const date = formData.get("date") as string;
  const type = formData.get("type") as string;
  const category_id = formData.get("category_id") as string;
  const amount = formData.get("amount") as string;
  const description = formData.get("description") as string;
  const imageFile = formData.get("image") as File | null;

  let image_path = null;

  // LOGIKA UPLOAD DIPERBAIKI
  if (imageFile && imageFile.size > 0) {
    // Validasi ukuran (Max 2MB)
    if (imageFile.size > 2 * 1024 * 1024) {
      console.error("File terlalu besar");
      // Opsional: throw error agar UI tahu
    } else {
      try {
        const fileExt = imageFile.name.split(".").pop();
        // Nama file unik: timestamp-randomstring.ext
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${fileName}`;

        // KONVERSI FILE KE BUFFER (PENTING UNTUK SERVER ACTION)
        const arrayBuffer = await imageFile.arrayBuffer();
        const fileBuffer = Buffer.from(arrayBuffer);

        const { error: uploadError, data } = await supabase.storage
          .from("receipts") // Pastikan nama bucket ini benar di dashboard
          .upload(filePath, fileBuffer, {
            contentType: imageFile.type,
            upsert: false,
          });

        if (uploadError) {
          console.error("Upload Error:", uploadError);
        } else {
          image_path = filePath; // Simpan path jika sukses
        }
      } catch (err) {
        console.error("System Error during upload:", err);
      }
    }
  }

  // Simpan ke Database
  const { error } = await supabase.from("transactions").insert({
    date,
    type,
    category_id: Number(category_id),
    amount: Number(amount),
    description,
    image_path, // Path akan null jika tidak ada gambar atau upload gagal
    created_by: user.id,
  });

  if (error) {
    console.error("Transaction Error:", error);
  }

  // Broadcast Realtime Event
  try {
    const isIncome = type === "income";
    const label = isIncome ? "Pemasukan" : "Pengeluaran";
    await fetch("http://localhost:3001/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "finance-update",
        data: { 
          message: `Laporan ${label} baru sebesar Rp ${Number(amount).toLocaleString("id-ID")}`,
          type: type 
        },
      }),
    });
  } catch (e) {
    console.error("Socket Error", e);
  }

  revalidatePath("/keuangan");
  redirect("/keuangan");
}

// --- EXPORT FUNCTION (Tetap sama, dirapikan sedikit) ---
export async function getAllTransactionsForExport(startDate?: string, endDate?: string) {
  const supabase = await createClient();

  let query = supabase
    .from("transactions")
    .select(
      `
      date,
      type,
      amount,
      description,
      image_path, 
      transaction_categories (name)
    `
    )
    .order("date", { ascending: false });

  if (startDate) query = query.gte("date", startDate);
  if (endDate) query = query.lte("date", endDate);

  const { data, error } = await query;

  if (error) {
    console.error("Export Error:", error);
    return [];
  }

  return data.map((trx) => {
    const categoryRaw = trx.transaction_categories as any;
    const categoryName = Array.isArray(categoryRaw) ? categoryRaw[0]?.name : categoryRaw?.name;

    return {
      Tanggal: new Date(trx.date).toLocaleDateString("id-ID"),
      Kategori: categoryName || "Tanpa Kategori",
      Tipe: trx.type === "income" ? "Pemasukan" : "Pengeluaran",
      Keterangan: trx.description || "-",
      Nominal: Number(trx.amount),
      RawDate: trx.date,
    };
  });
}
