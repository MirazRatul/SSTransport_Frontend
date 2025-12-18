import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { scale as s, vs } from 'react-native-size-matters';
import { AppColors } from '../styles/colors';
import AppText from './AppText';

interface EmployeeCardProps {
  heading: string;
  imageURI: string;
  name: string;
  title: string;
  onPress: () => void;
}

const EmployeeCard = ({
  heading,
  imageURI,
  name,
  title,
  onPress,
}: EmployeeCardProps) => {
  return (
    <TouchableOpacity style={styles.cardContainer} onPress={onPress}>
      <AppText variant="bold">{heading}</AppText>
      <View style={styles.infoContainer}>
        <Image style={styles.image} source={{ uri: imageURI }} />
        <View style={styles.employee}>
          <AppText variant="bold">{name}</AppText>
          <AppText style={{ fontSize: s(11) }}>{title}</AppText>
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
