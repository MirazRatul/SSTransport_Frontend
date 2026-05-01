import {
  Alert,
  Image,
  Linking,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import AppText from '../AppText';
import { Phone, User } from 'lucide-react-native';
import { scale as s, vs } from 'react-native-size-matters';
import { AppColors } from '../../styles/colors';

interface Personnel {
  name?: string;
  role?: string;
  image?: string;
}

interface TripDetailsCardProps {
  title: string;
  subHeading1: string;
  subHeading2?: string;
  subHeadingValue1: string;
  subHeadingValue2?: string;
  subHeadingRight1?: string;
  subHeadingRightValue1?: string;
  callNumber?: string;
  type?: string;
  personnel?: Personnel[];
}

const TripDetailsCards = ({
  title,
  subHeading1,
  subHeading2,
  subHeadingValue1,
  subHeadingValue2,
  subHeadingRight1,
  subHeadingRightValue1,
  callNumber,
  type,
  personnel,
}: TripDetailsCardProps) => {
  const handleCall = async () => {
    if (!callNumber) {
      Alert.alert('Error', 'Contact number not available');
      return;
    }

    try {
      await Linking.openURL(`tel:${callNumber}`);
    } catch (error) {
      Alert.alert('Error', 'Unable to make call');
      console.error('Call error:', error);
    }
  };

  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardHeader}>
        <AppText variant="bold" style={styles.headingText}>
          {title}
        </AppText>
      </View>
      <View style={styles.separator} />
      <View style={styles.cardBody}>
        <View style={styles.headingRow}>
          <View style={styles.headingColumn}>
            <AppText style={styles.cardText1}>{subHeading1}</AppText>
            <AppText style={styles.cardText2} variant="bold">
              {subHeadingValue1}
            </AppText>
          </View>
          {subHeadingRightValue1 ? (
            <View style={[styles.headingColumn, styles.rightHeadingColumn]}>
              <AppText style={styles.cardText1}>{subHeadingRight1}</AppText>
              <AppText style={styles.cardText2} variant="bold">
                {subHeadingRightValue1}
              </AppText>
            </View>
          ) : null}
        </View>
        {subHeading2 ? (
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
        {personnel?.map((item, index) => (
          <View
            key={`${item.role || 'person'}-${index}`}
            style={styles.personRow}
          >
            {item.image ? (
              <Image source={{ uri: item.image }} style={styles.personImage} />
            ) : (
              <View style={[styles.personImage, styles.personPlaceholder]}>
                <User size={s(22)} color={AppColors.textColor} />
              </View>
            )}
            <View style={styles.personInfo}>
              <AppText variant="bold" style={styles.personName}>
                {item.name || 'N/A'}
              </AppText>
              <AppText style={styles.personRole}>{item.role || 'N/A'}</AppText>
            </View>
          </View>
        ))}
      </View>
      {type === 'client' ? (
        <View style={styles.cardFooter}>
          <TouchableOpacity style={styles.btnContainer} onPress={handleCall}>
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
  headingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headingColumn: {
    flex: 1,
  },
  rightHeadingColumn: {
    alignItems: 'flex-end',
  },
  personRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(14),
  },
  personImage: {
    width: s(48),
    height: s(48),
    borderRadius: s(24),
    marginRight: s(12),
    backgroundColor: AppColors.inputColor,
  },
  personPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  personInfo: {
    flex: 1,
  },
  personName: {
    fontSize: s(14),
  },
  personRole: {
    fontSize: s(12),
    color: '#bcc0c9',
    marginTop: vs(2),
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
