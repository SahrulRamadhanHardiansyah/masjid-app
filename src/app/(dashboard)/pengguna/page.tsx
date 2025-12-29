import { listAllUsers, createNewUser, deleteUser } from "@/lib/actions/users";
import { UserPlus, Trash2, CheckCircle, XCircle, User } from "lucide-react";
import { AddUserModal } from "@/components/AddUserModal";

export default async function UserManagementPage() {
  const users = await listAllUsers();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manajemen Pengguna</h1>
          <p className="text-sm text-slate-500 mt-1">Kelola akun pengurus yang dapat mengakses sistem.</p>
        </div>
        <AddUserModal />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* PERBAIKAN: Tambahkan div wrapper dengan overflow-x-auto */}
        <div className="overflow-x-auto w-full"> 
          <table className="w-full text-left text-sm whitespace-nowrap"> {/* Tambahkan whitespace-nowrap agar teks rapi */}
            <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600 uppercase text-xs">
              <tr>
                <th className="py-4 px-6">Pengguna</th>
                <th className="py-4 px-6">Status Email</th>
                <th className="py-4 px-6">Dibuat Pada</th>
                <th className="py-4 px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user: any) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-full text-blue-600 shrink-0"> {/* shrink-0 agar ikon tidak gepeng */}
                        <User size={18} />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{user.user_metadata?.full_name || "Tanpa Nama"}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    {user.email_confirmed_at ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                        <CheckCircle size={12} /> Terverifikasi
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-700 border border-orange-100">
                        <XCircle size={12} /> Belum Verifikasi
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-slate-500">{new Date(user.created_at).toLocaleDateString("id-ID")}</td>
                  <td className="py-4 px-6 text-right">
                    <form
                      action={async () => {
                        "use server";
                        await deleteUser(user.id);
                      }}
                    >
                      <button className="text-rose-500 hover:bg-rose-50 p-2 rounded-lg transition-colors" title="Hapus User">
                        <Trash2 size={18} />
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {users.length === 0 && <div className="p-8 text-center text-slate-500">Belum ada pengguna lain.</div>}
      </div>
    </div>
  );
}