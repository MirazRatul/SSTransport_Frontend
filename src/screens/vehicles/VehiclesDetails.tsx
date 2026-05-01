import {
  Alert,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Modal,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { container } from '../../constants/container';
import AppText from '../../components/AppText';
import { scale as s, vs } from 'react-native-size-matters';
import { AppColors } from '../../styles/colors';
import CommonHeader from '../../components/CommonHeader';
import EmployeeCard from '../../components/EmployeeCard';
import { useNavigation } from '@react-navigation/native';
import AppButton from '../../components/AppButton';
import apiClient from '../../api/api';
import { useToast } from '../../components/Toast/ToastContext';

interface VehicleDetail {
  vehicleId: number;
  regNumber: string;
  vehicleSize: string;
  capacity: string;
  regCard: string;
  fitnessCertificate: string;
  lastMaintenanceDate: string;
  partsFixed: string;
  assignedDriverId: number;
  assignedDriverName: string;
  assignedDriverRole: string;
  assignedDriverImage: string;
  assignedHelperId: number;
  assignedHelperName: string;
  assignedHelperRole: string;
  assignedHelperImage: string;
}

interface RecentTrip {
  id: number | string;
  date?: string;
  pickupDest?: string;
  dropDest?: string;
  status?: string;
}

const formatTripDate = (date?: string) => {
  if (!date) return 'N/A';

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return date;

  return parsedDate.toLocaleDateString([], {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const formatTripTime = (date?: string) => {
  if (!date) return '';

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return '';

  return parsedDate.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const VehiclesDetails = ({ route }: any) => {
  const navigation = useNavigation<any>();
  const { showToast } = useToast();
  const { selectedVehicle } = route.params;
  const [vehicleDetail, setVehicleDetail] = useState<VehicleDetail | null>(
    null,
  );
  const [recentTrips, setRecentTrips] = useState<RecentTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<{
    uri: string;
    title: string;
  } | null>(null);

  useEffect(() => {
    const fetchVehicleDetails = async () => {
      try {
        setLoading(true);
        const vehicleResponse = await apiClient.get(
          `/vehicles/details/${selectedVehicle.id}`,
        );
        setVehicleDetail(vehicleResponse.data);

        try {
          const tripsResponse = await apiClient.get(
            `/trips/vehicle/${selectedVehicle.id}/recent`,
          );
          setRecentTrips(
            Array.isArray(tripsResponse.data)
              ? tripsResponse.data
              : tripsResponse.data?.data || [],
          );
        } catch (tripError) {
          console.log('Error fetching recent trips:', tripError);
          showToast({ message: 'Failed to load recent trips', type: 'error' });
        }
      } catch (error) {
        console.log('Error fetching vehicle details:', error);
        showToast({ message: 'Failed to load vehicle details', type: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleDetails();
  }, [selectedVehicle.id, showToast]);

  if (loading) {
    return (
      <SafeAreaView style={[container, { paddingBottom: s(10) }]}>
        <CommonHeader title="Vehicle Details" />
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <ActivityIndicator size="large" color={AppColors.secondaryColor} />
        </View>
      </SafeAreaView>
    );
  }

  if (!vehicleDetail) {
    return (
      <SafeAreaView style={[container, { paddingBottom: s(10) }]}>
        <CommonHeader title="Vehicle Details" />
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <AppText>Failed to load vehicle details</AppText>
        </View>
      </SafeAreaView>
    );
  }

  const vehicleStatus = vehicleDetail.assignedDriverId ? 'Active' : 'Available';

  const handleTripPress = (tripId: number | string) => {
    navigation.navigate('TripDetails', {
      selectedTripId: tripId.toString(),
    });
  };

  return (
    <SafeAreaView style={[container, { paddingBottom: s(10) }]}>
      <CommonHeader title="Vehicle Details" />

      {/* ── Full-screen Image Modal ── */}
      <Modal
        visible={!!selectedImage}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedImage(null)}
      >
        <View style={styles.modalOverlay}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <AppText style={styles.modalTitle}>{selectedImage?.title}</AppText>
            <TouchableOpacity
              onPress={() => setSelectedImage(null)}
              style={styles.closeBtn}
            >
              <AppText style={styles.closeBtnText}>✕</AppText>
            </TouchableOpacity>
          </View>

          {/* Image */}
          <View style={styles.modalImageWrapper}>
            <Image
              source={{ uri: selectedImage?.uri }}
              style={styles.modalImage}
              resizeMode="contain"
            />
          </View>
        </View>
      </Modal>

      <ScrollView
        style={styles.detailsContainer}
        contentContainerStyle={{ paddingBottom: vs(20) }}
      >
        <View style={styles.informationCard}>
          <AppText
            style={{ marginBottom: s(10), fontSize: s(18) }}
            variant="bold"
          >
            Vehicle Information
          </AppText>
          <View style={styles.innerContainer}>
            <AppText style={styles.innerText}>Registration Number</AppText>
            <AppText style={styles.innerText}>
              {vehicleDetail.regNumber}
            </AppText>
          </View>
          <View style={styles.innerContainer}>
            <AppText style={styles.innerText}>Vehicle Size</AppText>
            <AppText style={styles.innerText}>
              {vehicleDetail.vehicleSize}
            </AppText>
          </View>
          <View style={styles.innerContainer}>
            <AppText style={styles.innerText}>Capacity</AppText>
            <AppText style={styles.innerText}>{vehicleDetail.capacity}</AppText>
          </View>
          <View style={styles.innerContainer}>
            <AppText style={styles.innerText}>Last Maintenance</AppText>
            <AppText style={styles.innerText}>
              {vehicleDetail.lastMaintenanceDate}
            </AppText>
          </View>
          <View style={styles.innerContainer}>
            <AppText style={styles.innerText}>Parts Fixed</AppText>
            <AppText style={styles.innerText}>
              {vehicleDetail.partsFixed || 'N/A'}
            </AppText>
          </View>
          <View style={styles.innerContainer}>
            <AppText style={styles.innerText}>Current Status</AppText>
            <View
              style={[
                styles.statusContainer,
                {
                  borderColor:
                    vehicleStatus === 'Active'
                      ? AppColors.secondaryColor
                      : '#4CAF50',
                  backgroundColor:
                    vehicleStatus === 'Active'
                      ? `${AppColors.secondaryColor}1A`
                      : '#4CAF501A',
                },
              ]}
            >
              <AppText style={{ fontSize: s(10) }}>{vehicleStatus}</AppText>
            </View>
          </View>
        </View>

        {/* Documents */}
        <View style={styles.documentsContainer}>
          <AppText
            style={{ marginBottom: s(10), fontSize: s(14), fontWeight: 'bold' }}
          >
            Documents
          </AppText>
          <View style={styles.documentsGrid}>
            <TouchableOpacity
              style={styles.documentCard}
              onPress={() =>
                setSelectedImage({
                  uri: vehicleDetail.regCard,
                  title: 'Registration Card',
                })
              }
            >
              <Image
                source={{ uri: vehicleDetail.regCard }}
                style={styles.documentImage}
              />
              <AppText style={styles.documentLabel}>Registration Card</AppText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.documentCard}
              onPress={() =>
                setSelectedImage({
                  uri: vehicleDetail.fitnessCertificate,
                  title: 'Fitness Certificate',
                })
              }
            >
              <Image
                source={{ uri: vehicleDetail.fitnessCertificate }}
                style={styles.documentImage}
              />
              <AppText style={styles.documentLabel}>
                Fitness Certificate
              </AppText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Assigned Driver */}
        <EmployeeCard
          heading="Assigned Driver"
          onPress={() => Alert.alert('Driver Selected')}
          name={vehicleDetail.assignedDriverName}
          role={vehicleDetail.assignedDriverRole}
          imageURI={vehicleDetail.assignedDriverImage}
        />

        {/* Assigned Helper */}
        <EmployeeCard
          heading="Assigned Helper"
          onPress={() => Alert.alert('Helper Selected')}
          name={vehicleDetail.assignedHelperName}
          role={vehicleDetail.assignedHelperRole}
          imageURI={vehicleDetail.assignedHelperImage}
        />

        <View style={styles.summaryContainer}>
          <AppText variant="bold" style={styles.summaryText}>
            Recent Trips Summary
          </AppText>
          {recentTrips.length > 0 ? (
            recentTrips.map((item, index) => (
              <View key={item.id}>
                <TouchableOpacity
                  style={styles.tripParent}
                  onPress={() => handleTripPress(item.id)}
                >
                  <View style={styles.tripChild}>
                    <AppText variant="bold">Trip ID: {item.id}</AppText>
                    <AppText style={styles.destinationText}>
                      {item.pickupDest || 'N/A'} to {item.dropDest || 'N/A'}
                    </AppText>
                  </View>
                  <View style={styles.tripDateContainer}>
                    <AppText style={styles.destinationText}>
                      {formatTripDate(item.date)}
                    </AppText>
                    {formatTripTime(item.date) ? (
                      <AppText style={styles.tripTimeText}>
                        {formatTripTime(item.date)}
                      </AppText>
                    ) : null}
                  </View>
                </TouchableOpacity>
                {index < recentTrips.length - 1 ? (
                  <View style={styles.separator} />
                ) : null}
              </View>
            ))
          ) : (
            <AppText style={styles.destinationText}>
              No recent trips found
            </AppText>
          )}
        </View>

        <AppButton
          textStyle={{ fontSize: s(14), color: AppColors.primaryColor }}
          btnStyle={styles.btn1}
          title="Mark Vehicle Active"
          onPress={() => Alert.alert('Vehicle Marked')}
        />
        <AppButton
          textStyle={{ fontSize: s(14), color: AppColors.textColor }}
          btnStyle={styles.btn2}
          title="Report Issue"
          onPress={() => Alert.alert('Vehicle Marked')}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default VehiclesDetails;

const styles = StyleSheet.create({
  // ── Modal ──────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.92)',
    justifyContent: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: s(16),
    paddingTop: vs(50),
    paddingBottom: vs(12),
  },
  modalTitle: {
    color: '#fff',
    fontSize: s(16),
    fontWeight: 'bold',
  },
  closeBtn: {
    width: s(32),
    height: s(32),
    borderRadius: s(16),
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnText: {
    color: '#fff',
    fontSize: s(14),
  },
  modalImageWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: s(12),
    paddingBottom: vs(40),
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },
  // ── Existing styles ────────────────────────────
  detailsContainer: {
    flex: 1,
    paddingTop: s(20),
    paddingHorizontal: s(10),
  },
  informationCard: {
    backgroundColor: AppColors.cardColor,
    padding: s(15),
    borderRadius: s(10),
    marginBottom: vs(15),
  },
  documentsContainer: {
    backgroundColor: AppColors.cardColor,
    padding: s(15),
    borderRadius: s(10),
    marginBottom: vs(15),
  },
  documentsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  documentCard: {
    width: '48%',
    alignItems: 'center',
    backgroundColor: `${AppColors.secondaryColor}1A`,
    padding: s(10),
    borderRadius: s(8),
  },
  documentImage: {
    width: s(80),
    height: s(100),
    borderRadius: s(6),
    marginBottom: s(8),
  },
  documentLabel: {
    fontSize: s(11),
    textAlign: 'center',
    color: AppColors.textColor,
  },
  innerText: {
    fontSize: s(13),
    marginVertical: vs(8),
  },
  innerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusContainer: {
    height: s(25),
    backgroundColor: `${AppColors.secondaryColor}1A`,
    paddingVertical: s(5),
    paddingHorizontal: s(7),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: s(20),
    borderWidth: 1,
    borderColor: AppColors.secondaryColor,
  },
  summaryContainer: {
    padding: s(15),
    backgroundColor: AppColors.cardColor,
    marginVertical: vs(15),
    borderRadius: s(10),
  },
  separator: {
    height: 1,
    backgroundColor: `${AppColors.secondaryColor}1A`,
    marginVertical: vs(8),
  },
  summaryText: {
    marginBottom: vs(15),
    fontSize: s(17),
  },
  destinationText: {
    fontSize: s(13),
  },
  tripParent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tripChild: {
    flex: 1,
    marginRight: s(12),
  },
  tripDateContainer: {
    alignItems: 'flex-end',
  },
  tripTimeText: {
    fontSize: s(12),
    color: '#bcc0c9',
    marginTop: vs(2),
  },
  btn1: {
    width: '100%',
    height: s(45),
    marginBottom: s(14),
  },
  btn2: {
    width: '100%',
    height: s(45),
    backgroundColor: 'transparent',
    borderWidth: s(1),
    borderColor: AppColors.cardColor,
  },
});
