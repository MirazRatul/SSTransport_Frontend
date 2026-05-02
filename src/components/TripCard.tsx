import { StyleSheet, View } from 'react-native';
import React from 'react';
import { scale as s } from 'react-native-size-matters';
import { AppColors } from '../styles/colors';
import { Truck, ArrowRight } from 'lucide-react-native';
import AppText from './AppText';
import AppButton from './AppButton';

interface TripCardProps {
  tripId: string;
  status: string;
  from: string;
  to: string;
  dateTime?: string;
  vehicleId: string;
  statusColor?: string;
  onDetailsPress?: () => void;
}

const TripCard: React.FC<TripCardProps> = ({
  tripId,
  status,
  from,
  to,
  dateTime,
  vehicleId,
  statusColor,
  onDetailsPress = () => {},
}) => {
  const accentColor = statusColor || AppColors.secondaryColor;
  const isActive = accentColor === AppColors.secondaryColor;

  return (
    <View style={[styles.tripContainer]}>
      <View style={styles.tripHeader}>
        <Truck size={20} color={accentColor} />
        <View style={styles.tripIdContainer}>
          <AppText style={{ marginStart: s(10) }} variant="bold">
            {tripId}
          </AppText>
        </View>
        <View
          style={[
            styles.statusContainer,
            {
              backgroundColor: `${accentColor}1A`,
              borderColor: accentColor,
            },
          ]}
        >
          <AppText
            style={{
              fontSize: s(10),
              color: accentColor,
            }}
          >
            {status}
          </AppText>
        </View>
      </View>
      <AppText style={{ fontSize: 13 }}>Route:</AppText>
      <View style={styles.destiContainer}>
        <AppText>{from}</AppText>
        <ArrowRight
          style={{ marginHorizontal: s(5) }}
          size={15}
          color={accentColor}
        />
        <AppText>{to}</AppText>
      </View>
      <AppText style={{ fontSize: 13 }}>Date and Time:</AppText>
      <AppText>{dateTime || 'N/A'}</AppText>

      <AppText style={{ fontSize: 13, marginTop: s(10) }}>Vehicle</AppText>
      <View style={styles.vehicleIdContainer}>
        <AppText
          style={{
            fontSize: s(12),
            color: accentColor,
            marginHorizontal: s(5),
          }}
        >
          {vehicleId}
        </AppText>
      </View>
      <AppButton
        textStyle={{
          fontSize: s(15),
          color: isActive ? AppColors.primaryColor : accentColor,
        }}
        btnStyle={[
          styles.btn,
          {
            backgroundColor: isActive ? accentColor : 'transparent',
            borderColor: isActive ? 'transparent' : accentColor,
            borderWidth: isActive ? 0 : 1,
          },
        ]}
        title="Details"
        onPress={onDetailsPress}
      />
    </View>
  );
};

export default TripCard;

const styles = StyleSheet.create({
  tripContainer: {
    width: s(230),
    height: s(260),
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: AppColors.tripBackground,
    padding: s(15),
    borderRadius: s(10),
    elevation: 6,
    marginRight: s(12),
  },
  tripHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: s(15),
  },
  tripIdContainer: {
    flex: 1,
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
  },
  destiContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: s(10),
  },
  vehicleIdContainer: {
    height: s(25),
    backgroundColor: `${AppColors.secondaryColor}1A`,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: s(20),
    marginTop: s(3),
    padding: s(4),
  },
  btn: {
    height: s(40),
    width: '100%',
    marginTop: s(15),
  },
});
