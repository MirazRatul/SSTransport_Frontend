import { Dimensions, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import Onboarding from 'react-native-onboarding-swiper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppColors } from '../../styles/colors';
import { scale as s } from 'react-native-size-matters';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const OnboardingScreen = ({ onFinish }: { onFinish: () => void }) => {
  const [loading, setLoading] = useState(false);

  const handleFinish = async () => {
    setLoading(true);
    try {
      await AsyncStorage.setItem('onboarding', '1');
      onFinish();
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  const doneButton = ({...props}) => {
    return(
      <TouchableOpacity
      style={styles.doneButton}
      {...props} // Pass the library's default props (like onPress)
    >
      {loading ? (
        <ActivityIndicator color={AppColors.secondaryColor || 'white'} size="small" />
      ) : (
        <Text style={styles.doneText}>Done</Text>
      )}
    </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <Onboarding
        containerStyles={{ paddingHorizontal: s(15) }}
        DoneButtonComponent={doneButton}
        pages={[
          {
            backgroundColor: '#000',
            image: (
              <View style={styles.lottieContainer}>
                <LottieView
                  style={styles.lottie}
                  source={require('../../assets/animations/orangeboxes.json')}
                  autoPlay
                  loop
                />
              </View>
            ),
            title: 'Manage Cargo Smarter',
            subtitle: 'Everything you need to handle shipments efficiently.',
          },
          {
            backgroundColor: '#000',
            image: (
              <View style={styles.lottieContainer}>
                <LottieView
                  style={styles.lottie}
                  source={require('../../assets/animations/WarehouseDelivery.json')}
                  autoPlay
                  loop
                />
              </View>
            ),
            title: 'Deliver With Confidence',
            subtitle: 'Fast, safe, and transparent transportation.',
          },
          {
            backgroundColor: '#000',
            image: (
              <View style={styles.lottieContainer}>
                <LottieView
                  style={styles.lottie}
                  source={require('../../assets/animations/Warehouseanddelivery.json')}
                  autoPlay
                  loop
                />
              </View>
            ),
            title: 'Deliver With Confidence',
            subtitle: 'Fast, safe, and transparent transportation.',
          },
        ]}
        onSkip={handleFinish}
        onDone={handleFinish}
      />
    </SafeAreaView>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.primaryColor,
  },
  lottieContainer: {
    borderRadius: s(10),
  },
  lottie: {
    height: width * 0.8,
    width: width,
  },
  doneButton: {
    paddingRight: s(20),
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  doneText: {
    color: '#fff',
    fontSize: s(14),
  },
});
