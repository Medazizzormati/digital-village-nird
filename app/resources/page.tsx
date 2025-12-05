"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ExternalLink, FileText, Video, Wrench, HelpCircle, Users, Monitor, Shield, Leaf, BookOpen } from "lucide-react"
import { MediaCard } from "@/components/media-card"
import Image from "next/image"

export default function ResourcesPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const resources = [
    {
      category: "Documentation",
      icon: FileText,
      color: "from-cyan-500 to-blue-500",
      items: [
        {
          title: "Guide complet NIRD v1.0",
          description: "Documentation complète de la démarche NIRD avec exemples et cas d'usage.",
          url: "#",
          tag: "PDF",
        },
        {
          title: "Installation de Linux – Débutants",
          description: "Tutoriel pas à pas pour installer Linux sur vos ordinateurs.",
          url: "#",
          tag: "Guide",
        },
        {
          title: "Logiciels libres recommandés",
          description: "Liste complète des applications open-source essentielles.",
          url: "#",
          tag: "Liste",
        },
        {
          title: "Checkliste d'implémentation",
          description: "Guide de vérification pour mettre en place NIRD dans votre structure.",
          url: "#",
          tag: "Checklist",
        },
      ],
    },
    {
      category: "Vidéos & Tutoriels",
      icon: Video,
      color: "from-purple-500 to-pink-500",
      items: [
        {
          title: "Webinaire: Introduction à NIRD",
          description: "Découvrez les principes fondamentaux en 30 minutes.",
          url: "#",
          tag: "30 min",
        },
        {
          title: "Comment installer Ubuntu pas à pas",
          description: "Tutorial vidéo complet pour débutants.",
          url: "#",
          tag: "45 min",
        },
        {
          title: "LibreOffice pour les débutants",
          description: "Maîtrisez la suite bureautique libre en 45 minutes.",
          url: "#",
          tag: "45 min",
        },
      ],
    },
    {
      category: "Outils & Ressources",
      icon: Wrench,
      color: "from-emerald-500 to-teal-500",
      items: [
        {
          title: "Image ISO Ubuntu LTS",
          description: "Téléchargez la version stable et à long terme support.",
          url: "#",
          tag: "Télécharger",
        },
        {
          title: "Liste des logiciels essentiels",
          description: "Scripts d'installation automatique pour configurer votre système.",
          url: "#",
          tag: "Scripts",
        },
        {
          title: "Template de présentation",
          description: "Diapositives prêtes à l'emploi pour former votre communauté.",
          url: "#",
          tag: "Slides",
        },
      ],
    },
  ]

  const quickLinks = [
    { label: "Linux", icon: Monitor, color: "from-orange-500 to-red-500" },
    { label: "Logiciels Libres", icon: BookOpen, color: "from-blue-500 to-cyan-500" },
    { label: "Sécurité", icon: Shield, color: "from-purple-500 to-pink-500" },
    { label: "Durabilité", icon: Leaf, color: "from-emerald-500 to-green-500" },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
      <Navigation />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="pt-32 pb-16 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: `linear-gradient(rgba(0, 230, 118, 0.1) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(0, 230, 118, 0.1) 1px, transparent 1px)`,
              backgroundSize: '60px 60px'
            }}></div>
          </div>
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-[150px]"></div>
          <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-cyan-500/15 rounded-full blur-[100px]"></div>
          
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-6">
              Ressources & <span className="bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent">Outils</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl leading-relaxed">
              Documentations, vidéos, tutoriels et outils pratiques pour mettre en œuvre la démarche NIRD.
            </p>
          </div>
        </section>

        {/* Resources Section */}
        <section className="py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-16">
              {resources.map((resourceGroup, idx) => {
                const Icon = resourceGroup.icon
                return (
                  <div key={idx} className="animate-fadeIn" style={{ animationDelay: `${idx * 100}ms` }}>
                    {/* Category Header */}
                    <div className="flex items-center gap-4 mb-8">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${resourceGroup.color} flex items-center justify-center shadow-lg`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">{resourceGroup.category}</h2>
                        <p className="text-sm text-gray-500">
                          {resourceGroup.items.length} ressources disponibles
                        </p>
                      </div>
                    </div>
                    
                    {/* Resource Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {resourceGroup.items.map((item, itemIdx) => (
                        <a
                          key={itemIdx}
                          href={item.url}
                          className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-white/10 transition-all duration-300"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <span className="inline-block px-3 py-1 bg-primary/20 text-primary text-xs font-bold rounded-lg mb-3">
                                {item.tag}
                              </span>
                              <h3 className="font-bold text-white group-hover:text-primary transition-colors mb-2">
                                {item.title}
                              </h3>
                              <p className="text-sm text-gray-400 leading-relaxed">
                                {item.description}
                              </p>
                            </div>
                            <ExternalLink className="w-5 h-5 text-gray-600 group-hover:text-primary flex-shrink-0 transition-colors" />
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Media Section */}
        <section className="py-16 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent"></div>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black text-white mb-4">
                Médias & <span className="bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent">Couverture</span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Découvrez comment les médias parlent de la démarche NIRD et de ses initiatives.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <MediaCard
                title="Windows 11 : l'alternative des logiciels libres"
                description="Reportage de France 3 Alpes sur les solutions libres face à l'obsolescence programmée."
                url="https://video.echirolles.fr/w/hVykGUtRZqRen6eiutqRvQ"
                type="video"
                duration="2 min"
                source="France 3 Alpes"
              />
              <MediaCard
                title="Face à l'obsolescence : le logiciel libre"
                description="Grand reportage de France Inter sur les alternatives aux mises à jour Windows."
                url="https://www.radiofrance.fr/franceinter/podcasts/le-grand-reportage-de-france-inter/le-grand-reportage-du-mardi-14-octobre-2025-4136495"
                type="article"
                duration="4 min"
                source="France Inter"
              />
              <MediaCard
                title="L'État obligé de jeter des milliers d'ordinateurs ?"
                description="Reportage France Info sur l'impact de l'obsolescence logicielle."
                url="https://www.youtube.com/watch?v=76T8oubek-c"
                type="video"
                duration="3 min"
                source="France Info"
              />
              <MediaCard
                title="L'Ordinateur Obsolète"
                description="Vidéo de sensibilisation par Back Market sur l'obsolescence programmée."
                url="https://www.youtube.com/watch?v=S6GLqkhykmA"
                type="video"
                duration="1 min"
                source="Back Market"
              />
              <MediaCard
                title="Linux, c'est facile !"
                description="Intervention des élèves du lycée Carnot démontrant la simplicité de Linux."
                url="https://tube-numerique-educatif.apps.education.fr/w/3LXem3XK4asbwZa5R1qGkW"
                type="video"
                duration="5 min"
                source="Lycée Carnot"
              />
              <MediaCard
                title="Le projet NIRD présenté par les élèves"
                description="Présentation complète du projet NIRD par les élèves du lycée Carnot."
                url="https://tube-numerique-educatif.apps.education.fr/w/pZCnzPKTYX2iF38Qh4ZGmq"
                type="video"
                duration="4 min"
                source="Lycée Carnot"
              />
            </div>
          </div>
        </section>

        {/* Nuit de l'Info Section */}
        <section className="py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black text-white mb-4">
                Nuit de l&apos;Info <span className="bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent">2025</span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Le collectif NIRD participe à la Nuit de l&apos;Info 2025 avec un défi : créer une plateforme pour aider
                les établissements scolaires à réduire leurs dépendances numériques.
              </p>
            </div>
            <div className="space-y-6">
              <div className="rounded-2xl overflow-hidden border border-white/10">
                <Image
                  src="/nuit-info-2025-header.png"
                  alt="Nuit de l'Info 2025 - Header"
                  width={1200}
                  height={400}
                  className="w-full h-auto"
                />
              </div>
              <div className="rounded-2xl overflow-hidden border border-white/10">
                <Image
                  src="/nuit-info-2025-content.png"
                  alt="Nuit de l'Info 2025 - Contenu du défi"
                  width={1200}
                  height={800}
                  className="w-full h-auto"
                />
              </div>
              <div className="text-center pt-4">
                <a
                  href="https://www.nuitdelinfo.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-cyan-400 text-black font-bold rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all"
                >
                  En savoir plus sur la Nuit de l&apos;Info
                  <ExternalLink className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Help Section */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/30 transition-all">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-6">
                  <HelpCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Besoin d&apos;aide ?</h3>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  Notre équipe et notre communauté sont là pour répondre à vos questions et vous accompagner.
                </p>
                <a
                  href="mailto:contact@nird.org"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-black font-bold text-sm rounded-lg hover:shadow-lg hover:shadow-primary/30 transition-all"
                >
                  Nous contacter
                </a>
              </div>
              <div className="p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-cyan-500/10 border border-primary/20 hover:border-primary/40 transition-all">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-6">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Rejoignez la communauté</h3>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  Partagez vos expériences et collaborez avec d&apos;autres membres du projet NIRD.
                </p>
                <button className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-white font-bold text-sm rounded-lg border border-white/20 hover:bg-white/20 transition-all">
                  Forum communautaire
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="py-16 pb-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">Accès rapides</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickLinks.map((link, idx) => {
                const Icon = link.icon
                return (
                  <button
                    key={idx}
                    className="group aspect-square rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-white/10 transition-all flex flex-col items-center justify-center gap-3"
                  >
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${link.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <p className="font-bold text-white text-sm">{link.label}</p>
                  </button>
                )
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
