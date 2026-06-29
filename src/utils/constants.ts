import type { ProductCategory, OrderStatus, PaymentMethod, Role, AuditAction } from '../types';

export const CATEGORIES: Record<ProductCategory, string> = {
  huile:    'Huile',
  riz:      'Riz',
  sucre:    'Sucre',
  the:      'Thé',
  vinaigre: 'Vinaigre',
  eau:      'Eau',
};

export const CATEGORY_COLORS: Record<ProductCategory, string> = {
  huile:    'bg-yellow-100 text-yellow-800',
  riz:      'bg-amber-100 text-amber-800',
  sucre:    'bg-pink-100 text-pink-800',
  the:      'bg-green-100 text-green-800',
  vinaigre: 'bg-purple-100 text-purple-800',
  eau:      'bg-cyan-100 text-cyan-800',
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  validee:    'Validée',
  en_attente: 'En attente',
  annulee:    'Annulée',
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  validee:    'bg-green-100 text-green-800',
  en_attente: 'bg-yellow-100 text-yellow-800',
  annulee:    'bg-red-100 text-red-800',
};

export const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  especes:      'Espèces',
  wave:         'Wave',
  orange_money: 'Orange Money',
  virement:     'Virement',
  autre:        'Autre',
};

export const ROLE_LABELS: Record<Role, string> = {
  admin:   'Administrateur',
  stock:   'Gestionnaire de Stock',
  vendeur: 'Vendeur / Caissier',
};

export const ROLE_COLORS: Record<Role, string> = {
  admin:   'bg-purple-100 text-purple-800',
  stock:   'bg-blue-100 text-blue-800',
  vendeur: 'bg-green-100 text-green-800',
};

export const AUDIT_ACTION_LABELS: Record<AuditAction, string> = {
  creation_produit:     'Produit créé',
  modification_produit: 'Produit modifié',
  suppression_produit:  'Produit supprimé',
  entree_stock:         'Entrée stock',
  sortie_stock:         'Sortie stock',
  vente_effectuee:      'Vente effectuée',
  commande_validee:     'Commande validée',
  commande_annulee:     'Commande annulée',
  creation_utilisateur: 'Utilisateur créé',
  modification_utilisateur: 'Utilisateur modifié',
  connexion:            'Connexion',
};
