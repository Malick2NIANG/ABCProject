import { useState, useCallback } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { AlertBanner } from '../../components/shared/AlertBanner';
import { ConfirmModal } from '../../components/shared/ConfirmModal';
import { ProductTable } from './components/ProductTable';
import { ProductModal } from './components/ProductModal';
import { MovementModal } from './components/MovementModal';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useFilters } from '../../hooks/useFilters';
import type { Product, MouvementType } from '../../types';
import { CATEGORIES } from '../../utils/constants';

export function StockPage() {
  const { products, setProducts, addMouvement, addAuditLog, lowStockProducts } = useApp();
  const { currentUser } = useAuth();

  const [productModal, setProductModal] = useState<{ open: boolean; product: Product | null }>({ open: false, product: null });
  const [movementModal, setMovementModal] = useState<{ open: boolean; product: Product | null }>({ open: false, product: null });
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [catFilter, setCatFilter] = useState('');

  const filterFn = useCallback(
    (p: Product, f: { search: string }) => {
      const matchSearch = p.nom.toLowerCase().includes(f.search.toLowerCase());
      const matchCat = catFilter === '' || p.categorie === catFilter;
      return matchSearch && matchCat;
    },
    [catFilter]
  );

  const { filters, setFilter, filtered } = useFilters(products, filterFn);

  function handleSaveProduct(data: Omit<Product, 'id'>) {
    if (productModal.product) {
      setProducts((prev) => prev.map((p) => p.id === productModal.product!.id ? { ...p, ...data } : p));
      addAuditLog({ action: 'modification_produit', utilisateurId: currentUser!.id, utilisateurNom: `${currentUser!.prenom} ${currentUser!.nom}`, detail: `Produit modifié : ${data.nom}`, produitId: productModal.product.id });
    } else {
      const newProduct: Product = { ...data, id: `p${Date.now()}` };
      setProducts((prev) => [...prev, newProduct]);
      addAuditLog({ action: 'creation_produit', utilisateurId: currentUser!.id, utilisateurNom: `${currentUser!.prenom} ${currentUser!.nom}`, detail: `Produit créé : ${data.nom}` });
    }
    setProductModal({ open: false, product: null });
  }

  function handleDelete() {
    if (!deleteTarget) return;
    setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    addAuditLog({ action: 'suppression_produit', utilisateurId: currentUser!.id, utilisateurNom: `${currentUser!.prenom} ${currentUser!.nom}`, detail: `Produit supprimé : ${deleteTarget.nom}` });
    setDeleteTarget(null);
  }

  function handleMovement(type: MouvementType, quantite: number, note: string) {
    const p = movementModal.product!;
    addMouvement({ produitId: p.id, produitNom: p.nom, type, quantite, utilisateurId: currentUser!.id, utilisateurNom: `${currentUser!.prenom} ${currentUser!.nom}`, note });
    addAuditLog({ action: type === 'sortie' ? 'sortie_stock' : 'entree_stock', utilisateurId: currentUser!.id, utilisateurNom: `${currentUser!.prenom} ${currentUser!.nom}`, detail: `${type === 'sortie' ? 'Sortie' : 'Entrée'} ${quantite} ${p.unite} — ${p.nom}`, produitId: p.id });
    setMovementModal({ open: false, product: null });
  }

  return (
    <div className="space-y-5">
      {lowStockProducts.length > 0 && (
        <AlertBanner
          type="warning"
          message={`${lowStockProducts.length} produit(s) sous le seuil d'alerte : ${lowStockProducts.map((p) => p.nom).join(', ')}`}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-brand-dark">{filtered.length} produit(s)</h2>
          <p className="text-sm text-gray-400">Catalogue J'adore</p>
        </div>
        <Button onClick={() => setProductModal({ open: true, product: null })}>
          <Plus size={16} /> Nouveau produit
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-48">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={filters.search}
              onChange={(e) => setFilter('search', e.target.value)}
              placeholder="Rechercher un produit..."
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-green/30"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-gray-400" />
            <select
              value={catFilter}
              onChange={(e) => setCatFilter(e.target.value)}
              className="text-sm rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green/30"
            >
              <option value="">Toutes catégories</option>
              {Object.entries(CATEGORIES).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card padding={false}>
        <ProductTable
          products={filtered}
          onEdit={(p) => setProductModal({ open: true, product: p })}
          onDelete={(p) => setDeleteTarget(p)}
          onMovement={(p) => setMovementModal({ open: true, product: p })}
        />
      </Card>

      <ProductModal
        open={productModal.open}
        product={productModal.product}
        onSave={handleSaveProduct}
        onClose={() => setProductModal({ open: false, product: null })}
      />
      <MovementModal
        open={movementModal.open}
        product={movementModal.product}
        onSave={handleMovement}
        onClose={() => setMovementModal({ open: false, product: null })}
      />
      <ConfirmModal
        open={!!deleteTarget}
        title="Supprimer le produit"
        message={`Voulez-vous vraiment supprimer "${deleteTarget?.nom}" ? Cette action est irréversible.`}
        confirmLabel="Supprimer"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
