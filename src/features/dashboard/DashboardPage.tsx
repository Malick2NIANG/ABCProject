import { ShoppingCart, Package, TrendingUp, AlertTriangle, KeyRound, CheckCircle, Clock } from 'lucide-react';
import { KpiCard } from './components/KpiCard';
import { SalesChart } from './components/SalesChart';
import { StockAlertList } from './components/StockAlertList';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from '../../utils/constants';

export function DashboardPage() {
  const { orders, products, auditLogs, lowStockProducts, passwordResetRequests, validatePasswordReset } = useApp();
  const { currentUser } = useAuth();

  const todayOrders = orders.filter((o) => o.statut === 'validee');
  const totalVentes = todayOrders.reduce((s, o) => s + o.montantTotal, 0);
  const recentOrders = [...orders].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  const recentLogs = auditLogs.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h2 className="text-lg font-bold text-brand-dark">
          Bonjour, {currentUser?.prenom}
        </h2>
        <p className="text-sm text-gray-400">Voici l'activité du jour — {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Ventes du jour"
          value={formatCurrency(totalVentes)}
          evolution={12}
          icon={<TrendingUp size={20} />}
        />
        <KpiCard
          label="Commandes"
          value={String(orders.length)}
          evolution={5}
          icon={<ShoppingCart size={20} />}
        />
        <KpiCard
          label="Produits actifs"
          value={String(products.length)}
          icon={<Package size={20} />}
        />
        <KpiCard
          label="Alertes stock"
          value={String(lowStockProducts.length)}
          evolution={-2}
          icon={<AlertTriangle size={20} />}
        />
      </div>

      {/* Charts + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <SalesChart />
        </div>
        <StockAlertList />
      </div>

      {/* Demandes de réinitialisation — admin uniquement */}
      {currentUser?.role === 'admin' && passwordResetRequests.length > 0 && (
        <Card padding={false}>
          <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-2">
            <KeyRound size={15} className="text-brand-gold" />
            <h3 className="font-semibold text-brand-dark text-sm">Demandes de réinitialisation</h3>
            <span className="ml-auto bg-orange-100 text-orange-600 text-xs font-bold px-2 py-0.5 rounded-full">
              {passwordResetRequests.filter((r) => r.status === 'en_attente').length} en attente
            </span>
          </div>
          <div className="divide-y divide-gray-50">
            {passwordResetRequests.map((r) => (
              <div key={r.id} className="flex items-center justify-between px-5 py-3 gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-brand-green/10 flex items-center justify-center flex-shrink-0">
                    <KeyRound size={14} className="text-brand-green" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-brand-dark truncate">{r.email}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(r.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  {r.status === 'en_attente' ? (
                    <>
                      <div className="flex items-center gap-1 text-xs text-orange-500">
                        <Clock size={12} />
                        En attente
                      </div>
                      <button
                        onClick={() => validatePasswordReset(r.id)}
                        className="text-xs bg-brand-green text-white px-3 py-1.5 rounded-lg hover:bg-brand-green/90 transition-colors font-medium"
                      >
                        Valider
                      </button>
                    </>
                  ) : (
                    <div className="flex items-center gap-1 text-xs text-brand-green font-medium">
                      <CheckCircle size={13} />
                      <span>Envoyé — <span className="font-mono">{r.tempPassword}</span></span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Recent orders + Audit */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent orders */}
        <Card padding={false}>
          <div className="px-5 py-4 border-b border-gray-50">
            <h3 className="font-semibold text-brand-dark text-sm">Commandes récentes</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {recentOrders.map((o) => (
              <div key={o.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="text-sm font-medium text-brand-dark">{o.numero}</p>
                  <p className="text-xs text-gray-400">{o.client}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-brand-dark">{formatCurrency(o.montantTotal)}</span>
                  <Badge className={ORDER_STATUS_COLORS[o.statut]}>
                    {ORDER_STATUS_LABELS[o.statut]}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent activity */}
        <Card padding={false}>
          <div className="px-5 py-4 border-b border-gray-50">
            <h3 className="font-semibold text-brand-dark text-sm">Activité récente</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {recentLogs.map((log) => (
              <div key={log.id} className="px-5 py-3">
                <p className="text-sm text-brand-dark">{log.detail}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {log.utilisateurNom} · {formatDateTime(log.date)}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
