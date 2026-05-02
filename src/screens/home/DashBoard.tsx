import {
  RefreshControl,
  StyleSheet,
  View,
  FlatList,
  ScrollView,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import AppText from '../../components/AppText';
import { container } from '../../constants/container';
import AppHeader from '../../components/AppHeader';
import TripCard from '../../components/TripCard';
import { scale as s, vs } from 'react-native-size-matters';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../../api/api';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { AppColors } from '../../styles/colors';
import { useToast } from '../../components/Toast/ToastContext';
import DashboardSkeleton from '../../components/SkeletonLoader/DashboardSkeleton';

type TripStatus = 'ongoing' | 'pending' | 'completed' | 'cancelled';

type Trip = {
  id?: string | number;
  tripUID?: string;
  tripUid?: string;
  date?: string;
  pickupDest?: string;
  dropDest?: string;
  status?: string;
  vehicleRegNumber?: string;
  vehicleName?: string;
  vehicle?: {
    regNumber?: string;
    name?: string;
  };
  vehicleId?: string | number;
};

type TripsByStatus = Record<TripStatus, Trip[]>;

const tripSections: {
  title: string;
  status: TripStatus;
}[] = [
  { title: 'Active Trips', status: 'ongoing' },
  { title: 'Upcoming Trips', status: 'pending' },
  { title: 'Completed Trips', status: 'completed' },
  { title: 'Cancelled Trips', status: 'cancelled' },
];

const initialTripsByStatus: TripsByStatus = {
  ongoing: [],
  pending: [],
  completed: [],
  cancelled: [],
};

const normalizeTripsResponse = (data: any): Trip[] => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.trips)) return data.trips;
  return [];
};

const getTripId = (trip: Trip) =>
  trip.id?.toString() || trip.tripUID || trip.tripUid || '';

const getVehicleId = (trip: Trip) =>
  trip.vehicleRegNumber ||
  trip.vehicleName ||
  trip.vehicle?.regNumber ||
  trip.vehicle?.name ||
  trip.vehicleId?.toString() ||
  'N/A';

const getTripDateTime = (date?: string) => {
  if (!date) return 'N/A';

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return date;

  const formattedDate = parsedDate.toLocaleDateString([], {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const formattedTime = parsedDate.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return `${formattedDate}, ${formattedTime}`;
};

const formatStatus = (status?: string) => {
  if (!status) return 'N/A';
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const getStatusColor = (status: TripStatus) => {
  switch (status) {
    case 'pending':
      return AppColors.tripStatusPending;
    case 'completed':
      return AppColors.tripStatusCompleted;
    case 'cancelled':
      return AppColors.tripStatusCancelled;
    case 'ongoing':
    default:
      return AppColors.secondaryColor;
  }
};

const DashBoard = () => {
  const navigation = useNavigation<any>();
  const { showToast } = useToast();
  const [tripsByStatus, setTripsByStatus] =
    useState<TripsByStatus>(initialTripsByStatus);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUserInfo = async () => {
    const userData = await AsyncStorage.getItem('userData');
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        console.log('User Data: ', parsed.email);
      } catch {
        console.log('User Data (raw): ', userData);
      }
    } else {
      console.log('User Data: null');
    }
  };
  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchTripsByStatus = useCallback(async (showLoader = true) => {
    try {
      if (showLoader) {
        setLoading(true);
      }

      const responses = await Promise.all(
        tripSections.map(section =>
          apiClient.get(`/trips/details/status/${section.status}`),
        ),
      );

      const nextTripsByStatus = tripSections.reduce<TripsByStatus>(
        (acc, section, index) => {
          acc[section.status] = normalizeTripsResponse(responses[index].data);
          return acc;
        },
        { ...initialTripsByStatus },
      );

      setTripsByStatus(nextTripsByStatus);
    } catch (error) {
      console.log('Error fetching dashboard trips:', error);
      showToast({ message: 'Failed to load dashboard trips', type: 'error' });
    } finally {
      if (showLoader) {
        setLoading(false);
      }
    }
  }, [showToast]);

  useFocusEffect(
    useCallback(() => {
      fetchTripsByStatus();
    }, [fetchTripsByStatus]),
  );

  const handleRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await fetchTripsByStatus(true);
    } finally {
      setRefreshing(false);
    }
  }, [fetchTripsByStatus]);

  const handleDetailsPress = (trip: Trip) => {
    const selectedTripId = getTripId(trip);

    navigation.navigate('TripDetails', {
      selectedTripId,
      selectedTrip: trip,
    });
  };

  const renderTripSection = ({
    title,
    status,
  }: (typeof tripSections)[number]) => (
    <View key={status} style={styles.sectionContainer}>
      <View style={styles.tripTitle}>
        <AppText style={{ fontSize: s(18) }} variant="bold">
          {title}
        </AppText>
      </View>
      <FlatList
        data={tripsByStatus[status]}
        keyExtractor={(item, index) =>
          `${status}-${getTripId(item) || index.toString()}`
        }
        renderItem={({ item }) => (
          <TripCard
            vehicleId={getVehicleId(item)}
            dateTime={getTripDateTime(item.date)}
            from={item.pickupDest || 'N/A'}
            to={item.dropDest || 'N/A'}
            tripId={getTripId(item) || 'N/A'}
            status={formatStatus(item.status || status)}
            statusColor={getStatusColor(status)}
            onDetailsPress={() => handleDetailsPress(item)}
          />
        )}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        nestedScrollEnabled={true}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <AppText style={styles.emptyText}>No {title.toLowerCase()}</AppText>
          </View>
        }
      />
    </View>
  );

  return (
    <>
      <AppHeader title={'Dashboard'} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={AppColors.secondaryColor}
            colors={[AppColors.secondaryColor]}
          />
        }
        contentContainerStyle={{
          paddingBottom: vs(20),
        }}
      >
        <View>
          {loading ? (
            <DashboardSkeleton />
          ) : (
            tripSections.map(renderTripSection)
          )}
        </View>
      </ScrollView>
    </>
  );
};

export default DashBoard;

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: vs(18),
  },
  tripTitle: {
    marginBottom: s(10),
  },
  emptyContainer: {
    width: s(230),
    height: s(120),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppColors.tripBackground,
    borderRadius: s(10),
    marginRight: s(12),
    paddingHorizontal: s(12),
  },
  emptyText: {
    color: '#bcc0c9',
    fontSize: s(13),
    textAlign: 'center',
  },
});
