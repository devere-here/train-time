import { getArrivalsForStop } from '../api';
import { useArrivals } from './useArrivals';

export function useTrainArrivals(stopId: string, line: string) {
  return useArrivals(() => getArrivalsForStop(stopId, line));
}
