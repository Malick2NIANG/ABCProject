# ABC J'adore — Système de Gestion Commerciale & Distribution

> Skeleton Frontend — Version Présentation Client  
> Client : **Aziz Business Company (ABC)** · Marque : **J'adore** · Pays : **Sénégal**

---

## Table des matières

1. [Contexte & Objectif](#1-contexte--objectif)
2. [Produits concernés](#2-produits-concernés)
3. [Rôles & Permissions](#3-rôles--permissions)
4. [Modules fonctionnels](#4-modules-fonctionnels)
5. [Architecture du projet](#5-architecture-du-projet)
6. [Stack technique](#6-stack-technique)
7. [Identité visuelle](#7-identité-visuelle)
8. [Démarrage rapide](#8-démarrage-rapide)
9. [Comptes de démonstration](#9-comptes-de-démonstration)
10. [Structure des fichiers](#10-structure-des-fichiers)
11. [Données mock](#11-données-mock)
12. [Roadmap — Vers la version complète](#12-roadmap--vers-la-version-complète)

---

## 1. Contexte & Objectif

**ABC Agroalimentaire** est une entreprise sénégalaise spécialisée dans la distribution de produits alimentaires sous la marque **J'adore**, fondée par **Aziz Ndiaye**.

### Problème identifié
L'entreprise gère ses stocks, ventes et commandes de manière dispersée (papier, Excel, appels téléphoniques). Cela génère des pertes, des ruptures non détectées, et une traçabilité insuffisante.

### Solution
Mise en place d'un **système de gestion commerciale et logistique centralisé**, couvrant :
- La gestion des stocks en temps réel
- Le suivi des commandes (physiques et à distance)
- La traçabilité complète de toutes les opérations
- La supervision de l'activité par la direction

### Ce dépôt
Ce projet est le **skeleton frontend** — un prototype interactif haute fidélité développé pour **présenter et valider l'expérience utilisateur avec le client ABC avant le développement complet du backend**.

Il fonctionne entièrement avec des **données mock** (aucun serveur requis) et simule l'ensemble des flux métier réels.

---

## 2. Produits concernés

| Catégorie | Produits |
|-----------|----------|
| Huile | J'adore 1L, J'adore 5L |
| Riz | J'adore 25kg, J'adore 5kg |
| Sucre | J'adore 1kg, J'adore 5kg |
| Thé | J'adore Menthe, J'adore Vert |
| Vinaigre | J'adore 1L |
| Eau | J'adore 1.5L, J'adore 5L |

---

## 3. Rôles & Permissions

Le système comporte **3 rôles distincts** avec des accès différenciés.

### Administrateur
- Accès complet à tous les modules
- Supervision des ventes, stocks, mouvements et commandes
- Gestion des utilisateurs (CRUD + réinitialisation mot de passe)
- Consultation de la piste d'audit complète
- Filtres avancés : par date, utilisateur, produit, type d'opération

### Gestionnaire de Stock
- Gestion du catalogue produits (CRUD)
- Enregistrement des entrées / sorties / réapprovisionnements
- Suivi des niveaux de stock et des alertes
- Historique des mouvements

### Vendeur / Caissier
- Terminal caisse interactif (vente physique)
- Gestion des commandes à distance
- Consultation de son propre historique de ventes
- Débit automatique du stock à chaque vente validée

---

## 4. Modules fonctionnels

### Authentification
- Page de connexion split-screen (formulaire + carrousel visuel)
- Accès démo rapide par rôle
- Notification flash "Mot de passe oublié" vers l'administrateur
- Routing protégé par rôle (`ProtectedRoute`)

### Tableau de bord
- KPIs temps réel : ventes du jour, commandes, produits actifs, alertes stock
- Graphique en barres des ventes hebdomadaires (Recharts)
- Liste des alertes stock bas / rupture
- Fil des commandes récentes et de l'activité récente

### Stock & Produits
- Table des produits avec images, catégories et indicateurs de stock
- CRUD produit complet (modal)
- Mouvements de stock : entrée, sortie, réapprovisionnement
- Mise à jour automatique des quantités après chaque mouvement
- Alerte bannière si produits sous le seuil critique

### Ventes & Commandes
- Sélecteur de canal : **Vente Physique** → Terminal Caisse | **Commande à Distance** → Liste commandes
- Terminal Caisse : grille produits avec images, panier interactif, quantités, total
- 5 modes de paiement : Espèces, Wave, Orange Money, Virement, Autre
- Débit stock automatique + création commande + log audit à chaque vente
- Gestion des commandes à distance : filtres, détail, annulation

### Traçabilité *(Admin uniquement)*
- Timeline chronologique de toutes les opérations
- Actions tracées : créations/modifications produits, mouvements stock, ventes, connexions, gestion utilisateurs
- Filtres : recherche texte, type d'action, plage de dates

### Gestion Utilisateurs *(Admin uniquement)*
- Liste des comptes avec rôle, statut actif/inactif, dernière connexion
- CRUD utilisateur complet
- Réinitialisation de mot de passe avec notification flash

---

## 5. Architecture du projet

### Principe de découpage
Le projet adopte une **architecture feature-slice** : chaque module fonctionnel est autonome dans son dossier `features/`. Les composants génériques vivent dans `components/`.

### Séparation des responsabilités (exemple : Auth)
```
features/auth/
├── AuthPage.tsx    → Conteneur pur (mise en page split-screen). Aucune logique.
├── Login.tsx       → Formulaire, validation, gestion des rôles, notifications flash.
└── AuthLogin.tsx   → Carrousel visuel animé (Framer Motion). Aucune logique métier.
```

Ce principe est appliqué dans tout le projet : **layout ≠ logique ≠ visuel**.

---

## 6. Stack technique

| Outil | Version | Usage |
|-------|---------|-------|
| React | 19 | UI |
| TypeScript | 5 | Typage strict |
| Vite | 6 | Bundler / Dev server |
| Tailwind CSS | 3 | Styling utility-first |
| React Router DOM | 6 | Routing + ProtectedRoute |
| Framer Motion | — | Animations carrousel |
| Recharts | — | Graphiques dashboard |
| Lucide React | — | Icônes |

---

## 7. Identité visuelle

### Palette de couleurs (brand J'adore)
| Token | Hex | Usage |
|-------|-----|-------|
| `brand-green` | `#4A8C2A` | Couleur principale (CTA, accents) |
| `brand-dark` | `#1E2A1A` | Sidebar, textes foncés |
| `brand-light` | `#6BAE3E` | Hover states |
| `brand-lime` | `#B5C830` | Fond logo, dégradés |
| `brand-gold` | `#C9A028` | Accent doré (J du logo) |
| `brand-cream` | `#F4F6F0` | Fond général de l'app |

### Assets brand
Tous les assets sont dans `public/images/` :
- `Logo.jpg` — Logo officiel J'adore (utilisé dans Sidebar + carrousel)
- `Aziz1.jpeg`, `Aziz2.jpeg`, `Aziz3.jpeg` — Photos du fondateur Aziz Ndiaye
- `Huile.jpg`, `Huile2.jpg` — Produit Huile J'adore
- `Riz.jpg` — Produit Riz J'adore
- `Sucre.jpeg`, `Sucre2.jpeg` — Produit Sucre J'adore
- `Thé.webp` — Produit Thé J'adore
- `Vinaigre.jpeg` — Produit Vinaigre J'adore
- `Eau.jpg` — Produit Eau J'adore

---

## 8. Démarrage rapide

### Prérequis
- Node.js ≥ 18
- npm ≥ 9

### Installation

```bash
# Cloner le projet
git clone <url-du-repo>
cd abc-jadoreproject

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

L'application est accessible sur **http://localhost:5173**

### Build production

```bash
npm run build
npm run preview
```

---

## 9. Comptes de démonstration

Aucun mot de passe n'est requis — utilisez le sélecteur "Accès démo rapide" sur la page de connexion, ou entrez directement un email ci-dessous avec n'importe quel mot de passe.

| Nom | Email | Rôle | Accès |
|-----|-------|------|-------|
| Mamadou Diallo | `admin@jadore.sn` | Administrateur | Tout |
| Fatou Ndiaye | `stock@jadore.sn` | Gestionnaire Stock | Stock + Ventes + Dashboard |
| Ibrahima Sow | `vendeur1@jadore.sn` | Vendeur | Ventes + Dashboard |
| Aissatou Fall | `vendeur2@jadore.sn` | Vendeur | Ventes + Dashboard |

---

## 10. Structure des fichiers

```
abc-jadoreproject/
├── public/
│   └── images/                     # Assets brand (logo, produits, photos Aziz)
│
├── src/
│   ├── assets/
│   │   └── index.css               # Tailwind + variables globales
│   │
│   ├── components/
│   │   ├── ui/                     # UI Kit générique réutilisable
│   │   │   ├── Button.tsx          # Variants : primary, secondary, danger, ghost, gold
│   │   │   ├── Card.tsx            # Carte avec ombre et bordure
│   │   │   ├── Table.tsx           # Table générique typée
│   │   │   ├── Badge.tsx           # Badge de statut/catégorie
│   │   │   └── Input.tsx           # Champ texte avec label et erreur
│   │   ├── layout/                 # Shell applicatif
│   │   │   ├── AppLayout.tsx       # Wrapper Sidebar + Topbar + <Outlet />
│   │   │   ├── Sidebar.tsx         # Navigation latérale (role-aware)
│   │   │   └── Topbar.tsx          # Barre supérieure (recherche, alertes, profil)
│   │   └── shared/                 # Composants transversaux
│   │       ├── AlertBanner.tsx     # Bannière info/success/warning/error
│   │       ├── ConfirmModal.tsx    # Modal de confirmation avec option danger
│   │       └── EmptyState.tsx      # État vide illustré
│   │
│   ├── context/
│   │   ├── AuthContext.tsx         # Auth state + login/logout + hasRole()
│   │   └── AppContext.tsx          # Produits, commandes, users, logs, mouvements
│   │
│   ├── features/
│   │   ├── auth/
│   │   │   ├── AuthPage.tsx        # Conteneur split-screen (layout only)
│   │   │   ├── Login.tsx           # Formulaire + logique + flash notifications
│   │   │   └── AuthLogin.tsx       # Carrousel visuel Framer Motion (visual only)
│   │   ├── dashboard/
│   │   │   ├── DashboardPage.tsx
│   │   │   └── components/
│   │   │       ├── KpiCard.tsx
│   │   │       ├── SalesChart.tsx
│   │   │       └── StockAlertList.tsx
│   │   ├── stock/
│   │   │   ├── StockPage.tsx
│   │   │   └── components/
│   │   │       ├── ProductTable.tsx
│   │   │       ├── ProductModal.tsx
│   │   │       └── MovementModal.tsx
│   │   ├── ventes/
│   │   │   ├── VentesPage.tsx
│   │   │   └── components/
│   │   │       ├── ChannelSelector.tsx
│   │   │       ├── OrderTable.tsx
│   │   │       ├── OrderDetails.tsx
│   │   │       ├── CashierTerminal.tsx
│   │   │       └── PaymentModal.tsx
│   │   ├── tracabilite/
│   │   │   ├── TracabilitePage.tsx
│   │   │   └── components/
│   │   │       ├── AuditTimeline.tsx
│   │   │       └── FilterBar.tsx
│   │   └── utilisateurs/
│   │       ├── UsersPage.tsx
│   │       └── components/
│   │           ├── UserTable.tsx
│   │           └── UserModal.tsx
│   │
│   ├── hooks/
│   │   ├── useAuth.ts              # Re-export de useAuth (depuis AuthContext)
│   │   ├── useBasket.ts            # Panier caisse : add, remove, update, clear, total
│   │   └── useFilters.ts           # Hook générique de filtrage avec state
│   │
│   ├── routes/
│   │   ├── AppRouter.tsx           # BrowserRouter + toutes les routes
│   │   └── ProtectedRoute.tsx      # Guard : redirige si non authentifié ou mauvais rôle
│   │
│   ├── types/
│   │   └── index.ts                # Product, Order, User, AuditLog, BasketItem...
│   │
│   ├── utils/
│   │   ├── constants.ts            # Labels et couleurs par catégorie, statut, rôle
│   │   ├── formatters.ts           # formatCurrency (XOF), formatDate, formatDateTime
│   │   └── mockData.ts             # Données de démo réalistes (contexte sénégalais)
│   │
│   ├── App.tsx                     # AuthProvider > AppProvider > AppRouter
│   └── main.tsx                    # Point d'entrée React
│
├── tailwind.config.js              # Couleurs brand + font Inter
├── tsconfig.json
├── vite.config.ts
└── package.json
```

---

## 11. Données mock

Toutes les données de démonstration se trouvent dans `src/utils/mockData.ts`. Elles sont volontairement **réalistes et contextualisées** (noms sénégalais, prix en FCFA, clients locaux).

### Produits
11 produits pré-chargés couvrant les 6 catégories, chacun avec image, prix, quantité et seuil d'alerte.

### Commandes
5 commandes de démonstration avec statuts variés (validée, en attente, annulée), les deux canaux (physique/distance) et plusieurs modes de paiement.

### Audit
8 entrées de traçabilité couvrant tous les types d'actions possibles.

### Persistance
Les données sont maintenues en mémoire React (via `AppContext`). Toute action (vente, mouvement stock, création utilisateur) se reflète immédiatement dans l'interface — **mais est perdue au rechargement de la page**. C'est le comportement attendu pour un skeleton de présentation.

---

## 12. Roadmap — Vers la version complète

Ce skeleton est la **phase 1** du projet. Voici ce qui sera nécessaire pour la version production :

### Backend à développer
- [ ] API REST (Node.js / Django / Laravel — à définir)
- [ ] Base de données (PostgreSQL recommandé)
- [ ] Authentification JWT sécurisée
- [ ] Gestion des sessions et refresh tokens

### Remplacer les mocks par de vraies API
- [ ] Remplacer `mockData.ts` par des appels API (React Query recommandé)
- [ ] Remplacer `AuthContext` par une auth JWT réelle
- [ ] Persister les données (produits, commandes, mouvements, logs)

### Fonctionnalités complémentaires
- [ ] Export PDF des commandes et rapports
- [ ] Notifications push (alertes stock bas en temps réel)
- [ ] Gestion multi-dépôts
- [ ] Module de facturation
- [ ] Application mobile (React Native — partage de types et logique possible)

### Infrastructure
- [ ] Déploiement (Vercel / VPS Sénégal)
- [ ] Domaine personnalisé ABC
- [ ] Configuration HTTPS

---

## Contributeurs

| Rôle | Contact |
|------|---------|
| Client / Propriétaire produit | Aziz Ndiaye — ABC Agroalimentaire |
| Développement & Architecture | SSD Consulting |

---

*Dernière mise à jour : Mai 2026 — Version skeleton frontend v1.0*
