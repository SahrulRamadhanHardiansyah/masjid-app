import { transporter } from '@/lib/mailer'

const resetUrl =
  `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?email=${email}`

await transporter.sendMail({
  from: 'no-reply@yourapp.com',
  to: email,
  subject: 'Reset Password',
  html: `
    <div style="font-family: sans-serif">
      <h2>Reset Password</h2>
      <p>Kode OTP kamu:</p>
      <h1>${otp}</h1>

      <p>Atau klik link berikut:</p>
      <a href="${resetUrl}">${resetUrl}</a>

      <p><small>Berlaku 5 menit</small></p>
    </div>
  `
})