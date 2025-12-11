import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { AppColors } from '../../styles/colors';
import { scale as s, vs } from 'react-native-size-matters';
import AppInput from '../../components/AppInput';
import AppText from '../../components/AppText';
import AppButton from '../../components/AppButton';
const SignUp = () => {
  return (
    <View style={styles.loginView}>
      <AppText style={styles.welcome}>Sign Up</AppText>
      <AppInput label="Name" placeholder='Enter your name'/>
      <AppInput label="Email" placeholder='Enter your email'/>
      <AppInput label="Password" placeholder='Enter your password'/>
      <AppButton
        btnStyle={styles.loginBtn}
        title="Sign Up"
        textStyle={{ color: AppColors.primaryColor, fontSize: s(15) }}
        onPress={() => Alert.alert('Sign Up Successful')}
      />
      <View style={styles.signUpContainer}>
        <AppText style={styles.noAccount}>Already have an account? </AppText>
        <TouchableOpacity onPress={() => Alert.alert('SignUp processing')}>
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
    height: '75%',
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
