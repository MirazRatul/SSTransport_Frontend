import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppText from '../../components/AppText';
import { container } from '../../constants/container';

const VehiclesList = () => {
  return (
    <SafeAreaView style={container}>
      <AppText>Vehicle List</AppText>
    </SafeAreaView>
  );
};

export default VehiclesList;

const styles = StyleSheet.create({
});
