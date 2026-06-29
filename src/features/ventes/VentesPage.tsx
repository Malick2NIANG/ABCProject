import { useState, useCallback } from 'react';
import { ArrowLeft, Search, Filter } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ChannelSelector } from './components/ChannelSelector';
import { OrderTable } from './components/OrderTable';
import { OrderDetails } from './components/OrderDetails';
import { CashierTerminal } from './components/CashierTerminal';
import { useApp } from '../../context/AppContext';
import { useFilters } from '../../hooks/useFilters';
import { usePagination } from '../../hooks/usePagination';
import { Pagination } from '../../components/shared/Pagination';
import type { Order, OrderChannel } from '../../types';

type View = 'hub' | 'commandes' | 'caisse';

export function VentesPage() {
  const { orders } = useApp();
  const [view, setView] = useState<View>('hub');
  const [selectedChannel, setSelectedChannel] = useState<OrderChannel | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState('');

  const filterFn = useCallback(
    (o: Order, f: { search: string }) => {
      const matchSearch =
        o.numero.toLowerCase().includes(f.search.toLowerCase()) ||
        o.client.toLowerCase().includes(f.search.toLowerCase());
      const matchStatus = statusFilter === '' || o.statut === statusFilter;
      return matchSearch && matchStatus;
    },
    [statusFilter]
  );

  const { filters, setFilter, filtered } = useFilters(orders, filterFn);
  const distanceOrders = filtered.filter((o) => o.canal === 'distance');
  const { page, setPage, pageSize, setPageSize, paginated, total, totalPages } = usePagination(distanceOrders);

  function handleChannelSelect(channel: OrderChannel) {
    setSelectedChannel(channel);
    if (channel === 'physique') {
      setView('caisse');
    } else {
      setView('commandes');
    }
  }

  if (view === 'caisse') {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => setView('hub')}>
            <ArrowLeft size={16} /> Retour
          </Button>
          <h2 className="font-bold text-brand-dark">Terminal Caisse — Vente Physique</h2>
        </div>
        <CashierTerminal />
      </div>
    );
  }

  if (view === 'commandes') {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => setView('hub')}>
            <ArrowLeft size={16} /> Retour
          </Button>
          <h2 className="font-bold text-brand-dark">Commandes à Distance</h2>
        </div>

        <Card>
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-48">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={filters.search}
                onChange={(e) => setFilter('search', e.target.value)}
                placeholder="N° commande, client..."
                className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-green/30"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-sm rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green/30"
              >
                <option value="">Tous les statuts</option>
                <option value="validee">Validée</option>
                <option value="en_attente">En attente</option>
                <option value="annulee">Annulée</option>
              </select>
            </div>
          </div>
        </Card>

        <Card padding={false}>
          <OrderTable orders={paginated} onSelect={setSelectedOrder} />
          <div className="border-t border-gray-100">
            <Pagination page={page} totalPages={totalPages} pageSize={pageSize} total={total} onPageChange={setPage} onPageSizeChange={setPageSize} />
          </div>
        </Card>

        <OrderDetails order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-bold text-brand-dark">Centre des Ventes & Commandes</h2>
        <p className="text-sm text-gray-400">Choisissez le type d'opération commerciale</p>
      </div>

      <ChannelSelector selected={selectedChannel} onSelect={handleChannelSelect} />

      {/* All orders summary */}
      <Card padding={false}>
        <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
          <h3 className="font-semibold text-brand-dark text-sm">Toutes les commandes</h3>
          <span className="text-xs text-gray-400">{orders.length} commandes</span>
        </div>
        <OrderTable orders={orders.slice(0, 5)} onSelect={setSelectedOrder} />
      </Card>

      <OrderDetails order={selectedOrder} onClose={() => setSelectedOrder(null)} />
    </div>
  );
}
