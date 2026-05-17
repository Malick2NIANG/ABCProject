# ABCProject — Système de Gestion J'adore

> Plateforme de gestion interne pour **ABC Agroalimentaire** — marque **J'adore**  
> Fondateur : Aziz Ndiaye | Développé par **SSD Consulting**

---

## À propos

ABCProject est le système d'information centralisé de la société **ABC Agroalimentaire** (Aziz Business Company), distributeur de la marque **J'adore** au Sénégal.

Il couvre l'ensemble des opérations métier : gestion des stocks, ventes, traçabilité et administration des utilisateurs, avec un contrôle d'accès par rôle.

---

## Branches

| Branche | Rôle |
|---------|------|
| `main` | Produit fini — versions stables uniquement |
| `develop` | Développement actif — skeleton et nouvelles fonctionnalités |

> Aucun merge direct sur `main`. Toute fonctionnalité passe par `develop` puis une Pull Request validée.

---

## Modules

- **Authentification** — Login sécurisé, mot de passe oublié avec validation admin
- **Tableau de bord** — KPIs, graphiques, alertes stock, activité récente
- **Stock & Produits** — Catalogue, mouvements, seuils d'alerte
- **Ventes & Commandes** — Terminal caisse, commandes distance, 5 modes de paiement
- **Traçabilité** — Journal d'audit complet avec filtres
- **Utilisateurs** — Gestion des comptes et des rôles

---

## Rôles

| Rôle | Accès |
|------|-------|
| **Admin** | Accès complet à tous les modules |
| **Gestionnaire de stock** | Stock, ventes, tableau de bord |
| **Vendeur / Caissier** | Ventes et tableau de bord uniquement |

---

## Stack technique

- **Frontend** : React 19 + TypeScript + Vite
- **Style** : Tailwind CSS v3 (charte J'adore)
- **Animations** : Framer Motion
- **Graphiques** : Recharts
- **Icons** : Lucide React
- **Routing** : React Router DOM v7

---

## Développé par

**SSD Consulting** — © 2026  
Pour le compte de **ABC Agroalimentaire / J'adore**
