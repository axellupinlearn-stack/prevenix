# PREVENIX ASSURANCES — SITE WEB OFFICIEL & ESPACE ADMINISTRATEUR

Plateforme web vitrine haut de gamme, moderne, immersive et entièrement administrable conçue pour **PREVENIX**, Société de Courtage d'Assurances en Côte d'Ivoire.

---

## 🌟 Identité de la Marque

- **Nom :** PREVENIX
- **Dénomination :** Société de Courtage d'Assurances (Assurances Internationales)
- **Slogan officiel :** *« Votre meilleure assurance, c'est votre courtier. »*
- **Téléphones :** `08 84 97 25` / `03 43 43 25`
- **Adresse :** Cocody Angré Djibi, 100 m avant la station Shell, Abidjan, Côte d'Ivoire.
- **Charte graphique respectée :**
  - Bleu marine profond : `#07164D`
  - Bleu moderne : `#2584B2`
  - Blanc : `#FFFFFF`
  - Gris très clair : `#F5F8FC`
  - Rouge : `#D92332`

---

## 🚀 Fonctionnalités Clés

### 1. Site Public Premium
- **Header & Navigation Sticky :** Effet glassmorphism au défilement, numéros d'appel direct, accès direct WhatsApp et bouton de demande de devis. Menu mobile optimisé avec tiroir fluide.
- **Hero Section Spectaculaire :** Intégration des visuels officiels (famille africaine épanouie, conseillers professionnels), mise en valeur du slogan officiel, sélecteur express interactif et badges de réassurance.
- **Section Confiance (4 Valeurs) :** Proximité, Accompagnement, Conseil, Confiance.
- **Solutions d'Assurance Dynamiques :** Automobile (Offre ZEN), Santé & Famille, Habitation & Biens, Vie & Prévoyance, Entreprise & Professionnelle, Autres Solutions. Chaque carte propose un tiroir modal détaillé avec demande de devis pré-remplie.
- **Section Comparateur & Piliers :** Basée sur l'affiche officielle (1. La meilleure assurance, 2. Le meilleur Prix/Garanties, 3. La meilleure prestation sinistre, 4. Le meilleur suivi) avec tableau comparatif interactif.
- **Section À Propos :** Présentation de l'institution, mission, vision, engagements et rôle d'indépendance du courtier en Côte d'Ivoire.
- **Magazine Actualités & Conseils :** Articles éducatifs et guides pratiques, filtrables par catégorie avec lecteur immersif et pages dédiées SEO (`/actualites/[slug]`).
- **Galerie Photos & Vidéos :** Filtres interactifs (Tout, Photos, Vidéos, Affiches de Campagnes, Événements), visionneuse photo lightbox et lecteur vidéo YouTube intégré.
- **Formulaires Fonctionnels & Connectés :** Formulaire de devis comparatif et formulaire de contact direct connectés à la base de données.
- **Bouton WhatsApp Flottant :** Widget interactif avec raccourcis de messages pré-remplis pour un contact immédiat.
- **Footer Institutionnel :** Informations légales, politique de confidentialité, coordonnées, réseaux sociaux et copyright dynamique.

---

### 2. Espace Administrateur Autonome (`/admin`)

Accès sécurisé pour permettre à la direction de PREVENIX de gérer 100% du site sans toucher au code :
- **URL d'accès :** `/admin/login` ou `/admin`
- **Aucun identifiant par défaut :** l'accès administrateur reste désactivé tant que les variables d'environnement obligatoires ne sont pas définies.
- L'authentification est vérifiée côté serveur et utilise un cookie de session signé, `HttpOnly`, `SameSite=Strict` et `Secure` en production.
- Les routes de consultation des demandes et messages, de modification du site et de téléversement sont protégées côté serveur.

#### Modules d'Administration Inclus :
1. **Tableau de Bord :** Indicateurs clés en temps réel (nombre de devis, messages, articles, photos et vidéos) et flux d'activité récente.
2. **Gestion des Devis (Leads) :** Consultation des demandes de devis, coordonnées complètes, mise à jour du statut (*Nouveau*, *En cours*, *Traité*), notes de suivi, suppression et export au format CSV.
3. **Gestion des Messages de Contact :** Boîte de réception des messages avec changement de statut et raccourcis d'appel ou d'envoi d'e-mail.
4. **Gestion des Actualités :** Création, modification, brouillon/publication, upload d'image de couverture, catégories et contenu riche Markdown.
5. **Gestion des Solutions d'Assurance :** Ajout, modification des garanties, activation/masquage sur le site public, upload d'image et gestion de l'ordre d'affichage.
6. **Gestion des Médias :** Ajout de photos, vidéos YouTube, affiches de campagne avec titre, catégorie et description.
7. **Paramètres Généraux du Site :** Modification immédiate du logo, slogan, numéros de téléphone, WhatsApp, e-mail, adresse géographique, textes d'accueil, textes À Propos et liens vers les réseaux sociaux.

---

## 🛠️ Stack Technique

- **Framework :** Next.js 14 (App Router) avec TypeScript
- **Styling :** Tailwind CSS avec palette sur mesure PREVENIX
- **Icônes :** Lucide React
- **Persistance des Données :**
  - **Développement local :** Moteur JSON dans `data/db.json`.
  - **Production/Vercel :** Supabase Postgres pour les paramètres, solutions, articles, devis et messages; Supabase Storage pour les images téléversées.
  - Le schéma, les politiques RLS et le bucket de stockage sont définis dans `supabase/schema.sql`.
- **SEO & Performance :** Balises OpenGraph, Twitter Cards, Sitemap XML dynamique (`/sitemap.xml`), Robots.txt (`/robots.txt`) et données structurées JSON-LD `InsuranceAgency`.

---

## 💻 Démarrage Rapide

Pour développer en local, copiez `.env.example` vers `.env.local`. Le stockage JSON local est utilisé en mode développement. Pour Vercel, créez un projet Supabase et exécutez `supabase/schema.sql` dans son éditeur SQL. Ajoutez ensuite dans Vercel (Settings → Environment Variables) les variables `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_SECRET_KEY`, `ADMIN_DEFAULT_EMAIL` et `ADMIN_DEFAULT_PASSWORD`, puis redéployez. La clé `SUPABASE_SERVICE_ROLE_KEY` doit rester secrète et ne jamais porter le préfixe `NEXT_PUBLIC_`.

`ADMIN_SECRET_KEY` doit être une clé aléatoire d'au moins 32 caractères; `ADMIN_DEFAULT_PASSWORD` doit en contenir au moins 12. Sans variables d'administration valides, le Studio reste désactivé. Sans configuration Supabase, le build peut se terminer, mais les API de données de production refusent les opérations au lieu d'écrire dans le système de fichiers éphémère de Vercel.

Les demandes de devis et messages de démonstration contenant des données personnelles ne sont pas inclus dans les nouvelles bases. `data/db.json` et les téléversements locaux de `public/uploads/` sont ignorés par Git; en production, les images sont stockées dans le bucket Supabase `prevenix-uploads`.

### 1. Démarrer le serveur de développement :
```bash
npm run dev
```
Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

### 2. Compiler et démarrer en production :
```bash
npm run build
npm start
```

---

## 📁 Architecture du Projet

```
prevenix/
├── app/
│   ├── actualites/[slug]/page.tsx   # Page dédiée pour chaque article
│   ├── admin/
│   │   ├── login/page.tsx           # Page de connexion sécurisée
│   │   └── page.tsx                 # Dashboard administrateur complet
│   ├── api/                         # Routes API REST (CRUD réel)
│   │   ├── admin/login/route.ts
│   │   ├── admin/logout/route.ts
│   │   ├── admin/session/route.ts
│   │   ├── admin/stats/route.ts
│   │   ├── articles/route.ts
│   │   ├── media/route.ts
│   │   ├── messages/route.ts
│   │   ├── quotes/route.ts
│   │   ├── settings/route.ts
│   │   ├── solutions/route.ts
│   │   └── upload/route.ts
│   ├── layout.tsx                   # Layout global avec balises SEO & JSON-LD
│   ├── page.tsx                     # Landing page vitrine PREVENIX
│   ├── robots.ts                    # Configuration robots.txt
│   └── sitemap.ts                   # Générateur sitemap.xml
├── components/                      # Composants UI modulaires
│   ├── AboutSection.tsx
│   ├── ComparatorPillars.tsx
│   ├── ContactQuoteSection.tsx
│   ├── FinalCta.tsx
│   ├── Footer.tsx
│   ├── HeroSection.tsx
│   ├── InsuranceSolutions.tsx
│   ├── MediaGallery.tsx
│   ├── Navbar.tsx
│   ├── NewsSection.tsx
│   ├── PrevenixLogo.tsx
│   ├── QuoteModal.tsx
│   └── WhatsAppFloatingButton.tsx
├── data/
│   └── db.json                      # Base de données persistante
├── lib/
│   ├── admin-auth.ts               # Vérification serveur et sessions signées
│   ├── db.ts                        # Couche d'accès aux données (CRUD)
│   ├── initial-data.ts              # Données de démarrage officielles
│   ├── types.ts                     # Définitions TypeScript
│   └── utils.ts                     # Fonctions utilitaires
├── public/
│   ├── images/
│   │   ├── logo.png                 # Logo officiel extrait
│   │   ├── logo-transparent.png     # Logo officiel transparent
│   │   ├── campaigns/               # Affiches publicitaires officielles
│   │   └── hero/                    # Photographies optimisées (famille, pro)
│   └── uploads/                     # Dossier d'upload des médias administrateur
├── supabase/
│   └── schema.sql                   # Schéma de migration Supabase avec RLS
├── .env.example                     # Exemple de variables d'environnement
├── tailwind.config.js               # Configuration Tailwind avec charte PREVENIX
└── package.json
```
