import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EmployeeCard from '../../components/EmployeeCard';
import React, { useState, useMemo } from 'react';
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

interface Employee {
  id: string;
  imageURI: string;
  heading: string;
  name: string;
  title: string;
  role: string;
}

const EmployeeList = () => {
  const navigation = useNavigation<any>();
  const [activeBtn, setActiveBtn] = useState('All');

  const employeeData = useMemo<Employee[]>(
    () => [
      {
        id: '1',
        imageURI:
          'https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg',
        heading: 'Driver',
        name: 'Miraz',
        title: 'Truck Driver',
        role: 'driver',
      },
      {
        id: '2',
        imageURI:
          'https://img.freepik.com/free-vector/young-man-avatar-character_24877-947.jpg',
        heading: 'Driver',
        name: 'Rahim',
        title: 'Helper',
        role: 'helper',
      },
      {
        id: '3',
        imageURI:
          'https://img.freepik.com/free-vector/man-avatar-profile-picture_18591-58483.jpg',
        heading: 'Driver',
        name: 'Karim',
        title: 'Truck Driver',
        role: 'manager',
      },
      {
        id: '4',
        imageURI:
          'https://img.freepik.com/free-vector/young-man-with-glasses-illustration_1308-174706.jpg',
        heading: 'Driver',
        name: 'Sajid',
        title: 'Truck Driver',
        role: 'driver',
      },
      {
        id: '5',
        imageURI:
          'https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174671.jpg',
        heading: 'Driver',
        name: 'Fahim',
        title: 'Truck Driver',
        role: 'manager',
      },
      {
        id: '6',
        imageURI:
          'https://img.freepik.com/free-vector/man-avatar-profile-picture_18591-58481.jpg',
        heading: 'Driver',
        name: 'Nayeem',
        title: 'Truck Driver',
        role: 'manager',
      },
      {
        id: '7',
        imageURI:
          'https://img.freepik.com/free-vector/young-man-avatar-character_24877-948.jpg',
        heading: 'Driver',
        name: 'Imran',
        title: 'Truck Driver',
        role: 'helper',
      },
      {
        id: '8',
        imageURI:
          'https://img.freepik.com/free-vector/young-man-with-beard-illustration_1308-174700.jpg',
        heading: 'Driver',
        name: 'Arif',
        title: 'Truck Driver',
        role: 'manager',
      },
      {
        id: '9',
        imageURI:
          'https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174670.jpg',
        heading: 'Driver',
        name: 'Hasan',
        title: 'Truck Driver',
        role: 'helper',
      },
      {
        id: '10',
        imageURI:
          'https://img.freepik.com/free-vector/young-man-avatar-profile_24877-9475.jpg',
        heading: 'Driver',
        name: 'Tanvir',
        title: 'Truck Driver',
        role: 'helper',
      },
    ],
    [],
  );

  const [searchText, setSearchText] = useState('');

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
        <FlatList
          data={filteredData}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <EmployeeCard
              imageURI={item.imageURI}
              heading={item.heading}
              name={item.name}
              title={item.title}
              onPress={() => handleEmployeeSelect(item)}
            />
          )}
          ListEmptyComponent={
            searchText.length > 0 ? (
              <View style={styles.noDataFound}>
                <AppText>No Result Found!!</AppText>
              </View>
            ) : null
          }
          showsVerticalScrollIndicator={false}
        />
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
