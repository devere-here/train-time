// Subway stop IDs from MTA static GTFS stops.txt.
// Suffix N = northbound (toward Manhattan), S = southbound.
export const STOPS = {
  BAY_RIDGE_AVE_NB: 'R42N',  // R train → Manhattan
  EIGHTH_AVE_NB: 'N02N',     // N train → Manhattan
} as const;

// Bus stop IDs from MTA Bus Time. Find yours:
//   1. Check the 6-digit code printed on the physical bus stop sign
//   2. Visit https://www.bustime.mta.info/ and search for your stop
//   3. Use the stops-for-route API with your MTA key:
//      GET https://bustime.mta.info/api/where/stops-for-route/MTA%20NYCT_B63.json?key=YOUR_KEY&version=2
export const BUS_STOPS = {
  // TODO: replace with real stop IDs from the MTA Bus Time website
  BAY_RIDGE_AVE_B63_NB: '305348',  // B63 5 Av/Bay Ridge Av → Downtown Brooklyn
} as const;
