import {
  Alert,
  Image,
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
  const employeeInfo = [
    {
      uniqueId: 'UID-876543',
      contactNumber: '+8801704825020',
      nidNumber: '286-330-8389',
      role: 'Driver',
      drivingLicense: 'DL-ABC=987654',
    },
  ];
  const { selectedEmployee } = route.params;
  return (
    <SafeAreaView style={container}>
      <CommonHeader title="Employee Details" />
      {selectedEmployee && (
        <ScrollView
          style={styles.detailsContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.nameSection}>
            <Image
              source={{ uri: selectedEmployee.imageURI }}
              style={styles.image}
            />
            <AppText style={{ fontSize: s(20) }} variant="bold">
              {selectedEmployee.name}
            </AppText>
            <AppText style={{ fontSize: s(13) }}>
              {selectedEmployee.title}
            </AppText>
          </View>
          <View style={styles.separator} />
          <View style={styles.callContainer}>
            <TouchableOpacity style={styles.btn}>
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
            {employeeInfo.map(item => (
              <View style={styles.info} key={item.uniqueId}>
                <AppText style={styles.infoTextTitle}>Unique ID</AppText>
                <AppText style={styles.infoText}>{item.uniqueId}</AppText>
                <View style={styles.separator} />

                <AppText style={styles.infoTextTitle}>Contact Number</AppText>
                <AppText style={styles.infoText}>{item.contactNumber}</AppText>
                <View style={styles.separator} />

                <AppText style={styles.infoTextTitle}>NID Number</AppText>
                <AppText style={styles.infoText}>{item.nidNumber}</AppText>
                <View style={styles.separator} />

                <AppText style={styles.infoTextTitle}>Role</AppText>
                <AppText style={styles.infoText}>{item.role}</AppText>
                <View style={styles.separator} />

                <AppText style={styles.infoTextTitle}>Driving License</AppText>
                <AppText style={styles.infoText}>{item.drivingLicense}</AppText>
              </View>
            ))}
          </View>
          <View style={styles.nidContainer}>
            <AppText style={{ fontSize: s(16) }} variant="bold">
              Identity Documents
            </AppText>
            <Image
              source={{
                uri: 'https://imgv2-2-f.scribdassets.com/img/document/658369602/original/a9e0b3a4b2/1?v=1',
              }}
              style={styles.nidImage}
            />
          </View>
        </ScrollView>
      )}
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
