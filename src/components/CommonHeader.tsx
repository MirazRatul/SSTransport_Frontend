import { StyleSheet, View } from 'react-native';
import React from 'react';
import BackButton from './BackButton';
import AppText from './AppText';
import { scale as s } from 'react-native-size-matters';

interface headerProps {
  title: string;
}

const CommonHeader = ({ title }: headerProps) => {
  return (
    <View style={styles.container}>
      <AppText style={styles.title} variant="bold">
        {title}
      </AppText>
      <BackButton />
    </View>
  );
};

export default CommonHeader;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    height: s(40),
  },
  title: {
    alignSelf: 'center',
    fontSize: s(17),
  },
});
