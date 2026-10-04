export interface TrainArrival {
  tripId: string;
  routeId: string;
  stopId: string;
  direction: 'N' | 'S' | null;
  arrivalTime: Date | null;
  departureTime: Date | null;
}

export interface BusArrival {
  vehicleRef: string;
  routeId: string;
  stopId: string;
  destinationName: string;
  arrivalTime: Date | null;
  scheduledArrivalTime: Date | null;
}

export type Arrival = { arrivalTime: Date | null };
