"use client";

import { useState } from "react";
import { MessageDetailModal } from "@/components/admin/MessageDetailModal";
import { MessageActions } from "./MessageActions";

type Message = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  isRead: boolean;
  createdAt: Date;
};

type Props = {
  messages: Message[];
};

function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function getRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Baru saja";
  if (minutes < 60) return `${minutes} menit lalu`;
  if (hours < 24) return `${hours} jam lalu`;
  if (days < 7) return `${days} hari lalu`;
  return formatDateTime(date);
}

const STATUS_LABELS: Record<string, string> = {
  UNREAD: "Belum Dibaca",
  READ: "Sudah Dibaca",
  REPLIED: "Dibalas",
};

const STATUS_COLORS: Record<string, string> = {
  UNREAD: "bg-blue-50 text-blue-700",
  READ: "bg-neutral-100 text-neutral-600",
  REPLIED: "bg-green-50 text-green-700",
};

export function MessageListClient({ messages }: Props) {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  return (
    <>
      <div className="rounded-xl border border-neutral-200 bg-white shadow-card">
        {messages.length === 0 ? (
          <div className="py-16 text-center">
            <svg className="mx-auto h-12 w-12 text-neutral-300" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
            <p className="mt-4 text-neutral-500">Kotak masuk kosong.</p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {messages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => setSelectedMessage(msg)}
                className={`flex items-start gap-4 px-5 py-4 transition-colors hover:bg-neutral-50/50 ${
                  msg.status === "UNREAD" ? "bg-blue-50/30" : ""
                } cursor-pointer`}
              >
                {/* Unread dot */}
                <div className="flex-shrink-0 pt-1.5">
                  {msg.status === "UNREAD" ? (
                    <span className="block h-2.5 w-2.5 rounded-full bg-blue-500" />
                  ) : (
                    <span className="block h-2.5 w-2.5" />
                  )}
                </div>

                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700">
                    {msg.name.charAt(0)}
                  </div>
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p
                      className={`truncate text-sm ${
                        msg.status === "UNREAD"
                          ? "font-semibold text-neutral-900"
                          : "font-medium text-neutral-700"
                      }`}
                    >
                      {msg.name}
                    </p>
                    <span className="text-xs text-neutral-400">
                      &lt;{msg.email}&gt;
                    </span>
                  </div>
                  <p
                    className={`mt-0.5 truncate text-sm ${
                      msg.status === "UNREAD"
                        ? "font-medium text-neutral-900"
                        : "text-neutral-600"
                    }`}
                  >
                    {msg.subject}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-neutral-500">
                    {msg.message.slice(0, 100)}
                    {msg.message.length > 100 ? "..." : ""}
                  </p>
                </div>

                {/* Right side */}
                <div className="flex flex-shrink-0 flex-col items-end gap-2">
                  <span className="text-xs text-neutral-400">
                    {getRelativeTime(msg.createdAt)}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[msg.status]}`}
                  >
                    {STATUS_LABELS[msg.status]}
                  </span>
                  <div onClick={(e) => e.stopPropagation()}>
                    <MessageActions
                      messageId={msg.id}
                      messageSubject={msg.subject}
                      currentStatus={msg.status}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <MessageDetailModal
        message={selectedMessage}
        onClose={() => setSelectedMessage(null)}
      />
    </>
  );
}
