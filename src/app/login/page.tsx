import { login } from '@/lib/actions/auth'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-900">Login Pengurus Masjid</h1>
        <form action={login} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black">Email</label>
            <input name="email" type="email" required placeholder="admin@masjid.com" className="w-full px-3 py-2 mt-1 border rounded-md text-black" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input name="password" type="password" required className="w-full px-3 py-2 mt-1 border rounded-md text-black" />
          </div>
          <button type="submit" className="w-full px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700">
            Masuk
          </button>
        </form>
      </div>
    </div>
  )
}
