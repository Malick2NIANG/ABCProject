import { AlertTriangle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { useApp } from '../../../context/AppContext';
import { CATEGORIES } from '../../../utils/constants';

export function StockAlertList() {
  const { lowStockProducts } = useApp();

  return (
    <Card padding={false}>
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
        <div className="flex items-center gap-2">
          <AlertTriangle size={16} className="text-red-500" />
          <h3 className="font-semibold text-brand-dark text-sm">Alertes Stock</h3>
          {lowStockProducts.length > 0 && (
            <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">
              {lowStockProducts.length}
            </span>
          )}
        </div>
        <Link to="/stock" className="text-xs text-brand-green hover:underline flex items-center gap-1">
          Voir stock <ArrowRight size={12} />
        </Link>
      </div>

      <div className="divide-y divide-gray-50">
        {lowStockProducts.length === 0 ? (
          <p className="px-5 py-6 text-sm text-gray-400 text-center">Tous les stocks sont suffisants</p>
        ) : (
          lowStockProducts.slice(0, 6).map((p) => (
            <div key={p.id} className="flex items-center justify-between px-5 py-3">
              <div>
                <p className="text-sm font-medium text-brand-dark">{p.nom}</p>
                <p className="text-xs text-gray-400">{CATEGORIES[p.categorie]}</p>
              </div>
              <div className="text-right">
                <p className={`text-sm font-bold ${p.quantite === 0 ? 'text-red-600' : 'text-orange-500'}`}>
                  {p.quantite} {p.unite}
                </p>
                <p className="text-xs text-gray-400">Seuil : {p.seuilAlerte}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
