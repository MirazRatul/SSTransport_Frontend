import { FlatList, StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppText from '../../components/AppText';
import { container } from '../../constants/container';
import AppHeader from '../../components/AppHeader';
import VehiclesCard from '../../components/vehicles/VehiclesCard';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Plus } from 'lucide-react-native';
import { AppColors } from '../../styles/colors';
import apiClient from '../../api/api';
import { scale as s } from 'react-native-size-matters';
import { useToast } from '../../components/Toast/ToastContext';

type Vehicle = {
  id: string;
  regNumber: string;
  vehicleSize: string;
  capacity: string;
  assignedDriver?: string;
  assignedHelper?: string;
  regCard?: string;
  fitnessCertificate?: string;
  lastMaintenanceDate?: string;
  partsFixed?: string;
};

const VehiclesList = () => {
  const navigation = useNavigation<any>();
  const { showToast } = useToast();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch vehicles from API
  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/vehicles');
      setVehicles(response.data);
    } catch (error) {
      console.log('Error fetching vehicles:', error);
      showToast({ message: 'Failed to load vehicles', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Fetch vehicles on component mount
  useEffect(() => {
    fetchVehicles();
  }, []);

  // Refresh vehicles when screen is focused (returning from AddVehicle)
  useFocusEffect(
    React.useCallback(() => {
      fetchVehicles();
    }, [])
  );

  const navigateToDetails = (vehicle: Vehicle) => {
    navigation.navigate('VehicleDetails', {
      selectedVehicle: vehicle
    })
  }

  const handleAddVehicle = () => {
    navigation.navigate('AddVehicle');
  };

  if (loading) {
    return (
      <>
        <AppHeader title="Vehicles" />
        <View style={[container, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color={AppColors.secondaryColor} />
        </View>
      </>
    );
  }

  return (
    <>
      <AppHeader title="Vehicles" />
      <View style={container}>
        {vehicles.length === 0 ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <AppText style={{ fontSize: s(16), color: AppColors.textColor }}>
              No vehicles found. Add one to get started!
            </AppText>
          </View>
        ) : (
          <FlatList
            data={vehicles}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <VehiclesCard
                imageURI={'https://apparelresources.com/wp-content/uploads/2025/12/Bangladesh-launches-digital-tracking-for-cross-border-cargo-trucks.jpg'}
                name={item.regNumber}
                size={item.vehicleSize}
                capacity={item.capacity}
                vehicleStatus={item.assignedDriver ? 'Active' : 'Available'}
                onPress={() => navigateToDetails(item)}
              />
            )}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
      
      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleAddVehicle}
        activeOpacity={0.7}
      >
        <Plus size={28} color={AppColors.textColor} />
      </TouchableOpacity>
    </>
  );
};

export default VehiclesList;

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: AppColors.secondaryColor,
    opacity: 0.9,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
