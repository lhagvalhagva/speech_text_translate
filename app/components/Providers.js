"use client";

import dynamic from "next/dynamic";
import { Analytics } from "@vercel/analytics/react";

const AuthProvider = dynamic(
  () => import("./auth/AuthProvider").then((mod) => mod.AuthProvider),
  {
    ssr: false,
  }
);

export function Providers({ children }) {
  return (
    <>
      <AuthProvider>{children}</AuthProvider>
      <Analytics />
    </>
  );
}
