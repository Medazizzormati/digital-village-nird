import Link from "next/link"
import { Github, Twitter, ExternalLink, Heart } from "lucide-react"

export function Footer() {
  return (
    <footer className="relative border-t border-border/50 bg-card/50 backdrop-blur-xl">
      {/* Gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent"></div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-black text-sm shadow-lg shadow-primary/30">
                DV
              </div>
              <div>
                <span className="text-primary font-bold">Digital</span>
                <span className="text-foreground font-bold"> Village</span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              La démarche NIRD pour une transformation numérique durable, inclusive et responsable.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              Navigation
            </h3>
            <ul className="space-y-2">
              {[
                { href: "/about", label: "Qu'est-ce que NIRD ?" },
                { href: "/steps", label: "La démarche" },
                { href: "/quiz", label: "Quiz interactif" },
                { href: "/resources", label: "Ressources" },
              ].map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent"></span>
              Ressources
            </h3>
            <ul className="space-y-2">
              {[
                { href: "https://nird.forge.apps.education.fr/", label: "Site officiel NIRD", external: true },
                { href: "https://www.nuitdelinfo.com/", label: "Nuit de l'Info", external: true },
                { href: "#", label: "Documentation" },
                { href: "#", label: "Communauté" },
              ].map((link, idx) => (
                <li key={idx}>
                  <a 
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
                  >
                    {link.label}
                    {link.external && <ExternalLink className="w-3 h-3" />}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              Contact
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Rejoignez la communauté NIRD et participez à la transformation numérique.
            </p>
            <div className="flex gap-3">
              <a 
                href="#" 
                className="w-10 h-10 rounded-xl bg-secondary/50 hover:bg-primary/20 border border-border/50 hover:border-primary/50 flex items-center justify-center text-muted-foreground hover:text-primary transition-all"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-xl bg-secondary/50 hover:bg-primary/20 border border-border/50 hover:border-primary/50 flex items-center justify-center text-muted-foreground hover:text-primary transition-all"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            © 2025 Digital Village – NIRD. Fait avec 
            <Heart className="w-4 h-4 text-red-500 fill-red-500" /> 
            pour la Nuit de l'Info
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="px-3 py-1 rounded-full bg-accent/10 text-accent font-medium">
              Open Source
            </span>
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
              Licence Libre
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
