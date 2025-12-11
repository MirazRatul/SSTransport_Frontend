import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import React, { Activity } from 'react';
import { AppColors } from '../styles/colors';
import { scale as s, vs } from 'react-native-size-matters';
import AppText from './AppText';

interface AppButtonProps {
  title: string;
  onPress: () => void;
  btnStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  isLoading?: boolean;
}

const AppButton = ({
  title,
  onPress,
  btnStyle,
  textStyle,
  isLoading,
}: AppButtonProps) => {
  return (
    <TouchableOpacity style={[styles.btnContainer, btnStyle]} onPress={onPress}>
      {isLoading ? (
        <ActivityIndicator size="small" color={AppColors.textColor} />
      ) : (
        <AppText variant='bold' style={[styles.btnText, textStyle]}>{title}</AppText>
      )}
    </TouchableOpacity>
  );
};

export default AppButton;

const styles = StyleSheet.create({
  btnContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppColors.secondaryColor,
    height: s(48),
    width: s(326),
    paddingHorizontal: s(16),
    borderRadius: s(6),
  },
  btnText: {
    color: AppColors.textColor,
    fontSize: s(18),
  },
});
