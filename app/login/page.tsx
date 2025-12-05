"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff, ArrowRight, Shield, AlertCircle, Lock, Mail, Cpu, Globe, Users, Fingerprint } from "lucide-react"
import { authAPI } from "@/lib/api"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [useAPI, setUseAPI] = useState(true)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (useAPI) {
        const response = await authAPI.login(email, password)
        if (response.success) {
          window.location.href = "/dashboard"
        } else {
          setError(response.message || "Erreur de connexion")
        }
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        if (email && password) {
          localStorage.setItem("user", JSON.stringify({ 
            name: email.split("@")[0], 
            email,
            role: "student",
            xp: 0,
            level: 1,
            completedSteps: [],
            badges: [],
            streak: { current: 0, best: 0 }
          }))
          window.location.href = "/dashboard"
        } else {
          setError("Veuillez remplir tous les champs")
        }
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Erreur de connexion"
      setError(errorMessage)
      if (errorMessage.includes("fetch")) {
        setError("Serveur non disponible. Utilisez le mode démo.")
        setUseAPI(false)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-[#0a0a0a] via-[#0f1a12] to-[#0a0a0a] overflow-hidden">
        {/* Animated Grid */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(0, 230, 118, 0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(0, 230, 118, 0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        
        {/* Glowing Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-cyan-500/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <div>
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-cyan-400 flex items-center justify-center shadow-lg shadow-primary/30 group-hover:shadow-primary/50 transition-all">
                <Cpu className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">NIRD</span>
            </Link>
          </div>
          
          {/* Main Content */}
          <div className="space-y-8">
            <div>
              <h1 className="text-5xl font-black text-white leading-tight mb-4">
                Bienvenue dans<br />
                <span className="bg-gradient-to-r from-primary via-cyan-400 to-primary bg-clip-text text-transparent">
                  l&apos;écosystème NIRD
                </span>
              </h1>
              <p className="text-lg text-gray-400 max-w-md leading-relaxed">
                Découvrez le numérique responsable à travers une expérience immersive et gamifiée.
              </p>
            </div>
            
            {/* Features */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Shield, text: "Sécurisé", desc: "Authentification JWT" },
                { icon: Globe, text: "Accessible", desc: "Disponible partout" },
                { icon: Users, text: "Communauté", desc: "Apprenez ensemble" },
                { icon: Fingerprint, text: "Personnel", desc: "Parcours adapté" }
              ].map((item, i) => (
                <div key={i} className="group p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-primary/30 transition-all duration-300">
                  <item.icon className="w-6 h-6 text-primary mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-white font-semibold text-sm">{item.text}</p>
                  <p className="text-gray-500 text-xs">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Footer */}
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <span>© 2025 NIRD</span>
            <span className="w-1 h-1 rounded-full bg-gray-600"></span>
            <Link href="/" className="hover:text-primary transition-colors">Accueil</Link>
            <span className="w-1 h-1 rounded-full bg-gray-600"></span>
            <Link href="/quiz" className="hover:text-primary transition-colors">Quiz</Link>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-[#0a0a0a]">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-cyan-400 flex items-center justify-center">
                <Cpu className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black text-white">NIRD</span>
            </Link>
          </div>

          {/* Header */}
          <div className="mb-10">
            <h2 className="text-3xl font-black text-white mb-2">Connexion</h2>
            <p className="text-gray-400">Accédez à votre espace personnel</p>
          </div>

          {/* Mode Toggle */}
          <div className="mb-8">
            <div className="flex p-1 rounded-xl bg-white/5 border border-white/10">
              <button
                type="button"
                onClick={() => setUseAPI(true)}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  useAPI 
                    ? "bg-primary text-black shadow-lg shadow-primary/25" 
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Lock className="w-4 h-4" />
                  Mode API
                </div>
              </button>
              <button
                type="button"
                onClick={() => setUseAPI(false)}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  !useAPI 
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25" 
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Cpu className="w-4 h-4" />
                  Mode Démo
                </div>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              {useAPI ? "Connexion sécurisée via le serveur" : "Simulation locale sans serveur"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                Adresse email
              </label>
              <div className="relative group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className="w-full px-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 font-medium focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                  required
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 to-cyan-500/20 opacity-0 group-focus-within:opacity-100 -z-10 blur-xl transition-opacity"></div>
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <Lock className="w-4 h-4 text-primary" />
                Mot de passe
              </label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-4 pr-12 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 font-medium focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 to-cyan-500/20 opacity-0 group-focus-within:opacity-100 -z-10 blur-xl transition-opacity"></div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <p className="text-red-400 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="relative w-full py-4 rounded-xl font-bold text-base overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-cyan-400 to-primary bg-[length:200%_100%] animate-shimmer"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="relative flex items-center justify-center gap-2 text-black">
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    Connexion en cours...
                  </>
                ) : (
                  <>
                    Se connecter
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            <span className="text-gray-500 text-sm">ou</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-gray-400">
              Pas encore de compte ?{" "}
              <Link href="/signup" className="text-primary font-semibold hover:text-cyan-400 transition-colors">
                Créer un compte
              </Link>
            </p>
          </div>

          {/* Back to Home */}
          <div className="mt-8 text-center lg:hidden">
            <Link href="/" className="text-sm text-gray-500 hover:text-primary transition-colors">
              ← Retour à l&apos;accueil
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .animate-shimmer {
          animation: shimmer 3s linear infinite;
        }
      `}</style>
    </div>
  )
}
