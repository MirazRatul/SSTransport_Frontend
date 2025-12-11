import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EmployeeCard from '../../components/EmployeeCard';
import React from 'react';
import { sharedPadding } from '../../constants/SharedPadding';
import { AppColors } from '../../styles/colors';
import { container } from '../../constants/container';

const EmployeeList = () => {
  return (
    <SafeAreaView style={container}>
      <EmployeeCard
        imageURI="https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg"
        heading={'Assigned Driver'}
        name="Miraz"
        title="Truck Driver"
      />
    </SafeAreaView>
  );
};

export default EmployeeList;

const styles = StyleSheet.create({

});
