import { useState, useCallback } from 'react';

export function useLeads() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const search = useCallback(async (filters, page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const params = buildParams(filters, page);
      const res = await fetch(`/api/leads?${params}`);
      if (!res.ok) throw new Error(`Erro ${res.status}`);
      setData(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const exportCSV = useCallback(async (filters) => {
    const params = buildParams(filters, 1);
    params.set('format', 'csv');
    params.set('limit', '9999');
    const res = await fetch(`/api/leads?${params}`);
    const blob = await res.blob();
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `leads_geradores_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  return { data, loading, error, search, exportCSV };
}

function buildParams(filters, page) {
  const p = new URLSearchParams();
  if (filters.q)               p.set('q', filters.q);
  if (filters.classification?.length) p.set('classification', filters.classification.join(','));
  if (filters.states?.length)  p.set('states', filters.states.join(','));
  if (filters.type?.length)    p.set('type', filters.type.join(','));
  if (filters.status?.length)  p.set('status', filters.status.join(','));
  if (filters.activity?.length) p.set('activity', filters.activity.join(','));
  if (filters.region?.length)  p.set('region', filters.region.join(','));
  if (filters.ruralOnly)       p.set('ruralOnly', 'true');
  if (filters.scoreMin != null) p.set('scoreMin', filters.scoreMin);
  if (filters.scoreMax != null) p.set('scoreMax', filters.scoreMax);
  if (filters.issueDateFrom)   p.set('issueDateFrom', filters.issueDateFrom);
  if (filters.issueDateTo)     p.set('issueDateTo',   filters.issueDateTo);
  if (filters.expiryDateFrom)  p.set('expiryDateFrom', filters.expiryDateFrom);
  if (filters.expiryDateTo)    p.set('expiryDateTo',   filters.expiryDateTo);
  if (filters.sortBy)          p.set('sortBy',  filters.sortBy);
  if (filters.sortDir)         p.set('sortDir', filters.sortDir);
  p.set('page',  page);
  p.set('limit', 20);
  return p;
}
