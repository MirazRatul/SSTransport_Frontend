import { StyleSheet, View, ScrollView } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { container } from '../../constants/container';
import AppText from '../../components/AppText';
import CommonHeader from '../../components/CommonHeader';
import { scale as s, vs } from 'react-native-size-matters';
import { AppColors } from '../../styles/colors';
import TripDetailsCards from '../../components/trips/TripDetailsCards';

const TripDetails = ({ route }: any) => {
  const { selectedTripId } = route.params;
  return (
    <SafeAreaView style={container}>
      <CommonHeader title="Trip Details" />
      <View style={styles.idContainer}>
        <AppText style={styles.text}>Trip ID:</AppText>
        <AppText variant="bold" style={styles.idText}>
          {selectedTripId}
        </AppText>
        <View style={[styles.statusContainer, { alignSelf: 'flex-end' }]}>
          <AppText style={styles.textStatus}>Active</AppText>
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <TripDetailsCards
          title="Client Details"
          subHeading1="Client Name"
          subHeading2="Contact Number"
          subHeadingValue1="Alice Johnson"
          subHeadingValue2="+1(555)123-4567"
          type="client"
        />
        <TripDetailsCards
          title="Route Information"
          subHeading1="Pickup Location"
          subHeading2="Destination Location"
          subHeadingValue1="Dhaka"
          subHeadingValue2="Chittagong"
        />
        <TripDetailsCards
          title="Fare Details"
          subHeading1="Fare Amount"
          subHeadingValue1="$75.50"
          type='fare'
        />
        <TripDetailsCards
          title="Vehicle & Personal"
          subHeading1="Vehicle Details"
          subHeadingValue1="Tata Truck"
        />
        <TripDetailsCards
          title="Logistics"
          subHeading1="Date"
          subHeading2="Goods Type"
          subHeadingValue1="2024-07-20"
          subHeadingValue2="Sweater"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default TripDetails;

const styles = StyleSheet.create({
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
});
