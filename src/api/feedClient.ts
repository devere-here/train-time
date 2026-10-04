import { transit_realtime } from 'gtfs-realtime-bindings';
import { MTA_API_KEY } from './config';

export async function fetchFeed(feedUrl: string): Promise<transit_realtime.FeedMessage> {
  const response = await fetch(feedUrl, {
    headers: { 'x-api-key': MTA_API_KEY },
  });

  if (!response.ok) {
    throw new Error(`MTA API error ${response.status}: ${response.statusText}`);
  }

  const buffer = await response.arrayBuffer();
  return transit_realtime.FeedMessage.decode(new Uint8Array(buffer));
}
