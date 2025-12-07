"use client"

import { useState, useEffect } from "react"

export type Language = "fr" | "ar"

export function useLanguage() {
  const [language, setLanguage] = useState<Language>("fr")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedLanguage = localStorage.getItem("language") as Language | null
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }

    // Écouter les changements de langue
    const handleLanguageChange = () => {
      const newLanguage = localStorage.getItem("language") as Language | null
      if (newLanguage) {
        setLanguage(newLanguage)
        // Mettre à jour l'attribut HTML
        if (typeof document !== "undefined") {
          document.documentElement.lang = newLanguage
          document.documentElement.dir = newLanguage === "ar" ? "rtl" : "ltr"
        }
      }
    }

    window.addEventListener("storage", handleLanguageChange)
    // Écouter aussi les changements dans la même fenêtre
    const interval = setInterval(() => {
      const currentLanguage = localStorage.getItem("language") as Language | null
      if (currentLanguage && currentLanguage !== language) {
        handleLanguageChange()
      }
    }, 100)

    return () => {
      window.removeEventListener("storage", handleLanguageChange)
      clearInterval(interval)
    }
  }, [language])

  const changeLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage)
    localStorage.setItem("language", newLanguage)
    if (typeof document !== "undefined") {
      document.documentElement.lang = newLanguage
      document.documentElement.dir = newLanguage === "ar" ? "rtl" : "ltr"
    }
    // Déclencher un événement personnalisé
    window.dispatchEvent(new Event("languagechange"))
  }

  return { language, changeLanguage, mounted }
}

