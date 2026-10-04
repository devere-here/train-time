export interface TrainArrival {
  tripId: string;
  routeId: string;
  stopId: string;
  direction: 'N' | 'S' | null;
  arrivalTime: Date | null;
  departureTime: Date | null;
}
