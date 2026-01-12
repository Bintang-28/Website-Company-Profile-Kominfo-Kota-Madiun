"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import AuthProvider from "@/context/AuthProvider";
import AdminThemeProvider from "@/context/AdminThemeProvider";

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <AuthProvider>
      <AdminThemeProvider>
        <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900">
          <Sidebar isOpen={sidebarOpen} />
          <div className="flex-1 flex flex-col">
            <Header onMenuClick={() => setSidebarOpen((prev) => !prev)} />
            <main className="flex-1 p-4 md:p-8 bg-gray-100 dark:bg-gray-900">
              {children}
            </main>
          </div>
        </div>
      </AdminThemeProvider>
    </AuthProvider>
  );
}