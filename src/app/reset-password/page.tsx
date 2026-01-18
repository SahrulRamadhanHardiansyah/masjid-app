'use client'

import { useState } from 'react'

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [password, setPassword] = useState('')

  async function submit() {
    await fetch('/api/reset-password', {
      method: 'POST',
      body: JSON.stringify({
        email,
        otp,
        newPassword: password,
      }),
    })
    alert('Password direset')
  }

  return (
    <div>
      <h1>Reset Password</h1>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input placeholder="OTP" onChange={e => setOtp(e.target.value)} />
      <input type="password" placeholder="Password Baru"
        onChange={e => setPassword(e.target.value)} />
      <button onClick={submit}>Reset</button>
    </div>
  )
}
