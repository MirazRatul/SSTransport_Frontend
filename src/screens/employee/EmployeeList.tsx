import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EmployeeCard from '../../components/EmployeeCard';
import React, { useState, useMemo, useEffect } from 'react';
import { sharedPadding } from '../../constants/SharedPadding';
import { AppColors } from '../../styles/colors';
import { container } from '../../constants/container';
import AppHeader from '../../components/AppHeader';
import AppInput from '../../components/AppInput';
import AppButton from '../../components/AppButton';
import { scale as s } from 'react-native-size-matters';
import AppText from '../../components/AppText';
import EmployeeDetails from './EmployeeDetails';
import { useNavigation } from '@react-navigation/native';
import apiClient from '../../api/api';
import EmployeeListSkeleton from '../../components/SkeletonLoader/EmployeeListSkeleton';

// Shape returned by the backend — image fields are full Cloudinary URLs
interface Employee {
  id: number;
  name: string;
  image: string;              // Cloudinary URL e.g. "https://res.cloudinary.com/.../employees/rahim.jpg"
  contact: string;
  nidNo: string;
  nidPic: string;
  role: string;
  drivingLicenseNo: string | null;
  drivingLicenseImg: string | null; // Cloudinary URL or null
}

const EmployeeList = () => {
  const navigation = useNavigation<any>();
  const [activeBtn, setActiveBtn] = useState('All');
  const [employeeData, setEmployeeData] = useState<Employee[]>([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchEmployee = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/employees');
      setEmployeeData(response.data);
    } catch (error) {
      console.log('Error fetching employee data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchEmployee();
    } catch (error) {
      console.log('Error refreshing employee data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    console.log('Fetching employee data...');
    fetchEmployee();
    console.log('Employee data state after fetch:',JSON.stringify(employeeData, null, 2));
  },[]);

  const handleEmployeeSelect = (employee: Employee) => {
    navigation.navigate('EmployeeDetails', {
      selectedEmployee: employee,
    });
  };

  const filteredData = useMemo(() => {
    let data = employeeData;

    //category filter
    if (activeBtn !== 'All') {
      data = data.filter(item => {
        return item.role === activeBtn;
      });
    }

    //search filter
    if (searchText.trim() !== '') {
      data = data.filter(item => {
        return item.name.toLowerCase().includes(searchText.toLowerCase());
      });
    }

    return data;
  }, [employeeData, searchText, activeBtn]);

  return (
    <>
      <AppHeader title="Employees" />
      <View style={container}>
        <AppInput
          placeholder="Search Employees"
          type="search"
          onChangeText={setSearchText}
        />
        <View style={styles.filterBtnCont}>
          <TouchableOpacity
            style={[
              styles.filterBtn,
              {
                borderWidth: 1,
                borderColor:
                  activeBtn === 'All' ? AppColors.secondaryColor : undefined,
              },
            ]}
            onPress={() => setActiveBtn('All')}
          >
            <AppText variant="bold" style={styles.btnText}>
              All
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterBtn,
              {
                borderWidth: 1,
                borderColor:
                  activeBtn === 'manager'
                    ? AppColors.secondaryColor
                    : undefined,
              },
            ]}
            onPress={() => setActiveBtn('manager')}
          >
            <AppText variant="bold" style={styles.btnText}>
              Management
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterBtn,
              {
                borderWidth: 1,
                borderColor:
                  activeBtn === 'driver' ? AppColors.secondaryColor : undefined,
              },
            ]}
            onPress={() => setActiveBtn('driver')}
          >
            <AppText variant="bold" style={styles.btnText}>
              Drivers
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterBtn,
              {
                borderWidth: 1,
                borderColor:
                  activeBtn === 'helper' ? AppColors.secondaryColor : undefined,
              },
            ]}
            onPress={() => setActiveBtn('helper')}
          >
            <AppText variant="bold" style={styles.btnText}>
              Helpers
            </AppText>
          </TouchableOpacity>
        </View>
        {loading ? (
          <EmployeeListSkeleton count={6} />
        ) : (
          <FlatList
            data={filteredData}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <EmployeeCard
                imageURI={item.image}
                name={item.name}
                role={item.role}
                onPress={() => handleEmployeeSelect(item)}
              />
            )}
            ListEmptyComponent={
              <View style={styles.noDataFound}>
                <AppText>No Result Found!!</AppText>
              </View>
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{}}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[AppColors.secondaryColor]}
                tintColor={AppColors.secondaryColor}
              />
            }
          />
        )}
      </View>
    </>
  );
};

export default EmployeeList;

const styles = StyleSheet.create({
  filterBtnCont: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: s(5),
    marginBottom: s(15),
  },
  filterBtn: {
    backgroundColor: AppColors.cardColor,
    paddingHorizontal: s(15),
    paddingVertical: s(5),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: s(15),
  },
  btnText: {
    fontSize: s(13),
  },
  noDataFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
