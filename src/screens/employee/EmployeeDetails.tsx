import {
  Alert,
  ActivityIndicator,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useCallback, useState } from 'react';
import { AppColors } from '../../styles/colors';
import { scale as s, vs } from 'react-native-size-matters';
import AppText from '../../components/AppText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { container } from '../../constants/container';
import CommonHeader from '../../components/CommonHeader';
import { Phone, MessageSquare, User } from 'lucide-react-native';
import apiClient from '../../api/api';
import { useFocusEffect } from '@react-navigation/native';

interface Employee {
  id?: string | number;
  name?: string;
  image?: string;
  contact?: string;
  nidNo?: string;
  nidPic?: string;
  role?: string;
  drivingLicenseNo?: string | null;
  drivingLicenseImg?: string | null;
}

const normalizeEmployeeResponse = (data: any): Employee | null => {
  if (!data) return null;
  if (data?.data && !Array.isArray(data.data)) return data.data;
  return data;
};

const EmployeeDetails = ({ route }: any) => {
  const { selectedEmployee, employeeId } = route.params || {};
  const [employee, setEmployee] = useState<Employee | null>(
    selectedEmployee || null,
  );
  const [loading, setLoading] = useState(!selectedEmployee && !!employeeId);

  const fetchEmployeeDetails = useCallback(async () => {
    if (!employeeId) return;

    try {
      setLoading(true);
      const response = await apiClient.get(`/employees/${employeeId}`);
      const employeeData = normalizeEmployeeResponse(response.data);

      if (employeeData) {
        setEmployee(employeeData);
        return;
      }
    } catch (error) {
      console.log('Error fetching employee details:', error);

      try {
        const response = await apiClient.get('/employees');
        const employeesData = Array.isArray(response.data)
          ? response.data
          : response.data?.data || [];
        const matchedEmployee = employeesData.find(
          (item: Employee) => item.id?.toString() === employeeId?.toString(),
        );

        if (matchedEmployee) {
          setEmployee(matchedEmployee);
        }
      } catch (fallbackError) {
        console.log('Error fetching employee list:', fallbackError);
      }
    } finally {
      setLoading(false);
    }
  }, [employeeId]);

  useFocusEffect(
    useCallback(() => {
      fetchEmployeeDetails();
    }, [fetchEmployeeDetails]),
  );

  if (loading) {
    return (
      <SafeAreaView style={container}>
        <CommonHeader title="Employee Details" />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={AppColors.secondaryColor} />
        </View>
      </SafeAreaView>
    );
  }

  if (!employee) {
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
    if (!employee.contact) {
      Alert.alert('Error', 'Contact number not available');
      return;
    }
    try {
      await Linking.openURL(`tel:${employee.contact}`);
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
          {employee.image ? (
            <Image source={{ uri: employee.image }} style={styles.image} />
          ) : (
            <View style={[styles.image, styles.imagePlaceholder]}>
              <User size={s(34)} color={AppColors.textColor} />
            </View>
          )}
          <AppText style={{ fontSize: s(20) }} variant="bold">
            {employee.name || 'N/A'}
          </AppText>
          <AppText style={{ fontSize: s(13) }}>
            {employee.role || 'N/A'}
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
            <AppText style={styles.infoText}>{employee.id || 'N/A'}</AppText>
            <View style={styles.separator} />

            <AppText style={styles.infoTextTitle}>Contact Number</AppText>
            <AppText style={styles.infoText}>{employee.contact || 'N/A'}</AppText>
            <View style={styles.separator} />

            <AppText style={styles.infoTextTitle}>NID Number</AppText>
            <AppText style={styles.infoText}>{employee.nidNo || 'N/A'}</AppText>
            <View style={styles.separator} />

            <AppText style={styles.infoTextTitle}>Role</AppText>
            <AppText style={styles.infoText}>{employee.role || 'N/A'}</AppText>
            <View style={styles.separator} />

            <AppText style={styles.infoTextTitle}>Driving License</AppText>
            <AppText style={styles.infoText}>
              {employee.drivingLicenseNo || 'N/A'}
            </AppText>
          </View>
        </View>
        {employee.nidPic && (
          <View style={styles.nidContainer}>
            <AppText style={{ fontSize: s(16) }} variant="bold">
              NID Document
            </AppText>
            <Image
              source={{ uri: employee.nidPic }}
              style={styles.nidImage}
            />
          </View>
        )}
        {employee.drivingLicenseImg && (
          <View style={styles.nidContainer}>
            <AppText style={{ fontSize: s(16) }} variant="bold">
              Driving License
            </AppText>
            <Image
              source={{ uri: employee.drivingLicenseImg }}
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
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppColors.inputColor,
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
