import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppText from '../../components/AppText';
import { container } from '../../constants/container';

const DashBoard = () => {
  return (
    <SafeAreaView style={container}>
      <AppText variant='bold'>Dashboard</AppText>
    </SafeAreaView>
  );
};

export default DashBoard;

const styles = StyleSheet.create({
});
