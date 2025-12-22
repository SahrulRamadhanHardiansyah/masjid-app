'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'

export function MonthFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentMonth = Number(searchParams.get('month')) || new Date().getMonth() + 1
  const currentYear = Number(searchParams.get('year')) || new Date().getFullYear()

  const date = new Date(currentYear, currentMonth - 1, 1)
  const monthName = date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })

  const changeDate = (increment: number) => {
    const newDate = new Date(currentYear, currentMonth - 1 + increment, 1)
    const newMonth = newDate.getMonth() + 1
    const newYear = newDate.getFullYear()
    
    router.push(`/laporan?month=${newMonth}&year=${newYear}`)
  }

  return (
    <div className="flex items-center gap-4 bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
      <button 
        onClick={() => changeDate(-1)}
        className="p-2 hover:bg-slate-100 rounded-md text-slate-500 hover:text-blue-700 transition-colors"
      >
        <ChevronLeft size={20} />
      </button>
      
      <div className="flex items-center gap-2 min-w-[180px] justify-center text-slate-700 font-semibold select-none">
        <Calendar size={18} className="text-blue-600 mb-0.5" />
        <span>{monthName}</span>
      </div>

      <button 
        onClick={() => changeDate(1)}
        className="p-2 hover:bg-slate-100 rounded-md text-slate-500 hover:text-blue-700 transition-colors"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  )
}