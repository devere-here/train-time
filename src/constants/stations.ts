// Stop IDs sourced from MTA static GTFS stops.txt.
// Suffix N = northbound (toward Manhattan), S = southbound.
export const STOPS = {
  BAY_RIDGE_AVE_NB: 'R42N',  // R train → Manhattan
  EIGHTH_AVE_NB: 'N02N',     // N train → Manhattan
} as const;
