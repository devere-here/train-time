import { useCallback, useEffect, useRef, useState } from 'react';
import type { Arrival } from '../api';

const POLL_MS = 30_000;

interface UseArrivalsResult<T extends Arrival> {
  arrivals: T[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useArrivals<T extends Arrival>(
  fetcher: () => Promise<T[]>,
): UseArrivalsResult<T> {
  const [arrivals, setArrivals] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Always call the latest fetcher without restarting the poll interval
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const poll = useCallback(async () => {
    try {
      setError(null);
      const now = new Date();
      const data = await fetcherRef.current();
      setArrivals(data.filter(a => a.arrivalTime != null && a.arrivalTime > now));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load arrivals');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    poll();
    const id = setInterval(poll, POLL_MS);
    return () => clearInterval(id);
  }, [poll]);

  return { arrivals, loading, error, refresh: poll };
}
