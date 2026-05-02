import { ActivityIndicator, StyleSheet, View, ScrollView } from 'react-native';
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

  const fetchTripDetails = useCallback(async () => {
    if (!tripId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await apiClient.get(`/trips/details/${tripId}`);
      setTrip(response.data);
    } catch (error) {
      console.log('Error fetching trip details:', error);
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
        <View style={styles.centerContent}>
          <AppText>Failed to load trip details</AppText>
        </View>
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

  return (
    <SafeAreaView style={container}>
      <CommonHeader title="Trip Details" />
      <View style={styles.idContainer}>
        <AppText style={styles.text}>Trip ID:</AppText>
        <AppText variant="bold" style={styles.idText}>
          {trip.id}
        </AppText>
        <View
          style={[
            styles.statusContainer,
            styles.statusAlign,
            { backgroundColor: statusColor },
          ]}
        >
          <AppText style={styles.textStatus}>{trip.status || 'N/A'}</AppText>
        </View>
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
});
