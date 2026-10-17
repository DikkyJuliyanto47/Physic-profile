"use client";

import { useEffect, useRef } from "react";

export function useDialogAccessibility(
  open: boolean,
  onClose: () => void,
  locked = false,
) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const latest = useRef({ onClose, locked });

  useEffect(() => {
    latest.current = { onClose, locked };
    if (open && locked) dialogRef.current?.focus();
  }, [onClose, locked, open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!open || !dialog) return;
    const trigger =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const cancel = (event: Event) => {
      event.preventDefault();
      if (!latest.current.locked) latest.current.onClose();
    };
    dialog.addEventListener("cancel", cancel);
    dialog.showModal();
    (
      dialog.querySelector<HTMLElement>("[data-dialog-initial-focus]") ?? dialog
    ).focus();
    return () => {
      dialog.removeEventListener("cancel", cancel);
      dialog.close();
      if (trigger?.isConnected) trigger.focus();
    };
  }, [open]);

  return dialogRef;
}
