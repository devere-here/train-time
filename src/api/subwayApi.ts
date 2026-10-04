import Long from 'long';
import { LINE_FEED_URL } from './config';
import { fetchFeed } from './feedClient';
import type { TrainArrival } from './types';

function feedUrlForLine(line: string): string {
  const url = LINE_FEED_URL[line.toUpperCase()];
  if (!url) {
    throw new Error(`Unknown subway line: "${line}"`);
  }
  return url;
}

function timestampToDate(value: number | Long | null | undefined): Date | null {
  if (value == null) return null;
  const seconds = value instanceof Long ? value.toNumber() : (value as number);
  return new Date(seconds * 1000);
}

// NYC GTFS stop IDs end in 'N' or 'S' to indicate direction (e.g. "127N", "127S").
function parseDirection(stopId: string): 'N' | 'S' | null {
  const suffix = stopId.slice(-1);
  if (suffix === 'N') return 'N';
  if (suffix === 'S') return 'S';
  return null;
}

export async function getArrivalsForStop(
  stopId: string,
  line: string,
): Promise<TrainArrival[]> {
  const feed = await fetchFeed(feedUrlForLine(line));
  const arrivals: TrainArrival[] = [];

  for (const entity of feed.entity) {
    const tripUpdate = entity.tripUpdate;
    if (!tripUpdate) continue;

    const routeId = tripUpdate.trip.routeId ?? '';
    const tripId = tripUpdate.trip.tripId ?? '';

    for (const stu of tripUpdate.stopTimeUpdate ?? []) {
      if (stu.stopId !== stopId) continue;

      arrivals.push({
        tripId,
        routeId,
        stopId,
        direction: parseDirection(stopId),
        arrivalTime: timestampToDate(stu.arrival?.time),
        departureTime: timestampToDate(stu.departure?.time),
      });
    }
  }

  return arrivals.sort((a, b) => {
    const aMs = a.arrivalTime?.getTime() ?? Infinity;
    const bMs = b.arrivalTime?.getTime() ?? Infinity;
    return aMs - bMs;
  });
}
