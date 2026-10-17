const messages: Record<string, string> = {
  submitted: "Pengajuan tersimpan dan menunggu persetujuan Admin PSI Surabaya.",
  resubmitted:
    "Pengajuan berhasil diajukan ulang dan menunggu persetujuan Admin PSI Surabaya.",
  approved: "Pengajuan berhasil disetujui.",
  rejected: "Pengajuan ditolak dan dikembalikan untuk revisi.",
  "status-updated": "Status berhasil diperbarui.",
  saved: "Konten berhasil disimpan.",
  deleted: "Konten berhasil dihapus.",
};

export function ContentFeedback({ result }: { result?: string }) {
  const message =
    result && Object.hasOwn(messages, result) ? messages[result] : undefined;
  return message ? (
    <p
      role="status"
      className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
    >
      {message}
    </p>
  ) : null;
}
