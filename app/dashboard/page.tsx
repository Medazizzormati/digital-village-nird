"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { 
  LogOut, User, Trophy, Target, BookOpen, Zap, Star, 
  TrendingUp, Award, Shield, Leaf, ChevronRight, Flame,
  Clock, CheckCircle2, Lock
} from "lucide-react"
import Link from "next/link"

interface UserData {
  name: string
  email: string
  role?: string
}

export default function Dashboard() {
  const [userProgress, setUserProgress] = useState<number[]>([])
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<UserData | null>(null)
  const [totalXP, setTotalXP] = useState(0)

  useEffect(() => {
    setMounted(true)
    const savedProgress = localStorage.getItem("nirdProgress")
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress))
    }

    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("nirdProgress", JSON.stringify(userProgress))
      // Calculate XP based on progress
      setTotalXP(userProgress.length * 200)
    }
  }, [userProgress, mounted])

  const handleLogout = () => {
    localStorage.removeItem("user")
    window.location.href = "/"
  }

  const steps = [
    { id: 1, title: "Installer Linux", emoji: "🐧", xp: 200, description: "Système d'exploitation libre" },
    { id: 2, title: "Réutiliser le matériel", emoji: "♻️", xp: 200, description: "Économie circulaire" },
    { id: 3, title: "Logiciels libres", emoji: "💻", xp: 200, description: "Alternatives open-source" },
    { id: 4, title: "Sécurité & données", emoji: "🔒", xp: 200, description: "Protection et RGPD" },
    { id: 5, title: "Sobriété numérique", emoji: "🌱", xp: 200, description: "Impact environnemental" },
  ]

  const badges = [
    {
      id: 1,
      title: "Pionnier",
      description: "Première étape complétée",
      emoji: "🚀",
      unlocked: userProgress.length >= 1,
      rarity: "common",
    },
    {
      id: 2,
      title: "Explorateur",
      description: "3 étapes complétées",
      emoji: "🗺️",
      unlocked: userProgress.length >= 3,
      rarity: "rare",
    },
    {
      id: 3,
      title: "Maître NIRD",
      description: "Toute la démarche complétée",
      emoji: "👑",
      unlocked: userProgress.length === 5,
      rarity: "legendary",
    },
    {
      id: 4,
      title: "Quiz Master",
      description: "Terminer le quiz complet",
      emoji: "🧠",
      unlocked: false,
      rarity: "epic",
    },
    {
      id: 5,
      title: "Éco-Warrior",
      description: "Champion de la durabilité",
      emoji: "🌍",
      unlocked: userProgress.includes(5),
      rarity: "rare",
    },
    {
      id: 6,
      title: "Sécurisé",
      description: "Expert en protection des données",
      emoji: "🛡️",
      unlocked: userProgress.includes(4),
      rarity: "epic",
    },
  ]

  const rarityColors = {
    common: "from-gray-400 to-gray-600",
    rare: "from-blue-400 to-blue-600",
    epic: "from-purple-400 to-purple-600",
    legendary: "from-yellow-400 to-orange-500",
  }

  const rarityBorders = {
    common: "border-gray-500/50",
    rare: "border-blue-500/50",
    epic: "border-purple-500/50",
    legendary: "border-yellow-500/50",
  }

  const roleLabels: Record<string, { label: string; emoji: string; color: string }> = {
    student: { label: "Élève", emoji: "🎓", color: "from-cyan-500 to-blue-500" },
    teacher: { label: "Enseignant", emoji: "👨‍🏫", color: "from-emerald-500 to-teal-500" },
    admin: { label: "Administration", emoji: "🏫", color: "from-purple-500 to-pink-500" },
    technician: { label: "Technicien", emoji: "🔧", color: "from-orange-500 to-red-500" },
    parent: { label: "Parent", emoji: "👨‍👩‍👧", color: "from-rose-500 to-pink-500" },
  }

  const progressPercentage = (userProgress.length / steps.length) * 100
  const currentLevel = Math.floor(totalXP / 500) + 1
  const xpForNextLevel = 500
  const currentLevelXP = totalXP % 500

  const toggleStep = (stepId: number) => {
    setUserProgress((prev) => (prev.includes(stepId) ? prev.filter((id) => id !== stepId) : [...prev, stepId]))
  }

  if (!mounted)
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground font-medium">Chargement...</p>
          </div>
        </div>
        <Footer />
      </div>
    )

  // Si pas connecté
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center py-24 relative overflow-hidden">
          <div className="absolute inset-0 grid-pattern opacity-50"></div>
          <div className="w-full max-w-md px-4 relative z-10">
            <div className="game-card p-10 rounded-3xl text-center">
              <div className="text-7xl mb-6">🔐</div>
              <h1 className="text-3xl font-black text-foreground mb-4">Accès Restreint</h1>
              <p className="text-muted-foreground font-medium mb-8">
                Connectez-vous pour accéder à votre tableau de bord et suivre votre progression.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link href="/login" className="game-btn rounded-xl text-primary-foreground">
                  Se connecter
                </Link>
                <Link
                  href="/signup"
                  className="px-6 py-3 rounded-xl font-bold border-2 border-accent/50 text-accent hover:bg-accent/10 transition-all"
                >
                  S'inscrire
                </Link>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const userRole = user.role ? roleLabels[user.role] : null

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-20">
        {/* Hero Header */}
        <section className="relative py-12 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-purple-500/20"></div>
          <div className="absolute inset-0 grid-pattern opacity-30"></div>
          
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              {/* User Info */}
              <div className="flex items-center gap-6">
                <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${userRole?.color || 'from-primary to-accent'} flex items-center justify-center text-5xl shadow-2xl shadow-primary/30 pulse-glow`}>
                  {userRole?.emoji || <User className="w-12 h-12 text-white" />}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-black text-foreground">{user.name}</h1>
                    <span className="level-badge">Niv. {currentLevel}</span>
                  </div>
                  <p className="text-muted-foreground font-medium mb-2">
                    {userRole?.label || "Membre"} • {user.email}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="w-4 h-4 fill-yellow-500" />
                      <span className="font-bold">{totalXP} XP</span>
                    </div>
                    <div className="flex items-center gap-1 text-orange-500">
                      <Flame className="w-4 h-4" />
                      <span className="font-bold">{userProgress.length} jours</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4">
                <Link
                  href="/quiz"
                  className="game-btn rounded-xl text-primary-foreground flex items-center gap-2"
                >
                  <Zap className="w-5 h-5" />
                  Jouer au Quiz
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-3 rounded-xl bg-secondary/50 border border-border/50 hover:border-red-500/50 hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-all"
                  title="Déconnexion"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* XP Progress */}
            <div className="mt-8 p-6 game-card rounded-2xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <span className="font-bold text-foreground">Progression vers niveau {currentLevel + 1}</span>
                </div>
                <span className="text-sm text-muted-foreground font-medium">
                  {currentLevelXP}/{xpForNextLevel} XP
                </span>
              </div>
              <div className="game-progress h-4">
                <div
                  className="game-progress-bar"
                  style={{ width: `${(currentLevelXP / xpForNextLevel) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="py-8 relative">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Target, label: "Progression", value: `${Math.round(progressPercentage)}%`, color: "cyan" },
                { icon: Trophy, label: "Badges", value: `${badges.filter(b => b.unlocked).length}/${badges.length}`, color: "yellow" },
                { icon: BookOpen, label: "Étapes", value: `${userProgress.length}/${steps.length}`, color: "emerald" },
                { icon: Star, label: "XP Total", value: totalXP.toString(), color: "purple" },
              ].map((stat, idx) => {
                const Icon = stat.icon
                return (
                  <div
                    key={idx}
                    className="game-card p-6 rounded-2xl"
                    style={{ animation: `slideUp 0.5s ease-out ${idx * 100}ms both` }}
                  >
                    <div className={`w-12 h-12 rounded-xl bg-${stat.color}-500/20 flex items-center justify-center mb-4`}>
                      <Icon className={`w-6 h-6 text-${stat.color}-400`} />
                    </div>
                    <p className="text-2xl font-black text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Main Content Grid */}
        <section className="py-8 relative">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Steps Progress */}
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-black text-foreground flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-primary" />
                    </div>
                    Parcours NIRD
                  </h2>
                  <Link href="/steps" className="text-primary font-bold hover:text-accent transition-colors flex items-center gap-1">
                    Voir tout <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="space-y-4">
                  {steps.map((step, idx) => {
                    const isCompleted = userProgress.includes(step.id)
                    const isNext = !isCompleted && (idx === 0 || userProgress.includes(steps[idx - 1].id))
                    
                    return (
                      <div
                        key={step.id}
                        onClick={() => toggleStep(step.id)}
                        className={`game-card p-5 rounded-2xl cursor-pointer transition-all ${
                          isCompleted 
                            ? "border-accent/50 bg-accent/5" 
                            : isNext 
                              ? "border-primary/50" 
                              : "opacity-60"
                        }`}
                        style={{ animation: `slideUp 0.5s ease-out ${idx * 100}ms both` }}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${
                            isCompleted 
                              ? "bg-accent/20" 
                              : isNext 
                                ? "bg-primary/20" 
                                : "bg-secondary/50"
                          }`}>
                            {step.emoji}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <h3 className="font-bold text-foreground">{step.title}</h3>
                              {isCompleted && <CheckCircle2 className="w-5 h-5 text-accent" />}
                              {!isCompleted && !isNext && <Lock className="w-4 h-4 text-muted-foreground" />}
                            </div>
                            <p className="text-sm text-muted-foreground">{step.description}</p>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                            isCompleted 
                              ? "bg-accent/20 text-accent" 
                              : "bg-primary/20 text-primary"
                          }`}>
                            +{step.xp} XP
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-8">
                {/* Quick Actions */}
                <div className="game-card p-6 rounded-2xl">
                  <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary" />
                    Actions Rapides
                  </h3>
                  <div className="space-y-3">
                    <Link
                      href="/quiz"
                      className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-primary/20 to-cyan-500/20 border border-primary/30 hover:border-primary/50 transition-all group"
                    >
                      <Trophy className="w-5 h-5 text-yellow-500" />
                      <div className="flex-1">
                        <p className="font-bold text-foreground">Quiz NIRD</p>
                        <p className="text-xs text-muted-foreground">5 stages disponibles</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </Link>
                    <Link
                      href="/ai-quiz"
                      className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 hover:border-purple-500/50 transition-all group"
                    >
                      <Zap className="w-5 h-5 text-purple-400" />
                      <div className="flex-1">
                        <p className="font-bold text-foreground">Quiz IA</p>
                        <p className="text-xs text-muted-foreground">Questions personnalisées</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-purple-400 transition-colors" />
                    </Link>
                    <Link
                      href="/resources"
                      className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 hover:border-emerald-500/50 transition-all group"
                    >
                      <BookOpen className="w-5 h-5 text-emerald-400" />
                      <div className="flex-1">
                        <p className="font-bold text-foreground">Ressources</p>
                        <p className="text-xs text-muted-foreground">Docs et tutoriels</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-emerald-400 transition-colors" />
                    </Link>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="game-card p-6 rounded-2xl">
                  <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-accent" />
                    Activité Récente
                  </h3>
                  <div className="space-y-3">
                    {userProgress.length > 0 ? (
                      userProgress.slice(-3).reverse().map((stepId) => {
                        const step = steps.find(s => s.id === stepId)
                        if (!step) return null
                        return (
                          <div key={stepId} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30">
                            <span className="text-xl">{step.emoji}</span>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-foreground">{step.title}</p>
                              <p className="text-xs text-accent">+{step.xp} XP gagnés</p>
                            </div>
                          </div>
                        )
                      })
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Aucune activité récente
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Badges Section */}
        <section className="py-12 relative">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-foreground flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                  <Award className="w-5 h-5 text-yellow-500" />
                </div>
                Badges & Récompenses
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground font-medium">
                  {badges.filter(b => b.unlocked).length}/{badges.length} débloqués
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {badges.map((badge, idx) => (
                <div
                  key={badge.id}
                  className={`relative p-6 rounded-2xl text-center transition-all ${
                    badge.unlocked 
                      ? `game-card ${rarityBorders[badge.rarity as keyof typeof rarityBorders]}` 
                      : "bg-secondary/20 border border-border/30 opacity-50 grayscale"
                  }`}
                  style={{ animation: `slideUp 0.5s ease-out ${idx * 50}ms both` }}
                >
                  {badge.unlocked && (
                    <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-br ${rarityColors[badge.rarity as keyof typeof rarityColors]} flex items-center justify-center`}>
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className="text-4xl mb-3">{badge.emoji}</div>
                  <h3 className="font-bold text-foreground text-sm mb-1">{badge.title}</h3>
                  <p className="text-xs text-muted-foreground">{badge.description}</p>
                  {badge.unlocked && (
                    <div className={`mt-3 text-xs font-bold px-2 py-1 rounded-full bg-gradient-to-r ${rarityColors[badge.rarity as keyof typeof rarityColors]} text-white capitalize`}>
                      {badge.rarity}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/10 to-purple-500/20"></div>
          <div className="absolute inset-0 grid-pattern opacity-30"></div>
          
          <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <h2 className="text-3xl font-black text-foreground mb-4">
              Continuez votre aventure <span className="gradient-text">NIRD</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Complétez toutes les étapes et devenez un Maître NIRD !
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/steps" className="game-btn rounded-xl text-primary-foreground">
                Continuer le parcours
              </Link>
              <Link
                href="/about"
                className="px-8 py-3 rounded-xl font-bold border-2 border-border/50 text-foreground hover:border-primary/50 transition-all"
              >
                En savoir plus
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      <style jsx>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
