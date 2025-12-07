import { NextRequest, NextResponse } from "next/server"

// Questions de secours par thème
const fallbackQuestions: Record<string, Array<{
    question: string
    options: string[]
    correctAnswer: number
    explanation: string
}>> = {
    default: [
        {
            question: "Qu'est-ce que NIRD signifie ?",
            options: [
                "Nouveau Internet Rapide et Direct",
                "Numérique Inclusif, Responsable et Durable",
                "Network Integration and Resource Development",
                "Nouvelles Innovations pour le Réseau Digital"
            ],
            correctAnswer: 1,
            explanation: "NIRD signifie Numérique Inclusif, Responsable et Durable. C'est une démarche éducative qui vise à créer des écosystèmes numériques résilients."
        },
        {
            question: "Quels sont les trois piliers de la démarche NIRD ?",
            options: [
                "Vitesse, Performance, Innovation",
                "Inclusion, Responsabilité, Durabilité",
                "Cloud, Mobile, Sécurité",
                "Hardware, Software, Network"
            ],
            correctAnswer: 1,
            explanation: "Les trois piliers de NIRD sont l'Inclusion (accès pour tous), la Responsabilité (protection des données) et la Durabilité (sobriété numérique)."
        },
        {
            question: "Quel est l'objectif principal de la démarche NIRD ?",
            options: [
                "Vendre plus d'ordinateurs",
                "Créer des écosystèmes numériques résilients et souverains",
                "Promouvoir les réseaux sociaux",
                "Augmenter la vitesse d'Internet"
            ],
            correctAnswer: 1,
            explanation: "NIRD vise à créer des écosystèmes numériques résilients, souverains et respectueux de l'environnement dans les établissements scolaires."
        },
        {
            question: "Pourquoi la sobriété numérique est-elle importante ?",
            options: [
                "Pour économiser de l'électricité seulement",
                "Pour réduire l'impact environnemental du numérique et prolonger la vie des équipements",
                "Pour utiliser moins Internet",
                "Pour éviter les virus informatiques"
            ],
            correctAnswer: 1,
            explanation: "La sobriété numérique vise à réduire l'empreinte carbone du numérique en prolongeant la durée de vie des équipements et en évitant le gaspillage."
        },
        {
            question: "Qu'est-ce qu'un logiciel libre ?",
            options: [
                "Un logiciel gratuit uniquement",
                "Un logiciel dont le code source est accessible, modifiable et redistribuable",
                "Un logiciel sans publicité",
                "Un logiciel développé par des bénévoles"
            ],
            correctAnswer: 1,
            explanation: "Un logiciel libre est un logiciel dont le code source est accessible à tous, peut être modifié et redistribué. La gratuité n'est qu'une conséquence."
        },
        {
            question: "Quelle alternative libre existe pour Microsoft Office ?",
            options: [
                "Google Docs uniquement",
                "LibreOffice",
                "OpenOffice exclusivement",
                "Il n'existe pas d'alternative"
            ],
            correctAnswer: 1,
            explanation: "LibreOffice est une suite bureautique libre et gratuite qui offre des fonctionnalités similaires à Microsoft Office."
        }
    ],
    linux: [
        {
            question: "Quelle est la mascotte officielle de Linux ?",
            options: ["Un pingouin nommé Tux", "Un renard", "Un robot", "Un castor"],
            correctAnswer: 0,
            explanation: "Tux, le pingouin, est la mascotte officielle de Linux depuis 1996, choisie par Linus Torvalds lui-même."
        },
        {
            question: "Qui a créé le noyau Linux ?",
            options: ["Bill Gates", "Steve Jobs", "Linus Torvalds", "Richard Stallman"],
            correctAnswer: 2,
            explanation: "Linus Torvalds a créé le noyau Linux en 1991 alors qu'il était étudiant en Finlande."
        },
        {
            question: "Qu'est-ce qu'une distribution Linux ?",
            options: [
                "Un type de virus",
                "Un système d'exploitation basé sur le noyau Linux avec des logiciels pré-installés",
                "Un serveur web",
                "Un langage de programmation"
            ],
            correctAnswer: 1,
            explanation: "Une distribution Linux est un système d'exploitation complet basé sur le noyau Linux, avec une sélection de logiciels et une interface utilisateur spécifique."
        },
        {
            question: "Quelle distribution Linux est recommandée pour les débutants ?",
            options: ["Arch Linux", "Gentoo", "Ubuntu ou Linux Mint", "Slackware"],
            correctAnswer: 2,
            explanation: "Ubuntu et Linux Mint sont des distributions conviviales avec une interface intuitive et une grande communauté d'entraide."
        },
        {
            question: "Linux est-il utilisé uniquement sur les ordinateurs personnels ?",
            options: [
                "Oui, uniquement",
                "Non, il fait tourner la majorité des serveurs web, smartphones Android et supercalculateurs",
                "Seulement sur les serveurs",
                "Seulement sur les téléphones"
            ],
            correctAnswer: 1,
            explanation: "Linux est partout : serveurs web (plus de 90%), Android, supercalculateurs (99%), objets connectés, et ordinateurs personnels."
        },
        {
            question: "Quel est l'avantage principal de Linux pour les écoles ?",
            options: [
                "Il est plus rapide que Windows",
                "Il est gratuit, sécurisé et fonctionne sur du vieux matériel",
                "Il a plus de jeux vidéo",
                "Il est obligatoire dans l'éducation nationale"
            ],
            correctAnswer: 1,
            explanation: "Linux est gratuit, open-source, très sécurisé et peut fonctionner efficacement sur du matériel ancien, réduisant les coûts et les déchets."
        },
        {
            question: "Qu'est-ce que le terminal Linux ?",
            options: [
                "Un jeu vidéo",
                "Une interface en ligne de commande pour interagir avec le système",
                "Un navigateur web",
                "Un logiciel de messagerie"
            ],
            correctAnswer: 1,
            explanation: "Le terminal est une interface en ligne de commande qui permet d'exécuter des commandes textuelles pour contrôler le système."
        },
        {
            question: "Quelle commande Linux permet de lister les fichiers d'un répertoire ?",
            options: ["dir", "ls", "list", "show"],
            correctAnswer: 1,
            explanation: "La commande 'ls' (list) affiche le contenu d'un répertoire sous Linux."
        },
        {
            question: "Qu'est-ce que le gestionnaire de paquets apt ?",
            options: [
                "Un jeu de cartes",
                "Un outil pour installer, mettre à jour et supprimer des logiciels",
                "Un éditeur de texte",
                "Un antivirus"
            ],
            correctAnswer: 1,
            explanation: "APT (Advanced Package Tool) est le gestionnaire de paquets utilisé par Debian, Ubuntu et leurs dérivés pour gérer les logiciels."
        },
        {
            question: "Pourquoi Linux est-il considéré comme plus sécurisé que Windows ?",
            options: [
                "Il est plus récent",
                "Son code est open-source et audité par des milliers de développeurs",
                "Il coûte plus cher",
                "Il est moins utilisé"
            ],
            correctAnswer: 1,
            explanation: "Le code open-source de Linux permet à des milliers d'experts de l'auditer et de corriger les failles rapidement."
        }
    ],
    securite: [
        {
            question: "Qu'est-ce que le RGPD ?",
            options: [
                "Un logiciel antivirus",
                "Le Règlement Général sur la Protection des Données",
                "Un protocole réseau",
                "Un système d'exploitation"
            ],
            correctAnswer: 1,
            explanation: "Le RGPD est une loi européenne qui protège les données personnelles des citoyens."
        },
        {
            question: "Pourquoi les logiciels libres sont-ils souvent plus sécurisés ?",
            options: [
                "Ils ont plus de publicité",
                "Leur code peut être audité par des milliers d'experts indépendants",
                "Ils sont plus chers",
                "Ils sont développés par des gouvernements"
            ],
            correctAnswer: 1,
            explanation: "Le code open-source peut être examiné par des milliers de développeurs, permettant de détecter et corriger les failles rapidement."
        },
        {
            question: "Qu'est-ce que le chiffrement des données ?",
            options: [
                "Supprimer des fichiers",
                "Transformer les données en code illisible sans la clé de déchiffrement",
                "Compresser des fichiers",
                "Sauvegarder des fichiers"
            ],
            correctAnswer: 1,
            explanation: "Le chiffrement transforme les données en un format illisible qui ne peut être déchiffré qu'avec une clé spécifique."
        },
        {
            question: "Qu'est-ce qu'un mot de passe fort ?",
            options: [
                "Un mot de passe court et facile à retenir",
                "Un mot de passe long avec lettres, chiffres et caractères spéciaux",
                "Le nom de votre animal de compagnie",
                "Votre date de naissance"
            ],
            correctAnswer: 1,
            explanation: "Un mot de passe fort doit être long (12+ caractères), combiner majuscules, minuscules, chiffres et caractères spéciaux."
        },
        {
            question: "Où vaut-il mieux stocker les données sensibles d'une école selon NIRD ?",
            options: [
                "Sur les serveurs des GAFAM américains",
                "Sur des serveurs locaux ou européens avec chiffrement",
                "Sur des clés USB non chiffrées",
                "Sur les réseaux sociaux"
            ],
            correctAnswer: 1,
            explanation: "NIRD recommande le stockage local ou sur des serveurs européens conformes au RGPD, avec chiffrement."
        },
        {
            question: "Qu'est-ce que l'authentification à deux facteurs (2FA) ?",
            options: [
                "Utiliser deux mots de passe",
                "Une méthode de sécurité combinant mot de passe et un second élément de vérification",
                "Se connecter sur deux appareils",
                "Avoir deux comptes différents"
            ],
            correctAnswer: 1,
            explanation: "La 2FA ajoute une couche de sécurité en demandant une seconde vérification (SMS, application, clé physique) en plus du mot de passe."
        },
        {
            question: "Qu'est-ce qu'un VPN ?",
            options: [
                "Un type de virus",
                "Un réseau privé virtuel qui chiffre la connexion Internet",
                "Un logiciel de messagerie",
                "Un navigateur web"
            ],
            correctAnswer: 1,
            explanation: "Un VPN (Virtual Private Network) crée un tunnel chiffré entre votre appareil et Internet, protégeant votre vie privée."
        },
        {
            question: "Qu'est-ce que le phishing ?",
            options: [
                "Un sport nautique",
                "Une technique d'arnaque pour voler des informations personnelles",
                "Un logiciel antivirus",
                "Un type de réseau"
            ],
            correctAnswer: 1,
            explanation: "Le phishing est une technique frauduleuse utilisant de faux emails ou sites web pour voler des informations sensibles."
        },
        {
            question: "Pourquoi faut-il mettre à jour régulièrement ses logiciels ?",
            options: [
                "Pour avoir de nouvelles couleurs",
                "Pour corriger les failles de sécurité découvertes",
                "Pour ralentir l'ordinateur",
                "Ce n'est pas nécessaire"
            ],
            correctAnswer: 1,
            explanation: "Les mises à jour corrigent les vulnérabilités de sécurité et protègent contre les nouvelles menaces."
        },
        {
            question: "Qu'est-ce qu'un pare-feu (firewall) ?",
            options: [
                "Un appareil qui éteint les incendies",
                "Un système qui filtre le trafic réseau pour bloquer les connexions non autorisées",
                "Un logiciel de dessin",
                "Un type de processeur"
            ],
            correctAnswer: 1,
            explanation: "Un pare-feu surveille et contrôle le trafic réseau entrant et sortant selon des règles de sécurité définies."
        }
    ],
    environnement: [
        {
            question: "Quelle est l'empreinte carbone moyenne d'un email avec pièce jointe ?",
            options: [
                "0 gramme de CO2",
                "Environ 50 grammes de CO2",
                "1 kg de CO2",
                "10 kg de CO2"
            ],
            correctAnswer: 1,
            explanation: "Un email avec pièce jointe émet environ 50g de CO2, incluant l'énergie des serveurs et la transmission des données."
        },
        {
            question: "Combien de temps faut-il utiliser un smartphone pour amortir son impact environnemental ?",
            options: [
                "6 mois",
                "1 an",
                "Au moins 4-5 ans",
                "1 mois"
            ],
            correctAnswer: 2,
            explanation: "La fabrication représente 80% de l'impact environnemental d'un smartphone. Il faut l'utiliser au moins 4-5 ans pour l'amortir."
        },
        {
            question: "Qu'est-ce que l'obsolescence programmée ?",
            options: [
                "Une technique de marketing",
                "La conception d'un produit pour qu'il devienne inutilisable après un certain temps",
                "Un type de garantie",
                "Une mise à jour logicielle"
            ],
            correctAnswer: 1,
            explanation: "L'obsolescence programmée est la stratégie de concevoir un produit pour limiter sa durée de vie et forcer son remplacement."
        },
        {
            question: "Quel pourcentage des déchets électroniques mondiaux est correctement recyclé ?",
            options: [
                "80%",
                "50%",
                "Moins de 20%",
                "100%"
            ],
            correctAnswer: 2,
            explanation: "Moins de 20% des déchets électroniques sont correctement recyclés dans le monde, le reste finit en décharge ou exporté illégalement."
        },
        {
            question: "Comment Linux aide-t-il à réduire les déchets électroniques ?",
            options: [
                "Il ne consomme pas d'électricité",
                "Il permet de faire fonctionner des ordinateurs anciens qui ne supportent plus Windows",
                "Il est fait de matériaux recyclés",
                "Il n'a aucun impact"
            ],
            correctAnswer: 1,
            explanation: "Linux est léger et peut fonctionner sur du matériel ancien, prolongeant la durée de vie des ordinateurs de plusieurs années."
        },
        {
            question: "Quelle action simple réduit la consommation d'énergie d'un ordinateur ?",
            options: [
                "Augmenter la luminosité de l'écran",
                "Activer le mode veille et réduire la luminosité",
                "Laisser l'ordinateur allumé 24h/24",
                "Installer plus de logiciels"
            ],
            correctAnswer: 1,
            explanation: "Le mode veille et la réduction de luminosité peuvent réduire significativement la consommation d'énergie."
        },
        {
            question: "Qu'est-ce que le réemploi informatique ?",
            options: [
                "Acheter du matériel neuf",
                "Reconditionner et réutiliser du matériel informatique existant",
                "Jeter les vieux ordinateurs",
                "Utiliser uniquement le cloud"
            ],
            correctAnswer: 1,
            explanation: "Le réemploi consiste à donner une seconde vie au matériel informatique par la réparation, le reconditionnement ou la réaffectation."
        },
        {
            question: "Quel est l'impact environnemental du streaming vidéo ?",
            options: [
                "Aucun impact",
                "Significatif : environ 300g de CO2 par heure de visionnage HD",
                "Négligeable",
                "Positif pour l'environnement"
            ],
            correctAnswer: 1,
            explanation: "Le streaming vidéo consomme beaucoup d'énergie (serveurs, réseaux). Une heure de vidéo HD émet environ 300g de CO2."
        },
        {
            question: "Pourquoi éviter le stockage cloud excessif est-il écologique ?",
            options: [
                "Ce n'est pas écologique",
                "Les data centers consomment énormément d'énergie pour stocker et refroidir",
                "Le cloud est gratuit",
                "Le cloud ne consomme pas d'énergie"
            ],
            correctAnswer: 1,
            explanation: "Les data centers consomment 1-2% de l'électricité mondiale. Le stockage local ou raisonné réduit cette empreinte."
        },
        {
            question: "Qu'est-ce que l'indice de réparabilité ?",
            options: [
                "Un indice de performance",
                "Une note sur 10 indiquant la facilité de réparation d'un appareil",
                "Un indice de prix",
                "Une mesure de vitesse"
            ],
            correctAnswer: 1,
            explanation: "L'indice de réparabilité (obligatoire en France) note de 0 à 10 la facilité de réparation d'un appareil électronique."
        }
    ],
    libre: [
        {
            question: "Qui a fondé le mouvement du logiciel libre ?",
            options: [
                "Steve Jobs",
                "Richard Stallman",
                "Bill Gates",
                "Mark Zuckerberg"
            ],
            correctAnswer: 1,
            explanation: "Richard Stallman a fondé le mouvement du logiciel libre en 1983 avec le projet GNU et la Free Software Foundation."
        },
        {
            question: "Quelles sont les 4 libertés fondamentales du logiciel libre ?",
            options: [
                "Télécharger, Installer, Utiliser, Supprimer",
                "Utiliser, Étudier, Modifier, Redistribuer",
                "Acheter, Vendre, Louer, Prêter",
                "Créer, Copier, Coller, Effacer"
            ],
            correctAnswer: 1,
            explanation: "Les 4 libertés sont : utiliser le programme, étudier son code, le modifier, et redistribuer les copies originales ou modifiées."
        },
        {
            question: "Quelle est la différence entre open-source et logiciel libre ?",
            options: [
                "C'est exactement la même chose",
                "Open-source se concentre sur les avantages pratiques, libre sur les libertés éthiques",
                "Open-source est payant",
                "Libre signifie gratuit uniquement"
            ],
            correctAnswer: 1,
            explanation: "Le logiciel libre met l'accent sur les libertés éthiques des utilisateurs, tandis qu'open-source se concentre sur les avantages pratiques du développement collaboratif."
        },
        {
            question: "Qu'est-ce que LibreOffice ?",
            options: [
                "Un réseau social",
                "Une suite bureautique libre alternative à Microsoft Office",
                "Un système d'exploitation",
                "Un navigateur web"
            ],
            correctAnswer: 1,
            explanation: "LibreOffice est une suite bureautique libre comprenant traitement de texte (Writer), tableur (Calc), présentations (Impress) et plus."
        },
        {
            question: "Quel navigateur web est libre et respecte la vie privée ?",
            options: [
                "Google Chrome",
                "Firefox",
                "Microsoft Edge",
                "Safari"
            ],
            correctAnswer: 1,
            explanation: "Firefox est développé par la Fondation Mozilla, est open-source et met l'accent sur la protection de la vie privée."
        },
        {
            question: "Qu'est-ce que GIMP ?",
            options: [
                "Un jeu vidéo",
                "Un logiciel libre de retouche d'images, alternative à Photoshop",
                "Un système d'exploitation",
                "Un langage de programmation"
            ],
            correctAnswer: 1,
            explanation: "GIMP (GNU Image Manipulation Program) est un logiciel libre de création et retouche d'images, alternative gratuite à Photoshop."
        },
        {
            question: "Qu'est-ce qu'une licence GPL ?",
            options: [
                "Un permis de conduire",
                "Une licence qui garantit que le logiciel reste libre et ses dérivés aussi",
                "Une licence commerciale",
                "Un certificat de sécurité"
            ],
            correctAnswer: 1,
            explanation: "La GPL (General Public License) est une licence copyleft qui garantit que le logiciel et ses modifications restent libres."
        },
        {
            question: "Quelle alternative libre existe pour Adobe Premiere ?",
            options: [
                "iMovie",
                "Kdenlive ou OpenShot",
                "Final Cut Pro",
                "Il n'en existe pas"
            ],
            correctAnswer: 1,
            explanation: "Kdenlive et OpenShot sont des logiciels de montage vidéo libres et gratuits, alternatives à Adobe Premiere."
        },
        {
            question: "Qu'est-ce que VLC ?",
            options: [
                "Un virus",
                "Un lecteur multimédia libre capable de lire presque tous les formats",
                "Un réseau social",
                "Un système d'exploitation"
            ],
            correctAnswer: 1,
            explanation: "VLC est un lecteur multimédia libre développé par VideoLAN, capable de lire quasiment tous les formats audio et vidéo."
        },
        {
            question: "Pourquoi les formats de fichiers ouverts sont-ils importants ?",
            options: [
                "Ils sont plus jolis",
                "Ils garantissent que les documents restent accessibles sans logiciel propriétaire",
                "Ils sont plus lourds",
                "Ils sont plus rapides"
            ],
            correctAnswer: 1,
            explanation: "Les formats ouverts (ODF, HTML, etc.) garantissent la pérennité et l'accessibilité des documents sans dépendre d'un éditeur."
        }
    ],
    inclusion: [
        {
            question: "Qu'est-ce que l'inclusion numérique ?",
            options: [
                "Avoir le dernier smartphone",
                "Garantir que tous aient accès aux technologies et compétences numériques",
                "Utiliser les réseaux sociaux",
                "Acheter plus d'ordinateurs"
            ],
            correctAnswer: 1,
            explanation: "L'inclusion numérique vise à ce que chacun, quel que soit son âge, situation ou handicap, puisse accéder et utiliser le numérique."
        },
        {
            question: "Qu'est-ce que l'accessibilité numérique ?",
            options: [
                "Avoir une connexion Internet rapide",
                "Concevoir les sites et applications utilisables par les personnes en situation de handicap",
                "Avoir accès aux réseaux sociaux",
                "Pouvoir télécharger des fichiers"
            ],
            correctAnswer: 1,
            explanation: "L'accessibilité numérique garantit que les personnes handicapées (visuelles, auditives, motrices, cognitives) peuvent utiliser les outils numériques."
        },
        {
            question: "Qu'est-ce que la fracture numérique ?",
            options: [
                "Un écran cassé",
                "L'écart entre ceux qui ont accès au numérique et ceux qui en sont exclus",
                "Un bug informatique",
                "Une panne d'Internet"
            ],
            correctAnswer: 1,
            explanation: "La fracture numérique désigne les inégalités d'accès aux technologies numériques et aux compétences pour les utiliser."
        },
        {
            question: "Pourquoi les logiciels libres favorisent-ils l'inclusion ?",
            options: [
                "Ils sont plus beaux",
                "Ils sont gratuits et peuvent être traduits/adaptés par la communauté",
                "Ils sont plus rapides",
                "Ils ne favorisent pas l'inclusion"
            ],
            correctAnswer: 1,
            explanation: "La gratuité supprime la barrière financière, et le code ouvert permet les traductions, adaptations pour handicaps, etc."
        },
        {
            question: "Qu'est-ce qu'un lecteur d'écran ?",
            options: [
                "Un type d'écran",
                "Un logiciel qui lit à voix haute le contenu de l'écran pour les personnes malvoyantes",
                "Un programme de lecture de vidéos",
                "Un navigateur web"
            ],
            correctAnswer: 1,
            explanation: "Un lecteur d'écran (comme NVDA, libre et gratuit) convertit le texte affiché en synthèse vocale pour les personnes aveugles ou malvoyantes."
        },
        {
            question: "Comment les écoles peuvent-elles réduire la fracture numérique ?",
            options: [
                "En interdisant les ordinateurs",
                "En fournissant du matériel reconditionné avec Linux et une formation adaptée",
                "En n'utilisant que des tablettes",
                "En laissant les familles se débrouiller"
            ],
            correctAnswer: 1,
            explanation: "Fournir du matériel reconditionné avec Linux permet un accès à moindre coût, complété par une formation pour tous."
        },
        {
            question: "Qu'est-ce que le RGAA ?",
            options: [
                "Un réseau de transport",
                "Le Référentiel Général d'Amélioration de l'Accessibilité pour les sites web publics",
                "Un logiciel antivirus",
                "Un type de fichier"
            ],
            correctAnswer: 1,
            explanation: "Le RGAA définit les règles d'accessibilité que doivent respecter les sites web des administrations françaises."
        },
        {
            question: "Pourquoi les personnes âgées peuvent-elles être exclues numériquement ?",
            options: [
                "Elles n'aiment pas la technologie",
                "Manque de formation, interfaces complexes et évolution rapide des technologies",
                "Elles ont tous des smartphones",
                "Elles préfèrent la télévision"
            ],
            correctAnswer: 1,
            explanation: "Les personnes âgées peuvent être exclues par le manque d'accompagnement, les interfaces peu intuitives et le rythme des changements."
        },
        {
            question: "Qu'est-ce qu'un Espace Public Numérique (EPN) ?",
            options: [
                "Un cybercafé",
                "Un lieu d'accès public au numérique avec accompagnement et formation",
                "Un data center",
                "Un magasin d'informatique"
            ],
            correctAnswer: 1,
            explanation: "Les EPN sont des lieux ouverts à tous offrant accès à Internet, ordinateurs et accompagnement pour développer les compétences numériques."
        },
        {
            question: "Comment le sous-titrage aide-t-il l'inclusion ?",
            options: [
                "Il rend les vidéos plus longues",
                "Il permet aux personnes sourdes et malentendantes d'accéder au contenu vidéo",
                "Il améliore la qualité vidéo",
                "Il n'aide pas l'inclusion"
            ],
            correctAnswer: 1,
            explanation: "Le sous-titrage rend le contenu vidéo accessible aux personnes sourdes et malentendantes, ainsi qu'aux apprenants de la langue."
        }
    ],
    education: [
        {
            question: "Pourquoi les écoles devraient-elles utiliser des logiciels libres ?",
            options: [
                "Pour économiser sur les licences",
                "Pour l'indépendance, l'économie, la sécurité et l'éducation au numérique ouvert",
                "Parce que c'est obligatoire",
                "Pour avoir moins de fonctionnalités"
            ],
            correctAnswer: 1,
            explanation: "Les logiciels libres offrent indépendance vis-à-vis des éditeurs, économies, sécurité renforcée et enseignent les valeurs du partage."
        },
        {
            question: "Qu'est-ce que le projet Primtux ?",
            options: [
                "Un jeu éducatif",
                "Une distribution Linux spécialement conçue pour les écoles primaires",
                "Un site web",
                "Une application mobile"
            ],
            correctAnswer: 1,
            explanation: "Primtux est une distribution Linux éducative française, adaptée aux écoles primaires avec des logiciels pédagogiques intégrés."
        },
        {
            question: "Pourquoi enseigner le code avec des outils libres ?",
            options: [
                "C'est moins efficace",
                "Les élèves peuvent voir, modifier et comprendre le code source réel",
                "C'est obligatoire",
                "C'est plus difficile"
            ],
            correctAnswer: 1,
            explanation: "Les outils libres permettent aux élèves d'explorer le code source, comprendre le fonctionnement réel et contribuer à la communauté."
        },
        {
            question: "Quel est l'avantage d'un serveur local dans une école ?",
            options: [
                "C'est plus cher",
                "Contrôle total des données, fonctionne hors connexion, respecte le RGPD",
                "C'est obligatoire",
                "C'est plus compliqué"
            ],
            correctAnswer: 1,
            explanation: "Un serveur local permet de garder les données des élèves en interne, fonctionne sans Internet et garantit la conformité RGPD."
        },
        {
            question: "Qu'est-ce que Nextcloud ?",
            options: [
                "Un réseau social",
                "Une plateforme libre de cloud et collaboration, alternative à Google Drive",
                "Un système d'exploitation",
                "Un jeu en ligne"
            ],
            correctAnswer: 1,
            explanation: "Nextcloud est une solution libre de stockage cloud et collaboration que les écoles peuvent héberger elles-mêmes pour protéger les données."
        },
        {
            question: "Comment NIRD aide-t-il les établissements scolaires ?",
            options: [
                "En vendant du matériel",
                "En proposant une méthodologie pour une transition numérique responsable",
                "En créant des réseaux sociaux",
                "En interdisant Internet"
            ],
            correctAnswer: 1,
            explanation: "NIRD propose une démarche complète pour accompagner les écoles vers un numérique souverain, durable et inclusif."
        },
        {
            question: "Qu'est-ce que Moodle ?",
            options: [
                "Un jeu vidéo",
                "Une plateforme libre d'apprentissage en ligne (LMS)",
                "Un réseau social",
                "Un navigateur web"
            ],
            correctAnswer: 1,
            explanation: "Moodle est une plateforme d'apprentissage en ligne libre utilisée par des milliers d'établissements dans le monde."
        },
        {
            question: "Pourquoi former les enseignants au numérique libre est-il important ?",
            options: [
                "Ce n'est pas important",
                "Pour qu'ils puissent transmettre ces compétences et valeurs aux élèves",
                "Pour les évaluer",
                "Pour remplacer les livres"
            ],
            correctAnswer: 1,
            explanation: "Les enseignants formés peuvent utiliser et enseigner les outils libres, transmettant les compétences et l'esprit du partage aux élèves."
        },
        {
            question: "Qu'est-ce que le logiciel éducatif GCompris ?",
            options: [
                "Un antivirus",
                "Une suite de jeux éducatifs libres pour les 2-10 ans",
                "Un traitement de texte",
                "Un navigateur web"
            ],
            correctAnswer: 1,
            explanation: "GCompris est une suite éducative libre proposant plus de 100 activités pour les enfants de 2 à 10 ans (lecture, maths, sciences, etc.)."
        },
        {
            question: "Quel outil libre permet de créer des cours interactifs ?",
            options: [
                "PowerPoint uniquement",
                "H5P, OpenBoard, ou LibreOffice Impress",
                "Aucun outil libre n'existe",
                "Seulement des outils payants"
            ],
            correctAnswer: 1,
            explanation: "H5P crée du contenu interactif, OpenBoard est un tableau blanc numérique, et LibreOffice Impress permet des présentations."
        }
    ],
    privacy: [
        {
            question: "Qu'est-ce que le pistage publicitaire en ligne ?",
            options: [
                "Une publicité normale",
                "La collecte de données sur vos habitudes de navigation pour cibler les publicités",
                "Un virus informatique",
                "Un service gratuit"
            ],
            correctAnswer: 1,
            explanation: "Le pistage publicitaire suit vos activités en ligne via cookies et trackers pour créer un profil et afficher des publicités ciblées."
        },
        {
            question: "Pourquoi les GAFAM posent-ils problème pour les données scolaires ?",
            options: [
                "Ils sont trop chers",
                "Données stockées hors UE, modèle économique basé sur l'exploitation des données",
                "Ils sont trop lents",
                "Ils n'ont aucun problème"
            ],
            correctAnswer: 1,
            explanation: "Les GAFAM stockent les données hors de l'UE (Cloud Act), et leur modèle économique repose sur l'exploitation des données utilisateurs."
        },
        {
            question: "Qu'est-ce qu'un cookie tiers ?",
            options: [
                "Un gâteau",
                "Un fichier placé par un domaine différent de celui visité, souvent pour le pistage",
                "Un virus",
                "Une mise à jour"
            ],
            correctAnswer: 1,
            explanation: "Les cookies tiers sont déposés par des domaines externes (publicitaires, réseaux sociaux) pour suivre votre navigation entre sites."
        },
        {
            question: "Quel navigateur libre bloque les trackers par défaut ?",
            options: [
                "Google Chrome",
                "Firefox avec protection renforcée contre le pistage",
                "Microsoft Edge",
                "Safari"
            ],
            correctAnswer: 1,
            explanation: "Firefox propose une protection renforcée contre le pistage qui bloque automatiquement les trackers et cookies tiers."
        },
        {
            question: "Qu'est-ce que le droit à l'oubli numérique ?",
            options: [
                "Le droit de ne pas utiliser Internet",
                "Le droit de demander la suppression de ses données personnelles",
                "Le droit d'oublier son mot de passe",
                "Le droit de changer de navigateur"
            ],
            correctAnswer: 1,
            explanation: "Le RGPD garantit le droit de demander l'effacement de ses données personnelles aux entreprises qui les détiennent."
        },
        {
            question: "Qu'est-ce qu'un moteur de recherche respectueux de la vie privée ?",
            options: [
                "Google",
                "DuckDuckGo, Qwant, ou Startpage",
                "Bing",
                "Yahoo"
            ],
            correctAnswer: 1,
            explanation: "DuckDuckGo, Qwant et Startpage ne tracent pas les utilisateurs et ne créent pas de profils publicitaires."
        },
        {
            question: "Pourquoi chiffrer ses communications est-il important ?",
            options: [
                "Pour les rendre plus rapides",
                "Pour empêcher l'interception et la lecture par des tiers non autorisés",
                "Pour les rendre plus jolies",
                "Ce n'est pas important"
            ],
            correctAnswer: 1,
            explanation: "Le chiffrement de bout en bout garantit que seuls l'expéditeur et le destinataire peuvent lire les messages."
        },
        {
            question: "Quelle messagerie libre propose le chiffrement de bout en bout ?",
            options: [
                "Facebook Messenger",
                "Signal ou Element (Matrix)",
                "SMS standard",
                "Email classique"
            ],
            correctAnswer: 1,
            explanation: "Signal est une messagerie libre avec chiffrement de bout en bout. Element utilise le protocole Matrix, également libre et chiffré."
        },
        {
            question: "Qu'est-ce que la minimisation des données (RGPD) ?",
            options: [
                "Réduire la taille des fichiers",
                "Ne collecter que les données strictement nécessaires à l'objectif",
                "Supprimer toutes les données",
                "Compresser les données"
            ],
            correctAnswer: 1,
            explanation: "Le principe de minimisation impose de ne collecter que les données strictement nécessaires et de les conserver le moins longtemps possible."
        },
        {
            question: "Qu'est-ce que le profilage des utilisateurs ?",
            options: [
                "Créer un profil sur un réseau social",
                "Analyser les données pour prédire comportements, préférences et caractéristiques",
                "Prendre une photo de profil",
                "Mettre à jour son profil"
            ],
            correctAnswer: 1,
            explanation: "Le profilage utilise les données collectées pour créer un portrait détaillé de l'utilisateur et prédire ses comportements futurs."
        }
    ],
    hardware: [
        {
            question: "Qu'est-ce que l'obsolescence logicielle ?",
            options: [
                "Un bug dans un logiciel",
                "Quand un logiciel rend un matériel fonctionnel inutilisable",
                "Une mise à jour",
                "Un virus"
            ],
            correctAnswer: 1,
            explanation: "L'obsolescence logicielle survient quand les nouvelles versions d'un OS (ex: Windows 11) ne supportent plus le matériel encore fonctionnel."
        },
        {
            question: "Combien de temps Windows 11 est-il supposé être supporté sur un PC neuf de 2024 ?",
            options: [
                "À vie",
                "Jusqu'en 2027-2028 environ selon les versions",
                "1 an",
                "20 ans"
            ],
            correctAnswer: 1,
            explanation: "Microsoft met fin au support des versions Windows après quelques années, forçant les mises à jour ou le remplacement du matériel."
        },
        {
            question: "Pourquoi reconditionner plutôt qu'acheter neuf ?",
            options: [
                "C'est plus cher",
                "Réduit les déchets, économise les ressources et coûte moins cher",
                "C'est moins fiable",
                "Ce n'est pas possible"
            ],
            correctAnswer: 1,
            explanation: "Un ordinateur reconditionné évite la production de déchets, économise les ressources naturelles et coûte 30-70% moins cher."
        },
        {
            question: "Qu'est-ce qu'un ordinateur zombie ?",
            options: [
                "Un ordinateur hanté",
                "Un ordinateur fonctionnel rendu obsolète par le logiciel",
                "Un ordinateur très lent",
                "Un ordinateur piraté"
            ],
            correctAnswer: 1,
            explanation: "Un ordinateur zombie est un PC encore fonctionnel mais rendu inutilisable par les nouvelles versions de Windows ou autres logiciels."
        },
        {
            question: "Comment prolonger la vie d'un vieil ordinateur ?",
            options: [
                "Le jeter et en acheter un neuf",
                "Installer Linux, ajouter de la RAM ou un SSD",
                "Attendre qu'il tombe en panne",
                "Le laisser éteint"
            ],
            correctAnswer: 1,
            explanation: "Linux peut fonctionner sur du matériel ancien. Ajouter un SSD ou de la RAM peut considérablement améliorer les performances."
        },
        {
            question: "Qu'est-ce qu'un SSD ?",
            options: [
                "Un type de processeur",
                "Un disque de stockage rapide sans pièces mécaniques",
                "Un type de RAM",
                "Un câble réseau"
            ],
            correctAnswer: 1,
            explanation: "Un SSD (Solid State Drive) est un disque de stockage utilisant de la mémoire flash, beaucoup plus rapide qu'un disque dur classique."
        },
        {
            question: "Pourquoi Windows 11 ne fonctionne pas sur beaucoup d'ordinateurs récents ?",
            options: [
                "Ces ordinateurs sont trop puissants",
                "Microsoft exige une puce TPM 2.0 et des processeurs récents",
                "Ces ordinateurs sont défectueux",
                "Windows 11 n'existe pas encore"
            ],
            correctAnswer: 1,
            explanation: "Windows 11 requiert TPM 2.0, Secure Boot et des processeurs récents, excluant des millions de PC parfaitement fonctionnels."
        },
        {
            question: "Qu'est-ce que le droit à la réparation ?",
            options: [
                "Le droit de casser son ordinateur",
                "Le droit d'accéder aux pièces, outils et documentation pour réparer ses appareils",
                "Le droit de retourner un produit",
                "Le droit de demander un remboursement"
            ],
            correctAnswer: 1,
            explanation: "Le droit à la réparation exige que les fabricants fournissent pièces détachées, outils et documentation pour permettre la réparation."
        },
        {
            question: "Combien d'ordinateurs pourraient être sauvés par Linux en France suite à l'abandon de Windows 10 ?",
            options: [
                "Quelques milliers",
                "Des millions d'ordinateurs",
                "Aucun",
                "Seulement les Mac"
            ],
            correctAnswer: 1,
            explanation: "Environ 40% des PC français ne supportent pas Windows 11. Linux pourrait sauver des millions d'ordinateurs encore fonctionnels."
        },
        {
            question: "Qu'est-ce que la mémoire RAM ?",
            options: [
                "Le disque dur",
                "La mémoire vive utilisée pour les tâches en cours d'exécution",
                "Le processeur",
                "La carte graphique"
            ],
            correctAnswer: 1,
            explanation: "La RAM (Random Access Memory) est la mémoire temporaire où le système stocke les données des programmes en cours d'utilisation."
        }
    ]
}

// Fonction pour générer des questions basées sur le sujet
function generateFallbackQuestions(topic: string, count: number) {
    const topicLower = topic.toLowerCase()
    
    let selectedQuestions: typeof fallbackQuestions.default = []

    // Recherche de correspondances dans le sujet
    if (topicLower.includes("linux") || topicLower.includes("ubuntu") || topicLower.includes("système") || topicLower.includes("distribution")) {
        selectedQuestions = [...selectedQuestions, ...fallbackQuestions.linux]
    }
    if (topicLower.includes("sécurité") || topicLower.includes("securite") || topicLower.includes("protection") || topicLower.includes("chiffrement") || topicLower.includes("mot de passe") || topicLower.includes("firewall")) {
        selectedQuestions = [...selectedQuestions, ...fallbackQuestions.securite]
    }
    if (topicLower.includes("environnement") || topicLower.includes("écologie") || topicLower.includes("durable") || topicLower.includes("carbone") || topicLower.includes("recyclage") || topicLower.includes("déchet") || topicLower.includes("sobriété")) {
        selectedQuestions = [...selectedQuestions, ...fallbackQuestions.environnement]
    }
    if (topicLower.includes("libre") || topicLower.includes("open source") || topicLower.includes("opensource") || topicLower.includes("libreoffice") || topicLower.includes("firefox") || topicLower.includes("gimp") || topicLower.includes("vlc")) {
        selectedQuestions = [...selectedQuestions, ...fallbackQuestions.libre]
    }
    if (topicLower.includes("inclusion") || topicLower.includes("accessibilité") || topicLower.includes("handicap") || topicLower.includes("fracture") || topicLower.includes("égalité")) {
        selectedQuestions = [...selectedQuestions, ...fallbackQuestions.inclusion]
    }
    if (topicLower.includes("école") || topicLower.includes("education") || topicLower.includes("éducation") || topicLower.includes("enseignement") || topicLower.includes("élève") || topicLower.includes("cours") || topicLower.includes("formation")) {
        selectedQuestions = [...selectedQuestions, ...fallbackQuestions.education]
    }
    if (topicLower.includes("privacy") || topicLower.includes("vie privée") || topicLower.includes("rgpd") || topicLower.includes("données") || topicLower.includes("pistage") || topicLower.includes("gafam") || topicLower.includes("cookie")) {
        selectedQuestions = [...selectedQuestions, ...fallbackQuestions.privacy]
    }
    if (topicLower.includes("hardware") || topicLower.includes("matériel") || topicLower.includes("obsolescence") || topicLower.includes("reconditionné") || topicLower.includes("réparation") || topicLower.includes("windows") || topicLower.includes("ordinateur")) {
        selectedQuestions = [...selectedQuestions, ...fallbackQuestions.hardware]
    }

    // Si aucun sujet spécifique trouvé, utiliser les questions par défaut
    if (selectedQuestions.length === 0) {
        selectedQuestions = fallbackQuestions.default
    }

    // Mélanger et prendre le nombre demandé
    const shuffled = [...selectedQuestions].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, Math.min(count, shuffled.length))
}

export async function POST(request: NextRequest) {
    let body: { topic?: string; difficulty?: string; count?: number } = {}
    
    try {
        body = await request.json()
    } catch {
        body = { topic: "NIRD", count: 5 }
    }

    const { topic = "NIRD", difficulty = "medium", count = 5 } = body

    try {
        // Vérifier si OpenAI est configuré
        if (!process.env.OPENAI_API_KEY) {
            console.log("OpenAI API key not configured, using fallback questions")
            const questions = generateFallbackQuestions(topic, count)
            return NextResponse.json({ questions })
        }

        // Si OpenAI est configuré, utiliser l'API
        const OpenAI = (await import("openai")).default
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        })

        const prompt = `Génère ${count} questions de quiz sur le thème NIRD (Numérique Inclusif, Responsable et Durable) avec le sujet spécifique: "${topic}".

Niveau de difficulté: ${difficulty}

Pour chaque question, fournis:
1. La question
2. 4 options de réponse (A, B, C, D)
3. L'index de la réponse correcte (0-3)
4. Une explication détaillée de la réponse

Contexte NIRD:
- Numérique Inclusif: Accès égal aux technologies pour tous
- Responsable: Protection des données, sécurité, gouvernance transparente
- Durable: Sobriété numérique, réemploi du matériel, logiciels libres (Linux)

Réponds UNIQUEMENT avec un JSON valide dans ce format exact:
{
  "questions": [
    {
      "question": "Question ici?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Explication détaillée"
    }
  ]
}`

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content:
                        "Tu es un expert en NIRD (Numérique Inclusif, Responsable et Durable). Tu crées des questions de quiz éducatives et pertinentes. Réponds UNIQUEMENT avec du JSON valide, sans texte supplémentaire.",
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
            temperature: 0.8,
            max_tokens: 2000,
        })

        const responseText = completion.choices[0].message.content
        if (!responseText) {
            throw new Error("No response from OpenAI")
        }

        // Parse the JSON response (extract JSON even if wrapped in markdown code blocks)
        let jsonText = responseText.trim()
        
        // Remove markdown code blocks if present
        if (jsonText.startsWith("```json")) {
            jsonText = jsonText.replace(/^```json\s*/, "").replace(/\s*```$/, "")
        } else if (jsonText.startsWith("```")) {
            jsonText = jsonText.replace(/^```\s*/, "").replace(/\s*```$/, "")
        }
        
        // Try to extract JSON object if there's extra text
        const jsonMatch = jsonText.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
            jsonText = jsonMatch[0]
        }
        
        const data = JSON.parse(jsonText)

        return NextResponse.json(data)
    } catch (error) {
        console.error("Quiz generation error:", error)
        
        // Fallback en cas d'erreur
        const questions = generateFallbackQuestions(topic, count)
        return NextResponse.json({ questions })
    }
}
