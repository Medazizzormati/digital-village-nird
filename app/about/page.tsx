"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ActorCard } from "@/components/actor-card"
import { ExternalLink } from "lucide-react"

export default function AboutNIRD() {
  const pillars = [
    {
      title: "Inclusion",
      description:
        "Mettre le numérique au service de tous, sans exclusion. Accès égal aux technologies et aux connaissances.",
      details: ["Accès universel au numérique", "Équité technologique", "Formation inclusive pour tous"],
      emoji: "👥",
    },
    {
      title: "Responsabilité",
      description: "Prendre soin des données et de la sécurité. Gouvernance transparente et citoyenne du numérique.",
      details: ["Protection des données", "Sécurité informatique", "Gouvernance transparente"],
      emoji: "🛡️",
    },
    {
      title: "Durabilité",
      description: "Un numérique sobre et respectueux de l'environnement. Réduire l'empreinte écologique.",
      details: ["Sobriété numérique", "Réemploi du matériel", "Logiciels libres"],
      emoji: "🌱",
    },
  ]

  const actors = [
    {
      name: "Élèves et éco-délégués",
      role: "Acteurs du changement",
      description: "Sensibilisés à la sobriété numérique et ambassadeurs de NIRD dans leurs établissements.",
      emoji: "🎓",
    },
    {
      name: "Enseignants",
      role: "Facilitateurs",
      description: "Transmettent les valeurs NIRD et accompagnent les élèves dans la transformation numérique.",
      emoji: "👨‍🏫",
    },
    {
      name: "Directions d'établissements",
      role: "Décideurs",
      description: "Pilotent la stratégie numérique et soutiennent les initiatives NIRD.",
      emoji: "🏫",
    },
    {
      name: "Techniciens réseaux",
      role: "Experts techniques",
      description: "Assurent la mise en œuvre technique et la maintenance des solutions libres.",
      emoji: "🔧",
    },
    {
      name: "Associations partenaires",
      role: "Soutiens",
      description: "Apportent expertise et ressources pour accompagner la démarche NIRD.",
      emoji: "🤝",
    },
    {
      name: "Collectivités territoriales",
      role: "Financeurs",
      description: "Soutiennent financièrement et politiquement la transition numérique responsable.",
      emoji: "🏛️",
    },
    {
      name: "Services académiques",
      role: "Coordinateurs",
      description: "Coordonnent les initiatives et diffusent les bonnes pratiques à l'échelle académique.",
      emoji: "📋",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <section className="py-16 sm:py-24 bg-gradient-to-b from-secondary to-background border-b-4 border-primary">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-6 text-balance">Qu'est-ce que NIRD ?</h1>
            <p className="text-xl text-muted-foreground max-w-2xl font-medium">
              NIRD est une démarche holistique qui place l'humain au centre de la transformation numérique. Elle repose
              sur trois piliers fondamentaux : Inclusion, Responsabilité et Durabilité.
            </p>
          </div>
        </section>

        <section className="py-20 bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className="p-12 bg-gradient-to-br from-card to-secondary rounded-lg border-2 border-primary"
              style={{ boxShadow: "4px 4px 0px rgba(0,0,0,0.15)" }}
            >
              <h2 className="text-3xl font-bold text-primary mb-6">Objectif Principal</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-4 font-medium">
                Créer des écosystèmes numériques résilients, inclusifs et durables qui permettent à chaque communauté de
                maîtriser ses outils technologiques.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed font-medium">
                NIRD transforme le numérique d'une ressource imposée en un bien commun partagé et maîtrisé par tous.
              </p>
            </div>
          </div>
        </section>

        <section className="py-24 bg-gradient-to-b from-background via-secondary to-background">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-primary mb-16 text-center text-balance">Les 3 Piliers de NIRD</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pillars.map((pillar, idx) => (
                <div
                  key={idx}
                  className="p-8 bg-card rounded-lg border-2 border-primary"
                  style={{
                    animation: `slideUp 0.6s ease-out ${idx * 150}ms both`,
                    boxShadow: "4px 4px 0px rgba(0,0,0,0.15)",
                  }}
                >
                  <div className="text-5xl mb-6">{pillar.emoji}</div>
                  <h3 className="text-2xl font-bold text-primary mb-4">{pillar.title}</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed font-medium">{pillar.description}</p>
                  <div className="space-y-3 pt-6 border-t-2 border-primary">
                    {pillar.details.map((detail, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded bg-primary border border-primary"></div>
                        <span className="text-sm text-muted-foreground font-medium">{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 bg-background">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-primary mb-6 text-balance">Les Acteurs du Projet NIRD</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto font-medium">
                La démarche NIRD associe un ensemble d'acteurs du système éducatif et des territoires pour expérimenter,
                partager et transformer les pratiques.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {actors.map((actor, idx) => (
                <ActorCard key={idx} {...actor} delay={idx * 100} />
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-br from-accent/10 to-secondary">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="text-5xl mb-6">🌐</div>
            <h2 className="text-3xl font-bold text-primary mb-4">Site Officiel NIRD</h2>
            <p className="text-lg text-muted-foreground mb-8 font-medium">
              Découvrez plus de ressources et rejoignez la communauté NIRD sur le site officiel.
            </p>
            <a
              href="https://nird.forge.apps.education.fr/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-bold text-base border-2 border-primary rounded hover-lift"
              style={{ boxShadow: "4px 4px 0px rgba(0,0,0,0.2)" }}
            >
              Visiter le site officiel <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        </section>

        <section className="py-24 bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-primary mb-8">Exemple Concret en École</h2>
            <div className="space-y-6">
              <div
                className="p-8 bg-card rounded-lg border-2 border-primary border-l-4 border-l-accent"
                style={{ boxShadow: "4px 4px 0px rgba(0,0,0,0.15)" }}
              >
                <h4 className="text-xl font-bold text-primary mb-3">❌ Avant NIRD</h4>
                <ul className="space-y-2 text-muted-foreground font-medium">
                  <li>• Ordinateurs obsolètes abandonnés</li>
                  <li>• Logiciels propriétaires coûteux</li>
                  <li>• Données stockées chez les géants du web</li>
                  <li>• Les étudiants dépendants des outils commerciaux</li>
                </ul>
              </div>
              <div
                className="p-8 bg-gradient-to-br from-accent/10 to-secondary rounded-lg border-2 border-accent border-l-4 border-l-accent"
                style={{ boxShadow: "4px 4px 0px rgba(0,0,0,0.15)" }}
              >
                <h4 className="text-xl font-bold text-primary mb-3">✓ Après NIRD</h4>
                <ul className="space-y-2 text-muted-foreground font-medium">
                  <li>✓ Ordinateurs réemployés avec Linux</li>
                  <li>✓ Logiciels libres gratuits et transparents</li>
                  <li>✓ Données sécurisées et contrôlées localement</li>
                  <li>✓ Les étudiants maîtrisent leurs outils</li>
                </ul>
              </div>
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
