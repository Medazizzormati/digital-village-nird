"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ArrowRight, Zap, Shield, Leaf, Trophy, Star, Gamepad2 } from "lucide-react"
import Link from "next/link"

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const cards = [
    {
      title: "Pourquoi NIRD ?",
      description: "Une approche holistique pour transformer le numérique en ressource inclusive et durable.",
      icon: Zap,
      color: "from-cyan-500 to-blue-500",
      delay: 0,
    },
    {
      title: "Les avantages",
      description: "Résilience, maîtrise technologique et sobriété numérique pour tous.",
      icon: Star,
      color: "from-emerald-500 to-teal-500",
      delay: 100,
    },
    {
      title: "Les étapes",
      description: "Une démarche claire, progressive et accessible pour débuter.",
      icon: Trophy,
      color: "from-purple-500 to-pink-500",
      delay: 200,
    },
  ]

  const stats = [
    { value: "5", label: "Étapes", icon: "🎯" },
    { value: "50+", label: "Questions", icon: "❓" },
    { value: "∞", label: "Possibilités", icon: "🚀" },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 grid-pattern"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background"></div>
          
          {/* Floating particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {mounted && [...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-primary rounded-full opacity-60"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 5}s`,
                }}
              />
            ))}
          </div>

          {/* Decorative elements */}
          <div className="absolute top-20 left-10 w-32 h-32 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-transparent float" style={{ animationDelay: '0s' }}></div>
          <div className="absolute top-40 right-20 w-40 h-40 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-transparent float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-40 left-1/4 w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500/20 to-transparent float" style={{ animationDelay: '4s' }}></div>

          <div className="relative z-10 max-w-5xl mx-auto px-4 text-center space-y-8 pt-20">
            {/* Badge */}
            <div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-medium"
              style={{ animation: 'slideDown 0.8s ease-out' }}
            >
              <Gamepad2 className="w-4 h-4" />
              <span>Nuit de l&apos;Info 2025</span>
              <span className="xp-badge">+500 XP</span>
            </div>

            {/* Title */}
            <h1 
              className="text-5xl sm:text-6xl lg:text-8xl font-black leading-tight"
              style={{ animation: 'slideUp 0.8s ease-out 0.2s both' }}
            >
              <span className="gradient-text">القرية الرقمية</span>
              <br />
              <span className="text-foreground">Digital Village</span>
            </h1>

            {/* Subtitle */}
            <p 
              className="text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto font-medium"
              style={{ animation: 'slideUp 0.8s ease-out 0.4s both' }}
            >
              Comprendre et appliquer la démarche <span className="text-primary font-bold">NIRD</span> facilement
            </p>

            {/* CTA Buttons */}
            <div 
              className="flex gap-4 justify-center flex-wrap pt-4"
              style={{ animation: 'slideUp 0.8s ease-out 0.6s both' }}
            >
              <Link
                href="/about"
                className="game-btn inline-flex items-center gap-2 rounded-xl text-primary-foreground"
              >
                Commencer <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/quiz"
                className="group inline-flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-foreground border-2 border-primary/50 hover:border-primary hover:bg-primary/10 transition-all"
              >
                <Trophy className="w-5 h-5 text-yellow-500" />
                Quiz NIRD
                <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded-full">5 Stages</span>
              </Link>
            </div>

            {/* Stats */}
            <div 
              className="flex justify-center gap-8 pt-12"
              style={{ animation: 'slideUp 0.8s ease-out 0.8s both' }}
            >
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-3xl mb-1">{stat.icon}</div>
                  <div className="text-3xl font-black text-primary">{stat.value}</div>
                  <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 rounded-full border-2 border-primary/50 flex items-start justify-center p-2">
              <div className="w-1.5 h-3 bg-primary rounded-full animate-pulse"></div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 relative">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-black text-foreground mb-4">
                Découvrez les <span className="gradient-text">3 piliers</span> de NIRD
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Une approche complète pour une transformation numérique réussie
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {cards.map((card, idx) => {
                const Icon = card.icon
                return (
                  <div
                    key={idx}
                    className="game-card p-8 rounded-2xl group cursor-pointer"
                    style={{ animation: `slideUp 0.6s ease-out ${card.delay + 200}ms both` }}
                  >
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {card.description}
                    </p>
                    <div className="mt-6 flex items-center gap-2 text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      En savoir plus <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Pillars Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-accent/5"></div>
          
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {[
                { icon: Shield, title: "Inclusion", desc: "Accès égal aux technologies pour tous", color: "cyan", emoji: "👥" },
                { icon: Zap, title: "Responsabilité", desc: "Protection des données et gouvernance transparente", color: "emerald", emoji: "🛡️" },
                { icon: Leaf, title: "Durabilité", desc: "Sobriété numérique et respect de l'environnement", color: "purple", emoji: "🌱" },
              ].map((pillar, idx) => (
                <div
                  key={idx}
                  className="relative group"
                  style={{ animation: `slideUp 0.6s ease-out ${idx * 150}ms both` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative game-card p-8 rounded-3xl text-center">
                    <div className="text-6xl mb-6">{pillar.emoji}</div>
                    <h3 className="text-2xl font-bold text-foreground mb-3">{pillar.title}</h3>
                    <p className="text-muted-foreground">{pillar.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/10 to-purple-500/20"></div>
          <div className="absolute inset-0 grid-pattern opacity-50"></div>
          
          <div className="max-w-4xl mx-auto px-4 text-center relative">
            <div className="inline-block mb-6">
              <span className="level-badge">Niveau 1 • Débutant</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-foreground mb-6">
              Prêt à commencer votre <span className="gradient-text">transformation</span> ?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Explorez la démarche NIRD en 5 étapes simples et gagnez des badges en progressant !
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/steps"
                className="game-btn inline-flex items-center gap-2 rounded-xl text-primary-foreground"
              >
                Voir la démarche <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/ai-quiz"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition-opacity"
              >
                <Zap className="w-5 h-5" />
                Quiz IA
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
