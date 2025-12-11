import type { Metadata } from "next";
import { ReactQueryClientProvider } from "./providers";
import "./globals.css";
import "../styles/shadcn.css";
import "@/styles/pdf.css";
import AppShell from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "AI Construction Assistant",
  description: "AI-powered construction document assistant"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ReactQueryClientProvider>
          <AppShell>{children}</AppShell>
        </ReactQueryClientProvider>
      </body>
    </html>
  );
}
