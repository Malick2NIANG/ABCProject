import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import type { Product, ProductCategory } from '../../../types';
import { CATEGORIES } from '../../../utils/constants';

interface Props {
  open: boolean;
  product: Product | null;
  onSave: (data: Omit<Product, 'id'>) => void;
  onClose: () => void;
}

const EMPTY: Omit<Product, 'id'> = {
  nom: '',
  categorie: 'huile',
  prix: 0,
  quantite: 0,
  seuilAlerte: 20,
  unite: 'unités',
};

export function ProductModal({ open, product, onSave, onClose }: Props) {
  const [form, setForm] = useState<Omit<Product, 'id'>>(EMPTY);

  useEffect(() => {
    setForm(product ? { nom: product.nom, categorie: product.categorie, prix: product.prix, quantite: product.quantite, seuilAlerte: product.seuilAlerte, unite: product.unite } : EMPTY);
  }, [product, open]);

  if (!open) return null;

  function set(field: string, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave(form);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-brand-dark">
            {product ? 'Modifier le produit' : 'Nouveau produit'}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <Input
            label="Nom du produit"
            value={form.nom}
            onChange={(e) => set('nom', e.target.value)}
            placeholder="Ex: Huile J'adore 1L"
            required
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-brand-dark">Catégorie</label>
            <select
              value={form.categorie}
              onChange={(e) => set('categorie', e.target.value as ProductCategory)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/40"
            >
              {(Object.entries(CATEGORIES) as [ProductCategory, string][]).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Prix (FCFA)"
              type="number"
              min={0}
              value={form.prix}
              onChange={(e) => set('prix', Number(e.target.value))}
              required
            />
            <Input
              label="Unité"
              value={form.unite}
              onChange={(e) => set('unite', e.target.value)}
              placeholder="bouteilles"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Quantité en stock"
              type="number"
              min={0}
              value={form.quantite}
              onChange={(e) => set('quantite', Number(e.target.value))}
              required
            />
            <Input
              label="Seuil d'alerte"
              type="number"
              min={0}
              value={form.seuilAlerte}
              onChange={(e) => set('seuilAlerte', Number(e.target.value))}
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" type="button" onClick={onClose}>Annuler</Button>
            <Button type="submit">{product ? 'Enregistrer' : 'Créer le produit'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
