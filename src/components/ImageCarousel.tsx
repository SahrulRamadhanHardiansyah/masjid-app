'use client'

import React from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'

export function ImageCarousel() {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 3000 })])

  const images = [
      '/carousel/zakat.png',
      '/carousel/zakat2.png',
      '/carousel/zakat3.png',
  ]

  return (
    <div className="w-full max-w-5xl mx-auto mt-8 mb-12 px-4">
      
      {/* Container Utama */}
      <div className="overflow-hidden rounded-2xl shadow-lg border border-slate-200 bg-slate-100" ref={emblaRef}>
        <div className="flex">
          {images.map((src, index) => (
            <div className="flex-[0_0_100%] min-w-0 relative aspect-[21/9]" key={index}>
              {/* Menggunakan <img> biasa agar langsung load tanpa config domain */}
              <img 
                src={src} 
                alt={`Kegiatan Masjid ${index + 1}`} 
                className="w-full h-full object-cover block"
                // Menambahkan error handling sederhana jika link bermasalah
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none'; // Sembunyikan jika error
                }}
              />
              
              {/* Overlay Gradient untuk estetika */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Caption */}
      <div className="text-center mt-3">
        <p className="text-xs font-medium text-slate-400">
          Dokumentasi kegiatan penyaluran zakat, infaq, dan sedekah.
        </p>
      </div>
    </div>
  )
}