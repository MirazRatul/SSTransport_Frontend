import {
  Alert,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { AppColors } from '../../styles/colors';
import { scale as s, vs } from 'react-native-size-matters';
import AppText from '../../components/AppText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { container } from '../../constants/container';
import CommonHeader from '../../components/CommonHeader';
import AppButton from '../../components/AppButton';
import { Phone, MessageSquare } from 'lucide-react-native';

const EmployeeDetails = ({ route }: any) => {
  const { selectedEmployee } = route.params;

  if (!selectedEmployee) {
    return (
      <SafeAreaView style={container}>
        <CommonHeader title="Employee Details" />
        <View style={styles.centerContainer}>
          <AppText>No employee data available</AppText>
        </View>
      </SafeAreaView>
    );
  }

  const handleCall = async () => {
    if (!selectedEmployee.contact) {
      Alert.alert('Error', 'Contact number not available');
      return;
    }
    try {
      await Linking.openURL(`tel:${selectedEmployee.contact}`);
    } catch (error) {
      Alert.alert('Error', 'Unable to make call');
      console.error('Call error:', error);
    }
  };

  return (
    <SafeAreaView style={container}>
      <CommonHeader title="Employee Details" />
      <ScrollView
        style={styles.detailsContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.nameSection}>
          <Image
            source={{ uri: selectedEmployee.image }}
            style={styles.image}
          />
          <AppText style={{ fontSize: s(20) }} variant="bold">
            {selectedEmployee.name}
          </AppText>
          <AppText style={{ fontSize: s(13) }}>
            {selectedEmployee.role}
          </AppText>
        </View>
        <View style={styles.separator} />
        <View style={styles.callContainer}>
          <TouchableOpacity style={styles.btn} onPress={handleCall}>
            <View style={styles.btnInside}>
              <Phone size={s(15)} color={AppColors.primaryColor} />
              <AppText
                variant="bold"
                style={[styles.text, { color: AppColors.primaryColor }]}
              >
                Call
              </AppText>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.btn,
              {
                backgroundColor: 'transparent',
                borderWidth: 1,
                borderColor: AppColors.secondaryColor,
              },
            ]}
          >
            <View style={styles.btnInside}>
              <MessageSquare size={s(15)} color={AppColors.secondaryColor} />
              <AppText
                variant="bold"
                style={[styles.text, { color: AppColors.secondaryColor }]}
              >
                Message
              </AppText>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.separator} />
        <View style={styles.employeeInfoContainer}>
          <View style={styles.info}>
            <AppText style={styles.infoTextTitle}>Employee ID</AppText>
            <AppText style={styles.infoText}>{selectedEmployee.id}</AppText>
            <View style={styles.separator} />

            <AppText style={styles.infoTextTitle}>Contact Number</AppText>
            <AppText style={styles.infoText}>{selectedEmployee.contact}</AppText>
            <View style={styles.separator} />

            <AppText style={styles.infoTextTitle}>NID Number</AppText>
            <AppText style={styles.infoText}>{selectedEmployee.nidNo}</AppText>
            <View style={styles.separator} />

            <AppText style={styles.infoTextTitle}>Role</AppText>
            <AppText style={styles.infoText}>{selectedEmployee.role}</AppText>
            <View style={styles.separator} />

            <AppText style={styles.infoTextTitle}>Driving License</AppText>
            <AppText style={styles.infoText}>
              {selectedEmployee.drivingLicenseNo || 'N/A'}
            </AppText>
          </View>
        </View>
        {selectedEmployee.nidPic && (
          <View style={styles.nidContainer}>
            <AppText style={{ fontSize: s(16) }} variant="bold">
              NID Document
            </AppText>
            <Image
              source={{ uri: selectedEmployee.nidPic }}
              style={styles.nidImage}
            />
          </View>
        )}
        {selectedEmployee.drivingLicenseImg && (
          <View style={styles.nidContainer}>
            <AppText style={{ fontSize: s(16) }} variant="bold">
              Driving License
            </AppText>
            <Image
              source={{ uri: selectedEmployee.drivingLicenseImg }}
              style={styles.nidImage}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default EmployeeDetails;

const styles = StyleSheet.create({
  detailsContainer: {
    flex: 1,
    padding: s(10),
    borderRadius: s(10),
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: AppColors.cardColor,
    marginVertical: vs(8),
  },
  nameSection: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: s(10),
    padding: s(10),
  },
  callContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  btn: {
    backgroundColor: AppColors.secondaryColor,
    paddingHorizontal: s(30),
    paddingVertical: s(8),
    borderWidth: 1,
    borderRadius: s(5),
    width: '48%',
  },
  btnInside: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    marginStart: s(10),
  },
  image: {
    height: s(80),
    width: s(80),
    borderRadius: s(40),
    marginBottom: vs(10),
  },
  employeeInfoContainer: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginVertical: vs(10),
  },
  info: {
    width: '100%',
  },
  infoTextTitle: {
    fontSize: s(12),
    fontWeight: 500,
  },
  infoText: {
    fontSize: s(15),
    fontWeight: 900,
  },
  nidContainer: {
    marginVertical: vs(20),
  },
  nidImage: {
    marginVertical: vs(10),
    height: s(200),
    width: s(300),
    resizeMode: 'contain',
    overflow: 'hidden',
    borderRadius: s(10),
  },
});
