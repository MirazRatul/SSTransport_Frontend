import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { scale as s, vs } from 'react-native-size-matters';
import { AppColors } from '../styles/colors';
import AppText from './AppText';

interface EmployeeCardProps {
  imageURI: string;
  name: string;
  role: string;
  onPress: () => void;
  heading?: string;
}

const EmployeeCard = ({ imageURI, name, role, onPress }: EmployeeCardProps) => {
  return (
    <TouchableOpacity style={styles.cardContainer} onPress={onPress}>
      <AppText variant="bold">
        {role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()}
      </AppText>
      <View style={styles.infoContainer}>
        <Image style={styles.image} source={{ uri: imageURI }} />
        <View style={styles.employee}>
          <AppText variant="bold">{name}</AppText>
          <AppText style={{ fontSize: s(11) }}>{role}</AppText>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default EmployeeCard;

const styles = StyleSheet.create({
  cardContainer: {
    height: vs(100),
    width: '100%',
    justifyContent: 'space-evenly',
    paddingHorizontal: s(15),
    backgroundColor: AppColors.cardColor,
    borderRadius: s(5),
    marginVertical: s(5),
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  image: {
    height: s(50),
    width: s(50),
    borderWidth: 1,
    borderRadius: s(25),
    resizeMode: 'cover',
    marginRight: s(10),
  },
  employee: {
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
});
