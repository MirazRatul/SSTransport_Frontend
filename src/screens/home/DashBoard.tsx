import { StyleSheet, Text, View, FlatList } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppText from '../../components/AppText';
import { container } from '../../constants/container';
import AppHeader from '../../components/AppHeader';
import TripCard from '../../components/TripCard';
import { scale as s } from 'react-native-size-matters';

const DashBoard = () => {
  const tripsData = [
    {
      vehicleId: 'NYB-8092',
      time: '2h 15m (14:30 EST)',
      from: 'Dhaka',
      to: 'Chittagong',
      tripId: '$erdwr234',
      status: 'Active',
    },
    {
      vehicleId: 'DHK-4521',
      time: '1h 40m (09:10 EST)',
      from: 'Sylhet',
      to: 'Dhaka',
      tripId: '$asdkj982',
      status: 'Running',
    },
    {
      vehicleId: 'CTG-7789',
      time: '3h 05m (18:45 EST)',
      from: 'Chittagong',
      to: 'Cox’s Bazar',
      tripId: '$qweu123',
      status: 'Pending',
    },
    {
      vehicleId: 'RAJ-3390',
      time: '4h 30m (06:00 EST)',
      from: 'Rajshahi',
      to: 'Dhaka',
      tripId: '$plmnb765',
      status: 'Completed',
    },
    {
      vehicleId: 'BAR-9104445555',
      time: '2h 50m (21:20 EST)',
      from: 'Barisal',
      to: 'Khulna',
      tripId: '$zxcmv456',
      status: 'Cancelled',
    },
  ];

  return (
    <>
      <AppHeader title={'Dashboard'} />
      <View style={container}>
        <View style={styles.tripTitle}>
          <AppText style={{ fontSize: s(18) }} variant="bold">
            Active Trips
          </AppText>
        </View>
        <FlatList
          data={tripsData}
          keyExtractor={item => item.tripId.toString()}
          renderItem={({ item }) => {
            return (
              <TripCard
                type="active"
                vehicleId={item.vehicleId}
                time={item.time}
                from={item.from}
                to={item.to}
                tripId={item.tripId}
                status={item.status}
              />
            );
          }}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        />
        <View style={styles.tripTitle}>
          <AppText style={{ fontSize: s(18) }} variant="bold">
            Upcoming Trips
          </AppText>
        </View>
        <FlatList
          data={tripsData}
          keyExtractor={item => item.tripId.toString()}
          renderItem={({ item }) => {
            return (
              <TripCard
                type="upcoming"
                vehicleId={item.vehicleId}
                time={item.time}
                from={item.from}
                to={item.to}
                tripId={item.tripId}
                status={item.status}
              />
            );
          }}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </>
  );
};

export default DashBoard;

const styles = StyleSheet.create({
  tripTitle: {
    marginBottom: s(10),
  },
});
