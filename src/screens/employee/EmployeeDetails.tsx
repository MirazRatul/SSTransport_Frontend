import {
  Image,
  StyleSheet,
  View,
} from 'react-native';
import React from 'react';
import { AppColors } from '../../styles/colors';
import { scale as s, vs } from 'react-native-size-matters';
import AppText from '../../components/AppText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { container } from '../../constants/container';
import BackButton from '../../components/BackButton';

const EmployeeDetails = ({ route }: any) => {
  const { selectedEmployee } = route.params;
  return (
    <SafeAreaView style={container}>
      {selectedEmployee && (
        <View style={styles.detailsContainer}>
          <BackButton />
          <Image
            source={{ uri: selectedEmployee.imageURI }}
            style={styles.image}
          />
          <AppText variant="bold">{selectedEmployee.name}</AppText>
          <AppText>{selectedEmployee.title}</AppText>
          <Image
            source={{
              uri: 'https://imgv2-2-f.scribdassets.com/img/document/658369602/original/a9e0b3a4b2/1?v=1',
            }}
            style={styles.nidImage}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default EmployeeDetails;

const styles = StyleSheet.create({
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: s(10),
    backgroundColor: AppColors.cardColor,
    borderRadius: s(10),
  },
  image: {
    height: s(80),
    width: s(80),
    borderRadius: s(40),
    marginBottom: vs(10),
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
