// Get your free API key at https://api.mta.info/
export const MTA_API_KEY = '';

const BASE = 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2F';

export const LINE_FEED_URL: Record<string, string> = {
  '1': `${BASE}gtfs`,
  '2': `${BASE}gtfs`,
  '3': `${BASE}gtfs`,
  '4': `${BASE}gtfs`,
  '5': `${BASE}gtfs`,
  '6': `${BASE}gtfs`,
  '7': `${BASE}gtfs`,
  'S': `${BASE}gtfs`,
  'A': `${BASE}gtfs-ace`,
  'C': `${BASE}gtfs-ace`,
  'E': `${BASE}gtfs-ace`,
  'B': `${BASE}gtfs-bdfm`,
  'D': `${BASE}gtfs-bdfm`,
  'F': `${BASE}gtfs-bdfm`,
  'M': `${BASE}gtfs-bdfm`,
  'N': `${BASE}gtfs-nqrw`,
  'Q': `${BASE}gtfs-nqrw`,
  'R': `${BASE}gtfs-nqrw`,
  'W': `${BASE}gtfs-nqrw`,
  'G': `${BASE}gtfs-g`,
  'J': `${BASE}gtfs-jz`,
  'Z': `${BASE}gtfs-jz`,
  'L': `${BASE}gtfs-l`,
  'SIR': `${BASE}gtfs-si`,
};
