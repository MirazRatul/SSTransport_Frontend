import { StyleSheet, Image, TouchableOpacity, View, Text } from 'react-native';
import React from 'react';
import { scale as s, vs } from 'react-native-size-matters';
import { AppColors } from '../../styles/colors';
import AppText from '../AppText';
import { ChevronRight } from 'lucide-react-native';

interface VehiclesCardProps {
  imageURI: string;
  name: string;
  size: string;
  capacity: string;
  vehicleStatus: string;
  type?: string;
  onPress: () => void
}

const VehiclesCard = ({
  imageURI,
  name,
  size,
  capacity,
  vehicleStatus,
  type,
  onPress
}: VehiclesCardProps) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image
          style={{ height: s(70), width: s(70), resizeMode: 'cover' }}
          source={{ uri: imageURI }}
        />
      </View>
      <View style={styles.nameContainer}>
        <AppText variant="bold">{name}</AppText>
        <View style={styles.textContainer}>
          <View style={styles.sizeContainer}>
            <AppText style={[styles.text, styles.label]}>Size:</AppText>
            <AppText style={styles.text}>{size}</AppText>
          </View>
          <View style={styles.capacityContainer}>
            <AppText style={[styles.text, styles.label]}>Capacity:</AppText>
            <AppText style={styles.text}>{capacity}</AppText>
          </View>
        </View>
      </View>
      <View
        style={[
          styles.statusContainer,
          {
            borderColor:
              type === 'maintenance'
                ? '#e77878'
                : type === 'onTrip'
                ? AppColors.textColor
                : AppColors.secondaryColor,
          },
          {
            backgroundColor:
              type === 'maintenance'
                ? '#e77878'
                : type === 'onTrip'
                ? `${AppColors.cardColor}1A`
                : `${AppColors.secondaryColor}1A`,
          },
        ]}
      >
        <AppText style={{ fontSize: s(10) }}>{vehicleStatus}</AppText>
      </View>
      <View style={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <ChevronRight size={20} color={AppColors.textColor} />
      </View>
    </TouchableOpacity>
  );
};

export default VehiclesCard;

const styles = StyleSheet.create({
  container: {
    height: vs(100),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.cardColor,
    borderRadius: s(5),
    marginVertical: s(5),
    paddingHorizontal: s(10),
  },
  imageContainer: {
    height: s(70),
    width: s(70),
    borderRadius: s(10),
    overflow: 'hidden',
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  sizeContainer: {
    marginEnd: s(20),
    flexDirection: 'row',
    alignItems: 'center',
  },
  capacityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: s(13),
  },
  label: {
    marginEnd: s(5),
  },
  statusContainer: {
    height: s(25),
    backgroundColor: `${AppColors.secondaryColor}1A`,
    paddingVertical: s(5),
    paddingHorizontal: s(7),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: s(20),
    borderWidth: 1,
    borderColor: AppColors.secondaryColor,
    position: 'absolute',
    top: s(10),
    right: s(10),
  },
  nameContainer: {
    flex: 1,
    justifyContent: 'center',
    marginStart: s(20),
  },
});
