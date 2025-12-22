'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { Filter, ChevronDown, ChevronLeft, ChevronRight, SortAsc, SortDesc, Calendar, AlignLeft, TrendingDown } from 'lucide-react'

export function TransactionControls({ 
  hasNextPage, 
  hasPrevPage, 
  totalCount,
  currentPage 
}: { 
  hasNextPage: boolean, 
  hasPrevPage: boolean, 
  totalCount: number,
  currentPage: number 
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const currentSort = searchParams.get('sort') || 'latest'

  // Tutup dropdown jika klik di luar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Fungsi Update URL
  const handleSort = (sortType: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', sortType)
    params.set('page', '1') // Reset ke halaman 1 jika ganti filter
    router.push(`/keuangan?${params.toString()}`)
    setIsOpen(false)
  }

  const handlePage = (direction: 'next' | 'prev') => {
    const params = new URLSearchParams(searchParams.toString())
    const newPage = direction === 'next' ? currentPage + 1 : currentPage - 1
    params.set('page', newPage.toString())
    router.push(`/keuangan?${params.toString()}`)
  }

  // Label Mapping
  const sortLabel: Record<string, string> = {
    'latest': 'Terbaru',
    'oldest': 'Terlama',
    'amount_desc': 'Nominal Terbesar',
    'amount_asc': 'Nominal Terkecil',
    'desc_asc': 'Abjad (A-Z)'
  }

  return (
    <div className="flex items-center justify-between gap-4">
      
      {/* FILTER DROPDOWN */}
      <div className="relative" ref={dropdownRef}>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 border border-slate-300 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-50 bg-white transition-all shadow-sm"
        >
          <Filter size={14} /> 
          <span>Urutkan: <span className="text-blue-600 font-bold">{sortLabel[currentSort]}</span></span>
          <ChevronDown size={14} />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-slate-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-2 space-y-1">
              <button onClick={() => handleSort('latest')} className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-md ${currentSort === 'latest' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}>
                <Calendar size={14} /> Terbaru (Default)
              </button>
              <button onClick={() => handleSort('oldest')} className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-md ${currentSort === 'oldest' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}>
                <SortAsc size={14} /> Terlama
              </button>
              <div className="h-px bg-slate-100 my-1"></div>
              <button onClick={() => handleSort('amount_desc')} className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-md ${currentSort === 'amount_desc' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}>
                <TrendingDown size={14} /> Nominal Terbesar
              </button>
              <button onClick={() => handleSort('amount_asc')} className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-md ${currentSort === 'amount_asc' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}>
                <SortAsc size={14} /> Nominal Terkecil
              </button>
              <div className="h-px bg-slate-100 my-1"></div>
              <button onClick={() => handleSort('desc_asc')} className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-md ${currentSort === 'desc_asc' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}>
                <AlignLeft size={14} /> Abjad (Keterangan)
              </button>
            </div>
          </div>
        )}
      </div>

      {/* PAGINATION BUTTONS */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-500 hidden sm:inline-block mr-2">
           Halaman {currentPage}
        </span>
        <button 
          onClick={() => handlePage('prev')}
          disabled={!hasPrevPage}
          className="p-1.5 rounded-md border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-slate-600"
        >
          <ChevronLeft size={16} />
        </button>
        <button 
          onClick={() => handlePage('next')}
          disabled={!hasNextPage}
          className="p-1.5 rounded-md border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-slate-600"
        >
          <ChevronRight size={16} />
        </button>
      </div>

    </div>
  )
}