import { NextResponse } from "next/server"

const quizStages = [
  {
    stage: 1,
    name: "Les Fondamentaux",
    description: "Comprendre NIRD et ses principes",
    difficulty: "Facile",
    questions: [
      {
        id: 1,
        question: "Qu'est-ce que NIRD?",
        options: [
          "Un système d'exploitation propriétaire",
          "Une approche pour la Résilience, Inclusion, Responsabilité et Durabilité numérique",
          "Un logiciel de traitement de texte gratuit",
          "Un format de fichier compressé",
        ],
        correctAnswer: 1,
        explanation:
          "NIRD signifie Résilience, Inclusion, Responsabilité, Durabilité. C'est une approche éducative qui met l'accent sur la communauté numérique locale, résiliente et écologique.",
      },
      {
        id: 2,
        question: "Quels sont les 3 piliers de NIRD?",
        options: [
          "Vitesse, Puissance, Compatibilité",
          "Inclusion, Responsabilité et Durabilité",
          "Sécurité, Confidentialité et Liberté",
          "Innovation, Technologie et Profit",
        ],
        correctAnswer: 1,
        explanation:
          "Les 3 piliers de NIRD sont: 1) Inclusion; 2) Responsabilité; 3) Durabilité numérique et écologique.",
      },
      {
        id: 3,
        question: "Quel est l'objectif principal de NIRD?",
        options: [
          "Vendre du matériel informatique",
          "Créer une communauté numérique résiliente, inclusive et durable",
          "Remplacer tous les ordinateurs",
          "Interdire Internet dans les écoles",
        ],
        correctAnswer: 1,
        explanation: "NIRD vise à créer une communauté numérique résiliente, inclusive, responsable et durable.",
      },
      {
        id: 4,
        question: "Qui peut bénéficier de NIRD?",
        options: [
          "Seulement les écoles privées riches",
          "Seulement les experts en informatique",
          "Tous: écoles, communautés, familles avec ressources limitées",
          "Seulement les villes modernes",
        ],
        correctAnswer: 2,
        explanation: "NIRD est conçu pour tous: écoles, communautés, organisations avec des ressources limitées.",
      },
      {
        id: 5,
        question: "Qu'est-ce que la Résilience numérique?",
        options: [
          "La vitesse d'Internet",
          "La capacité à continuer à fonctionner face aux défis technologiques",
          "Un type de virus informatique",
          "Un logiciel antivirus",
        ],
        correctAnswer: 1,
        explanation:
          "La Résilience numérique est la capacité à continuer à fonctionner même avec du matériel ancien ou une connexion faible.",
      },
      {
        id: 6,
        question: "Qu'est-ce que l'Inclusion numérique?",
        options: [
          "Donner un ordinateur à chacun",
          "Assurer que tout le monde ait accès égal à la technologie",
          "Utiliser uniquement des logiciels gratuits",
          "Interdire les ordinateurs propriétaires",
        ],
        correctAnswer: 1,
        explanation:
          "L'Inclusion numérique signifie que tout le monde a accès égal à la technologie, indépendamment de ses ressources.",
      },
      {
        id: 7,
        question: "Qu'est-ce que la Responsabilité numérique?",
        options: [
          "Acheter du matériel neuf chaque année",
          "Comprendre comment la technologie fonctionne et être conscient de son impact éthique",
          "Utiliser seulement le cloud",
          "Ignorer la sécurité des données",
        ],
        correctAnswer: 1,
        explanation:
          "La Responsabilité numérique signifie comprendre comment la technologie fonctionne et son impact éthique et environnemental.",
      },
      {
        id: 8,
        question: "Qu'est-ce que la Durabilité numérique?",
        options: [
          "Avoir une connexion Internet stable",
          "Réduire les déchets électroniques et l'impact environnemental de la technologie",
          "Utiliser des batteries rechargeables",
          "Acheter des panneaux solaires",
        ],
        correctAnswer: 1,
        explanation:
          "La Durabilité numérique vise à réduire les déchets électroniques en réemployant le matériel et en utilisant des logiciels légers.",
      },
      {
        id: 9,
        question: "NIRD favorise-t-il l'autonomie technologique?",
        options: [
          "Non, NIRD rend les utilisateurs dépendants",
          "Oui, en enseignant comment les systèmes fonctionnent et en évitant la dépendance aux éditeurs",
          "Seulement pour les informaticiens professionnels",
          "Non, NIRD est pour les débutants seulement",
        ],
        correctAnswer: 1,
        explanation:
          "Oui, NIRD favorise l'autonomie en enseignant comment les systèmes fonctionnent et en utilisant des logiciels libres et transparents.",
      },
      {
        id: 10,
        question: "Quel est le rôle de la communauté dans NIRD?",
        options: [
          "La communauté n'a aucun rôle",
          "La communauté finance tout le matériel",
          "La communauté partage les connaissances, s'entraîne et crée un écosystème local",
          "La communauté surveille l'utilisation d'Internet",
        ],
        correctAnswer: 2,
        explanation:
          "La communauté est au cœur de NIRD: partage des connaissances, entraide, création d'un écosystème numérique local solide.",
      },
    ],
  },
  {
    stage: 2,
    name: "Linux et Logiciels Libres",
    description: "Découvrir les avantages de Linux et des logiciels open-source",
    difficulty: "Moyen",
    questions: [
      {
        id: 11,
        question: "Pourquoi utiliser Linux dans une école?",
        options: [
          "Parce que c'est le seul système disponible",
          "Gratuit, sécurisé, open-source et permet de recycler du matériel ancien",
          "Parce que Microsoft l'oblige",
          "Parce qu'il est plus facile que Windows",
        ],
        correctAnswer: 1,
        explanation:
          "Linux est gratuit, sécurisé et open-source. Il permet aux écoles d'économiser des coûts et de recycler du matériel ancien.",
      },
      {
        id: 12,
        question: "Quels sont les avantages des logiciels libres?",
        options: [
          "Ils ne fonctionnent que sur Linux",
          "Gratuits, transparents, modifiables et offrent une liberté pédagogique totale",
          "Ils sont plus lents que les propriétaires",
          "Ils ne supportent pas les fichiers standards",
        ],
        correctAnswer: 1,
        explanation:
          "Les logiciels libres sont gratuits, transparents et modifiables. Ils offrent une meilleure transparence et sécurité.",
      },
      {
        id: 13,
        question: "Qu'est-ce que le code source ouvert?",
        options: [
          "Un site Internet public",
          "Le code d'un programme accessible et modifiable par tous",
          "Un virus informatique",
          "Un type de serveur web",
        ],
        correctAnswer: 1,
        explanation:
          "Le code source ouvert signifie que n'importe qui peut lire, modifier et améliorer le code d'un programme.",
      },
      {
        id: 14,
        question: "Linux peut-il fonctionner sur du vieux matériel?",
        options: [
          "Non, Linux nécessite du matériel récent",
          "Oui, Linux fonctionne très bien sur du vieux matériel grâce à sa légèreté",
          "Seulement sur du matériel très ancien",
          "Non, c'est impossible",
        ],
        correctAnswer: 1,
        explanation:
          "Oui! Linux est très léger et peut fonctionner efficacement sur du vieux matériel, ce qui en fait un allié pour le recyclage.",
      },
      {
        id: 15,
        question: "Quel est un exemple de logiciel libre populaire?",
        options: ["Microsoft Office", "Adobe Photoshop", "LibreOffice ou GIMP", "Autocad"],
        correctAnswer: 2,
        explanation:
          "LibreOffice (alternative à Microsoft Office) et GIMP (alternative à Photoshop) sont des logiciels libres populaires.",
      },
      {
        id: 16,
        question: "Pourquoi les logiciels libres sont-ils souvent plus sécurisés?",
        options: [
          "Ils ont plus d'experts en sécurité",
          "Parce que le code est audité par de nombreux experts indépendants",
          "Ils ont des pare-feu meilleurs",
          "Parce qu'ils utilisent un chiffrement militaire",
        ],
        correctAnswer: 1,
        explanation:
          "Les logiciels libres sont audités par des milliers d'experts. Les failles sont découvertes et corrigées plus rapidement.",
      },
      {
        id: 17,
        question: "Les logiciels libres peuvent-ils être utilisés à l'école?",
        options: [
          "Non, ils sont réservés aux experts",
          "Oui, ce sont des outils puissants et adaptés à l'enseignement",
          "Seulement en cours d'informatique",
          "Non, c'est interdite par la loi",
        ],
        correctAnswer: 1,
        explanation:
          "Oui! Les logiciels libres sont parfaits pour l'école. Ils offrent une transparence et une liberté pédagogique totale.",
      },
      {
        id: 18,
        question: "Qu'est-ce qu'une distribution Linux?",
        options: [
          "Une version modifiée de Linux créée par des entreprises",
          "Un type de virus",
          "Un service d'abonnement Internet",
          "Un fournisseur d'électricité",
        ],
        correctAnswer: 0,
        explanation:
          "Une distribution Linux est une version de Linux avec des outils et logiciels pré-installés (Ubuntu, Fedora, Debian, etc.).",
      },
      {
        id: 19,
        question: "Linux est-il gratuit?",
        options: [
          "Non, il faut acheter une licence",
          "Seulement pour les écoles",
          "Oui, Linux est entièrement gratuit et open-source",
          "Gratuit la première année seulement",
        ],
        correctAnswer: 2,
        explanation:
          "Oui! Linux est entièrement gratuit, open-source et peut être utilisé sans payer de licences, même en contexte commercial.",
      },
      {
        id: 20,
        question: "Peut-on utiliser des logiciels libres avec Windows ou macOS?",
        options: [
          "Non, seulement sur Linux",
          "Oui, beaucoup de logiciels libres fonctionnent sur tous les systèmes d'exploitation",
          "Seulement sur macOS",
          "C'est interdit par la loi",
        ],
        correctAnswer: 1,
        explanation:
          "Oui! Beaucoup de logiciels libres comme Firefox, LibreOffice, GIMP fonctionnent sur Windows, macOS et Linux.",
      },
    ],
  },
  {
    stage: 3,
    name: "Implémentation Pratique",
    description: "Apprendre à mettre en place NIRD dans une école",
    difficulty: "Moyen-Avancé",
    questions: [
      {
        id: 21,
        question: "Comment commencer avec NIRD dans une école?",
        options: [
          "Remplacer tout immédiatement",
          "Attendre que l'État l'impose",
          "Former les enseignants et tester Linux sur quelques ordinateurs progressivement",
          "Acheter des licences logicielles coûteuses",
        ],
        correctAnswer: 2,
        explanation:
          "Commencez par former les enseignants, testez Linux sur quelques ordinateurs, puis expandez progressivement.",
      },
      {
        id: 22,
        question: "Quel est le coût initial de mise en place de NIRD?",
        options: [
          "Très élevé (10 000+)",
          "Moyen (5 000)",
          "Minimal car tous les outils sont gratuits, on utilise du matériel recyclé",
          "Il faut acheter du nouveau matériel cher",
        ],
        correctAnswer: 2,
        explanation:
          "NIRD est conçu pour les budgets limités. Tous les outils sont gratuits et on recycle du matériel existant.",
      },
      {
        id: 23,
        question: "Qui doit être formé en premier pour NIRD?",
        options: [
          "Les élèves directement",
          "Les parents d'abord",
          "Les enseignants et le personnel informatique",
          "Les directeurs seulement",
        ],
        correctAnswer: 2,
        explanation:
          "Les enseignants et le personnel informatique doivent être formés en premier pour pouvoir soutenir les élèves.",
      },
      {
        id: 24,
        question: "Quel type de matériel peut être utilisé pour NIRD?",
        options: [
          "Seulement du matériel très récent",
          "Du matériel d'occasion, même ancien, qui fonctionnerait mal avec Windows",
          "Seuls les ordinateurs portables neufs",
          "Seulement les tablettes récentes",
        ],
        correctAnswer: 1,
        explanation:
          "NIRD peut utiliser du vieux matériel (5-10 ans) qui fonctionnerait mal avec Windows mais fonctionne bien avec Linux.",
      },
      {
        id: 25,
        question: "Comment intégrer NIRD avec les systèmes existants?",
        options: [
          "C'est impossible, il faut tout remplacer",
          "Utiliser des outils qui importent et exportent les formats standards (Excel, Word, PDF)",
          "Garder seulement Windows",
          "Il ne faut pas mélanger les systèmes",
        ],
        correctAnswer: 1,
        explanation:
          "Les logiciels libres supportent les formats standards (Excel, Word, PDF), donc la transition est progressive et compatible.",
      },
      {
        id: 26,
        question: "NIRD fonctionne-t-il sans Internet?",
        options: [
          "Non, Internet est obligatoire",
          "Oui, Linux et les logiciels libres fonctionnent hors ligne",
          "Seulement avec le cloud",
          "Il faut une connexion satellite",
        ],
        correctAnswer: 1,
        explanation:
          "Oui! Linux et les logiciels libres fonctionnent en mode offline. On peut utiliser le cloud optionnellement.",
      },
      {
        id: 27,
        question: "Quel est le rôle du support technique dans NIRD?",
        options: [
          "Il n'y a pas besoin de support",
          "Tout le support vient de l'éditeur Microsoft",
          "Combinaison d'auto-support communautaire, forums en ligne et formation locale",
          "Seul Apple peut fournir du support",
        ],
        correctAnswer: 2,
        explanation:
          "Le support vient de la communauté open-source, des forums en ligne et de la formation locale, tous gratuits.",
      },
      {
        id: 28,
        question: "Comment mesurer le succès de NIRD dans une école?",
        options: [
          "Par la vitesse des ordinateurs",
          "Réduction des coûts IT, amélioration des compétences numériques, moins de déchets électroniques",
          "Par le nombre d'ordinateurs achetés",
          "Par la consommation d'électricité",
        ],
        correctAnswer: 1,
        explanation:
          "Le succès se mesure par la réduction des coûts, l'amélioration des compétences et la réduction des déchets.",
      },
      {
        id: 29,
        question: "NIRD nécessite-t-il une infrastructure réseau complexe?",
        options: [
          "Oui, très complexe et coûteuse",
          "Non, Linux fonctionne avec une infrastructure simple et peu coûteuse",
          "Seulement du cloud",
          "Nécessite des serveurs militaires",
        ],
        correctAnswer: 1,
        explanation:
          "Non! Linux fonctionne avec une infrastructure simple. Pas besoin de serveurs complexes ou coûteux.",
      },
      {
        id: 30,
        question: "Quelle est la première étape concrète pour démarrer NIRD?",
        options: [
          "Acheter du nouveau matériel",
          "Former tous les 500 enseignants en même temps",
          "Créer un plan de migration, former un petit groupe pilote, installer Linux sur quelques postes",
          "Demander l'approbation du gouvernement",
        ],
        correctAnswer: 2,
        explanation:
          "La première étape est de créer un plan, former un petit groupe pilote et tester sur quelques ordinateurs.",
      },
    ],
  },
  {
    stage: 4,
    name: "Sécurité et Protection des Données",
    description: "Protéger les données et la vie privée avec NIRD",
    difficulty: "Avancé",
    questions: [
      {
        id: 31,
        question: "Quel est le lien entre NIRD et la sécurité des données?",
        options: [
          "NIRD n'a rien à voir avec la sécurité",
          "NIRD met l'accent sur la protection des données des élèves via les logiciels libres audités",
          "Les données sont moins sécurisées avec les logiciels libres",
          "Seuls les logiciels propriétaires sont sécurisés",
        ],
        correctAnswer: 1,
        explanation:
          "NIRD met l'accent sur la protection des données. Les systèmes libres sont généralement plus sécurisés car audités par des experts.",
      },
      {
        id: 32,
        question: "Comment les logiciels libres protègent la vie privée?",
        options: [
          "Ils ne la protègent pas",
          "Leur code est transparent, pas de spyware ou trackers cachés",
          "Ils utilisent le chiffrement militaire",
          "Personne ne peut voir le code",
        ],
        correctAnswer: 1,
        explanation:
          "Avec les logiciels libres, le code est transparent. Aucun spyware ou tracking caché ne peut s'y cacher.",
      },
      {
        id: 33,
        question: "Les données des élèves sont-elles en sécurité avec NIRD?",
        options: [
          "Non, NIRD expose les données",
          "Oui, NIRD utilise des systèmes auditables et des pratiques sécurisées",
          "Seulement si on achète un antivirus supplémentaire",
          "Non, les données doivent être sur le cloud propriétaire",
        ],
        correctAnswer: 1,
        explanation:
          "Oui! NIRD utilise des systèmes auditables et des pratiques de sécurité robustes pour protéger les données des élèves.",
      },
      {
        id: 34,
        question: "Qu'est-ce que le chiffrement dans NIRD?",
        options: [
          "Un virus informatique",
          "Transformer les données en code secret pour les protéger",
          "Un type de logiciel payant",
          "Une connexion Internet",
        ],
        correctAnswer: 1,
        explanation:
          "Le chiffrement transforme les données en code secret. Les logiciels libres utilisent des algorithmes de chiffrement robustes.",
      },
      {
        id: 35,
        question: "Comment NIRD gère-t-il les données sensibles des élèves?",
        options: [
          "Les données ne sont jamais protégées",
          "Stockage local, chiffrement, contrôle d'accès strict, conformité RGPD",
          "Tout est envoyé sur le cloud public",
          "Les données peuvent être vendues à des tiers",
        ],
        correctAnswer: 1,
        explanation:
          "NIRD utilise le stockage local, le chiffrement, les contrôles d'accès stricts et respecte la conformité RGPD.",
      },
      {
        id: 36,
        question: "NIRD est-il conforme aux régulations de protection des données?",
        options: [
          "Non, NIRD n'est pas conforme",
          "Oui, NIRD respecte la RGPD et les régulations locales de protection des données",
          "Seulement en Europe",
          "Jamais",
        ],
        correctAnswer: 1,
        explanation: "Oui! NIRD est conçu pour respecter la RGPD et les régulations locales de protection des données.",
      },
      {
        id: 37,
        question: "Qui a accès aux données dans un système NIRD?",
        options: [
          "Tout le monde",
          "Seulement les administrateurs autorisés avec les permissions appropriées",
          "Le gouvernement automatiquement",
          "Les éditeurs de logiciels",
        ],
        correctAnswer: 1,
        explanation:
          "Seuls les administrateurs autorisés ont accès, avec des permissions granulaires et des logs d'accès.",
      },
      {
        id: 38,
        question: "Comment protéger les mots de passe dans NIRD?",
        options: [
          "Les mots de passe ne sont pas importants",
          "Utiliser des mots de passe forts, hachage sécurisé, authentification multi-facteurs",
          "Les mots de passe sont stockés en texte clair",
          "Partager les mots de passe entre tous les enseignants",
        ],
        correctAnswer: 1,
        explanation:
          "NIRD utilise des mots de passe forts, le hachage sécurisé et l'authentification multi-facteurs pour la sécurité.",
      },
      {
        id: 39,
        question: "NIRD peut-il détecter les menaces de sécurité?",
        options: [
          "Non, NIRD ne peut pas sécuriser les systèmes",
          "Oui, Linux avec les outils de monitoring et les pare-feu détecte les menaces",
          "Seulement avec un logiciel antivirus propriétaire payant",
          "Non, c'est impossible",
        ],
        correctAnswer: 1,
        explanation:
          "Oui! Linux avec les outils de monitoring, pare-feu et systèmes d'intrusion détecte et prévient les menaces.",
      },
      {
        id: 40,
        question: "Comment mettre à jour les systèmes NIRD en sécurité?",
        options: [
          "Ne jamais mettre à jour",
          "Mettre à jour rapidement sans tester",
          "Tester les mises à jour sur des machines de test, puis déployer progressivement",
          "Demander l'approbation du gouvernement à chaque mise à jour",
        ],
        correctAnswer: 2,
        explanation:
          "Les mises à jour doivent être testées d'abord sur des machines de test, puis déployées progressivement.",
      },
    ],
  },
  {
    stage: 5,
    name: "Engagement et Impact Communautaire",
    description: "Créer l'impact avec NIRD et engager la communauté",
    difficulty: "Avancé",
    questions: [
      {
        id: 41,
        question: "Comment impliquer les élèves dans NIRD?",
        options: [
          "Les laisser sans explications",
          "Leur montrer comment fonctionne Linux, les laisser personnaliser, encourager les contributions open-source",
          "Les éloigner de la technologie",
          "Leur donner seulement des ordinateurs fermés",
        ],
        correctAnswer: 1,
        explanation:
          "Impliquez les élèves en leur montrant comment Linux fonctionne et en les encourageant à contribuer à des projets open-source.",
      },
      {
        id: 42,
        question: "NIRD peut-il créer des opportunités d'apprentissage?",
        options: [
          "Non, NIRD est juste un système",
          "Oui, les élèves apprennent la programmation, l'administration système, l'éthique numérique",
          "Seulement pour les cours d'informatique",
          "Non, c'est trop difficile",
        ],
        correctAnswer: 1,
        explanation:
          "Oui! NIRD crée des opportunités pour apprendre la programmation, l'administration système et l'éthique numérique.",
      },
      {
        id: 43,
        question: "Comment NIRD favorise-t-il l'entrepreneuriat local?",
        options: [
          "NIRD ne favorise rien",
          "En créant des emplois locaux pour la maintenance IT et le support technique",
          "En vendant des licences logicielles",
          "En exportant des données",
        ],
        correctAnswer: 1,
        explanation:
          "NIRD crée des opportunités d'emploi local: techniciens, formateurs, développeurs locaux pour maintenir les systèmes.",
      },
      {
        id: 44,
        question: "Quel est l'impact environnemental de NIRD?",
        options: [
          "NIRD augmente les déchets électroniques",
          "Réduction des déchets, moins d'énergie, réemploi du matériel obsolète",
          "Pas d'impact",
          "Augmentation de la consommation d'électricité",
        ],
        correctAnswer: 1,
        explanation:
          "NIRD réduit drastiquement les déchets électroniques en réemployant le matériel obsolète et en utilisant des logiciels légers.",
      },
      {
        id: 45,
        question: "Comment NIRD renforce-t-il l'inclusion sociale?",
        options: [
          "NIRD ne renforce rien",
          "En donnant l'accès à la technologie à tous, indépendamment du revenu",
          "En vendant du matériel cher",
          "En réduisant l'accès à Internet",
        ],
        correctAnswer: 1,
        explanation:
          "NIRD renforce l'inclusion en donnant accès à la technologie à tous, peu importe leur situation économique.",
      },
      {
        id: 46,
        question: "NIRD peut-il connecter les écoles entre elles?",
        options: [
          "Non, c'est impossible",
          "Oui, via des réseaux communautaires et des projets collaboratifs locaux",
          "Seulement avec Internet très rapide",
          "Non, chaque école doit être isolée",
        ],
        correctAnswer: 1,
        explanation:
          "Oui! NIRD permet de connecter les écoles via des réseaux communautaires et des projets collaboratifs locaux.",
      },
      {
        id: 47,
        question: "Quel est le rôle des parents dans NIRD?",
        options: [
          "Les parents n'ont aucun rôle",
          "Ils supportent l'école, participent aux formations, aident à la maintenance",
          "Seulement financer l'école",
          "Seulement surveiller les élèves",
        ],
        correctAnswer: 1,
        explanation:
          "Les parents jouent un rôle clé: ils supportent l'école, participent aux formations et aident à la maintenance des systèmes.",
      },
      {
        id: 48,
        question: "NIRD peut-il créer une culture numérique local?",
        options: [
          "Non, la culture vient de l'extérieur",
          "Oui, en encourageant l'innovation locale et le partage des connaissances communautaires",
          "Seulement via les réseaux sociaux",
          "Non, c'est impossible en zone rurale",
        ],
        correctAnswer: 1,
        explanation:
          "Oui! NIRD crée une culture numérique locale forte en encourageant l'innovation locale et le partage des connaissances.",
      },
      {
        id: 49,
        question: "NIRD peut-il soutenir la formation continue?",
        options: [
          "Non, la formation s'arrête après l'école",
          "Oui, en fournissant les outils et l'environnement pour l'apprentissage continu",
          "Seulement les formations payantes",
          "Jamais",
        ],
        correctAnswer: 1,
        explanation:
          "Oui! NIRD fournit les outils et l'environnement pour l'apprentissage continu tout au long de la vie.",
      },
      {
        id: 50,
        question: "Quel est le futur de NIRD?",
        options: [
          "NIRD disparaîtra bientôt",
          "NIRD grandira en tant que mouvement global pour la résilience numérique et l'autonomie technologique",
          "NIRD devient un logiciel propriétaire",
          "NIRD ne changera jamais",
        ],
        correctAnswer: 1,
        explanation:
          "NIRD continuerait à grandir comme un mouvement global pour la résilience numérique, l'autonomie technologique et la durabilité.",
      },
    ],
  },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const stage = Number.parseInt(searchParams.get("stage") || "1")

  const selectedStage = quizStages.find((s) => s.stage === stage)
  if (!selectedStage) {
    return NextResponse.json({ error: "Stage not found" }, { status: 404 })
  }

  return NextResponse.json({
    stage: selectedStage.stage,
    name: selectedStage.name,
    description: selectedStage.description,
    difficulty: selectedStage.difficulty,
    totalStages: quizStages.length,
    questions: selectedStage.questions,
  })
}
