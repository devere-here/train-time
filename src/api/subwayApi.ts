import Long from 'long';
import type { transit_realtime } from 'gtfs-realtime-bindings';
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

function arrivalsAtStops(
  feed: transit_realtime.FeedMessage,
  stopIds: string[],
): TrainArrival[] {
  const arrivals: TrainArrival[] = [];

  for (const entity of feed.entity) {
    const tripUpdate = entity.tripUpdate;
    if (!tripUpdate) continue;

    const routeId = tripUpdate.trip.routeId ?? '';
    const tripId = tripUpdate.trip.tripId ?? '';

    for (const stu of tripUpdate.stopTimeUpdate ?? []) {
      const stopId = stu.stopId;
      if (!stopId || !stopIds.includes(stopId)) continue;

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

  return arrivals;
}

function byArrivalTime(a: TrainArrival, b: TrainArrival): number {
  const aMs = a.arrivalTime?.getTime() ?? Infinity;
  const bMs = b.arrivalTime?.getTime() ?? Infinity;
  return aMs - bMs;
}

export async function getArrivalsForStop(
  stopId: string,
  line: string,
): Promise<TrainArrival[]> {
  const feed = await fetchFeed(feedUrlForLine(line));
  return arrivalsAtStops(feed, [stopId]).sort(byArrivalTime);
}

// For stations served by lines that live in different feeds (e.g. D is in
// bdfm, N/R are in nqrw). Returns every train at the stop, merged in time order.
export async function getArrivalsForStopOnLines(
  stopId: string,
  lines: string[],
): Promise<TrainArrival[]> {
  return getArrivalsForStopsOnLines([stopId], lines);
}

// For station complexes where each line group has its own platform and stop ID
// (e.g. Atlantic Av-Barclays Ctr: 2/3/4/5, B/Q and D/N/R). Returns every train
// at any of the stops, merged in time order.
export async function getArrivalsForStopsOnLines(
  stopIds: readonly string[],
  lines: string[],
): Promise<TrainArrival[]> {
  const feedUrls = Array.from(new Set(lines.map(feedUrlForLine)));
  const feeds = await Promise.all(feedUrls.map(fetchFeed));
  return feeds.flatMap(feed => arrivalsAtStops(feed, [...stopIds])).sort(byArrivalTime);
}
