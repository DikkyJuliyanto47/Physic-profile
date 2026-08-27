"use client";

import { SessionProvider } from "next-auth/react";
import { useState } from "react";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { AdminTopbar } from "@/components/layout/AdminTopbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarPinned, setSidebarPinned] = useState(true);

  return (
    <SessionProvider>
      <div className="min-h-screen bg-neutral-50">
        <AdminSidebar
          isOpen={sidebarOpen}
          pinned={sidebarPinned}
          onOpenChange={setSidebarOpen}
          onPinnedChange={setSidebarPinned}
        />

        <AdminTopbar
          sidebarOpen={sidebarOpen}
          onMenuToggle={() => setSidebarOpen((current) => !current)}
        />

        <main
          className={`min-h-screen pt-17 transition-[margin] duration-300 ease-in-out ${
            sidebarOpen ? "lg:ml-66" : "lg:ml-16"
          }`}
        >
          <div className="px-4 py-6 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </SessionProvider>
  );
}