import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card } from '../../../components/ui/Card';
import { SALES_CHART_DATA } from '../../../utils/mockData';

function formatYAxis(value: number) {
  return value >= 1000 ? `${value / 1000}k` : String(value);
}

export function SalesChart() {
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-brand-dark text-sm">Ventes de la semaine</h3>
        <span className="text-xs text-gray-400">FCFA</span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={SALES_CHART_DATA} barSize={28}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis dataKey="jour" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
          <YAxis tickFormatter={formatYAxis} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
          <Tooltip
            formatter={(v: number) => [`${v.toLocaleString('fr-FR')} FCFA`, 'Ventes']}
            contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }}
            cursor={{ fill: '#4A8C2A11' }}
          />
          <Bar dataKey="ventes" fill="#4A8C2A" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
