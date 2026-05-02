import React, { useEffect, useRef } from 'react';
import { Animated, ScrollView, StyleSheet, View } from 'react-native';
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

const SkeletonTripCard = ({
  animatedValue,
}: {
  animatedValue: Animated.Value;
}) => (
  <View style={styles.card}>
    <View style={styles.headerRow}>
      <ShimmerBox animatedValue={animatedValue} style={styles.icon} />
      <ShimmerBox animatedValue={animatedValue} style={styles.tripIdLine} />
      <ShimmerBox animatedValue={animatedValue} style={styles.statusPill} />
    </View>

    <ShimmerBox animatedValue={animatedValue} style={styles.smallLine} />
    <ShimmerBox animatedValue={animatedValue} style={styles.routeLine} />
    <ShimmerBox animatedValue={animatedValue} style={styles.smallLine} />
    <ShimmerBox animatedValue={animatedValue} style={styles.dateLine} />
    <ShimmerBox animatedValue={animatedValue} style={styles.smallLine} />
    <ShimmerBox animatedValue={animatedValue} style={styles.vehiclePill} />
    <ShimmerBox animatedValue={animatedValue} style={styles.button} />
  </View>
);

const SkeletonSection = ({
  animatedValue,
}: {
  animatedValue: Animated.Value;
}) => (
  <View style={styles.section}>
    <ShimmerBox animatedValue={animatedValue} style={styles.titleLine} />
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      scrollEnabled={false}
    >
      {Array.from({ length: 2 }).map((_, index) => (
        <SkeletonTripCard key={index} animatedValue={animatedValue} />
      ))}
    </ScrollView>
  </View>
);

const DashboardSkeleton = () => {
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
    <>
      {Array.from({ length: 4 }).map((_, index) => (
        <SkeletonSection key={index} animatedValue={animatedValue} />
      ))}
    </>
  );
};

export default DashboardSkeleton;

const styles = StyleSheet.create({
  shimmer: {
    borderRadius: s(4),
    overflow: 'hidden',
  },
  section: {
    marginBottom: vs(18),
  },
  titleLine: {
    width: s(135),
    height: vs(18),
    marginBottom: s(10),
  },
  card: {
    width: s(230),
    height: s(260),
    backgroundColor: AppColors.tripBackground,
    padding: s(15),
    borderRadius: s(10),
    marginRight: s(12),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: s(15),
  },
  icon: {
    width: s(20),
    height: s(20),
    borderRadius: s(10),
  },
  tripIdLine: {
    flex: 1,
    height: vs(14),
    marginHorizontal: s(10),
  },
  statusPill: {
    width: s(62),
    height: s(25),
    borderRadius: s(20),
  },
  smallLine: {
    width: s(70),
    height: vs(11),
    marginBottom: s(7),
  },
  routeLine: {
    width: s(150),
    height: vs(16),
    marginBottom: s(12),
  },
  dateLine: {
    width: s(170),
    height: vs(15),
    marginBottom: s(12),
  },
  vehiclePill: {
    width: s(90),
    height: s(25),
    borderRadius: s(20),
    marginBottom: s(15),
  },
  button: {
    width: '100%',
    height: s(40),
    borderRadius: s(6),
  },
});
