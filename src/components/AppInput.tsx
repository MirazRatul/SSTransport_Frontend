import {
  StyleSheet,
  TextInput,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
  TouchableOpacity
} from 'react-native';
import React, { useState } from 'react';
import { scale as s, vs } from 'react-native-size-matters';
import AppText from './AppText';
import { Search } from 'lucide-react-native';
import { AppColors } from '../styles/colors';
import { Eye } from 'lucide-react-native';
import { EyeClosed } from 'lucide-react-native';

interface AppInputProps {
  label?: string;
  placeholder?: string;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  value?: string;
  onChangeText?: (text: string) => void;
  secureTextEntry?: boolean;
  type?: string;
}

const AppInput = ({
  label,
  placeholder,
  containerStyle,
  inputStyle,
  value,
  onChangeText,
  secureTextEntry,
  type,
}: AppInputProps) => {
  const [isFocused, setIsFocused] = useState(false)
  const [passwordVisible, setPasswordVisible] = useState(false);

  // Logic to determine if text should be hidden
  const isPassword = type === 'password';
  const shouldSecureText = isPassword ? !passwordVisible : secureTextEntry;

  return (
    <View style={[styles.inputWrapper, containerStyle]}>
      {type !== 'search' && (
        <AppText variant="bold" style={{ marginVertical: s(5) }}>
          {label}
        </AppText>
      )}

      <View style={styles.fieldContainer}>
        {type === 'search' && (
          <View style={styles.leftIconWrapper}>
            <Search size={20} color={AppColors.textColor} />
          </View>
        )}

        <TextInput
          style={[
            styles.inputContainer,
            inputStyle,
            isFocused && { borderColor: AppColors.secondaryColor, borderWidth: 1.5 },
            {
              paddingLeft: type === 'search' ? s(35) : s(10),
              paddingRight: isPassword ? s(40) : s(10), // Add padding so text doesn't go under the eye
            },
          ]}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={shouldSecureText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        {/* Password Eye Toggle */}
        {isPassword && (
          <TouchableOpacity
            style={styles.rightIconWrapper}
            onPress={() => setPasswordVisible(!passwordVisible)}
          >
            {passwordVisible ? (
              <Eye size={20} color={AppColors.textColor} />
            ) : (
              <EyeClosed size={20} color={AppColors.textColor} />
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default AppInput;

const styles = StyleSheet.create({
  inputWrapper: {
    width: '100%',
    marginBottom: s(10),
  },
  fieldContainer: {
    justifyContent: 'center',
  },
  leftIconWrapper: {
    position: 'absolute',
    left: s(10),
    zIndex: 1, // Ensure icon stays above input
  },
  rightIconWrapper: {
    position: 'absolute',
    right: s(10),
    padding: s(5),
    zIndex: 1,
  },
  inputContainer: {
    height: s(40),
    width: '100%',
    borderWidth: 1,
    borderColor: '#383838',
    borderRadius: s(5),
    color: AppColors.textColor,
  },
});
