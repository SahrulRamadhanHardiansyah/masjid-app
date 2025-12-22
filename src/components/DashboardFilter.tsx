'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Calendar, Filter } from 'lucide-react'

export function DashboardFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentYear = new Date().getFullYear()
  const selectedMonth = searchParams.get('month') || (new Date().getMonth() + 1).toString()
  const selectedYear = searchParams.get('year') || currentYear.toString()

  const months = [
    { value: '1', label: 'Januari' }, { value: '2', label: 'Februari' },
    { value: '3', label: 'Maret' }, { value: '4', label: 'April' },
    { value: '5', label: 'Mei' }, { value: '6', label: 'Juni' },
    { value: '7', label: 'Juli' }, { value: '8', label: 'Agustus' },
    { value: '9', label: 'September' }, { value: '10', label: 'Oktober' },
    { value: '11', label: 'November' }, { value: '12', label: 'Desember' },
  ]

  // Generate 5 tahun terakhir
  const years = Array.from({ length: 5 }, (_, i) => (currentYear - i).toString())

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set(key, value)
    router.push(`/dashboard?${params.toString()}`)
  }

  return (
    <div className="flex items-center gap-3 bg-white p-1.5 rounded-lg border border-slate-200 shadow-sm">
      <div className="pl-2 pr-1 text-slate-400">
        <Filter size={16} />
      </div>
      
      <select 
        value={selectedMonth} 
        onChange={(e) => handleFilterChange('month', e.target.value)}
        className="text-sm font-medium text-slate-700 bg-transparent border-none focus:ring-0 cursor-pointer outline-none"
      >
        {months.map((m) => (
          <option key={m.value} value={m.value}>{m.label}</option>
        ))}
      </select>

      <div className="w-px h-4 bg-slate-200"></div>

      <select 
        value={selectedYear}
        onChange={(e) => handleFilterChange('year', e.target.value)}
        className="text-sm font-medium text-slate-700 bg-transparent border-none focus:ring-0 cursor-pointer outline-none pr-2"
      >
        {years.map((y) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
    </div>
  )
}