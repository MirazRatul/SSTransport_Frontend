import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppColors } from '../../styles/colors';
import { sharedPadding } from '../../constants/SharedPadding';

const EmployeeDetails = () => {
  return (
    <SafeAreaView style={styles.container}>
        
    </SafeAreaView>
  );
};

export default EmployeeDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: sharedPadding,
    backgroundColor: AppColors.primaryColor,
  }
});
