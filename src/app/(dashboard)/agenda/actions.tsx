"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createAgenda(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const dateStr = formData.get("date") as string;
  const timeStr = formData.get("time") as string;
  const startDateTime = new Date(`${dateStr}T${timeStr}:00`).toISOString();

  const endDateObj = new Date(`${dateStr}T${timeStr}:00`);
  endDateObj.setHours(endDateObj.getHours() + 2);
  const endDateTime = endDateObj.toISOString();

  // Logika Upload Gambar
  let image_path = null;
  const imageFile = formData.get("image") as File | null;

  if (imageFile && imageFile.size > 0) {
    if (imageFile.size > 2 * 1024 * 1024) {
      console.error("File terlalu besar");
    } else {
      try {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${fileName}`;

        const arrayBuffer = await imageFile.arrayBuffer();
        const fileBuffer = Buffer.from(arrayBuffer);

        const { error: uploadError } = await supabase.storage.from("events").upload(filePath, fileBuffer, { contentType: imageFile.type });

        if (!uploadError) {
          image_path = filePath;
        }
      } catch (err) {
        console.error("System Upload Error:", err);
      }
    }
  }

  const eventData = {
    title: formData.get("title"),
    short_description: formData.get("description"),
    location: formData.get("location"),
    pic_name: formData.get("pic_name"),
    start_datetime: startDateTime,
    end_datetime: endDateTime,
    image_path: image_path,
    created_by: user.id,
  };

  const { error } = await supabase.from("events").insert(eventData);

  if (error) {
    console.error("ERROR INSERT:", error);
    throw new Error("Gagal menyimpan agenda");
  }

  revalidatePath("/agenda");
  revalidatePath("/agenda-kegiatan");
  revalidatePath("/");
}

export async function updateAgenda(id: string, formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const dateStr = formData.get("date") as string;
  const timeStr = formData.get("time") as string;
  const startDateTime = new Date(`${dateStr}T${timeStr}:00`).toISOString();

  const endDateObj = new Date(`${dateStr}T${timeStr}:00`);
  endDateObj.setHours(endDateObj.getHours() + 2);
  const endDateTime = endDateObj.toISOString();

  // --- LOGIKA UPDATE GAMBAR ---
  let new_image_path = undefined; // Undefined agar tidak menimpa data lama jika kosong
  const imageFile = formData.get("image") as File | null;

  if (imageFile && imageFile.size > 0) {
    if (imageFile.size > 2 * 1024 * 1024) {
      console.error("File terlalu besar");
    } else {
      try {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${fileName}`;

        const arrayBuffer = await imageFile.arrayBuffer();
        const fileBuffer = Buffer.from(arrayBuffer);

        const { error: uploadError } = await supabase.storage.from("events").upload(filePath, fileBuffer, { contentType: imageFile.type });

        if (!uploadError) {
          new_image_path = filePath;
        }
      } catch (err) {
        console.error("Upload Error:", err);
      }
    }
  }

  // Siapkan data update
  const eventData: any = {
    title: formData.get("title"),
    short_description: formData.get("description"),
    location: formData.get("location"),
    pic_name: formData.get("pic_name"),
    start_datetime: startDateTime,
    end_datetime: endDateTime,
  };

  // Hanya tambahkan image_path ke query jika ada gambar baru
  if (new_image_path) {
    eventData.image_path = new_image_path;
  }

  const { error } = await supabase.from("events").update(eventData).eq("id", id);

  if (error) {
    console.error("ERROR UPDATE:", error);
    throw new Error("Gagal mengupdate agenda");
  }

  revalidatePath("/agenda");
  revalidatePath("/agenda-kegiatan");
  revalidatePath("/");
}

export async function deleteAgenda(id: string) {
  const supabase = await createClient();
  await supabase.from("events").delete().eq("id", id);

  revalidatePath("/agenda");
  revalidatePath("/agenda-kegiatan");
  revalidatePath("/");
}
