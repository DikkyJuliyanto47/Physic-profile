"use client";

import { useState } from "react";
import { MessageDetailModal } from "@/components/admin/MessageDetailModal";

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

export function InboxClient({ messages }: Props) {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  return (
    <>
      {/* Click handlers are added via data attributes on the page */}
      <MessageDetailModal
        message={selectedMessage}
        onClose={() => setSelectedMessage(null)}
      />

      {/* Hidden script to wire up click events */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.querySelectorAll('[data-message-id]').forEach(function(el) {
              el.addEventListener('click', function(e) {
                if (e.target.closest('button') || e.target.closest('a')) return;
                var id = el.getAttribute('data-message-id');
                window.__openMessage && window.__openMessage(id);
              });
              el.style.cursor = 'pointer';
            });
          `,
        }}
      />
    </>
  );
}

export function useMessageModal() {
  const [selected, setSelected] = useState<Message | null>(null);
  return { selected, setSelected };
}
