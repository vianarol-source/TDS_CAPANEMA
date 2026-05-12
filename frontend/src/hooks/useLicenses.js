import { useState, useCallback } from 'react';

export function useLicenses() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = useCallback(async ({ states, filters, page = 1 }) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (states.length > 0) params.set('states', states.join(','));
      if (filters.type) params.set('type', filters.type);
      if (filters.status) params.set('status', filters.status);
      if (filters.query) params.set('q', filters.query);
      params.set('page', page);
      params.set('limit', 20);

      const res = await fetch(`/api/licenses?${params}`);
      if (!res.ok) throw new Error(`Erro ${res.status}: ${res.statusText}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, search };
}
