"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Globe, Menu, X, User, LogIn, Zap, Trophy } from "lucide-react"

interface UserData {
  name: string
  email: string
  role?: string
}

export function Navigation() {
  const [language, setLanguage] = useState<"fr" | "ar">("fr")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<UserData | null>(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedLanguage = localStorage.getItem("language") as "fr" | "ar" | null
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleLanguage = () => {
    const newLanguage = language === "fr" ? "ar" : "fr"
    setLanguage(newLanguage)
    localStorage.setItem("language", newLanguage)
    if (typeof document !== "undefined") {
      document.documentElement.lang = newLanguage
      document.documentElement.dir = newLanguage === "ar" ? "rtl" : "ltr"
    }
  }

  const links = {
    fr: [
      { href: "/", label: "Accueil" },
      { href: "/about", label: "NIRD" },
      { href: "/steps", label: "Démarche" },
      { href: "/resources", label: "Ressources" },
      { href: "/quiz", label: "Quiz", badge: "5 Stages" },
    ],
    ar: [
      { href: "/", label: "الصفحة الرئيسية" },
      { href: "/about", label: "NIRD" },
      { href: "/steps", label: "الخطوات" },
      { href: "/resources", label: "الموارد" },
      { href: "/quiz", label: "اختبار", badge: "5 Stages" },
    ],
  }

  const currentLinks = links[language]

  if (!mounted) {
    return <header className="fixed top-0 left-0 right-0 z-50 h-16"></header>
  }

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-background/80 backdrop-blur-xl border-b border-primary/20 shadow-lg shadow-primary/5' 
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 font-bold text-lg group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-black text-sm group-hover:scale-110 transition-transform shadow-lg shadow-primary/30">
              DV
            </div>
            <span className="hidden sm:block">
              <span className="text-primary">Digital</span>
              <span className="text-foreground"> Village</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {currentLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-primary/10 group"
              >
                {link.label}
                {link.badge && (
                  <span className="ml-2 text-xs bg-accent/20 text-accent px-2 py-0.5 rounded-full">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
            <Link
              href="/ai-quiz"
              className="ml-2 px-4 py-2 text-sm font-bold rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 hover:from-purple-500/30 hover:to-pink-500/30 transition-all flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              Quiz IA
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border/50 hover:border-primary/50 hover:bg-primary/10 transition-all text-muted-foreground hover:text-foreground"
              title={language === "fr" ? "Switch to Arabic" : "Switch to French"}
            >
              <Globe className="w-4 h-4" />
              <span className="text-xs font-bold hidden sm:inline">{language.toUpperCase()}</span>
            </button>

            {/* Auth */}
            {user ? (
              <Link
                href="/dashboard"
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 text-foreground font-medium hover:border-primary/50 transition-all"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-bold text-primary-foreground">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="max-w-[80px] truncate text-sm">{user.name}</span>
                <Trophy className="w-4 h-4 text-yellow-500" />
              </Link>
            ) : (
              <Link
                href="/login"
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:shadow-lg hover:shadow-primary/30 transition-all"
              >
                <LogIn className="w-4 h-4" />
                Connexion
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-primary/10 transition-colors text-foreground"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 space-y-1 border-t border-border/50 bg-background/95 backdrop-blur-xl -mx-4 px-4 animate-in slide-in-from-top-2">
            {currentLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-primary/10 text-foreground font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
                {link.badge && (
                  <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded-full">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
            <Link
              href="/ai-quiz"
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Zap className="w-4 h-4" />
              Quiz IA
            </Link>
            <div className="pt-2 mt-2 border-t border-border/50">
              {user ? (
                <Link
                  href="/dashboard"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 text-foreground font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-bold text-primary-foreground">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  {user.name}
                  <Trophy className="w-4 h-4 text-yellow-500 ml-auto" />
                </Link>
              ) : (
                <div className="space-y-2">
                  <Link
                    href="/login"
                    className="flex items-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground font-bold justify-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <LogIn className="w-4 h-4" />
                    Connexion
                  </Link>
                  <Link
                    href="/signup"
                    className="flex items-center gap-2 px-4 py-3 rounded-xl border border-primary/50 text-primary font-bold justify-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Inscription
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
