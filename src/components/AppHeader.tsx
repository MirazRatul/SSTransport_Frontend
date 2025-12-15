import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { Children } from 'react';
import { scale as s, vs } from 'react-native-size-matters';
import { AppColors } from '../styles/colors';
import AppText from './AppText';
import { ArrowLeft } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface AppHeaderProps {
  title?: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({ title }) => {
  return (
    <SafeAreaView style={styles.headerContainer}>
      <TouchableOpacity style={styles.backBtn}>
        <ArrowLeft size={24} color={AppColors.textColor} />
      </TouchableOpacity>
      <View style={styles.textContainer}>
        <AppText style={{color: AppColors.textColor}} variant="bold">{title}</AppText>
      </View>
      
    </SafeAreaView>
  );
};

export default AppHeader;

const styles = StyleSheet.create({
  headerContainer: {
    height: s(50),
    width: '100%',
    backgroundColor: AppColors.primaryColor,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: s(10),
    paddingTop: vs(20),
    paddingBottom: vs(15),
    borderWidth: .3,
    borderBottomColor: AppColors.textColor
  },
  backBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    height: s(30),
    width: s(30),
    borderRadius: s(15),
  },
  textContainer: {
    flex: 1,
    height: s(30),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginRight: s(30),
  },
});
