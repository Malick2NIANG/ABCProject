import { useState, useMemo } from 'react';

interface FilterState {
  search: string;
  dateFrom: string;
  dateTo: string;
  [key: string]: string;
}

export function useFilters<T>(
  data: T[],
  filterFn: (item: T, filters: FilterState) => boolean
) {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    dateFrom: '',
    dateTo: '',
  });

  function setFilter(key: string, value: string) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  function resetFilters() {
    setFilters({ search: '', dateFrom: '', dateTo: '' });
  }

  const filtered = useMemo(
    () => data.filter((item) => filterFn(item, filters)),
    [data, filters, filterFn]
  );

  return { filters, setFilter, resetFilters, filtered };
}
