'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createCategory } from '@/lib/actions/category'

export function AddCategoryModal() {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleSubmit = async (formData: FormData) => {
    try {
      await createCategory(formData)
      startTransition(() => {
        router.refresh()
        setOpen(false)
      })
    } catch (error) {
      console.error('Error creating category:', error)
      // You can add error handling here, like showing a toast
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-xs text-blue-600 hover:underline"
      >
        + Tambah
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-lg w-full max-w-sm p-5">
            <h3 className="font-semibold mb-4">Tambah Kategori</h3>

            <form action={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold">Nama Kategori</label>
                <input
                  name="name"
                  required
                  className="w-full border rounded-md px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-semibold">Tipe</label>
                <select
                  name="type"
                  className="w-full border rounded-md px-3 py-2 text-sm"
                >
                  <option value="income">Pemasukan</option>
                  <option value="expense">Pengeluaran</option>
                </select>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="text-sm px-4 py-2"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="bg-blue-600 text-white text-sm px-4 py-2 rounded-md disabled:opacity-50"
                >
                  {isPending ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
