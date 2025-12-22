'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { DeleteAgendaButton } from '@/components/DeleteAgendaButton'

export async function createAgenda(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const dateStr = formData.get('date') as string
  const timeStr = formData.get('time') as string
  const startDateTime = new Date(`${dateStr}T${timeStr}:00`).toISOString()
  
  const endDateObj = new Date(`${dateStr}T${timeStr}:00`)
  endDateObj.setHours(endDateObj.getHours() + 2)
  const endDateTime = endDateObj.toISOString()

  const eventData = {
    title: formData.get('title'),
    short_description: formData.get('description'),
    location: formData.get('location'),
    pic_name: formData.get('pic_name'),
    start_datetime: startDateTime,
    end_datetime: endDateTime,
    created_by: user.id
  }

  const { error } = await supabase.from('events').insert(eventData)

  if (error) {
    console.error('ERROR INSERT:', error)
    throw new Error('Gagal menyimpan agenda') 
  }

  revalidatePath('/agenda')
  revalidatePath('/agenda-kegiatan') // Revalidate halaman public juga
  revalidatePath('/')
}

export async function updateAgenda(id: string, formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Gabungkan Date & Time menjadi Timestamp
  const dateStr = formData.get('date') as string
  const timeStr = formData.get('time') as string
  const startDateTime = new Date(`${dateStr}T${timeStr}:00`).toISOString()
  
  // Hitung end time
  const endDateObj = new Date(`${dateStr}T${timeStr}:00`)
  endDateObj.setHours(endDateObj.getHours() + 2)
  const endDateTime = endDateObj.toISOString()

  const eventData = {
    title: formData.get('title'),
    short_description: formData.get('description'),
    location: formData.get('location'),
    pic_name: formData.get('pic_name'),
    start_datetime: startDateTime,
    end_datetime: endDateTime,
  }

  const { error } = await supabase
    .from('events')
    .update(eventData)
    .eq('id', id)

  if (error) {
    console.error('ERROR UPDATE:', error)
    throw new Error('Gagal mengupdate agenda') 
  }

  revalidatePath('/agenda')
  revalidatePath('/agenda-kegiatan')
  revalidatePath('/')
}

export async function deleteAgenda(id: string) {
  const supabase = await createClient()
  await supabase.from('events').delete().eq('id', id)
  
  revalidatePath('/agenda')
  revalidatePath('/agenda-kegiatan')
  revalidatePath('/')
}