import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { use, useState } from 'react';
import { AppColors } from '../../styles/colors';
import { scale as s, vs } from 'react-native-size-matters';
import AppInput from '../../components/AppInput';
import AppText from '../../components/AppText';
import AppButton from '../../components/AppButton';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SignUpProps {
  onGoToSignIn: () => void;
}

const SignUp = ({ onGoToSignIn }: SignUpProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Password do not match');
      return;
    }
    try {
      setLoading(true);

      const userCredential = await auth().createUserWithEmailAndPassword(
        email.trim(),
        password.trim(),
      );

      await userCredential.user.sendEmailVerification();

      // Firebase automatically signs in the newly created user.
      // Sign them out so the app doesn't navigate to the authenticated stack
      // before the user verifies their email.
      await auth().signOut();

      await AsyncStorage.setItem('Name', name.trim());

      Alert.alert(
        'Verify Email',
        'A verification link has been sent to your email. Please verify before signing in.',
        [
          {
            text: 'OK',
            onPress: () => onGoToSignIn(),
          },
        ],
      );
    } catch (error: any) {
      console.log('An Error Occurred: ', error);
      Alert.alert('Sign Up Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.loginView}>
      <AppText style={styles.welcome}>Sign Up</AppText>
      <AppInput
        label="Name"
        placeholder="Enter your name"
        onChangeText={setName}
      />
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
      <AppInput
        label="Confirm Password"
        placeholder="Confirm password"
        secureTextEntry
        onChangeText={setConfirmPassword}
        type="password"
      />
      {loading ? (
        <ActivityIndicator size={24} color={AppColors.secondaryColor} />
      ) : (
        <AppButton
          btnStyle={styles.loginBtn}
          title="Sign Up"
          textStyle={{ color: AppColors.primaryColor, fontSize: s(15) }}
          onPress={handleSignUp}
        />
      )}

      <View style={styles.signUpContainer}>
        <AppText style={styles.noAccount}>Already have an account? </AppText>
        <TouchableOpacity onPress={onGoToSignIn}>
          <AppText
            variant="bold"
            style={{ color: AppColors.secondaryColor, fontSize: s(13) }}
          >
            Sign In
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SignUp;

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
});
