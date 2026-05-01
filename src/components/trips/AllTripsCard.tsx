import {
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { scale as s, vs } from 'react-native-size-matters';
import { AppColors } from '../../styles/colors';
import AppText from '../AppText';
import { CalendarDays, PencilLine, Trash2, Van } from 'lucide-react-native';

interface AllTripsCardProps {
  tripUID?: string;
  date?: string;
  time?: string;
  vehicleName?: string;
  onPress: () => void;
  onEditPress: () => void;
  onDeletePress: () => void;
}

const AllTripsCard = ({
  tripUID,
  date,
  time,
  vehicleName,
  onPress,
  onEditPress,
  onDeletePress,
}: AllTripsCardProps) => {
  return (
    <TouchableOpacity style={styles.allTrips} onPress={onPress}>
      <TouchableOpacity style={styles.editButton} onPress={onEditPress}>
        <PencilLine size={s(16)} color={AppColors.primaryColor} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteButton} onPress={onDeletePress}>
        <Trash2 size={s(16)} color={AppColors.textColor} />
      </TouchableOpacity>
      <View style={styles.headerRow}>
        <AppText variant="bold">Trip UID: {tripUID}</AppText>
      </View>
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
    paddingRight: s(54),
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: AppColors.cardColor,
    borderRadius: s(10),
    marginVertical: vs(10),
  },
  headerRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  editButton: {
    width: s(30),
    height: s(30),
    borderRadius: s(6),
    backgroundColor: AppColors.secondaryColor,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: s(15),
    right: s(15),
  },
  deleteButton: {
    width: s(30),
    height: s(30),
    borderRadius: s(6),
    backgroundColor: AppColors.tripStatusCancelled,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: s(15),
    right: s(15),
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
