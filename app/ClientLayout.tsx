"use client"

import type React from "react"
import { Analytics } from "@vercel/analytics/next"
import { useState, useEffect } from "react"
import type { Cairo, Poppins } from "next/font/google"

interface ClientLayoutProps {
  children: React.ReactNode
  cairoFont: typeof Cairo extends (props: any) => any ? ReturnType<typeof Cairo> : any
  poppinsFont: typeof Poppins extends (props: any) => any ? ReturnType<typeof Poppins> : any
}

export function ClientLayout({ children, cairoFont, poppinsFont }: ClientLayoutProps) {
  const [language, setLanguage] = useState<"fr" | "ar">("fr")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedLanguage = localStorage.getItem("language") as "fr" | "ar" | null
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
  }, [])

  const dir = language === "ar" ? "rtl" : "ltr"

  return (
    <html lang={language} dir={dir}>
      <head>
        <meta name="theme-color" content="#39c0a0" />
      </head>
      <body
        className={`${poppinsFont.className} ${cairoFont.className} font-sans antialiased bg-background text-foreground`}
      >
        {mounted && children}
        <Analytics />
      </body>
    </html>
  )
}
