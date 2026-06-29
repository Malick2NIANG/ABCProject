import { Pencil, Trash2, ArrowUpDown } from 'lucide-react';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import type { Product } from '../../../types';
import { CATEGORIES, CATEGORY_COLORS } from '../../../utils/constants';
import { formatCurrency } from '../../../utils/formatters';

interface Props {
  products: Product[];
  onEdit: (p: Product) => void;
  onDelete: (p: Product) => void;
  onMovement: (p: Product) => void;
}

export function ProductTable({ products, onEdit, onDelete, onMovement }: Props) {
  const columns = [
    {
      key: 'nom',
      header: 'Produit',
      render: (p: Product) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-brand-cream flex-shrink-0">
            {p.image ? (
              <img
                src={p.image}
                alt={p.nom}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : null}
          </div>
          <div>
            <p className="font-medium text-brand-dark">{p.nom}</p>
            <Badge className={`mt-0.5 ${CATEGORY_COLORS[p.categorie]}`}>
              {CATEGORIES[p.categorie]}
            </Badge>
          </div>
        </div>
      ),
    },
    {
      key: 'prix',
      header: 'Prix unitaire',
      render: (p: Product) => (
        <span className="font-semibold text-brand-dark">{formatCurrency(p.prix)}</span>
      ),
    },
    {
      key: 'stock',
      header: 'Stock',
      render: (p: Product) => (
        <div className="flex items-center gap-2">
          <span className={`font-bold ${p.quantite === 0 ? 'text-red-600' : p.quantite <= p.seuilAlerte ? 'text-orange-500' : 'text-brand-dark'}`}>
            {p.quantite}
          </span>
          <span className="text-xs text-gray-400">{p.unite}</span>
          {p.quantite <= p.seuilAlerte && (
            <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-medium">
              {p.quantite === 0 ? 'Rupture' : 'Bas'}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'seuil',
      header: 'Seuil',
      render: (p: Product) => <span className="text-sm text-gray-400">{p.seuilAlerte} {p.unite}</span>,
    },
    {
      key: 'actions',
      header: '',
      render: (p: Product) => (
        <div className="flex items-center gap-1 justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => { e.stopPropagation(); onMovement(p); }}
            title="Mouvement stock"
          >
            <ArrowUpDown size={14} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => { e.stopPropagation(); onEdit(p); }}
            title="Modifier"
          >
            <Pencil size={14} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => { e.stopPropagation(); onDelete(p); }}
            title="Supprimer"
            className="hover:text-red-600"
          >
            <Trash2 size={14} />
          </Button>
        </div>
      ),
    },
  ];

  return <Table columns={columns} data={products} emptyMessage="Aucun produit trouvé" />;
}
