import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Heart, Shield, Leaf, BookOpen } from "lucide-react"

export default function NIRDPage() {
  const pillars = [
    {
      title: "Inclusion",
      description:
        "Assurer l'accès à la technologie pour tous, sans exclusion. Créer une environnement numérique où chacun peut participer et bénéficier.",
      icon: Heart,
      color: "text-red-500",
    },
    {
      title: "Responsabilité",
      description:
        "Maîtriser et contrôler les technologies utilisées. Garantir la transparence et l'autonomie dans les choix technologiques.",
      icon: Shield,
      color: "text-blue-500",
    },
    {
      title: "Durabilité",
      description:
        "Privilégier les solutions sobres et respectueuses de l'environnement. Réutiliser et prolonger la vie des équipements existants.",
      icon: Leaf,
      color: "text-accent",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1">
        {/* Header Section */}
        <section className="bg-card border-b border-border py-12 sm:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-4 text-balance">Qu'est-ce que NIRD ?</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              La démarche NIRD (النهج المقاوم للرقمنة) est une approche globale pour une transformation numérique
              inclusive, responsable et durable.
            </p>
          </div>
        </section>

        {/* Objective Section */}
        <section className="py-16 sm:py-24 bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-16">
              <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-6">Objectif principal</h2>
              <div className="bg-card p-8 rounded-lg border border-border">
                <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                  Permettre aux communautés locales, aux écoles et aux organisations de prendre le contrôle de leur
                  infrastructure numérique en utilisant des outils libres, durables et accessibles.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  NIRD vise à créer une résilience technologique locale tout en réduisant la dépendance aux grandes
                  plateformes propriétaires.
                </p>
              </div>
            </div>

            {/* Three Pillars */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-8">Les 3 piliers</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {pillars.map((pillar, idx) => {
                  const IconComponent = pillar.icon
                  return (
                    <div
                      key={idx}
                      className="bg-card p-6 rounded-lg border border-border hover:border-accent transition-colors"
                    >
                      <div className="mb-4">
                        <IconComponent className={`w-10 h-10 ${pillar.color}`} />
                      </div>
                      <h3 className="text-xl font-bold text-primary mb-3">{pillar.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{pillar.description}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Concrete Example Section */}
        <section className="py-16 sm:py-24 bg-primary text-primary-foreground">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-6 items-start">
              <BookOpen className="w-8 h-8 flex-shrink-0 text-accent" />
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-balance">Exemple concret en école</h2>
                <div className="space-y-4">
                  <p className="text-lg text-primary-foreground/90">
                    Une école cherche à moderniser son infrastructure informatique. Au lieu d'acheter des ordinateurs
                    neufs et d'utiliser des logiciels propriétaires coûteux :
                  </p>
                  <ul className="space-y-3">
                    <li className="flex gap-3">
                      <span className="text-accent font-bold">1.</span>
                      <span>Elle récupère d'anciens ordinateurs et les modernise avec Linux</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-accent font-bold">2.</span>
                      <span>Elle installe des logiciels libres (LibreOffice, GIMP, etc.)</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-accent font-bold">3.</span>
                      <span>Elle forme les enseignants et élèves à l'autonomie technologique</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-accent font-bold">4.</span>
                      <span>Elle réduit son impact environnemental et ses coûts</span>
                    </li>
                  </ul>
                  <p className="text-lg text-primary-foreground/90 pt-4">
                    Résultat : une infrastructure résiliente, autonome et inclusive.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
