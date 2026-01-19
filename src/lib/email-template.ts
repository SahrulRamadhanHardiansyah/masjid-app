export function resetPasswordEmail(
    otp: string,
    resetUrl: string
) {
return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6">
    <h2>Reset Password</h2>

    <p>Kami menerima permintaan reset password untuk akun Anda.</p>

    <p><strong>Kode OTP Anda:</strong></p>
    <h1 style="letter-spacing: 4px">${otp}</h1>

    <p>Atau klik link berikut untuk reset password:</p>
    <a href="${resetUrl}"
        style="
            display:inline-block;
            padding:10px 16px;
            background:#2563eb;
            color:#fff;
            text-decoration:none;
            border-radius:6px;
            ">
        Reset Password
        </a>

        <p style="margin-top:16px">
        Kode OTP berlaku <strong>5 menit</strong>.
        Jika Anda tidak meminta reset password, abaikan email ini.
        </p>
    </div>
    `
}