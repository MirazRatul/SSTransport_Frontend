import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { scale as s, vs } from 'react-native-size-matters';
import { AppColors } from '../../styles/colors';

const BASE_COLOR = '#2a2f3a';
const HIGHLIGHT_COLOR = '#3c4255';

const ShimmerBox = ({
  style,
  animatedValue,
}: {
  style: object;
  animatedValue: Animated.Value;
}) => {
  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [BASE_COLOR, HIGHLIGHT_COLOR, BASE_COLOR],
  });
  return <Animated.View style={[styles.shimmer, style, { backgroundColor }]} />;
};

const ProfileSkeleton = () => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: false,
      }),
    ).start();
    return () => animatedValue.stopAnimation();
  }, [animatedValue]);

  return (
    <View style={styles.scroll}>
      <View style={styles.profileContainer}>

        {/* Avatar circle */}
        <ShimmerBox animatedValue={animatedValue} style={styles.avatar} />

        {/* Email line */}
        <ShimmerBox animatedValue={animatedValue} style={styles.emailLine} />

        {/* Name line */}
        <ShimmerBox animatedValue={animatedValue} style={styles.nameLine} />

        {/* Contact line */}
        <ShimmerBox animatedValue={animatedValue} style={styles.contactLine} />

        {/* Edit Profile button */}
        <ShimmerBox animatedValue={animatedValue} style={styles.editBtn} />

        {/* Sign Out button */}
        <ShimmerBox animatedValue={animatedValue} style={styles.signOutBtn} />

      </View>
    </View>
  );
};

export default ProfileSkeleton;

const styles = StyleSheet.create({
  shimmer: {
    borderRadius: s(4),
    overflow: 'hidden',
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: vs(20),
  },
  profileContainer: {
    width: '90%',
    alignItems: 'center',
    gap: s(14),
    paddingVertical: s(36),
    backgroundColor: AppColors.cardColor,
    alignSelf: 'center',
    borderRadius: s(12),
    elevation: 5,
  },
  // circular avatar — mirrors s(90) x s(90) borderRadius s(45)
  avatar: {
    height: s(90),
    width: s(90),
    borderRadius: s(45),
  },
  // email — short centered line
  emailLine: {
    height: vs(12),
    width: '45%',
    borderRadius: s(4),
  },
  // name — slightly wider
  nameLine: {
    height: vs(15),
    width: '55%',
    borderRadius: s(4),
  },
  // contact — medium width
  contactLine: {
    height: vs(14),
    width: '40%',
    borderRadius: s(4),
  },
  // "Edit Profile" button shape
  editBtn: {
    height: vs(36),
    width: '45%',
    borderRadius: s(8),
    marginTop: s(4),
  },
  // "Sign Out" button shape
  signOutBtn: {
    height: vs(36),
    width: '38%',
    borderRadius: s(8),
  },
});
