import { FlatList, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppText from '../../components/AppText';
import { container } from '../../constants/container';
import AppHeader from '../../components/AppHeader';
import VehiclesCard from '../../components/vehicles/VehiclesCard';
import { useNavigation } from '@react-navigation/native';

type Vehicle = {
  id: number;
  name: string;
  size: string;
  capacity: string;
  vehicleStatus: string;
  imageURI: string;
  type?: string;
};

const VehiclesList = () => {
  const navigation = useNavigation<any>();
  const vehicleData: Vehicle[] = [
    {
      id: 1,
      name: 'ABC 123',
      size: 'Heavy Truck',
      capacity: '20 Tons',
      vehicleStatus: 'Active',
      imageURI: 'https://apparelresources.com/wp-content/uploads/2025/12/Bangladesh-launches-digital-tracking-for-cross-border-cargo-trucks.jpg',
    },
    {
      id: 2,
      name: 'DEF 123',
      size: 'Heavy Truck',
      capacity: '20 Tons',
      vehicleStatus: 'Active',
      imageURI: 'https://apparelresources.com/wp-content/uploads/2025/12/Bangladesh-launches-digital-tracking-for-cross-border-cargo-trucks.jpg',
    },
    {
      id: 3,
      name: 'GHI 123',
      size: 'Heavy Truck',
      capacity: '20 Tons',
      vehicleStatus: 'Active',
      imageURI: 'https://apparelresources.com/wp-content/uploads/2025/12/Bangladesh-launches-digital-tracking-for-cross-border-cargo-trucks.jpg',
    },
    {
      id: 4,
      name: 'JKL 123',
      size: 'Heavy Truck',
      capacity: '20 Tons',
      vehicleStatus: 'Active',
      imageURI: 'https://apparelresources.com/wp-content/uploads/2025/12/Bangladesh-launches-digital-tracking-for-cross-border-cargo-trucks.jpg',
    },
    {
      id: 5,
      name: 'MNO 123',
      size: 'Heavy Truck',
      capacity: '20 Tons',
      vehicleStatus: 'Active',
      imageURI: 'https://apparelresources.com/wp-content/uploads/2025/12/Bangladesh-launches-digital-tracking-for-cross-border-cargo-trucks.jpg',
    },
    {
      id: 6,
      name: 'PQR 123',
      size: 'Heavy Truck',
      capacity: '20 Tons',
      vehicleStatus: 'On Trip',
      imageURI: 'https://apparelresources.com/wp-content/uploads/2025/12/Bangladesh-launches-digital-tracking-for-cross-border-cargo-trucks.jpg',
      type: 'onTrip',
    },
    {
      id: 7,
      name: 'STU 123',
      size: 'Heavy Truck',
      capacity: '20 Tons',
      vehicleStatus: 'Maintenance',
      imageURI: 'https://apparelresources.com/wp-content/uploads/2025/12/Bangladesh-launches-digital-tracking-for-cross-border-cargo-trucks.jpg',
      type: 'maintenance',
    },
  ];

  const navigateToDetails = (vehicle: Vehicle) => {
    navigation.navigate('VehicleDetails', {
      selectedVehicle: vehicle
    })
  }

  return (
    <>
      <AppHeader title="Vehicles" />
      <View style={container}>
        <FlatList
          data={vehicleData}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <VehiclesCard
              imageURI={item.imageURI}
              name={item.name}
              size={item.size}
              capacity={item.capacity}
              vehicleStatus={item.vehicleStatus}
              type={item.type}
              onPress={() => navigateToDetails(item)}
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </>
  );
};

export default VehiclesList;

const styles = StyleSheet.create({});
