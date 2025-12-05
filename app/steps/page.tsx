"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export default function StepsPage() {
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  const steps = [
    {
      number: 1,
      title: "Installer Linux",
      description:
        "Commencez par remplacer les systèmes d'exploitation propriétaires par Linux, un système libre et gratuit.",
      details: ["Compatible avec les anciens ordinateurs", "Gratuit et sans licence", "Sécurisé et stable"],
      emoji: "🐧",
      benefits: "Fonctionne sur du matériel ancien et consomme peu d'énergie.",
    },
    {
      number: 2,
      title: "Réutiliser le matériel",
      description: "Donnez une seconde vie aux équipements existants au lieu d'en acheter de nouveaux.",
      details: ["Réduisez les déchets électroniques", "Économisez les ressources", "Diminuez les coûts"],
      emoji: "♻️",
      benefits: "Économique et écologique, respecte l'environnement.",
    },
    {
      number: 3,
      title: "Logiciels libres",
      description: "Utilisez des applications open-source pour remplacer les logiciels propriétaires coûteux.",
      details: ["LibreOffice pour les documents", "GIMP pour l'édition d'images", "Firefox pour la navigation web"],
      emoji: "💻",
      benefits: "Transparence totale et liberté d'utilisation sans restrictions.",
    },
    {
      number: 4,
      title: "Sécurité & données",
      description: "Protégez vos données et assurez la confidentialité avec des outils de chiffrement.",
      details: ["Chiffrez vos communications", "Gérez les mots de passe sécurément", "Contrôlez l'accès aux données"],
      emoji: "🔒",
      benefits: "Vos données vous appartiennent, contrôle local et sécurisé.",
    },
    {
      number: 5,
      title: "Sobriété numérique",
      description: "Adoptez une consommation numérique responsable et respectueuse de l'environnement.",
      details: [
        "Réduisez la consommation d'énergie",
        "Limitez les données volumineuses",
        "Maintenez régulièrement les systèmes",
      ],
      emoji: "🌱",
      benefits: "Réduit l'empreinte carbone et les coûts énergétiques.",
    },
  ]

  const toggleStep = (stepNumber: number) => {
    setCompletedSteps((prev) =>
      prev.includes(stepNumber) ? prev.filter((n) => n !== stepNumber) : [...prev, stepNumber],
    )
  }

  const progressPercentage = (completedSteps.length / steps.length) * 100

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <section className="py-16 sm:py-24 bg-gradient-to-br from-secondary to-background border-b-4 border-primary">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-6 text-balance">
              La démarche NIRD en 5 étapes
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mb-8 font-medium">
              Une progression claire et progressive pour transformer votre infrastructure numérique. Suivez votre
              avancée en marquant les étapes.
            </p>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm font-bold">
                <span className="text-primary">Votre progression</span>
                <span className="text-accent">
                  {completedSteps.length}/{steps.length} étapes
                </span>
              </div>
              <div className="w-full h-5 bg-secondary rounded-sm border-2 border-primary overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${progressPercentage}%`, boxShadow: "inset -1px -1px 0px rgba(0,0,0,0.2)" }}
                ></div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-6">
              {steps.map((step, idx) => {
                const isCompleted = completedSteps.includes(step.number)
                return (
                  <div
                    key={idx}
                    className={`p-8 bg-card rounded-lg border-2 cursor-pointer transition-all ${isCompleted ? "border-accent bg-accent/10" : "border-primary"}`}
                    onClick={() => toggleStep(step.number)}
                    style={{
                      animation: `slideUp 0.6s ease-out ${idx * 100}ms both`,
                      boxShadow: "4px 4px 0px rgba(0,0,0,0.15)",
                    }}
                  >
                    <div className="flex gap-6 items-start">
                      <div
                        className={`w-24 h-24 flex-shrink-0 rounded flex items-center justify-center text-4xl font-bold border-2 ${isCompleted ? "border-accent bg-accent/20" : "border-primary bg-secondary"}`}
                        style={{ boxShadow: "2px 2px 0px rgba(0,0,0,0.1)" }}
                      >
                        {step.emoji}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-primary mb-2">{step.title}</h3>
                        <p className="text-muted-foreground mb-4 leading-relaxed font-medium">{step.description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t-2 border-primary">
                          <div>
                            <h4 className="font-bold text-primary mb-3 text-sm">POINTS CLÉS</h4>
                            <ul className="space-y-2">
                              {step.details.map((detail, i) => (
                                <li
                                  key={i}
                                  className="flex items-center gap-2 text-sm text-muted-foreground font-medium"
                                >
                                  <div
                                    className={`w-2 h-2 rounded-full ${isCompleted ? "bg-accent" : "bg-primary"}`}
                                  ></div>
                                  {detail}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-bold text-primary mb-3 text-sm">AVANTAGE</h4>
                            <div className="p-4 bg-secondary rounded border-2 border-primary">
                              <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                                {step.benefits}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <section className="py-20 bg-primary text-primary-foreground border-t-8 border-primary">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
            <h2 className="text-3xl font-bold">
              Vous avez marqué {completedSteps.length} étape{completedSteps.length !== 1 ? "s" : ""}
            </h2>
            <p className="text-lg text-primary-foreground/90 mb-6 font-medium">
              {completedSteps.length === 0
                ? "Commencez par cliquer sur chaque étape pour les marquer comme complétées."
                : completedSteps.length === steps.length
                  ? "Félicitations ! Vous avez complété toute la démarche NIRD ! 🎉"
                  : "Continuez pour compléter la démarche NIRD."}
            </p>
            <a
              href="/resources"
              className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground font-bold text-sm border-2 border-secondary rounded"
              style={{ boxShadow: "3px 3px 0px rgba(0,0,0,0.2)" }}
            >
              Voir les ressources et tutoriels
            </a>
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
