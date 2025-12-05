"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff, ArrowRight, CheckCircle2, AlertCircle, Lock, Mail, User, Cpu, BookOpen, Settings, Crown, Wrench } from "lucide-react"
import { authAPI } from "@/lib/api"

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [useAPI, setUseAPI] = useState(true)

  const roles = [
    { value: "student", label: "Élève", icon: BookOpen, color: "from-blue-500 to-cyan-500", desc: "Apprenez et progressez" },
    { value: "teacher", label: "Enseignant", icon: Crown, color: "from-purple-500 to-pink-500", desc: "Guidez vos élèves" },
    { value: "admin", label: "Admin", icon: Settings, color: "from-orange-500 to-red-500", desc: "Gérez la plateforme" },
    { value: "technician", label: "Technicien", icon: Wrench, color: "from-green-500 to-emerald-500", desc: "Support technique" },
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas")
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères")
      setLoading(false)
      return
    }

    try {
      if (useAPI) {
        const response = await authAPI.register(
          formData.name,
          formData.email,
          formData.password,
          formData.role
        )
        
        if (response.success) {
          setSuccess(true)
          setTimeout(() => {
            window.location.href = "/dashboard"
          }, 2000)
        } else {
          if (response.errors) {
            setError(response.errors.map((e: { msg: string }) => e.msg).join(", "))
          } else {
            setError(response.message || "Erreur lors de l'inscription")
          }
        }
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        localStorage.setItem("user", JSON.stringify({
          name: formData.name,
          email: formData.email,
          role: formData.role,
          xp: 100,
          level: 1,
          completedSteps: [],
          badges: [{ badgeId: "newcomer" }],
          streak: { current: 1, best: 1 }
        }))
        setSuccess(true)
        setTimeout(() => {
          window.location.href = "/dashboard"
        }, 2000)
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de l'inscription"
      setError(errorMessage)
      if (errorMessage.includes("fetch")) {
        setError("Serveur non disponible. Utilisez le mode démo.")
        setUseAPI(false)
      }
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(0, 230, 118, 0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(0, 230, 118, 0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-500/20 rounded-full blur-[100px]"></div>
        
        <div className="relative z-10 text-center p-8">
          <div className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-primary to-cyan-400 flex items-center justify-center shadow-2xl shadow-primary/40 animate-bounce">
            <CheckCircle2 className="w-12 h-12 text-black" />
          </div>
          
          <div className="inline-block px-4 py-2 rounded-full bg-primary/20 border border-primary/30 text-primary font-bold text-sm mb-6">
            +100 XP Bonus inscription
          </div>
          
          <h1 className="text-4xl font-black text-white mb-4">Inscription réussie !</h1>
          <p className="text-xl text-gray-400 mb-2">Bienvenue dans la communauté NIRD</p>
          <p className="text-3xl font-bold bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent mb-8">
            {formData.name}
          </p>
          
          <div className="flex items-center justify-center gap-3 text-gray-400">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span>Redirection vers votre tableau de bord...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-2/5 relative bg-gradient-to-br from-[#0a0a0a] via-[#0f1a12] to-[#0a0a0a] overflow-hidden">
        {/* Animated Grid */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(0, 230, 118, 0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(0, 230, 118, 0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        
        {/* Glowing Orbs */}
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-primary/25 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-purple-500/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
        
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
              <h1 className="text-4xl font-black text-white leading-tight mb-4">
                Rejoignez la<br />
                <span className="bg-gradient-to-r from-primary via-cyan-400 to-primary bg-clip-text text-transparent">
                  révolution numérique
                </span>
              </h1>
              <p className="text-lg text-gray-400 max-w-sm leading-relaxed">
                Créez votre compte et commencez votre voyage vers un numérique plus responsable.
              </p>
            </div>
            
            {/* Stats */}
            <div className="space-y-4">
              {[
                { value: "2,500+", label: "Utilisateurs actifs" },
                { value: "150+", label: "Quiz complétés" },
                { value: "98%", label: "Taux de satisfaction" }
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-2xl font-black bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Footer */}
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <span>© 2025 NIRD</span>
            <span className="w-1 h-1 rounded-full bg-gray-600"></span>
            <Link href="/" className="hover:text-primary transition-colors">Accueil</Link>
          </div>
        </div>
      </div>

      {/* Right Panel - Signup Form */}
      <div className="w-full lg:w-3/5 flex items-center justify-center p-6 lg:p-12 bg-[#0a0a0a] overflow-y-auto">
        <div className="w-full max-w-lg">
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
          <div className="mb-8">
            <h2 className="text-3xl font-black text-white mb-2">Créer un compte</h2>
            <p className="text-gray-400">Rejoignez la communauté NIRD dès maintenant</p>
          </div>

          {/* Mode Toggle */}
          <div className="mb-6">
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
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                Nom complet
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Votre nom"
                className="w-full px-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 font-medium focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                Adresse email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="votre@email.com"
                className="w-full px-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 font-medium focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                required
              />
            </div>

            {/* Role Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-300">Vous êtes...</label>
              <div className="grid grid-cols-2 gap-3">
                {roles.map((role) => (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, role: role.value })}
                    className={`relative p-4 rounded-xl text-left transition-all duration-300 overflow-hidden group ${
                      formData.role === role.value
                        ? "bg-white/10 border-2 border-primary shadow-lg shadow-primary/20"
                        : "bg-white/5 border border-white/10 hover:border-white/30"
                    }`}
                  >
                    {/* Gradient Background on Selection */}
                    {formData.role === role.value && (
                      <div className={`absolute inset-0 bg-gradient-to-br ${role.color} opacity-10`}></div>
                    )}
                    
                    <div className="relative z-10">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${role.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                        <role.icon className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-white font-bold text-sm">{role.label}</p>
                      <p className="text-gray-500 text-xs mt-1">{role.desc}</p>
                    </div>
                    
                    {/* Check Mark */}
                    {formData.role === role.value && (
                      <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <CheckCircle2 className="w-3 h-3 text-black" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <Lock className="w-4 h-4 text-primary" />
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
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
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <Lock className="w-4 h-4 text-primary" />
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 font-medium focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                required
              />
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
                    Inscription en cours...
                  </>
                ) : (
                  <>
                    Créer mon compte
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            <span className="text-gray-500 text-sm">ou</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          </div>

          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-gray-400">
              Déjà un compte ?{" "}
              <Link href="/login" className="text-primary font-semibold hover:text-cyan-400 transition-colors">
                Se connecter
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
