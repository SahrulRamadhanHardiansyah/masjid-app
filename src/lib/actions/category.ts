'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createCategory(formData: FormData) {
  const supabase = await createClient()

  const name = formData.get('name') as string
  const type = formData.get('type') as 'income' | 'expense'

  if (!name || !type) {
    throw new Error('Nama dan tipe kategori wajib diisi')
  }

  const { error } = await supabase
    .from('transaction_categories')
    .insert({ name, type })

  if (error) {
    throw new Error(error.message)
  }

  // 🔑 INI YANG PENTING
  revalidatePath('/keuangan')
}