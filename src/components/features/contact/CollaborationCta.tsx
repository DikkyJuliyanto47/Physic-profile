import { ArrowUpRight, Mail } from "lucide-react";

export function CollaborationCta({ emailHref }: { emailHref?: string }) {
  return (
    <section aria-labelledby="contact-collaboration-heading" className="min-w-0 rounded-md border border-neutral-200 bg-background-muted p-6 sm:p-7">
      <h2 id="contact-collaboration-heading" className="text-xl font-semibold leading-7 tracking-tight text-primary-900">
        Komunikasi &amp; Kolaborasi
      </h2>
      <p className="mt-3 text-sm leading-6 text-foreground-muted">
        PSI Cabang Surabaya terbuka untuk komunikasi mengenai keanggotaan,
        kegiatan ilmiah, serta kolaborasi dalam pendidikan dan penelitian fisika.
      </p>
      {emailHref ? (
        <>
          <p className="mt-4 text-sm leading-6 text-foreground-muted">
            Gunakan email organisasi sebagai kanal komunikasi utama. Sertakan
            topik dan tujuan komunikasi agar informasi dapat disampaikan dengan jelas.
          </p>
          <a
            href={emailHref}
            className="mt-5 inline-flex min-h-11 max-w-full items-center justify-center gap-2 rounded-md bg-primary-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-primary-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-700 motion-reduce:transition-none"
          >
            <Mail aria-hidden="true" className="h-4 w-4 shrink-0" />
            Kirim Email
            <ArrowUpRight aria-hidden="true" className="h-4 w-4 shrink-0" />
          </a>
        </>
      ) : (
        <p className="mt-4 text-sm leading-6 text-foreground-muted">
          Kanal email organisasi belum tersedia.
        </p>
      )}
    </section>
  );
}
