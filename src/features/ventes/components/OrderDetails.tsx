import { X, Package } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import type { Order } from '../../../types';
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS, PAYMENT_LABELS } from '../../../utils/constants';
import { formatCurrency, formatDateTime } from '../../../utils/formatters';
import { useApp } from '../../../context/AppContext';
import { useAuth } from '../../../context/AuthContext';

interface Props {
  order: Order | null;
  onClose: () => void;
}

export function OrderDetails({ order, onClose }: Props) {
  const { setOrders, addAuditLog } = useApp();
  const { currentUser } = useAuth();

  if (!order) return null;

  function annulerCommande() {
    setOrders((prev) => prev.map((o) => o.id === order!.id ? { ...o, statut: 'annulee' } : o));
    addAuditLog({
      action: 'commande_annulee',
      utilisateurId: currentUser!.id,
      utilisateurNom: `${currentUser!.prenom} ${currentUser!.nom}`,
      detail: `Commande ${order!.numero} annulée`,
      orderId: order!.id,
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white">
          <div>
            <h3 className="font-semibold text-brand-dark">{order.numero}</h3>
            <p className="text-xs text-gray-400">{formatDateTime(order.date)}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={ORDER_STATUS_COLORS[order.statut]}>
              {ORDER_STATUS_LABELS[order.statut]}
            </Badge>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg ml-2">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* Meta */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400 text-xs mb-0.5">Client</p>
              <p className="font-medium text-brand-dark">{order.client}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-0.5">Vendeur</p>
              <p className="font-medium text-brand-dark">{order.vendeurNom}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-0.5">Canal</p>
              <p className="font-medium text-brand-dark capitalize">{order.canal}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-0.5">Paiement</p>
              <p className="font-medium text-brand-dark">{PAYMENT_LABELS[order.modePaiement]}</p>
            </div>
          </div>

          {/* Articles */}
          <div className="border border-gray-100 rounded-xl overflow-hidden">
            <div className="bg-brand-cream px-4 py-2 flex items-center gap-2">
              <Package size={14} className="text-brand-green" />
              <span className="text-xs font-semibold text-brand-dark">Articles commandés</span>
            </div>
            <div className="divide-y divide-gray-50">
              {order.articles.map((a, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-brand-dark">{a.produitNom}</p>
                    <p className="text-xs text-gray-400">Qté : {a.quantite} × {formatCurrency(a.prixUnitaire)}</p>
                  </div>
                  <p className="font-semibold text-brand-dark text-sm">
                    {formatCurrency(a.quantite * a.prixUnitaire)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-between items-center py-3 border-t border-gray-100">
            <span className="font-semibold text-brand-dark">Total</span>
            <span className="text-xl font-bold text-brand-green">{formatCurrency(order.montantTotal)}</span>
          </div>

          {/* Actions */}
          {order.statut !== 'annulee' && (
            <div className="flex justify-end">
              <Button variant="danger" size="sm" onClick={annulerCommande}>
                Annuler la commande
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
