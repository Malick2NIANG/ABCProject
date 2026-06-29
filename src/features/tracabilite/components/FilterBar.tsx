import { Search, RotateCcw } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { AUDIT_ACTION_LABELS } from '../../../utils/constants';
import type { AuditAction } from '../../../types';

interface Props {
  search: string;
  action: string;
  dateFrom: string;
  dateTo: string;
  onSearch: (v: string) => void;
  onAction: (v: string) => void;
  onDateFrom: (v: string) => void;
  onDateTo: (v: string) => void;
  onReset: () => void;
}

export function FilterBar({ search, action, dateFrom, dateTo, onSearch, onAction, onDateFrom, onDateTo, onReset }: Props) {
  return (
    <div className="flex flex-wrap gap-3 items-end">
      <div className="relative flex-1 min-w-48">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Utilisateur, détail..."
          className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-green/30"
        />
      </div>
      <select
        value={action}
        onChange={(e) => onAction(e.target.value)}
        className="text-sm rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green/30"
      >
        <option value="">Toutes les actions</option>
        {(Object.entries(AUDIT_ACTION_LABELS) as [AuditAction, string][]).map(([k, v]) => (
          <option key={k} value={k}>{v}</option>
        ))}
      </select>
      <input
        type="date"
        value={dateFrom}
        onChange={(e) => onDateFrom(e.target.value)}
        className="text-sm rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green/30"
      />
      <input
        type="date"
        value={dateTo}
        onChange={(e) => onDateTo(e.target.value)}
        className="text-sm rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green/30"
      />
      <Button variant="ghost" size="sm" onClick={onReset}>
        <RotateCcw size={14} /> Réinitialiser
      </Button>
    </div>
  );
}
