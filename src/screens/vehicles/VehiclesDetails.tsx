import { StyleSheet, View } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { container } from '../../constants/container';
import AppText from '../../components/AppText';
import { scale as s, vs } from 'react-native-size-matters';
import { AppColors } from '../../styles/colors';
import CommonHeader from '../../components/CommonHeader';

const VehiclesDetails = ({ route }: any) => {
  const {selectedVehicle} = route.params
  return (
    <SafeAreaView style={container}>
      <CommonHeader />
      <View style={styles.detailsContainer}>
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
              <AppText style={{ fontSize: s(10) }}>{selectedVehicle.vehicleStatus}</AppText>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default VehiclesDetails;

const styles = StyleSheet.create({
  detailsContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: s(20),
    paddingHorizontal: s(10),
  },
  informationCard: {
    backgroundColor: AppColors.cardColor,
    padding: s(15),
    borderRadius: s(10),
  },
  innerText: {
    fontSize: s(13),
    marginVertical: vs(8),
  },
  innerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
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
});
