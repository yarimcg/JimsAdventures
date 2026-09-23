import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Jim's Adventures — New Zealand Climbing Tours",
  description: "Private NZ climbing tours at Kawakawa Bay, Lake Taupō.",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
