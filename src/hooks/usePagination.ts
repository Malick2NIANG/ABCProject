import { useState, useEffect, useMemo } from 'react';

export const PAGE_SIZE_OPTIONS = [5, 10, 25, 50] as const;

export function usePagination<T>(data: T[], defaultPageSize = 5) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  // Retour page 1 à chaque changement de données (filtre, ajout, suppression)
  useEffect(() => {
    setPage(1);
  }, [data.length]);

  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));
  const safePage = Math.min(page, totalPages);

  const paginated = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, safePage, pageSize]);

  function handleSetPageSize(size: number) {
    setPageSize(size);
    setPage(1);
  }

  return {
    page: safePage,
    setPage,
    pageSize,
    setPageSize: handleSetPageSize,
    paginated,
    total: data.length,
    totalPages,
  };
}
