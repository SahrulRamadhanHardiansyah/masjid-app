'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Calendar, X } from 'lucide-react'

export function AgendaFilter() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  // Ambil tanggal dari URL jika ada
  const urlDate = searchParams.get('date')

  // State lokal untuk input (agar user bisa mengetik tanpa refresh instan)
  const [dateValue, setDateValue] = useState(urlDate || '')

  // Effect untuk melakukan DEBOUNCE
  // Kode ini hanya akan jalan jika user BERHENTI mengetik/memilih selama 500ms
  useEffect(() => {
    const timer = setTimeout(() => {
      // Cek apakah nilai input beda dengan URL (untuk menghindari refresh yang tidak perlu)
      if (dateValue !== urlDate) {
        const params = new URLSearchParams(searchParams)
        
        if (dateValue) {
          params.set('date', dateValue)
        } else {
          params.delete('date')
        }
        
        // Update URL tanpa reload halaman penuh (scroll: false menjaga posisi scroll)
        replace(`${pathname}?${params.toString()}`, { scroll: false })
      }
    }, 500) // Delay 500ms (setengah detik)

    return () => clearTimeout(timer)
  }, [dateValue, pathname, replace, searchParams, urlDate])

  // Handle Clear Filter
  const handleClear = () => {
    setDateValue('')
  }

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-8">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        
        <div className="flex items-center gap-2 text-slate-700 font-medium">
          <Calendar className="text-blue-600" size={20} />
          <span>Filter Tanggal:</span>
        </div>

        <div className="relative w-full md:w-auto flex items-center gap-2">
          <div className="relative">
            <input
              type="date"
              className="border border-slate-300 rounded-lg px-4 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all w-full md:w-64"
              value={dateValue}
              onChange={(e) => setDateValue(e.target.value)}
            />
          </div>

          {/* Tombol Reset Filter jika ada tanggal yang dipilih */}
          {dateValue && (
            <button 
              onClick={handleClear}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
              title="Hapus Filter"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}