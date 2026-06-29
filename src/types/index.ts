export type Role = 'admin' | 'stock' | 'vendeur';

export type ProductCategory =
  | 'huile'
  | 'riz'
  | 'sucre'
  | 'the'
  | 'vinaigre'
  | 'eau';

export interface Product {
  id: string;
  nom: string;
  categorie: ProductCategory;
  prix: number;
  quantite: number;
  seuilAlerte: number;
  unite: string;
  image?: string;
}

export type MouvementType = 'entree' | 'sortie' | 'reapprovisionnement';

export interface MouvementStock {
  id: string;
  produitId: string;
  produitNom: string;
  type: MouvementType;
  quantite: number;
  date: string;
  utilisateurId: string;
  utilisateurNom: string;
  note?: string;
}

export type OrderStatus = 'validee' | 'en_attente' | 'annulee';
export type OrderChannel = 'physique' | 'distance';
export type PaymentMethod = 'especes' | 'wave' | 'orange_money' | 'virement' | 'autre';

export interface OrderItem {
  produitId: string;
  produitNom: string;
  quantite: number;
  prixUnitaire: number;
}

export interface Order {
  id: string;
  numero: string;
  client: string;
  vendeurId: string;
  vendeurNom: string;
  articles: OrderItem[];
  montantTotal: number;
  statut: OrderStatus;
  canal: OrderChannel;
  modePaiement: PaymentMethod;
  date: string;
}

export interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  role: Role;
  actif: boolean;
  dateCreation: string;
  derniereConnexion?: string;
  telephone?: string;
}

export type AuditAction =
  | 'creation_produit'
  | 'modification_produit'
  | 'suppression_produit'
  | 'entree_stock'
  | 'sortie_stock'
  | 'vente_effectuee'
  | 'commande_validee'
  | 'commande_annulee'
  | 'creation_utilisateur'
  | 'modification_utilisateur'
  | 'connexion';

export interface AuditLog {
  id: string;
  action: AuditAction;
  utilisateurId: string;
  utilisateurNom: string;
  detail: string;
  date: string;
  produitId?: string;
  orderId?: string;
}

export interface PasswordResetRequest {
  id: string;
  email: string;
  date: string;
  status: 'en_attente' | 'validee';
  tempPassword?: string;
}

export interface BasketItem {
  produit: Product;
  quantite: number;
}

export interface KpiData {
  label: string;
  value: string | number;
  evolution?: number;
  icon: string;
}
