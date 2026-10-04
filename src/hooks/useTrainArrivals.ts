import { useCallback, useEffect, useState } from 'react';
import { getArrivalsForStop } from '../api';
import type { TrainArrival } from '../api';

const POLL_INTERVAL_MS = 30_000;

interface UseTrainArrivalsResult {
  arrivals: TrainArrival[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useTrainArrivals(stopId: string, line: string): UseTrainArrivalsResult {
  const [arrivals, setArrivals] = useState<TrainArrival[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setError(null);
      const data = await getArrivalsForStop(stopId, line);
      setArrivals(data.filter(a => a.arrivalTime != null && a.arrivalTime > new Date()));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load arrivals');
    } finally {
      setLoading(false);
    }
  }, [stopId, line]);

  useEffect(() => {
    fetch();
    const interval = setInterval(fetch, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetch]);

  return { arrivals, loading, error, refresh: fetch };
}
