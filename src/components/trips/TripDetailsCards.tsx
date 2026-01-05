import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import AppText from '../AppText';
import { Phone } from 'lucide-react-native';
import { scale as s, vs } from 'react-native-size-matters';
import { AppColors } from '../../styles/colors';

interface TripDetailsCardProps {
  title: string;
  subHeading1: string;
  subHeading2?: string;
  subHeadingValue1: string;
  subHeadingValue2?: string;
  type?: string;
}

const TripDetailsCards = ({
  title,
  subHeading1,
  subHeading2,
  subHeadingValue1,
  subHeadingValue2,
  type,
}: TripDetailsCardProps) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardHeader}>
        <AppText variant="bold" style={styles.headingText}>
          {title}
        </AppText>
      </View>
      <View style={styles.separator} />
      <View style={styles.cardBody}>
        <AppText style={styles.cardText1}>{subHeading1}</AppText>
        <AppText style={styles.cardText2} variant="bold">
          {subHeadingValue1}
        </AppText>
        {type !== 'fare' ? (
          <>
            <AppText style={styles.cardText1}>{subHeading2}</AppText>
            <AppText
              style={[styles.cardText2, { marginBottom: vs(25) }]}
              variant="bold"
            >
              {subHeadingValue2}
            </AppText>
          </>
        ) : null}
      </View>
      {type === 'client' ? (
        <View style={styles.cardFooter}>
          <TouchableOpacity style={styles.btnContainer}>
            <Phone size={s(15)} color={AppColors.primaryColor} />
            <AppText
              style={[styles.callText, { color: AppColors.primaryColor }]}
            >
              Call
            </AppText>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
};

export default TripDetailsCards;

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: AppColors.cardColor,
    borderRadius: s(10),
    marginBottom: vs(10),
  },
  cardHeader: {
    paddingHorizontal: s(15),
  },
  cardBody: {
    marginTop: vs(10),
    paddingHorizontal: s(15),
  },
  headingText: {
    fontSize: s(20),
    paddingVertical: vs(10),
  },
  separator: {
    height: s(0.5),
    backgroundColor: '#7b7b7cff',
  },
  cardText2: {
    marginBottom: vs(10),
  },
  cardText1: {
    fontSize: s(13),
  },
  cardFooter: {
    paddingHorizontal: s(15),
    marginBottom: vs(10),
  },
  btnContainer: {
    flexDirection: 'row',
    backgroundColor: AppColors.secondaryColor,
    padding: s(10),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: s(5),
  },
  callText: {
    marginStart: s(10),
  },
});
