"use server";

import { createClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export async function createNewUser(formData: FormData) {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: email,
    password: password,
    email_confirm: false,
    user_metadata: { full_name: fullName },
  });

  if (error) {
    console.error("Create User Error:", error);
    throw new Error(error.message);
  }

  if (data.user && !data.user.email_confirmed_at) {
    const { error: resendError } = await supabaseAdmin.auth.resend({
      type: "signup",
      email: email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/login`,
      },
    });

    if (resendError) {
      console.error("Gagal mengirim email verifikasi:", resendError);
    }
  }

  revalidatePath("/pengguna");
  return { success: true };
}

export async function listAllUsers() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const {
    data: { users },
    error,
  } = await supabaseAdmin.auth.admin.listUsers();

  if (error) {
    console.error(error);
    return [];
  }

  return users;
}

export async function deleteUser(userId: string) {
  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
  if (error) throw new Error(error.message);
  revalidatePath("/pengguna");
}

export async function requestPasswordReset(formData: FormData) {
  const email = formData.get("email") as string;
  const supabase = await createServerClient();

  const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/update-password`;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectUrl,
  });

  if (error) {
    console.error("Reset Error:", error);
    throw new Error("Gagal memproses permintaan.");
  }
}

export async function updatePassword(formData: FormData) {
  const password = formData.get("password") as string;
  const supabase = await createServerClient();

  const { error } = await supabase.auth.updateUser({ password });

  if (error) throw new Error("Gagal update password");
}
