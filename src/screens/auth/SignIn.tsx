import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';

import React, { use, useState } from 'react';

import { AppColors } from '../../styles/colors';

import { scale as s, vs } from 'react-native-size-matters';

import AppInput from '../../components/AppInput';

import AppText from '../../components/AppText';

import AppButton from '../../components/AppButton';

import auth from '@react-native-firebase/auth';

import { useDispatch } from 'react-redux';

import { clearUserData, setUserData } from '../../store/reducers/userSlice';

import { GoogleSignin } from '@react-native-google-signin/google-signin';

import AsyncStorage from '@react-native-async-storage/async-storage';

interface SignInProps {
  onGoToSignUp: () => void;
}

const SignIn = ({ onGoToSignUp }: SignInProps) => {
  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const handleSignIn = async () => {
    try {
      setLoading(true);

      const userCredential = await auth().signInWithEmailAndPassword(
        email.trim(),

        password.trim(),
      );

      // Ensure we have the latest user state (emailVerified may be stale)

      await auth().currentUser?.reload();

      const currentUser = auth().currentUser || userCredential.user;

      if (!currentUser?.emailVerified) {
        // Immediately sign out so an unverified user isn't kept authenticated

        await auth().signOut();

        Alert.alert(
          'Email Not Verified',

          'Please verify your email before signing in. Check your inbox for the verification link.',
        );

        return;
      }

      const userObject = {
        id: userCredential?.user.uid,

        email: userCredential?.user.email,
      };

      dispatch(clearUserData());

      dispatch(setUserData(userObject));

      await AsyncStorage.setItem('userData', JSON.stringify(userObject));

      Alert.alert('Login Successful');
    } catch (error: any) {
      console.log('An Error Occurred: ', error);

      Alert.alert('Login Failed: ', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);

      // Check Google Play Services (Android)

      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      // Get Google user

      await GoogleSignin.signIn();

      // Get tokens (idToken) required for Firebase credential

      const { idToken } = await GoogleSignin.getTokens();

      // Create Firebase credential

      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign in to Firebase

      const userCredential = await auth().signInWithCredential(
        googleCredential,
      );

      const user = userCredential.user;

      const userObject = {
        id: user.uid,

        email: user.email,
      };

      dispatch(clearUserData());

      dispatch(setUserData(userObject));

      await AsyncStorage.setItem('userData', JSON.stringify(userObject));

      Alert.alert('Google Login Successful');
    } catch (error: any) {
      console.log('Google Sign-In error:', error);

      if (error.code === '12501') {
        return; // user cancelled
      }

      Alert.alert('Google Sign-In Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Email is required, Please enter your email first');

      return;
    }

    try {
      setLoading(true);

      await auth().sendPasswordResetEmail(email);

      Alert.alert(
        'Reset Email Sent',

        'Check your inbox to reset your password.',
      );
    } catch (error: any) {
      console.log('Forgot Password Error: ', error);

      let message = 'Something went wrong while resetting password';

      if (error.code === 'auth/user-not-found') {
        message = 'User Not Found';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Invalid Email Address';
      }

      Alert.alert('Reset Failed', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.loginView}>
      <AppText style={styles.welcome}>Welcome Back!</AppText>

      <AppInput
        label="Email"
        placeholder="Enter your email"
        onChangeText={setEmail}
      />

      <AppInput
        label="Password"
        placeholder="Enter your password"
        secureTextEntry
        onChangeText={setPassword}
        type="password"
      />

      <TouchableOpacity
        style={styles.forgotContainer}
        onPress={handleForgotPassword}
      >
        <AppText
          style={[styles.forgotPassword, { color: AppColors.secondaryColor }]}
        >
          Forgot Password?
        </AppText>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size={24} color={AppColors.secondaryColor} />
      ) : (
        <>
          <AppButton
            btnStyle={styles.loginBtn}
            title="Login"
            textStyle={{ color: AppColors.primaryColor, fontSize: s(15) }}
            onPress={handleSignIn}
          />

          <TouchableOpacity
            style={styles.googleSignIn}
            onPress={handleGoogleSignIn}
          >
            <Image
              source={require('../../assets/google-icon.png')}
              style={styles.googleIcon}
            />

            <AppText variant="bold">Sign In With Google</AppText>
          </TouchableOpacity>
        </>
      )}

      <View style={styles.signUpContainer}>
        <AppText style={styles.noAccount}>Don't have an account? </AppText>

        <TouchableOpacity onPress={onGoToSignUp}>
          <AppText
            variant="bold"
            style={{ color: AppColors.secondaryColor, fontSize: s(13) }}
          >
            Sign Up
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  loginView: {
    backgroundColor: AppColors.cardColor,
    width: '100%',
    borderRadius: s(10),
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: s(10),
    paddingTop: vs(30),
  },
  forgotPassword: {
    fontSize: s(12),
  },
  forgotContainer: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: vs(5),
  },
  welcome: {
    fontSize: s(30),
    marginBottom: vs(20),
  },
  loginBtn: {
    width: '100%',
    marginTop: vs(20),
  },
  noAccount: {
    fontSize: s(12),
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: vs(20),
  },
  googleSignIn: {
    flexDirection: 'row',
    height: s(48),
    width: '100%',
    backgroundColor: 'transparent',
    borderEndEndRadius: s(10),
    borderColor: AppColors.textColor,
    borderWidth: 1,
    borderRadius: s(6),
    marginTop: s(20),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: s(16),
  },
  googleIcon: {
    height: s(20),
    width: s(20),
    marginRight: s(10),
  },
});
