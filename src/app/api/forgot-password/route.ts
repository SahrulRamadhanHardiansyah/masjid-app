import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { generateOTP } from '@/lib/otp'
import { transporter } from '@/lib/mailer'

export async function POST(req: Request) {
  // ✅ WAJIB ambil email dari body
  const { email } = await req.json()

  if (!email) {
    return NextResponse.json(
      { message: 'Email wajib diisi' },
      { status: 400 }
    )
  }

  // hapus OTP lama
  await supabase
    .from('password_resets')
    .delete()
    .eq('email', email)

  const otp = generateOTP()
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000)

  await supabase
    .from('password_resets')
    .insert({
      email,
      otp,
      expires_at: expiresAt,
    })

  // ✅ PASTIKAN email SUDAH ADA di sini
  const resetUrl =
    `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?email=${encodeURIComponent(email)}`

  await transporter.sendMail({
    from: 'no-reply@app.com',
    to: email,
    subject: 'Reset Password',
    html: `
      <h2>Reset Password</h2>
      <p>Kode OTP kamu:</p>
      <h1>${otp}</h1>
      <p>Atau klik link berikut:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p><small>Berlaku 5 menit</small></p>
    `,
  })

  return NextResponse.json({ message: 'OTP terkirim' })
}