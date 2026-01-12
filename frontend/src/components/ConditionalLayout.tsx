"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const pathsToHide = ["/login", "/admin"];

  const shouldHide = pathsToHide.some((path) => pathname.startsWith(path));

  return (
    <>
      {!shouldHide && <Navbar />}
      <main>{children}</main>
      {!shouldHide && <Footer />}
    </>
  );
}