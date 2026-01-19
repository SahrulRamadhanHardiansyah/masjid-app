'use client'

import { useState } from 'react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

async function submit() {
  if (!email) {
    alert('Email wajib diisi')
    return
  }

  setLoading(true)

  try {
    const res = await fetch('/api/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    const data = await res.json()

    if (!res.ok) {
      alert(data.message || 'Gagal mengirim OTP')
      return
    }

    alert('OTP berhasil dikirim ke email')
  } catch (error) {
    alert('Server error')
  } finally {
    setLoading(false)
  }
}

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        
        <h1 className="text-2xl font-semibold text-gray-800 text-center">
          Lupa Password
        </h1>

        <p className="text-sm text-gray-500 text-center mt-2">
          Masukkan email yang terdaftar untuk menerima kode OTP
        </p>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Masukkan email anda"
            className="w-full rounded-lg border border-gray-300 px-4 py-2
                      focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={submit}
          disabled={loading}
          className="mt-6 w-full rounded-lg bg-blue-600 text-white py-2
                    hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? 'Mengirim...' : 'Kirim OTP'}
        </button>

        <div className="mt-4 text-center">
          <a
            href="/login"
            className="text-sm text-blue-600 hover:underline"
          >
            ← Kembali ke Login
          </a>
        </div>

      </div>
    </div>
  )
}