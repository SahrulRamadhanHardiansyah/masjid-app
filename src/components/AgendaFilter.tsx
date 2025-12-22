'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Calendar, X } from 'lucide-react'

export function AgendaFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Ambil nilai tanggal dari URL jika ada
  const currentDate = searchParams.get('date') || ''

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value
    if (date) {
      router.push(`/agenda-kegiatan?date=${date}`)
    } else {
      router.push('/agenda-kegiatan')
    }
  }

  const handleReset = () => {
    router.push('/agenda-kegiatan')
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-8">
      <div className="flex items-center gap-2 text-slate-700 font-medium">
        <div className="bg-blue-50 p-2 rounded-lg text-blue-700">
           <Calendar size={20} />
        </div>
        <span>Filter Tanggal:</span>
      </div>

      <div className="relative flex-1 w-full sm:w-auto">
        <input 
          type="date" 
          value={currentDate}
          onChange={handleDateChange}
          className="w-full border border-slate-300 rounded-lg px-4 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        />
      </div>

      {currentDate && (
        <button 
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors border border-rose-200"
        >
          <X size={16} /> Reset Filter
        </button>
      )}
    </div>
  )
}