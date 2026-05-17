import { useState, useMemo } from 'react';
import { Card } from '../../components/ui/Card';
import { AuditTimeline } from './components/AuditTimeline';
import { FilterBar } from './components/FilterBar';
import { useApp } from '../../context/AppContext';

export function TracabilitePage() {
  const { auditLogs } = useApp();
  const [search, setSearch] = useState('');
  const [action, setAction] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  function reset() {
    setSearch('');
    setAction('');
    setDateFrom('');
    setDateTo('');
  }

  const filtered = useMemo(() => {
    return auditLogs.filter((log) => {
      const matchSearch =
        !search ||
        log.utilisateurNom.toLowerCase().includes(search.toLowerCase()) ||
        log.detail.toLowerCase().includes(search.toLowerCase());
      const matchAction = !action || log.action === action;
      const logDate = log.date.substring(0, 10);
      const matchFrom = !dateFrom || logDate >= dateFrom;
      const matchTo = !dateTo || logDate <= dateTo;
      return matchSearch && matchAction && matchFrom && matchTo;
    });
  }, [auditLogs, search, action, dateFrom, dateTo]);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-base font-bold text-brand-dark">Piste d'audit</h2>
        <p className="text-sm text-gray-400">{filtered.length} événement(s) enregistré(s)</p>
      </div>

      <Card>
        <FilterBar
          search={search}
          action={action}
          dateFrom={dateFrom}
          dateTo={dateTo}
          onSearch={setSearch}
          onAction={setAction}
          onDateFrom={setDateFrom}
          onDateTo={setDateTo}
          onReset={reset}
        />
      </Card>

      <Card>
        <AuditTimeline logs={filtered} />
      </Card>
    </div>
  );
}
