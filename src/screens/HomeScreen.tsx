import React, { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useArrivals } from '../hooks/useArrivals';
import { getArrivalsForStop, getBusArrivalsForStop } from '../api';
import type { Arrival } from '../api';
import { STOPS, BUS_STOPS } from '../constants/stations';

type ViewMode = 'subway' | 'bus';

function minutesUntil(date: Date): number {
  return Math.round((date.getTime() - Date.now()) / 60_000);
}

function formatArrival(a: Arrival): string {
  if (!a.arrivalTime) return '—';
  const mins = minutesUntil(a.arrivalTime);
  if (mins <= 0) return 'Due';
  if (mins === 1) return '1 min';
  return `${mins} mins`;
}

interface ToggleProps {
  value: ViewMode;
  onChange: (v: ViewMode) => void;
}

function Toggle({ value, onChange }: ToggleProps) {
  return (
    <View style={styles.toggle}>
      {(['subway', 'bus'] as ViewMode[]).map(mode => (
        <TouchableOpacity
          key={mode}
          style={[styles.toggleOption, value === mode && styles.toggleOptionActive]}
          onPress={() => onChange(mode)}
          activeOpacity={0.7}
        >
          <Text style={[styles.toggleLabel, value === mode && styles.toggleLabelActive]}>
            {mode === 'subway' ? '🚇 Subway' : '🚌 Bus'}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

interface ArrivalCardProps {
  line: string;
  lineColor: string;
  textColor?: string;
  stationName: string;
  destination: string;
  fetcher: () => Promise<Arrival[]>;
}

function ArrivalCard({
  line,
  lineColor,
  textColor = '#000',
  stationName,
  destination,
  fetcher,
}: ArrivalCardProps) {
  const { arrivals, loading, error } = useArrivals(fetcher);
  const nextThree = arrivals.slice(0, 3);

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={[styles.lineBadge, { backgroundColor: lineColor }]}>
          <Text style={[styles.lineLetter, { color: textColor }]}>{line}</Text>
        </View>
        <View style={styles.headerText}>
          <Text style={styles.stationName}>{stationName}</Text>
          <Text style={styles.destination}>→ {destination}</Text>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator style={styles.spinner} color="#666" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : nextThree.length === 0 ? (
        <Text style={styles.noService}>No upcoming arrivals</Text>
      ) : (
        <View style={styles.arrivalList}>
          {nextThree.map((arrival, i) => (
            <View key={i} style={styles.arrivalRow}>
              <Text style={[styles.arrivalTime, i === 0 && styles.nextArrival]}>
                {formatArrival(arrival)}
              </Text>
              {i === 0 && <Text style={styles.nextLabel}>next</Text>}
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

export function HomeScreen() {
  const [view, setView] = useState<ViewMode>('subway');

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.pageTitle}>{view === 'subway' ? 'Train Times' : 'Bus Times'}</Text>
        <Toggle value={view} onChange={setView} />

        {view === 'subway' ? (
          <>
            <ArrivalCard
              key="subway-r"
              line="R"
              lineColor="#FCCC0A"
              stationName="Bay Ridge Av"
              destination="Manhattan"
              fetcher={() => getArrivalsForStop(STOPS.BAY_RIDGE_AVE_NB, 'R')}
            />
            <ArrivalCard
              key="subway-n"
              line="N"
              lineColor="#FCCC0A"
              stationName="8 Av"
              destination="Manhattan"
              fetcher={() => getArrivalsForStop(STOPS.EIGHTH_AVE_NB, 'N')}
            />
          </>
        ) : (
          <>
            <ArrivalCard
              key="bus-b64"
              line="B64"
              lineColor="#0039A6"
              textColor="#FFF"
              stationName="Ovington Av / 6 Av"
              destination="Shore Road"
              fetcher={() => getBusArrivalsForStop(BUS_STOPS.OVINGTON_B64_SHORE, 'B64')}
            />
            <ArrivalCard
              key="bus-x27"
              line="X27"
              lineColor="#0039A6"
              textColor="#FFF"
              stationName="3 Av / Senator St"
              destination="Midtown Manhattan"
              fetcher={() => getBusArrivalsForStop(BUS_STOPS.SENATOR_ST_EXPRESS_NB, 'X27')}
            />
            <ArrivalCard
              key="bus-x37"
              line="X37"
              lineColor="#0039A6"
              textColor="#FFF"
              stationName="3 Av / Senator St"
              destination="Midtown Manhattan"
              fetcher={() => getBusArrivalsForStop(BUS_STOPS.SENATOR_ST_EXPRESS_NB, 'X37')}
            />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  container: {
    padding: 16,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 16,
  },
  toggle: {
    flexDirection: 'row',
    backgroundColor: '#E5E5EA',
    borderRadius: 12,
    padding: 3,
    marginBottom: 24,
  },
  toggleOption: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
  },
  toggleOptionActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  toggleLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#8E8E93',
  },
  toggleLabelActive: {
    color: '#1C1C1E',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  lineBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  lineLetter: {
    fontSize: 18,
    fontWeight: '800',
  },
  headerText: {
    flex: 1,
  },
  stationName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  destination: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 2,
  },
  arrivalList: {
    flexDirection: 'row',
    gap: 16,
  },
  arrivalRow: {
    alignItems: 'center',
  },
  arrivalTime: {
    fontSize: 18,
    fontWeight: '500',
    color: '#3C3C43',
  },
  nextArrival: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  nextLabel: {
    fontSize: 11,
    color: '#8E8E93',
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  spinner: {
    marginVertical: 8,
  },
  errorText: {
    fontSize: 13,
    color: '#FF3B30',
  },
  noService: {
    fontSize: 14,
    color: '#8E8E93',
  },
});
