import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ShieldAlert } from 'lucide-react-native';
import { scale as s, vs } from 'react-native-size-matters';
import AppText from './AppText';
import { AppColors } from '../styles/colors';

type PermissionDeniedStateProps = {
  title?: string;
  message?: string;
};

const PermissionDeniedState = ({
  title = 'Access restricted',
  message = 'Your account does not have permission to use this section. Please contact an administrator if you need access.',
}: PermissionDeniedStateProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <ShieldAlert size={s(34)} color={AppColors.secondaryColor} />
      </View>
      <AppText variant="bold" style={styles.title}>
        {title}
      </AppText>
      <AppText style={styles.message}>{message}</AppText>
    </View>
  );
};

export default PermissionDeniedState;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: s(20),
  },
  iconContainer: {
    width: s(62),
    height: s(62),
    borderRadius: s(31),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppColors.cardColor,
    marginBottom: vs(14),
  },
  title: {
    fontSize: s(18),
    color: AppColors.textColor,
    textAlign: 'center',
    marginBottom: vs(6),
  },
  message: {
    fontSize: s(13),
    lineHeight: s(19),
    color: '#a6a9b0',
    textAlign: 'center',
  },
});
