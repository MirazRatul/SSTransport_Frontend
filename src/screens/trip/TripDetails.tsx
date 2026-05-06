import { ActivityIndicator, StyleSheet, View, ScrollView, TouchableOpacity, Modal, FlatList } from 'react-native';
import React, { useCallback, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { container } from '../../constants/container';
import AppText from '../../components/AppText';
import CommonHeader from '../../components/CommonHeader';
import { scale as s, vs } from 'react-native-size-matters';
import { AppColors } from '../../styles/colors';
import TripDetailsCards from '../../components/trips/TripDetailsCards';
import apiClient from '../../api/api';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useToast } from '../../components/Toast/ToastContext';
import PermissionDeniedState from '../../components/PermissionDeniedState';
import { isPermissionError } from '../../utils/permissionError';

interface TripDetail {
  id: number | string;
  date?: string;
  pickupDest?: string;
  dropDest?: string;
  clientName?: string;
  clientContact?: string;
  driverId?: string | number;
  driverName?: string;
  driverRole?: string;
  driverImage?: string;
  helperId?: string | number;
  helperName?: string;
  helperRole?: string;
  helperImage?: string;
  driver?: PersonnelInfo;
  helper?: PersonnelInfo;
  vehicleRegNumber?: string;
  status?: string;
  fare?: number | string;
  goodsType?: string;
}

type PersonnelInfo = {
  id?: string | number;
  name?: string;
  role?: string;
  image?: string;
};

const getDriverInfo = (trip: TripDetail) => ({
  id: trip.driverId || trip.driver?.id,
  name: trip.driverName || trip.driver?.name,
  role: trip.driverRole || trip.driver?.role,
  image: trip.driverImage || trip.driver?.image,
});

const getHelperInfo = (trip: TripDetail) => ({
  id: trip.helperId || trip.helper?.id,
  name: trip.helperName || trip.helper?.name,
  role: trip.helperRole || trip.helper?.role,
  image: trip.helperImage || trip.helper?.image,
});

const formatDate = (date?: string) => {
  if (!date) return 'N/A';

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return date;

  return parsedDate.toLocaleDateString([], {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const formatTime = (date?: string) => {
  if (!date) return '';

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return '';

  return parsedDate.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatFare = (fare?: number | string) => {
  if (fare === undefined || fare === null || fare === '') return 'N/A';
  return `BDT ${fare}`;
};

const getStatusColor = (status?: string) => {
  switch (status?.toLowerCase()) {
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

const TripDetails = ({ route }: any) => {
  const navigation = useNavigation<any>();
  const { selectedTripId, selectedTrip } = route.params || {};
  const { showToast } = useToast();
  const tripId = selectedTripId || selectedTrip?.id?.toString();
  const [trip, setTrip] = useState<TripDetail | null>(selectedTrip || null);
  const [loading, setLoading] = useState(!selectedTrip);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const statusOptions = [
    { id: 'pending', name: 'Pending' },
    { id: 'ongoing', name: 'Ongoing' },
    { id: 'completed', name: 'Completed' },
    { id: 'cancelled', name: 'Cancelled' },
  ];

  const fetchTripDetails = useCallback(async () => {
    if (!tripId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await apiClient.get(`/trips/details/${tripId}`);
      setTrip(response.data);
      setPermissionDenied(false);
    } catch (error: any) {
      console.log('Error fetching trip details:', error);
      if (isPermissionError(error)) {
        setPermissionDenied(true);
        setTrip(null);
        return;
      }

      showToast({ message: 'Failed to load trip details', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [tripId, showToast]);

  useFocusEffect(
    useCallback(() => {
      fetchTripDetails();
    }, [fetchTripDetails]),
  );

  if (loading) {
    return (
      <SafeAreaView style={container}>
        <CommonHeader title="Trip Details" />
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={AppColors.secondaryColor} />
        </View>
      </SafeAreaView>
    );
  }

  if (!trip) {
    return (
      <SafeAreaView style={container}>
        <CommonHeader title="Trip Details" />
        {permissionDenied ? (
          <PermissionDeniedState
            title="Trip details restricted"
            message="You do not have permission to view this trip. Please contact an administrator if this access is required."
          />
        ) : (
          <View style={styles.centerContent}>
            <AppText>Failed to load trip details</AppText>
          </View>
        )}
      </SafeAreaView>
    );
  }

  const driverInfo = getDriverInfo(trip);
  const helperInfo = getHelperInfo(trip);
  const statusColor = getStatusColor(trip.status);
  const handlePersonnelPress = (person: PersonnelInfo) => {
    navigation.navigate('EmployeeDetails', {
      employeeId: person.id?.toString(),
      selectedEmployee: {
        id: person.id,
        name: person.name,
        role: person.role,
        image: person.image,
      },
    });
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!tripId) return;

    try {
      setUpdatingStatus(true);
      await apiClient.patch(`/trips/${tripId}/status?status=${newStatus}`);
      
      setTrip(prev => prev ? { ...prev, status: newStatus } : null);
      showToast({ message: 'Trip status updated successfully!', type: 'success' });
      setShowStatusModal(false);
    } catch (error: any) {
      console.log('Error updating trip status:', error);
      if (isPermissionError(error)) {
        setShowStatusModal(false);
        setPermissionDenied(true);
        setTrip(null);
        return;
      }

      showToast({ message: 'Failed to update trip status', type: 'error' });
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <SafeAreaView style={container}>
      <CommonHeader title="Trip Details" />
      <View style={styles.idContainer}>
        <AppText style={styles.text}>Trip ID:</AppText>
        <AppText variant="bold" style={styles.idText}>
          {trip.id}
        </AppText>
        <TouchableOpacity
          onPress={() => setShowStatusModal(true)}
          style={[
            styles.statusContainer,
            styles.statusAlign,
            { backgroundColor: statusColor },
          ]}
        >
          <AppText style={styles.textStatus}>{trip.status || 'N/A'}</AppText>
        </TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <TripDetailsCards
          title="Client Details"
          subHeading1="Client Name"
          subHeading2="Contact Number"
          subHeadingValue1={trip.clientName || 'N/A'}
          subHeadingValue2={trip.clientContact || 'N/A'}
          callNumber={trip.clientContact}
          type="client"
        />
        <TripDetailsCards
          title="Route Information"
          subHeading1="Pickup Location"
          subHeading2="Destination Location"
          subHeadingValue1={trip.pickupDest || 'N/A'}
          subHeadingValue2={trip.dropDest || 'N/A'}
        />
        <TripDetailsCards
          title="Fare Details"
          subHeading1="Fare Amount"
          subHeadingValue1={formatFare(trip.fare)}
          type="fare"
        />
        <TripDetailsCards
          title="Vehicle & Personal"
          subHeading1="Vehicle Details"
          subHeadingValue1={trip.vehicleRegNumber || 'N/A'}
          personnel={[
            driverInfo,
            helperInfo,
          ]}
          onPersonnelPress={handlePersonnelPress}
        />
        <TripDetailsCards
          title="Logistics"
          subHeading1="Date"
          subHeading2="Goods Type"
          subHeadingValue1={formatDate(trip.date)}
          subHeadingRight1="Time"
          subHeadingRightValue1={formatTime(trip.date)}
          subHeadingValue2={trip.goodsType || 'N/A'}
        />
      </ScrollView>

      {/* Status Update Modal */}
      <Modal visible={showStatusModal} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => !updatingStatus && setShowStatusModal(false)}
          disabled={updatingStatus}
        >
          <View style={styles.modalContent}>
            <AppText style={styles.modalTitle}>Update Trip Status</AppText>
            <FlatList
              data={statusOptions}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalItem,
                    trip?.status?.toLowerCase() === item.id && styles.modalItemSelected,
                  ]}
                  onPress={() => handleStatusUpdate(item.id)}
                  disabled={updatingStatus}
                >
                  <AppText
                    style={[
                      styles.modalItemText,
                      trip?.status?.toLowerCase() === item.id && styles.modalItemTextSelected,
                    ]}
                  >
                    {item.name}
                  </AppText>
                  {updatingStatus && trip?.status?.toLowerCase() === item.id && (
                    <ActivityIndicator size="small" color={AppColors.secondaryColor} />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

export default TripDetails;

const styles = StyleSheet.create({
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  idContainer: {
    paddingVertical: s(10),
    paddingHorizontal: vs(15),
    alignItems: 'flex-start',
    backgroundColor: AppColors.cardColor,
    borderRadius: s(10),
    marginVertical: vs(10),
  },
  text: {
    fontSize: s(13),
    marginVertical: vs(7),
  },
  textStatus: {
    fontSize: s(13),
    color: AppColors.primaryColor,
  },
  idText: {
    color: AppColors.secondaryColor,
    marginBottom: vs(20),
    fontSize: s(20),
  },
  statusContainer: {
    backgroundColor: AppColors.secondaryColor,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: s(5),
    paddingHorizontal: s(10),
    borderRadius: s(20),
  },
  statusAlign: {
    alignSelf: 'flex-end',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: AppColors.cardColor,
    borderTopLeftRadius: s(12),
    borderTopRightRadius: s(12),
    maxHeight: '50%',
    paddingBottom: vs(20),
  },
  modalTitle: {
    color: AppColors.textColor,
    fontSize: s(16),
    fontWeight: 'bold',
    paddingVertical: vs(12),
    paddingHorizontal: s(16),
    borderBottomColor: AppColors.inputColor,
    borderBottomWidth: 1,
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: vs(12),
    paddingHorizontal: s(16),
    borderBottomColor: AppColors.inputColor,
    borderBottomWidth: 1,
  },
  modalItemSelected: {
    backgroundColor: AppColors.secondaryColor + '20',
  },
  modalItemText: {
    color: AppColors.textColor,
    fontSize: s(14),
  },
  modalItemTextSelected: {
    color: AppColors.secondaryColor,
    fontWeight: 'bold',
  },
});
