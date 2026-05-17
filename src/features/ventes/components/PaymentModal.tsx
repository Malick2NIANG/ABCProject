import { CheckCircle, Banknote, Wifi, Smartphone, Building2, CreditCard, type LucideIcon } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import type { PaymentMethod } from '../../../types';
import { PAYMENT_LABELS } from '../../../utils/constants';
import { formatCurrency } from '../../../utils/formatters';

interface Props {
  open: boolean;
  total: number;
  onConfirm: (method: PaymentMethod) => void;
  onClose: () => void;
}

const PAYMENT_METHODS: PaymentMethod[] = ['especes', 'wave', 'orange_money', 'virement', 'autre'];

const METHOD_ICONS: Record<PaymentMethod, LucideIcon> = {
  especes:      Banknote,
  wave:         Wifi,
  orange_money: Smartphone,
  virement:     Building2,
  autre:        CreditCard,
};

const METHOD_COLORS: Record<PaymentMethod, string> = {
  especes:      'text-green-600 bg-green-50',
  wave:         'text-blue-600 bg-blue-50',
  orange_money: 'text-orange-500 bg-orange-50',
  virement:     'text-purple-600 bg-purple-50',
  autre:        'text-gray-600 bg-gray-100',
};

export function PaymentModal({ open, total, onConfirm, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-sm">
        <div className="px-6 py-5">
          <h3 className="font-semibold text-brand-dark text-center mb-1">Mode de paiement</h3>
          <p className="text-2xl font-bold text-brand-green text-center mb-5">{formatCurrency(total)}</p>

          <div className="space-y-2">
            {PAYMENT_METHODS.map((method) => {
              const Icon = METHOD_ICONS[method];
              return (
                <button
                  key={method}
                  onClick={() => onConfirm(method)}
                  className="w-full flex items-center gap-4 p-3.5 rounded-xl border border-gray-200 hover:border-brand-green hover:bg-brand-cream transition-all text-left group"
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${METHOD_COLORS[method]}`}>
                    <Icon size={17} />
                  </div>
                  <span className="font-medium text-brand-dark group-hover:text-brand-green flex-1 text-sm">
                    {PAYMENT_LABELS[method]}
                  </span>
                  <CheckCircle size={16} className="text-gray-200 group-hover:text-brand-green" />
                </button>
              );
            })}
          </div>

          <Button variant="ghost" className="w-full mt-4" onClick={onClose}>
            Annuler
          </Button>
        </div>
      </div>
    </div>
  );
}
