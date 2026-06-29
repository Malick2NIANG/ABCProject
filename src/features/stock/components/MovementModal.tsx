import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import type { Product, MouvementType } from '../../../types';

interface Props {
  open: boolean;
  product: Product | null;
  onSave: (type: MouvementType, quantite: number, note: string) => void;
  onClose: () => void;
}

const MOVEMENT_TYPES: { value: MouvementType; label: string; color: string }[] = [
  { value: 'entree',           label: 'Entrée',            color: 'bg-green-100 text-green-700 border-green-300' },
  { value: 'sortie',           label: 'Sortie',            color: 'bg-red-100 text-red-700 border-red-300' },
  { value: 'reapprovisionnement', label: 'Réapprovisionnement', color: 'bg-blue-100 text-blue-700 border-blue-300' },
];

export function MovementModal({ open, product, onSave, onClose }: Props) {
  const [type, setType] = useState<MouvementType>('entree');
  const [quantite, setQuantite] = useState(1);
  const [note, setNote] = useState('');

  if (!open || !product) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave(type, quantite, note);
    setQuantite(1);
    setNote('');
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h3 className="font-semibold text-brand-dark">Mouvement de stock</h3>
            <p className="text-xs text-gray-400">{product.nom}</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Type selector */}
          <div>
            <label className="text-sm font-medium text-brand-dark block mb-2">Type de mouvement</label>
            <div className="flex gap-2">
              {MOVEMENT_TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setType(t.value)}
                  className={`flex-1 py-2 px-2 rounded-lg border text-xs font-medium transition-all ${
                    type === t.value ? t.color + ' border-current' : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-brand-cream rounded-lg p-3 text-sm">
            <span className="text-gray-500">Stock actuel :</span>
            <span className="font-bold text-brand-dark ml-2">{product.quantite} {product.unite}</span>
          </div>

          <Input
            label={`Quantité (${product.unite})`}
            type="number"
            min={1}
            max={type === 'sortie' ? product.quantite : undefined}
            value={quantite}
            onChange={(e) => setQuantite(Number(e.target.value))}
            required
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-brand-dark">Note (optionnel)</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              placeholder="Motif, référence livraison..."
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/40 resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <Button variant="ghost" type="button" onClick={onClose}>Annuler</Button>
            <Button type="submit">Enregistrer</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
