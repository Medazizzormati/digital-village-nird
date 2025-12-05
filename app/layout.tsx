import type React from "react"
import type { Metadata, Viewport } from "next"
import { Cairo, Poppins } from "next/font/google"
import "./globals.css"
import { ClientLayout } from "./ClientLayout"

const cairo = Cairo({ 
  subsets: ["arabic", "latin"], 
  weight: ["400", "700"],
  variable: "--font-cairo"
})

const poppins = Poppins({ 
  subsets: ["latin"], 
  weight: ["400", "600", "700"],
  variable: "--font-poppins"
})

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export const metadata: Metadata = {
  title: "القرية الرقمية المقاومة – Digital Village NIRD",
  description: "Comprendre et appliquer la démarche NIRD facilement | فهم وتطبيق نهج NIRD بسهولة",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClientLayout cairoFont={cairo} poppinsFont={poppins}>
      {children}
    </ClientLayout>
  )
}
