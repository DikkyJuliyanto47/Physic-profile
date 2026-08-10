"use client";

import { useState } from "react";

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
  onOpen: (msg: Message) => void;
};

export function MessageInboxClient({ onOpen }: Props) {
  return null;
}

export type { Message };
