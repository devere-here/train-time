import { getBusArrivalsForStop } from '../api';
import { useArrivals } from './useArrivals';

export function useBusArrivals(stopId: string, routeId: string) {
  return useArrivals(() => getBusArrivalsForStop(stopId, routeId));
}
