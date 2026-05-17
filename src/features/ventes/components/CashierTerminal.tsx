import { useState } from 'react';
import { Search, Plus, Minus, Trash2, ShoppingCart, CheckCircle, Package } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { PaymentModal } from './PaymentModal';
import { useBasket } from '../../../hooks/useBasket';
import { useApp } from '../../../context/AppContext';
import { useAuth } from '../../../context/AuthContext';
import type { PaymentMethod } from '../../../types';
import { CATEGORIES, CATEGORY_COLORS } from '../../../utils/constants';
import { formatCurrency } from '../../../utils/formatters';
import { Badge } from '../../../components/ui/Badge';

export function CashierTerminal() {
  const { products, setOrders, addMouvement, addAuditLog } = useApp();
  const { currentUser } = useAuth();
  const { items, addItem, removeItem, updateQuantity, clearBasket, total, itemCount } = useBasket();
  const [search, setSearch] = useState('');
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [success, setSuccess] = useState(false);

  const filtered = products.filter(
    (p) => p.quantite > 0 && p.nom.toLowerCase().includes(search.toLowerCase())
  );

  function handleConfirmPayment(method: PaymentMethod) {
    const num = `CMD-2026-${String(Date.now()).slice(-4)}`;
    const newOrder = {
      id: `o${Date.now()}`,
      numero: num,
      client: 'Client comptoir',
      vendeurId: currentUser!.id,
      vendeurNom: `${currentUser!.prenom} ${currentUser!.nom}`,
      articles: items.map((i) => ({
        produitId: i.produit.id,
        produitNom: i.produit.nom,
        quantite: i.quantite,
        prixUnitaire: i.produit.prix,
      })),
      montantTotal: total,
      statut: 'validee' as const,
      canal: 'physique' as const,
      modePaiement: method,
      date: new Date().toISOString(),
    };

    setOrders((prev) => [newOrder, ...prev]);

    items.forEach((i) => {
      addMouvement({
        produitId: i.produit.id,
        produitNom: i.produit.nom,
        type: 'sortie',
        quantite: i.quantite,
        utilisateurId: currentUser!.id,
        utilisateurNom: `${currentUser!.prenom} ${currentUser!.nom}`,
        note: `Vente ${num}`,
      });
    });

    addAuditLog({
      action: 'vente_effectuee',
      utilisateurId: currentUser!.id,
      utilisateurNom: `${currentUser!.prenom} ${currentUser!.nom}`,
      detail: `Vente ${num} — ${formatCurrency(total)}`,
      orderId: newOrder.id,
    });

    setPaymentOpen(false);
    clearBasket();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <CheckCircle size={40} className="text-brand-green" />
        </div>
        <h3 className="text-xl font-bold text-brand-dark">Vente enregistrée !</h3>
        <p className="text-gray-400 text-sm mt-1">Le stock a été mis à jour automatiquement.</p>
        <Button className="mt-6" onClick={() => setSuccess(false)}>
          Nouvelle vente
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 h-full">
      {/* Produits */}
      <div className="lg:col-span-3 space-y-3">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un produit..."
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-green/30 bg-white"
          />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-96 overflow-y-auto scrollbar-thin">
          {filtered.map((p) => (
            <button
              key={p.id}
              onClick={() => addItem(p)}
              className="bg-white border border-gray-100 rounded-xl p-3 text-left hover:border-brand-green hover:shadow-md transition-all group"
            >
              <div className="w-full h-20 bg-brand-cream rounded-lg mb-2 overflow-hidden">
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.nom}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const el = e.currentTarget;
                      el.style.display = 'none';
                      el.parentElement!.classList.add('flex', 'items-center', 'justify-center');
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package size={24} className="text-brand-green/40" />
                  </div>
                )}
              </div>
              <p className="text-xs font-semibold text-brand-dark leading-tight line-clamp-2">{p.nom}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs font-bold text-brand-green">{formatCurrency(p.prix)}</span>
                <Badge className={CATEGORY_COLORS[p.categorie]}>{CATEGORIES[p.categorie]}</Badge>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">Stock : {p.quantite}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Panier */}
      <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-50">
          <ShoppingCart size={16} className="text-brand-green" />
          <span className="font-semibold text-brand-dark text-sm">Panier</span>
          {itemCount > 0 && (
            <span className="bg-brand-green text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold ml-auto">
              {itemCount}
            </span>
          )}
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin divide-y divide-gray-50">
          {items.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-10">Panier vide</p>
          ) : (
            items.map((item) => (
              <div key={item.produit.id} className="px-4 py-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-medium text-brand-dark flex-1 leading-tight">{item.produit.nom}</p>
                  <button onClick={() => removeItem(item.produit.id)} className="text-gray-300 hover:text-red-500">
                    <Trash2 size={13} />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => updateQuantity(item.produit.id, item.quantite - 1)}
                      className="w-6 h-6 rounded-lg bg-gray-100 hover:bg-brand-cream flex items-center justify-center"
                    >
                      <Minus size={11} />
                    </button>
                    <span className="w-8 text-center text-sm font-bold text-brand-dark">{item.quantite}</span>
                    <button
                      onClick={() => addItem(item.produit)}
                      className="w-6 h-6 rounded-lg bg-gray-100 hover:bg-brand-cream flex items-center justify-center"
                    >
                      <Plus size={11} />
                    </button>
                  </div>
                  <span className="text-sm font-bold text-brand-dark">
                    {formatCurrency(item.produit.prix * item.quantite)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-gray-100 p-4 space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Total</span>
            <span className="text-lg font-bold text-brand-green">{formatCurrency(total)}</span>
          </div>
          <Button
            className="w-full"
            size="lg"
            disabled={items.length === 0}
            onClick={() => setPaymentOpen(true)}
          >
            Valider & Payer
          </Button>
        </div>
      </div>

      <PaymentModal
        open={paymentOpen}
        total={total}
        onConfirm={handleConfirmPayment}
        onClose={() => setPaymentOpen(false)}
      />
    </div>
  );
}
