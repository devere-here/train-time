import { fetchBusArrivals } from './busTimeClient';
import type { BusArrival } from './types';

export async function getBusArrivalsForStop(
  stopId: string,
  routeId: string,
): Promise<BusArrival[]> {
  const now = new Date();
  const arrivals = await fetchBusArrivals(stopId, routeId);
  return arrivals
    .filter(a => a.arrivalTime != null && a.arrivalTime > now)
    .sort((a, b) => a.arrivalTime!.getTime() - b.arrivalTime!.getTime());
}
