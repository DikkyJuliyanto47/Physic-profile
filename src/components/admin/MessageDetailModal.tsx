"use client";

import { useEffect, useTransition } from "react";
import { markAsRead } from "@/actions/message";

type Message = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  createdAt: Date;
};

type Props = {
  message: Message | null;
  onClose: () => void;
};

export function MessageDetailModal({ message, onClose }: Props) {
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (message && message.status === "UNREAD") {
      startTransition(async () => {
        await markAsRead(message.id);
      });
    }
  }, [message]);

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!message) return null;

  function formatDateTime(date: Date): string {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 px-4 pt-[5vh] pb-4 sm:items-center sm:pt-0">
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-elevated">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4">
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">
              {message.subject}
            </h3>
            <p className="text-sm text-neutral-500">
              {formatDateTime(message.createdAt)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Sender Info */}
        <div className="border-b border-neutral-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700">
              {message.name.charAt(0)}
            </div>
            <div>
              <p className="font-medium text-neutral-900">{message.name}</p>
              <a
                href={`mailto:${message.email}`}
                className="text-sm text-primary-600 hover:text-primary-700 hover:underline"
              >
                {message.email}
              </a>
            </div>
          </div>
        </div>

        {/* Message Body */}
        <div className="px-6 py-5">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-neutral-700">
            {message.message}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-neutral-100 px-6 py-4">
          <a
            href={`mailto:${message.email}?subject=Re: ${message.subject}`}
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
            Balas via Email
          </a>
          <button
            onClick={onClose}
            className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
