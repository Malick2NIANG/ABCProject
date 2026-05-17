import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import type { Order } from '../../../types';
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS, PAYMENT_LABELS } from '../../../utils/constants';
import { formatCurrency, formatDateTime } from '../../../utils/formatters';

interface Props {
  orders: Order[];
  onSelect: (o: Order) => void;
}

export function OrderTable({ orders, onSelect }: Props) {
  const columns = [
    {
      key: 'numero',
      header: 'N° Commande',
      render: (o: Order) => (
        <div>
          <p className="font-semibold text-brand-dark">{o.numero}</p>
          <p className="text-xs text-gray-400">{formatDateTime(o.date)}</p>
        </div>
      ),
    },
    {
      key: 'client',
      header: 'Client',
      render: (o: Order) => <span className="text-sm text-brand-dark">{o.client}</span>,
    },
    {
      key: 'vendeur',
      header: 'Vendeur',
      render: (o: Order) => <span className="text-sm text-gray-500">{o.vendeurNom}</span>,
    },
    {
      key: 'canal',
      header: 'Canal',
      render: (o: Order) => (
        <Badge className={o.canal === 'physique' ? 'bg-brand-cream text-brand-green' : 'bg-blue-50 text-blue-700'}>
          {o.canal === 'physique' ? 'Boutique' : 'Distance'}
        </Badge>
      ),
    },
    {
      key: 'paiement',
      header: 'Paiement',
      render: (o: Order) => <span className="text-xs text-gray-500">{PAYMENT_LABELS[o.modePaiement]}</span>,
    },
    {
      key: 'montant',
      header: 'Montant',
      render: (o: Order) => (
        <span className="font-bold text-brand-dark">{formatCurrency(o.montantTotal)}</span>
      ),
    },
    {
      key: 'statut',
      header: 'Statut',
      render: (o: Order) => (
        <Badge className={ORDER_STATUS_COLORS[o.statut]}>
          {ORDER_STATUS_LABELS[o.statut]}
        </Badge>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      data={orders}
      onRowClick={onSelect}
      emptyMessage="Aucune commande trouvée"
    />
  );
}
