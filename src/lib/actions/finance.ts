'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createTransaction(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const date = formData.get('date')
  const type = formData.get('type')
  const category_id = formData.get('category_id')
  const amount = formData.get('amount')
  const description = formData.get('description')

  const { error } = await supabase.from('transactions').insert({
    date,
    type,
    category_id: Number(category_id),
    amount: Number(amount),
    description,
    created_by: user.id
  })

  if (error) {
    console.error(error)
    return { error: 'Gagal menyimpan data' }
  }

  revalidatePath('/keuangan')
  revalidatePath('/dashboard')
  revalidatePath('/')
  redirect('/keuangan')
}