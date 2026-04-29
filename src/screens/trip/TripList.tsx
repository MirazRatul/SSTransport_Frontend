import { FlatList, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useMemo, useState } from 'react';
import AppText from '../../components/AppText';
import AppHeader from '../../components/AppHeader';
import { container } from '../../constants/container';
import AllTripsCard from '../../components/trips/AllTripsCard';
import AppInput from '../../components/AppInput';
import { useNavigation } from '@react-navigation/native';
import TripDetails from './TripDetails';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus } from 'lucide-react-native';
import { AppColors } from '../../styles/colors';
import { scale as s } from 'react-native-size-matters';

const TripList = () => {
  const navigation = useNavigation<any>();
  const [searchText, setSearchText] = useState('');
  const tripDetails = [
    {
      tripUID: 'TRP-2023001',
      date: '2023-10-26',
      time: '09:30 AM',
      vehicleName: 'ABC 123',
    },
    {
      tripUID: 'TRP-2023002',
      date: '2023-10-27',
      time: '11:00 AM',
      vehicleName: 'DEF 456',
    },
    {
      tripUID: 'TRP-2023003',
      date: '2023-10-28',
      time: '02:15 PM',
      vehicleName: 'GHI 789',
    },
    {
      tripUID: 'TRP-2023004',
      date: '2023-10-29',
      time: '08:45 AM',
      vehicleName: 'JKL 321',
    },
    {
      tripUID: 'TRP-2023005',
      date: '2023-10-30',
      time: '04:30 PM',
      vehicleName: 'MNO 654',
    },
    {
      tripUID: 'TRP-2023006',
      date: '2023-10-31',
      time: '10:00 AM',
      vehicleName: 'PQR 987',
    },
  ];

  const handleTripClick = (tripUid: any) => {
    navigation.navigate('TripDetails', {
      selectedTripId: tripUid,
    });
  };

  const handleAddTrip = () => {
    navigation.navigate('AddTrip');
  };

  const filteredData = useMemo(() => {
    let data = tripDetails;

    if (searchText.trim() !== '') {
      data = data.filter(item =>
        item.tripUID.toLowerCase().includes(searchText.toLowerCase()),
      );
    }

    return data;
  }, [searchText, tripDetails]);

  return (
    <>
      <AppHeader title="Trips" />
      <SafeAreaView style={container} edges={['bottom']}>
        <AppInput
          type="search"
          placeholder="Search Trip..."
          onChangeText={setSearchText}
        />
        <FlatList
          data={filteredData}
          keyExtractor={item => item.tripUID.toString()}
          renderItem={({ item }) => (
            <AllTripsCard
              tripUID={item.tripUID}
              date={item.date}
              time={item.time}
              vehicleName={item.vehicleName}
              onPress={() => handleTripClick(item.tripUID)}
            />
          )}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            searchText.length > 0 ? (
              <View style={styles.noDataFound}>
                <AppText>No Result Found!!</AppText>
              </View>
            ): (
              null
            )
          }
        />
      </SafeAreaView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleAddTrip}
        activeOpacity={0.7}
      >
        <Plus size={28} color={AppColors.textColor} />
      </TouchableOpacity>
    </>
  );
};

export default TripList;

const styles = StyleSheet.create({
  noDataFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
