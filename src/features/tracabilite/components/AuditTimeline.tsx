import {
  Package, ArrowDownCircle, ArrowUpCircle, ShoppingCart,
  ClipboardCheck, User, LogIn, XCircle, RefreshCw,
} from 'lucide-react';
import type { AuditLog, AuditAction } from '../../../types';
import { AUDIT_ACTION_LABELS } from '../../../utils/constants';
import { formatDateTime } from '../../../utils/formatters';

interface Props {
  logs: AuditLog[];
}

const ACTION_CONFIG: Record<AuditAction, { icon: typeof Package; color: string; dot: string }> = {
  creation_produit:         { icon: Package,       color: 'text-brand-green', dot: 'bg-brand-green' },
  modification_produit:     { icon: Package,       color: 'text-blue-500',    dot: 'bg-blue-500' },
  suppression_produit:      { icon: Package,       color: 'text-red-500',     dot: 'bg-red-500' },
  entree_stock:             { icon: ArrowDownCircle, color: 'text-green-600', dot: 'bg-green-500' },
  sortie_stock:             { icon: ArrowUpCircle,  color: 'text-orange-500', dot: 'bg-orange-500' },
  vente_effectuee:          { icon: ShoppingCart,  color: 'text-brand-green', dot: 'bg-brand-green' },
  commande_validee:         { icon: ClipboardCheck, color: 'text-brand-green', dot: 'bg-brand-green' },
  commande_annulee:         { icon: XCircle,       color: 'text-red-500',     dot: 'bg-red-500' },
  creation_utilisateur:     { icon: User,          color: 'text-purple-500',  dot: 'bg-purple-500' },
  modification_utilisateur: { icon: User,          color: 'text-blue-500',    dot: 'bg-blue-500' },
  connexion:                { icon: LogIn,         color: 'text-gray-500',    dot: 'bg-gray-400' },
  reapprovisionnement:      { icon: RefreshCw,     color: 'text-blue-500',    dot: 'bg-blue-500' },
} as Record<AuditAction, { icon: typeof Package; color: string; dot: string }>;

export function AuditTimeline({ logs }: Props) {
  if (logs.length === 0) {
    return <p className="text-center text-gray-400 text-sm py-12">Aucune activité trouvée</p>;
  }

  return (
    <div className="relative">
      <div className="absolute left-6 top-0 bottom-0 w-px bg-gray-100" />
      <div className="space-y-1">
        {logs.map((log) => {
          const cfg = ACTION_CONFIG[log.action] ?? { icon: Package, color: 'text-gray-500', dot: 'bg-gray-400' };
          const Icon = cfg.icon;
          return (
            <div key={log.id} className="flex gap-4 pl-2 py-3 hover:bg-brand-cream rounded-xl transition-colors group">
              {/* Dot + icon */}
              <div className="relative flex-shrink-0 flex items-center justify-center w-9">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${cfg.dot} bg-opacity-10 group-hover:bg-opacity-20 transition-colors`}>
                  <Icon size={16} className={cfg.color} />
                </div>
              </div>
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-brand-dark">{AUDIT_ACTION_LABELS[log.action] ?? log.action}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{log.detail}</p>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">{formatDateTime(log.date)}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">Par {log.utilisateurNom}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
