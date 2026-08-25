"use client";

import { useEffect, useState } from "react";

interface ShareActionsProps {
  title: string;
  url?: string;
}

export function ShareActions({ title, url }: ShareActionsProps) {
  const [shareUrl, setShareUrl] = useState(() => url ?? window.location.href);

  useEffect(() => {
    if (url) {
      setShareUrl(url);
    }
  }, [url]);

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);

  return (
    <div className="flex shrink-0 items-center gap-3">
      <span className="text-sm font-semibold text-foreground">Bagikan</span>

      <a
        href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Bagikan melalui WhatsApp"
        className="flex h-8 w-8 items-center justify-center border border-neutral-200 text-foreground-muted transition-colors hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="currentColor">
          <path d="M20.52 3.48A11.87 11.87 0 0 0 12.08 0C5.52 0 .18 5.34.18 11.9c0 2.1.55 4.15 1.59 5.96L.08 24l6.28-1.65a11.9 11.9 0 0 0 5.72 1.46h.01c6.56 0 11.9-5.34 11.9-11.9 0-3.18-1.24-6.17-3.47-8.43ZM12.09 21.8h-.01a9.86 9.86 0 0 1-5.03-1.38l-.36-.21-3.73.98 1-3.64-.23-.37a9.85 9.85 0 1 1 8.36 4.62Zm5.41-7.39c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.46-.88-.78-1.47-1.74-1.64-2.04-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.09 4.49.71.31 1.27.49 1.7.63.72.23 1.37.2 1.89.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z" />
        </svg>
      </a>

      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Bagikan melalui Twitter"
        className="flex h-8 w-8 items-center justify-center border border-neutral-200 text-foreground-muted transition-colors hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="currentColor">
          <path d="M18.24 2.25h3.31l-7.23 8.26L22.82 21.75h-6.62l-5.19-6.79-5.94 6.79H1.75l7.73-8.84L1.18 2.25H7.97l4.69 6.2 5.58-6.2Zm-1.16 17.52h1.83L7.01 4.14H5.05l12.03 15.63Z" />
        </svg>
      </a>
    </div>
  );
}