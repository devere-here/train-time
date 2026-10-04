import { BUS_TIME_BASE, MTA_API_KEY } from './config';
import type { BusArrival } from './types';

// SIRI MonitoredStopVisit shape (subset of full SIRI schema)
interface SiriVisit {
  MonitoredVehicleJourney: {
    LineRef: string;
    VehicleRef: string;
    DestinationName: string | string[];
    MonitoredCall: {
      StopPointRef: string;
      ExpectedArrivalTime?: string;
      AimedArrivalTime?: string;
    };
  };
}

interface SiriResponse {
  Siri: {
    ServiceDelivery: {
      StopMonitoringDelivery: Array<{
        MonitoredStopVisit?: SiriVisit[];
        ErrorCondition?: { OtherError?: { ErrorText?: string } };
      }>;
    };
  };
}

function parseDate(iso: string | undefined): Date | null {
  if (!iso) return null;
  const d = new Date(iso);
  return isNaN(d.getTime()) ? null : d;
}

function firstName(value: string | string[]): string {
  return Array.isArray(value) ? (value[0] ?? '') : value;
}

export async function fetchBusArrivals(
  stopId: string,
  routeId: string,
): Promise<BusArrival[]> {
  const params = new URLSearchParams({
    key: MTA_API_KEY,
    MonitoringRef: stopId,
    LineRef: `MTA NYCT_${routeId}`,
    version: '2',
  });

  const response = await fetch(`${BUS_TIME_BASE}?${params}`);
  if (!response.ok) {
    throw new Error(`Bus Time API error ${response.status}: ${response.statusText}`);
  }

  const json: SiriResponse = await response.json();
  const delivery = json.Siri.ServiceDelivery.StopMonitoringDelivery[0];

  const error = delivery?.ErrorCondition?.OtherError?.ErrorText;
  if (error) throw new Error(error);

  const visits = delivery?.MonitoredStopVisit ?? [];
  return visits.map(({ MonitoredVehicleJourney: mvj }) => ({
    vehicleRef: mvj.VehicleRef,
    routeId: mvj.LineRef.replace(/^MTA NYCT_/, ''),
    stopId: mvj.MonitoredCall.StopPointRef.replace(/^MTA_/, ''),
    destinationName: firstName(mvj.DestinationName),
    arrivalTime: parseDate(mvj.MonitoredCall.ExpectedArrivalTime),
    scheduledArrivalTime: parseDate(mvj.MonitoredCall.AimedArrivalTime),
  }));
}
