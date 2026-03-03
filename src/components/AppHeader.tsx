import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { Children } from 'react';
import { scale as s, vs } from 'react-native-size-matters';
import { AppColors } from '../styles/colors';
import AppText from './AppText';
import { Menu } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { DrawerActions } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface AppHeaderProps {
  title?: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({ title }) => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.headerContainer}>
      <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
        <Menu size={s(24)} color={AppColors.textColor}/>
      </TouchableOpacity>
      <View style={styles.textContainer}>
        <AppText style={{color: AppColors.textColor, fontSize: s(18)}} variant="bold">{title}</AppText>
      </View>
    </SafeAreaView>
  );
};

export default AppHeader;

const styles = StyleSheet.create({
  headerContainer: {
    height: s(30),
    width: '100%',
    backgroundColor: AppColors.primaryColor,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: s(20),
    paddingTop: s(20),
    paddingBottom: s(20),
    borderWidth: .3,
    borderBottomColor: AppColors.textColor
  },
  textContainer: {
    flex: 1,
    height: s(30),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginRight: s(24),
  },
});
