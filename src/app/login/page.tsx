import { login } from '@/lib/actions/auth'
import Link from 'next/link'
import { Building2, Mail, Lock, ArrowLeft } from 'lucide-react'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 font-poppins relative overflow-hidden">
      
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-100/50 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-slate-200/50 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8 relative z-10 mx-4">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-blue-50 text-blue-700 mb-4 border border-blue-100">
            <Building2 size={28} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Login Pengurus</h1>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">
            Masuk untuk mengelola keuangan dan agenda <br/> Masjid Manarul Islam Bangil.
          </p>
        </div>

        {/* Form Section */}
        <form action={login} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={18} className="text-slate-400" />
              </div>
              <input 
                name="email" 
                type="email" 
                required 
                placeholder="Masukkan alamat email" 
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400" 
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-slate-400" />
              </div>
              <input 
                name="password" 
                type="password" 
                required 
                placeholder="Masukkan Password" 
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400" 
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 rounded-lg transition-all transform active:scale-[0.98] shadow-md shadow-blue-700/20 flex items-center justify-center gap-2 mt-2"
          >
            Masuk Dashboard
          </button>
        </form>

        {/* Footer / Back Link */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-700 font-medium transition-colors">
            <ArrowLeft size={16} /> Kembali ke Beranda
          </Link>
        </div>

      </div>
      
      {/* Copyright Footer */}
      <div className="absolute bottom-6 text-center w-full text-xs text-slate-400">
        &copy; {new Date().getFullYear()} Sistem Informasi Masjid Manarul Islam Bangil
      </div>
    </div>
  )
}