import {
  StyleSheet,
  TextInput,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import React from 'react';
import { scale as s, vs } from 'react-native-size-matters';
import AppText from './AppText';

interface AppInputProps {
  label: string;
  placeholder?: string;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  value?: string;
  onChangeText?: (text: string) => void;
  secureTextEntry?: boolean;
}

const AppInput = ({
  label,
  placeholder,
  containerStyle,
  inputStyle,
  value,
  onChangeText,
  secureTextEntry,
}: AppInputProps) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <AppText variant="bold">{label}</AppText>

      <TextInput
        style={[styles.inputContainer, inputStyle]}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
      />
    </View>
  );
};

export default AppInput;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: vs(3)
  },
  inputContainer: {
    height: s(40),
    width: '100%',
    padding: s(5),
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#383838',
    borderRadius: s(5),
    marginVertical: vs(5)
  },
});
