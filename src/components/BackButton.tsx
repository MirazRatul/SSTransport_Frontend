import { StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { scale as s } from 'react-native-size-matters';
import { ArrowLeft } from 'lucide-react-native';
import { AppColors } from '../styles/colors';

const BackButton = () => {
  const navigation = useNavigation<any>();
  return (
    <TouchableOpacity
      style={styles.backIcon}
      onPress={() => navigation.goBack()}
    >
      <ArrowLeft size={24} color={AppColors.textColor} />
    </TouchableOpacity>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  backIcon: {
    position: 'absolute',
    top: s(10),
    left: s(0),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
