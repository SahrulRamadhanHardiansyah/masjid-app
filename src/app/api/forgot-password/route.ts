import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { generateOTP } from '@/lib/otp'
import { transporter } from '@/lib/mailer'
import { resetPasswordEmail } from '@/lib/email-template'

export async function POST(req: Request) {
  try {
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

    // simpan OTP ke Supabase
    await supabase.from('password_resets').insert({
      email,
      otp,
      expires_at: expiresAt,
    })

    const resetUrl =
      `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?email=${encodeURIComponent(email)}`

    // ✉️ KIRIM EMAIL CUSTOM (INI KUNCINYA)
    await transporter.sendMail({
      from: `"Masjid App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Reset Password - Kode OTP',
      html: resetPasswordEmail(otp, resetUrl),
    })

    return NextResponse.json({ message: 'OTP berhasil dikirim ke email' })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}