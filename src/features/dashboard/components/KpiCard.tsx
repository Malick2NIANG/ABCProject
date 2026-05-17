import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { type ReactNode } from 'react';

interface Props {
  label: string;
  value: string;
  evolution?: number;
  icon: ReactNode;
  accent?: boolean;
}

export function KpiCard({ label, value, evolution, icon, accent = false }: Props) {
  const isPositive = evolution !== undefined && evolution >= 0;

  return (
    <Card className={accent ? 'border-brand-green/30 bg-brand-green' : ''}>
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-xs font-medium mb-1 ${accent ? 'text-white/70' : 'text-gray-400'}`}>{label}</p>
          <p className={`text-2xl font-bold ${accent ? 'text-white' : 'text-brand-dark'}`}>{value}</p>
          {evolution !== undefined && (
            <div className={`flex items-center gap-1 mt-1 text-xs ${isPositive ? 'text-green-500' : 'text-red-500'} ${accent ? 'text-white/80' : ''}`}>
              {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              <span>{isPositive ? '+' : ''}{evolution}% vs hier</span>
            </div>
          )}
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${accent ? 'bg-white/20' : 'bg-brand-cream'}`}>
          <span className={accent ? 'text-white' : 'text-brand-green'}>{icon}</span>
        </div>
      </div>
    </Card>
  );
}
