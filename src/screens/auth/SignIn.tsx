import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { AppColors } from '../../styles/colors';
import { scale as s, vs } from 'react-native-size-matters';
import AppInput from '../../components/AppInput';
import AppText from '../../components/AppText';
import AppButton from '../../components/AppButton';

const SignIn = () => {
  return (
    <View style={styles.loginView}>
      <AppText style={styles.welcome}>Welcome Back!</AppText>
      <AppInput label="Email" placeholder='Enter your email'/>
      <AppInput label="Password" placeholder='Enter your password'/>
      <TouchableOpacity
        style={styles.forgotContainer}
        onPress={() => Alert.alert('Hello')}
      >
        <AppText
          style={[styles.forgotPassword, { color: AppColors.secondaryColor }]}
        >
          Forgot Password?
        </AppText>
      </TouchableOpacity>
      <AppButton
        btnStyle={styles.loginBtn}
        title="Login"
        textStyle={{ color: AppColors.primaryColor, fontSize: s(15) }}
        onPress={() => Alert.alert('Login Successful')}
      />
      <View style={styles.signUpContainer}>
        <AppText style={styles.noAccount}>Don't have an account? </AppText>
        <TouchableOpacity onPress={() => Alert.alert('SignUp processing')}>
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
    height: '70%',
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
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginVertical: vs(10),
  },
  welcome: {
    fontSize: s(30),
    marginBottom: vs(20),
  },
  loginBtn: {
    width: '100%',
    marginTop: vs(50),
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
