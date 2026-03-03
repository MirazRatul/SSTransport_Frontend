import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { container } from '../../constants/container';
import AppText from '../../components/AppText';
import { scale as s, vs } from 'react-native-size-matters';
import { AppColors } from '../../styles/colors';
import CommonHeader from '../../components/CommonHeader';
import EmployeeCard from '../../components/EmployeeCard';
import { useNavigation } from '@react-navigation/native';
import AppButton from '../../components/AppButton';

const VehiclesDetails = ({ route }: any) => {
  const navigation = useNavigation();
  const tripDetails = [
    {
      tripId: 'TRP001',
      from: 'Dhaka',
      to: 'Chittagong',
      date: '2023-11-20',
    },
    {
      tripId: 'TRP02',
      from: 'Dhaka',
      to: 'Chittagong',
      date: '2023-11-15',
    },
    {
      tripId: 'TRP003',
      from: 'Dhaka',
      to: 'Chittagong',
      date: '2023-11-10',
    },
  ];

  const { selectedVehicle } = route.params;
  return (
    <SafeAreaView style={[container, {paddingBottom: s(10)}]}>
      <CommonHeader title="Vehicle Details" />
      <ScrollView style={styles.detailsContainer} contentContainerStyle={{
        paddingBottom: vs(20)
      }}>
        <View style={styles.informationCard}>
          <AppText
            style={{ marginBottom: s(10), fontSize: s(18) }}
            variant="bold"
          >
            Vehicle Information
          </AppText>
          <View style={styles.innerContainer}>
            <AppText style={styles.innerText}>Plate Number</AppText>
            <AppText style={styles.innerText}>Plate Number</AppText>
          </View>
          <View style={styles.innerContainer}>
            <AppText style={styles.innerText}>Size</AppText>
            <AppText style={styles.innerText}>Size</AppText>
          </View>
          <View style={styles.innerContainer}>
            <AppText style={styles.innerText}>Capacity</AppText>
            <AppText style={styles.innerText}>Capacity</AppText>
          </View>
          <View style={styles.innerContainer}>
            <AppText style={styles.innerText}>Current Status</AppText>
            <View
              style={[
                styles.statusContainer,
                {
                  borderColor:
                    selectedVehicle.type === 'maintenance'
                      ? '#e77878'
                      : selectedVehicle.type === 'onTrip'
                      ? AppColors.textColor
                      : AppColors.secondaryColor,
                },
                {
                  backgroundColor:
                    selectedVehicle.type === 'maintenance'
                      ? '#e77878'
                      : selectedVehicle.type === 'onTrip'
                      ? `${AppColors.cardColor}1A`
                      : `${AppColors.secondaryColor}1A`,
                },
              ]}
            >
              <AppText style={{ fontSize: s(10) }}>
                {selectedVehicle.vehicleStatus}
              </AppText>
            </View>
          </View>
        </View>
        <EmployeeCard
          heading="Assigned Driver"
          onPress={() => Alert.alert('Employee Selected')}
          name="Aminul Islam"
          role="Driver"
          imageURI="https://img.freepik.com/premium-vector/man-avatar-profile-picture-isolated-background-avatar-profile-picture-man_1293239-4841.jpg?semt=ais_hybrid&w=740&q=80"
        />

        <View style={styles.summaryContainer}>
          <AppText variant="bold" style={styles.summaryText}>
            Recent Trips Summary
          </AppText>
          {tripDetails.map((item, index) => (
            <>
              <View style={styles.tripParent} key={item.tripId}>
                <View style={styles.tripChild}>
                  <AppText variant="bold">Trip ID: {item.tripId}</AppText>
                  <AppText style={styles.destinationText}>
                    {item.from} to {item.to}
                  </AppText>
                </View>
                <AppText style={styles.destinationText}>{item.date}</AppText>
              </View>
              <View style={styles.separator} key={index} />
            </>
          ))}
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
  tripChild: {},
  btn1: {
    width: '100%',
    height: s(45),
    marginBottom: s(14)
  },
  btn2: {
    width: '100%',
    height: s(45),
    backgroundColor: 'transparent',
    borderWidth: s(1),
    borderColor: AppColors.cardColor,
  }
});
