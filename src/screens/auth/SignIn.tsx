import {
  ActivityIndicator,
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
import { useToast } from '../../components/Toast/ToastContext';

interface SignInProps {
  onGoToSignUp: () => void;
}

const SignIn = ({ onGoToSignUp }: SignInProps) => {
  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const { showToast } = useToast();

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
        await auth().signOut();
        showToast({
          message: 'Please verify your email before signing in. Check your inbox.',
          type: 'warning',
          duration: 4000,
        });
        return;
      }

      const userObject = {
        id: userCredential?.user.uid,

        email: userCredential?.user.email,
      };

      dispatch(clearUserData());

      dispatch(setUserData(userObject));

      await AsyncStorage.setItem('userData', JSON.stringify(userObject));

      showToast({ message: 'Login successful!', type: 'success' });
    } catch (error: any) {
      let errorMessage = "";

      if(error.code === 'auth/invalid-credential') {
        errorMessage = 'Invalid email or password.';
      } else {
        errorMessage = error.message ?? 'Login failed.';
      }

      console.log('An Error Occurred: ', error);
      showToast({ message: errorMessage, type: 'error' });
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

      showToast({ message: 'Google login successful!', type: 'success' });
    } catch (error: any) {
      console.log('Google Sign-In error:', error);

      if (error.code === '12501') {
        return; // user cancelled
      }

      showToast({ message: error.message ?? 'Google Sign-In failed.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      showToast({ message: 'Please enter your email first.', type: 'warning' });
      return;
    }

    try {
      setLoading(true);

      await auth().sendPasswordResetEmail(email);

      showToast({ message: 'Password reset email sent. Check your inbox.', type: 'success', duration: 4000 });
    } catch (error: any) {
      console.log('Forgot Password Error: ', error);

      let message = 'Something went wrong while resetting password';

      if (error.code === 'auth/user-not-found') {
        message = 'User not found';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Invalid email address';
      }

      showToast({ message, type: 'error' });
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
