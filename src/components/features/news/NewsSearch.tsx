"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent } from "react";

export function NewsSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentQuery = searchParams.get("q") ?? "";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const query = String(formData.get("q") ?? "").trim();
    const params = new URLSearchParams(searchParams.toString());

    if (query) {
      params.set("q", query);
    } else {
      params.delete("q");
    }

    params.delete("page");
    router.push(`/news?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Search
        className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
        aria-hidden="true"
      />
      <input
        type="search"
        name="q"
        defaultValue={currentQuery}
        placeholder="Cari berita..."
        className="h-11 w-full border border-border bg-background pl-11 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-neutral-400 focus:border-primary-600"
      />
    </form>
  );
}