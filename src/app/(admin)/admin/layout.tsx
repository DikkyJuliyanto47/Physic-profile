"use client";

import { SessionProvider } from "next-auth/react";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { AdminTopbar } from "@/components/layout/AdminTopbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <div className="min-h-screen bg-neutral-50">
        <AdminSidebar />

        <div className="lg:pl-72">
          <AdminTopbar />

          <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </SessionProvider>
  );
}
