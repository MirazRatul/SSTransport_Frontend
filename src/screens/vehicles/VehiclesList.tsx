import { FlatList, StyleSheet, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
import AppInput from '../../components/AppInput';

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
  const [searchText, setSearchText] = useState('');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch vehicles from API
  const fetchVehicles = useCallback(async () => {
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
  }, [showToast]);

  // Fetch vehicles on component mount
  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  // Refresh vehicles when screen is focused (returning from AddVehicle)
  useFocusEffect(
    React.useCallback(() => {
      fetchVehicles();
    }, [fetchVehicles])
  );

  const navigateToDetails = (vehicle: Vehicle) => {
    navigation.navigate('VehicleDetails', {
      selectedVehicle: vehicle
    })
  }

  const handleAddVehicle = () => {
    navigation.navigate('AddVehicle');
  };

  const filteredVehicles = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    if (!query) return vehicles;

    return vehicles.filter(vehicle =>
      [
        vehicle.regNumber,
        vehicle.vehicleSize,
        vehicle.capacity,
        vehicle.assignedDriver,
        vehicle.assignedHelper,
      ]
        .filter(Boolean)
        .some(value => String(value).toLowerCase().includes(query)),
    );
  }, [searchText, vehicles]);

  if (loading) {
    return (
      <>
        <AppHeader title="Vehicles" />
        <View style={[container, styles.centerContent]}>
          <ActivityIndicator size="large" color={AppColors.secondaryColor} />
        </View>
      </>
    );
  }

  return (
    <>
      <AppHeader title="Vehicles" />
      <View style={container}>
        <View style={styles.searchRow}>
          <AppInput
            type="search"
            placeholder="Search Vehicle..."
            onChangeText={setSearchText}
            containerStyle={styles.searchInput}
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddVehicle}
            activeOpacity={0.7}
          >
            <Plus size={s(24)} color={AppColors.textColor} />
          </TouchableOpacity>
        </View>
        {filteredVehicles.length === 0 ? (
          <View style={styles.centerContent}>
            <AppText style={{ fontSize: s(16), color: AppColors.textColor }}>
              {searchText.length > 0
                ? 'No Result Found!!'
                : 'No vehicles found. Add one to get started!'}
            </AppText>
          </View>
        ) : (
          <FlatList
            data={filteredVehicles}
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
    </>
  );
};

export default VehiclesList;

const styles = StyleSheet.create({
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(10),
    marginTop: s(10),
    marginBottom: s(10),
  },
  searchInput: {
    flex: 1,
    marginBottom: 0,
  },
  addButton: {
    width: s(40),
    height: s(40),
    borderRadius: s(20),
    backgroundColor: AppColors.secondaryColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
