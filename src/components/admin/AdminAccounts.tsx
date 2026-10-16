"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { saveAdmin, type AdminInput } from "@/actions/admin";

type Account = Omit<AdminInput, "password"> & { id: string };
const empty: AdminInput = { name: "", email: "", role: "ADMIN", isActive: true, password: "" };
const inputClass = "h-10 w-full rounded-md border border-neutral-300 bg-white px-4 text-sm text-neutral-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100";
const buttonClass = "rounded-md border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-50";

export function AdminAccounts({ accounts }: { accounts: Account[] }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [confirmation, setConfirmation] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [form, setForm] = useState<AdminInput>({ ...empty });
  const [busy, setBusy] = useState(false);
  const inFlight = useRef(false);
  const [feedback, setFeedback] = useState<{ error: boolean; text: string } | null>(null);

  function edit(account?: Account) {
    setSelected(account?.id ?? null);
    setForm(account ? { ...account, password: "" } : { ...empty });
    setFeedback(null);
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current || confirmation !== null) return;
    const account = accounts.find(item => item.id === selected);
    if (account) {
      const changes: string[] = [];
      if (account.role !== form.role) changes.push(`role: ${account.role === "SUPER_ADMIN" ? "Admin PSI Surabaya" : "Admin"} menjadi ${form.role === "SUPER_ADMIN" ? "Admin PSI Surabaya" : "Admin"}`);
      if (account.isActive !== form.isActive) changes.push(form.isActive ? "mengaktifkan akun" : "menonaktifkan akun (akses akan ditolak)");
      if (form.password) changes.push("mereset password");
      if (changes.length) {
        const ownAccount = selected === session?.user?.id;
        setConfirmation(`Akun ${account.name?.trim() || "User"} (${account.email}): ${changes.join("; ")}. Sesi akun ini akan dicabut.${ownAccount ? " Ini akun Anda sendiri: Anda akan logout dan perlu login kembali jika akun masih aktif dan memiliki akses." : " Jika ini akun Anda sendiri, Anda akan logout dan perlu login kembali jika masih memiliki akses."}`);
        return;
      }
    }
    void save();
  }

  async function save() {
    if (inFlight.current) return;
    setConfirmation(null);
    inFlight.current = true;
    setBusy(true);
    setFeedback(null);
    try {
      const result = await saveAdmin(selected, form);
      if (!result.success) {
        setFeedback({ error: true, text: result.error ?? "Gagal menyimpan akun." });
        return;
      }
      if (result.sessionRevoked) {
        await signOut({ callbackUrl: "/login" });
        return;
      }
      setSelected(null);
      setForm({ ...empty });
      setFeedback({ error: false, text: "Akun admin berhasil disimpan." });
      router.refresh();
    } catch {
      setFeedback({ error: true, text: "Tidak dapat menyimpan akun. Silakan coba lagi." });
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-card">
        <div className="flex items-center justify-between gap-3 border-b border-neutral-100 px-5 py-4">
          <p className="text-sm font-semibold text-neutral-900">Daftar akun ({accounts.length})</p>
          <button type="button" disabled={busy || confirmation !== null} className={buttonClass} onClick={() => edit()}>Tambah Admin</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-neutral-100 bg-neutral-50/70 text-neutral-500">
              <tr>{["Nama", "Email", "Role", "Status", "Aksi"].map((label) => <th key={label} className="px-5 py-3 font-medium">{label}</th>)}</tr>
            </thead>
            <tbody>{accounts.map((account) => (
              <tr key={account.id} className="border-b border-neutral-100 last:border-0">
                <td className="px-5 py-4 text-neutral-900">{account.name?.trim() || "User"}</td>
                <td className="px-5 py-4 text-neutral-600">{account.email}</td>
                <td className="px-5 py-4">{account.role === "SUPER_ADMIN" ? "Admin PSI Surabaya" : "Admin"}</td>
                <td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${account.isActive ? "bg-green-50 text-green-700" : "bg-neutral-100 text-neutral-600"}`}>{account.isActive ? "Aktif" : "Nonaktif"}</span></td>
                <td className="px-5 py-4"><button type="button" disabled={busy || confirmation !== null} className={buttonClass} onClick={() => edit(account)}>Kelola<span className="sr-only"> {account.email}</span></button></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>

      <form onSubmit={submit} className="space-y-5 rounded-lg border border-neutral-200 bg-white p-5 shadow-card sm:p-6">
        <h2 className="text-base font-semibold text-neutral-900">{selected ? "Ubah Akun Admin" : "Tambah Akun Admin"}</h2>
        {feedback && <p role={feedback.error ? "alert" : "status"} className={`rounded-md p-3 text-sm ${feedback.error ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>{feedback.text}</p>}
        <fieldset disabled={busy || confirmation !== null} className="grid gap-5 sm:grid-cols-2">
          <div><label htmlFor="admin-name" className="mb-1.5 block text-sm font-medium text-neutral-700">Nama</label><input id="admin-name" required maxLength={100} autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} /></div>
          <div><label htmlFor="admin-email" className="mb-1.5 block text-sm font-medium text-neutral-700">Email</label><input id="admin-email" type="email" required maxLength={254} autoComplete="off" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} /></div>
          <div><label htmlFor="admin-role" className="mb-1.5 block text-sm font-medium text-neutral-700">Role</label><select id="admin-role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value === "SUPER_ADMIN" ? "SUPER_ADMIN" : "ADMIN" })} className={inputClass}><option value="ADMIN">Admin</option><option value="SUPER_ADMIN">Admin PSI Surabaya</option></select></div>
          <div><label htmlFor="admin-status" className="mb-1.5 block text-sm font-medium text-neutral-700">Status</label><select id="admin-status" value={String(form.isActive)} onChange={(e) => setForm({ ...form, isActive: e.target.value === "true" })} className={inputClass}><option value="true">Aktif</option><option value="false">Nonaktif</option></select></div>
          <div className="sm:col-span-2"><label htmlFor="admin-password" className="mb-1.5 block text-sm font-medium text-neutral-700">{selected ? "Reset password (opsional)" : "Password"}</label><input id="admin-password" type="password" required={!selected} minLength={12} maxLength={72} autoComplete="new-password" value={form.password ?? ""} onChange={(e) => setForm({ ...form, password: e.target.value })} aria-describedby="admin-password-help" className={inputClass} /><p id="admin-password-help" className="mt-1.5 text-xs text-neutral-500">Minimal 12 karakter, maksimal 72 byte.{selected && " Kosongkan untuk mempertahankan password."}</p></div>
        </fieldset>
        <p className="text-xs leading-5 text-neutral-500">Perubahan role, status, atau password membatalkan sesi akun tersebut. Jika akun Anda sendiri diubah, Anda perlu login kembali.</p>
        <div className="flex gap-3"><button disabled={busy || confirmation !== null} className="rounded-md bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50">{busy ? "Menyimpan..." : "Simpan Akun"}</button>{selected && <button type="button" disabled={busy || confirmation !== null} className={buttonClass} onClick={() => edit()}>Batal</button>}</div>
      </form>
      {confirmation && <div role="dialog" aria-modal="true" aria-labelledby="account-confirm-title" className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4">
        <div className="w-full max-w-md rounded-lg border border-neutral-200 bg-white p-6 shadow-elevated">
          <h3 id="account-confirm-title" className="text-lg font-semibold text-neutral-900">Konfirmasi Perubahan Akun</h3>
          <p className="mt-2 text-sm leading-6 text-neutral-600">{confirmation}</p>
          <div className="mt-6 flex items-center justify-end gap-2">
            <button type="button" disabled={busy} className={buttonClass} onClick={() => setConfirmation(null)}>Batal</button>
            <button type="button" disabled={busy} className={buttonClass} onClick={() => void save()}>Ya, Simpan Perubahan</button>
          </div>
        </div>
      </div>}
    </div>
  );
}
