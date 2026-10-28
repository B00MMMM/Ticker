import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "TickerDesk | Newsroom ticker studio",
  description: "AI-assisted Malayalam-first news ticker production workspace"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
