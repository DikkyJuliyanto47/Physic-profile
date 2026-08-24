"use client";

import { SessionProvider } from "next-auth/react";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { AdminTopbar } from "@/components/layout/AdminTopbar";
import { useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <SessionProvider>
      <div className="min-h-screen bg-neutral-50">
        <AdminSidebar onToggle={setSidebarOpen} />
        <AdminTopbar sidebarOpen={sidebarOpen} />
        
        <main 
          className={`mt-16 px-4 py-6 sm:px-6 lg:px-8 transition-all duration-300 ease-in-out ${
            sidebarOpen ? "lg:ml-72" : "lg:ml-16"
          }`}
        >
          {children}
        </main>
      </div>
    </SessionProvider>
  );
}