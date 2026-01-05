import {
  InteractionManager,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { scale as s, vs } from 'react-native-size-matters';
import { AppColors } from '../../styles/colors';
import AppText from '../AppText';
import { CalendarDays, Van } from 'lucide-react-native';

interface AllTripsCardProps {
  tripUID?: string;
  date?: string;
  time?: string;
  vehicleName?: string;
  onPress: () => void;
}

const AllTripsCard = ({
  tripUID,
  date,
  time,
  vehicleName,
  onPress
}: AllTripsCardProps) => {
  return (
    <TouchableOpacity style={styles.allTrips} onPress={onPress}>
      <AppText variant="bold">Trip UID: {tripUID}</AppText>
      <View style={styles.dateTimeContainer}>
        <CalendarDays size={s(17)} color={'#bcc0c9'} />
        <AppText style={[styles.text, { marginHorizontal: s(8) }]}>
          {date}
        </AppText>
        <AppText style={styles.text}>{time}</AppText>
      </View>
      <View style={styles.nameContainer}>
        <Van size={s(17)} color={'#bcc0c9'} />
        <AppText style={[styles.text, { marginHorizontal: s(8) }]}>
          {vehicleName}
        </AppText>
      </View>
    </TouchableOpacity>
  );
};

export default AllTripsCard;

const styles = StyleSheet.create({
  allTrips: {
    padding: s(15),
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: AppColors.cardColor,
    borderRadius: s(10),
    marginVertical: vs(10),
  },
  dateTimeContainer: {
    flexDirection: 'row',
    marginVertical: vs(10),
  },
  nameContainer: {
    flexDirection: 'row',
  },
  text: {
    fontSize: s(12),
    color: '#bcc0c9',
  },
});
