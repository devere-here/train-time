import React from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTrainArrivals } from '../hooks/useTrainArrivals';
import { STOPS } from '../constants/stations';
import type { TrainArrival } from '../api';

function minutesUntil(date: Date): number {
  return Math.round((date.getTime() - Date.now()) / 60_000);
}

function formatArrival(arrival: TrainArrival): string {
  if (!arrival.arrivalTime) return '—';
  const mins = minutesUntil(arrival.arrivalTime);
  if (mins <= 0) return 'Due';
  if (mins === 1) return '1 min';
  return `${mins} mins`;
}

interface ArrivalCardProps {
  line: string;
  lineColor: string;
  stationName: string;
  stopId: string;
  destination: string;
}

function ArrivalCard({ line, lineColor, stationName, stopId, destination }: ArrivalCardProps) {
  const { arrivals, loading, error, refresh } = useTrainArrivals(stopId, line);
  const nextThree = arrivals.slice(0, 3);

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={[styles.lineBadge, { backgroundColor: lineColor }]}>
          <Text style={styles.lineLetter}>{line}</Text>
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
        <Text style={styles.noService}>No upcoming trains</Text>
      ) : (
        <View style={styles.arrivalList}>
          {nextThree.map((arrival, i) => (
            <View key={`${arrival.tripId}-${i}`} style={styles.arrivalRow}>
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
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={false} onRefresh={() => {}} />}
      >
        <Text style={styles.pageTitle}>Train Times</Text>

        <ArrivalCard
          line="R"
          lineColor="#FCCC0A"
          stationName="Bay Ridge Av"
          stopId={STOPS.BAY_RIDGE_AVE_NB}
          destination="Manhattan"
        />

        <ArrivalCard
          line="N"
          lineColor="#FCCC0A"
          stationName="8 Av"
          stopId={STOPS.EIGHTH_AVE_NB}
          destination="Manhattan"
        />
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
    marginBottom: 20,
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
    fontSize: 20,
    fontWeight: '800',
    color: '#000000',
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
