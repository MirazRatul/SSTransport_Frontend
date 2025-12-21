import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import BackButton from './BackButton';
import AppText from './AppText';
import { scale as s } from 'react-native-size-matters';

const CommonHeader = () => {
  return (
    <View style={{ justifyContent: 'center', height: s(40) }}>
      <AppText style={{ alignSelf: 'center', fontSize: s(17) }} variant="bold" >
        Vehicle Details
      </AppText>
      <BackButton />
    </View>
  );
};

export default CommonHeader;

const styles = StyleSheet.create({});
