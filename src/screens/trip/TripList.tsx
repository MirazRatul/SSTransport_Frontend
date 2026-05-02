import {
  ActivityIndicator,
  FlatList,
  Modal,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import React, { useCallback, useMemo, useState } from 'react';
import AppText from '../../components/AppText';
import AppHeader from '../../components/AppHeader';
import { container } from '../../constants/container';
import AllTripsCard from '../../components/trips/AllTripsCard';
import AppInput from '../../components/AppInput';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus } from 'lucide-react-native';
import { AppColors } from '../../styles/colors';
import { scale as s } from 'react-native-size-matters';
import apiClient from '../../api/api';
import { useToast } from '../../components/Toast/ToastContext';

type Trip = {
  id?: string | number;
  tripUID?: string;
  tripUid?: string;
  date?: string;
  time?: string;
  vehicleRegNumber?: string;
  vehicleName?: string;
  vehicle?: {
    regNumber?: string;
    name?: string;
  };
  vehicleId?: string | number;
};

const getTripUid = (trip: Trip) =>
  trip.tripUID || trip.tripUid || trip.id?.toString() || '';

const getVehicleName = (trip: Trip) =>
  trip.vehicleRegNumber ||
  trip.vehicleName ||
  trip.vehicle?.regNumber ||
  trip.vehicle?.name ||
  trip.vehicleId?.toString() ||
  'N/A';

const getTripDate = (trip: Trip) => {
  if (!trip.date) return '';
  return trip.date.split('T')[0];
};

const getTripTime = (trip: Trip) => {
  if (trip.time) return trip.time;
  if (!trip.date || !trip.date.includes('T')) return '';

  return new Date(trip.date).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const TripList = () => {
  const navigation = useNavigation<any>();
  const { showToast } = useToast();
  const [searchText, setSearchText] = useState('');
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [tripToDelete, setTripToDelete] = useState<Trip | null>(null);

  const fetchTrips = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/trips');
      const tripsData = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];
      setTrips(tripsData);
    } catch (error) {
      console.log('Error fetching trips:', error);
      showToast({ message: 'Failed to load trips', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useFocusEffect(
    useCallback(() => {
      fetchTrips();
    }, [fetchTrips]),
  );

  const handleTripClick = (trip: Trip) => {
    navigation.navigate('TripDetails', {
      selectedTripId: trip.id?.toString() || getTripUid(trip),
    });
  };

  const handleAddTrip = () => {
    navigation.navigate('AddTrip');
  };

  const handleEditTrip = (trip: Trip) => {
    navigation.navigate('AddTrip', {
      mode: 'edit',
      tripId: trip.id?.toString() || getTripUid(trip),
    });
  };

  const openDeleteConfirm = (trip: Trip) => {
    setTripToDelete(trip);
  };

  const closeDeleteConfirm = () => {
    if (!deleting) {
      setTripToDelete(null);
    }
  };

  const handleDeleteTrip = async () => {
    if (!tripToDelete) return;

    const tripId = tripToDelete.id?.toString() || getTripUid(tripToDelete);
    if (!tripId) {
      showToast({ message: 'Trip id not found', type: 'error' });
      setTripToDelete(null);
      return;
    }

    try {
      setDeleting(true);
      await apiClient.delete(`/trips/${tripId}`);
      setTrips(currentTrips =>
        currentTrips.filter(item => (item.id?.toString() || getTripUid(item)) !== tripId),
      );
      setTripToDelete(null);
      showToast({ message: 'Trip deleted successfully', type: 'success' });
    } catch (error: any) {
      console.log('Error deleting trip:', error);
      showToast({
        message: error?.response?.data?.message || 'Failed to delete trip',
        type: 'error',
      });
    } finally {
      setDeleting(false);
    }
  };

  const filteredData = useMemo(() => {
    let data = trips;

    if (searchText.trim() !== '') {
      data = data.filter(item =>
        getTripUid(item).toLowerCase().includes(searchText.toLowerCase()),
      );
    }

    return data;
  }, [searchText, trips]);

  if (loading) {
    return (
      <>
        <AppHeader title="Trips" />
        <View style={[container, styles.centerContent]}>
          <ActivityIndicator size="large" color={AppColors.secondaryColor} />
        </View>
      </>
    );
  }

  return (
    <>
      <AppHeader title="Trips" />
      <SafeAreaView style={container} edges={['bottom']}>
        <Modal
          visible={!!tripToDelete}
          transparent
          animationType="fade"
          onRequestClose={closeDeleteConfirm}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.confirmModal}>
              <AppText variant="bold" style={styles.confirmTitle}>
                Delete Trip?
              </AppText>
              <AppText style={styles.confirmMessage}>
                Are you sure you want to delete trip{' '}
                {tripToDelete ? getTripUid(tripToDelete) : ''}?
              </AppText>
              <View style={styles.confirmActions}>
                <TouchableOpacity
                  style={[styles.confirmButton, styles.cancelButton]}
                  onPress={closeDeleteConfirm}
                  disabled={deleting}
                >
                  <AppText style={styles.cancelButtonText}>Cancel</AppText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.confirmButton, styles.deleteConfirmButton]}
                  onPress={handleDeleteTrip}
                  disabled={deleting}
                >
                  {deleting ? (
                    <ActivityIndicator size="small" color={AppColors.textColor} />
                  ) : (
                    <AppText variant="bold" style={styles.deleteButtonText}>
                      Delete
                    </AppText>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <View style={styles.searchRow}>
          <AppInput
            type="search"
            placeholder="Search Trip..."
            onChangeText={setSearchText}
            containerStyle={styles.searchInput}
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddTrip}
            activeOpacity={0.7}
          >
            <Plus size={s(24)} color={AppColors.textColor} />
          </TouchableOpacity>
        </View>
        <FlatList
          data={filteredData}
          keyExtractor={(item, index) => getTripUid(item) || index.toString()}
          renderItem={({ item }) => (
            <AllTripsCard
              tripUID={getTripUid(item)}
              date={getTripDate(item)}
              time={getTripTime(item)}
              vehicleName={getVehicleName(item)}
              onPress={() => handleTripClick(item)}
              onEditPress={() => handleEditTrip(item)}
              onDeletePress={() => openDeleteConfirm(item)}
            />
          )}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            searchText.length > 0 ? (
              <View style={styles.noDataFound}>
                <AppText>No Result Found!!</AppText>
              </View>
            ) : (
              <View style={styles.noDataFound}>
                <AppText style={styles.emptyText}>
                  No trips found. Add one to get started!
                </AppText>
              </View>
            )
          }
        />
      </SafeAreaView>
    </>
  );
};

export default TripList;

const styles = StyleSheet.create({
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: s(16),
    color: AppColors.textColor,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(10),
    marginBottom: s(10),
  },
  searchInput: {
    flex: 1,
    marginBottom: 0,
  },
  addButton: {
    width: s(40),
    height: s(40),
    borderRadius: s(5),
    backgroundColor: AppColors.secondaryColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: s(20),
  },
  confirmModal: {
    width: '100%',
    backgroundColor: AppColors.cardColor,
    borderRadius: s(10),
    padding: s(18),
  },
  confirmTitle: {
    fontSize: s(18),
    marginBottom: s(8),
  },
  confirmMessage: {
    fontSize: s(13),
    color: '#bcc0c9',
    marginBottom: s(18),
  },
  confirmActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: s(10),
  },
  confirmButton: {
    minWidth: s(90),
    height: s(40),
    borderRadius: s(6),
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: AppColors.inputColor,
  },
  cancelButtonText: {
    color: AppColors.textColor,
  },
  deleteConfirmButton: {
    backgroundColor: AppColors.tripStatusCancelled,
  },
  deleteButtonText: {
    color: AppColors.textColor,
  },
});
