import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { scale as s, vs } from 'react-native-size-matters';
import { AppColors } from '../../styles/colors';

// ---------- shimmer colours (dark-theme aware) ----------
const BASE_COLOR = '#2a2f3a';
const HIGHLIGHT_COLOR = '#3c4255';

// ---------- single animated shimmer stripe ----------
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

// ---------- one skeleton card — mirrors EmployeeCard exactly ----------
const SkeletonCard = ({ animatedValue }: { animatedValue: Animated.Value }) => (
  <View style={styles.cardContainer}>
    {/* heading line */}
    <ShimmerBox animatedValue={animatedValue} style={styles.headingLine} />

    <View style={styles.infoContainer}>
      {/* avatar circle */}
      <ShimmerBox animatedValue={animatedValue} style={styles.avatar} />

      {/* name + title lines */}
      <View style={styles.textBlock}>
        <ShimmerBox animatedValue={animatedValue} style={styles.nameLine} />
        <ShimmerBox animatedValue={animatedValue} style={styles.titleLine} />
      </View>
    </View>
  </View>
);

// ---------- exported list skeleton ----------
interface EmployeeListSkeletonProps {
  count?: number;
}

const EmployeeListSkeleton = ({ count = 6 }: EmployeeListSkeletonProps) => {
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
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} animatedValue={animatedValue} />
      ))}
    </>
  );
};

export default EmployeeListSkeleton;

const styles = StyleSheet.create({
  shimmer: {
    borderRadius: s(4),
    overflow: 'hidden',
  },
  cardContainer: {
    height: vs(100),
    width: '100%',
    justifyContent: 'space-evenly',
    paddingHorizontal: s(15),
    backgroundColor: AppColors.cardColor,
    borderRadius: s(5),
    marginVertical: s(5),
  },
  // heading placeholder — ~40% card width
  headingLine: {
    height: vs(13),
    width: '40%',
    borderRadius: s(4),
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  // avatar circle — matches image: s(50) x s(50), borderRadius s(25)
  avatar: {
    height: s(50),
    width: s(50),
    borderRadius: s(25),
    marginRight: s(10),
  },
  textBlock: {
    flex: 1,
    justifyContent: 'center',
    gap: vs(6),
  },
  // name line — ~55% width
  nameLine: {
    height: vs(13),
    width: '55%',
    borderRadius: s(4),
  },
  // title line — ~35% width (smaller font in card)
  titleLine: {
    height: vs(11),
    width: '35%',
    borderRadius: s(4),
  },
});
