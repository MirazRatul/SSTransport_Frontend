import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';
import React, { useState } from 'react';
import AppButton from '../../components/AppButton';
import { scale as s, vs } from 'react-native-size-matters';
import { AppColors } from '../../styles/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { container } from '../../constants/container';
import SignIn from './SignIn';
import SignUp from './SignUp';

const CommonAuth = () => {
  const [activeTab, setActiveTab] = useState('login');
  return (
    <SafeAreaView style={container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.loginContainer}>
            <View style={styles.btnContainer}>
              <AppButton
                btnStyle={[
                  styles.btn,
                  {
                    backgroundColor:
                      activeTab === 'login'
                        ? AppColors.secondaryColor
                        : '#383838',
                  },
                ]}
                textStyle={[
                  styles.btnText,
                  {
                    color:
                      activeTab === 'login'
                        ? AppColors.primaryColor
                        : AppColors.textColor,
                  },
                ]}
                title="Login"
                onPress={() => setActiveTab('login')}
              />
              <AppButton
                btnStyle={[
                  styles.btn,
                  {
                    backgroundColor:
                      activeTab === 'signup'
                        ? AppColors.secondaryColor
                        : '#383838',
                  },
                ]}
                textStyle={[
                  styles.btnText,
                  {
                    color:
                      activeTab === 'signup'
                        ? AppColors.primaryColor
                        : AppColors.textColor,
                  },
                ]}
                title="SignUp"
                onPress={() => setActiveTab('signup')}
              />
            </View>
            {activeTab === 'login' ? (
              <SignIn onGoToSignUp={() => setActiveTab('signup')} />
            ) : (
              <SignUp onGoToSignIn={() => setActiveTab('login')} />
            )}
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CommonAuth;

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnContainer: {
    flexDirection: 'row',
    height: vs(45),
    width: '90%',
    padding: s(3),
    alignItems: 'center',
    backgroundColor: '#383838',
    borderRadius: s(5),
    marginBottom: vs(20),
  },
  btn: {
    width: '50%',
    height: '100%',
  },
  btnText: {
    fontSize: s(15),
  },
});
