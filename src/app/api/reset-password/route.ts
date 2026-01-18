import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'

export async function POST(req) {
  const { email, otp, newPassword } = await req.json()

  const record = await db.password_resets.findFirst({
    where: {
      email,
      otp
    }
  })

  if (!record) {
    return NextResponse.json(
      { message: 'OTP salah' },
      { status: 400 }
    )
  }

  if (new Date() > record.expires_at) {
    return NextResponse.json(
      { message: 'OTP sudah kadaluarsa' },
      { status: 400 }
    )
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10)

  // UPDATE PASSWORD DI TABEL PROFILE
  await db.profiles.update({
    where: { email },
    data: { password: hashedPassword }
  })

  // HAPUS OTP SETELAH DIGUNAKAN
  await db.password_resets.delete({
    where: { id: record.id }
  })

  return NextResponse.json({
    message: 'Password berhasil direset'
  })
}