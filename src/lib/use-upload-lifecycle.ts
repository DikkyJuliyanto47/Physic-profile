"use client";

import { useCallback, useEffect, useRef } from "react";

function releaseUploads(urls: string[]) {
  // Keep each request below the API limit and the browser keepalive budget.
  for (let offset = 0; offset < urls.length; offset += 50) {
    void fetch("/api/upload", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ urls: urls.slice(offset, offset + 50) }),
      keepalive: true,
    })
      .then((response) => {
        if (!response.ok)
          console.error("[media] Upload release failed:", response.status);
      })
      .catch((error: unknown) =>
        console.error("[media] Upload release failed:", error),
      );
  }
}

// Track only uploads created by this form, never initial media or pasted URLs.
// Replaced uploads also get released when the form is closed or navigation ends.
export function useUploadLifecycle() {
  const uploads = useRef(new Set<string>());
  const active = useRef(true);
  const trackUpload = useCallback((url: string) => {
    uploads.current.add(url);
    // An upload response can arrive after the form has already unmounted.
    if (!active.current) releaseUploads([url]);
  }, []);

  useEffect(() => {
    active.current = true;
    const release = () => {
      const urls = Array.from(uploads.current);
      releaseUploads(urls);
    };
    // A page in the back/forward cache is still an active form.
    const onPageHide = (event: PageTransitionEvent) => {
      if (!event.persisted) release();
    };
    window.addEventListener("pagehide", onPageHide);
    return () => {
      active.current = false;
      window.removeEventListener("pagehide", onPageHide);
      release();
    };
  }, []);

  return trackUpload;
}
