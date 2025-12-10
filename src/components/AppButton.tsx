import { StyleSheet, Text, TouchableOpacity, View, ViewStyle, TextStyle } from 'react-native'
import React from 'react'
import { AppColors } from '../styles/colors'

interface AppButtonProps {
  title: string;
  onPress: () => void;
  btnStyle?: ViewStyle;
  textStyle?: TextStyle;
  isLoading?: boolean;
}

const AppButton = ({title, onPress, btnStyle, textStyle, isLoading}: AppButtonProps) => {
  return (
    <TouchableOpacity style={styles.btnContainer} onPress={onPress}>
        {isLoading ? (<Text>Signin...</Text>): (<Text style={styles.btnText}>{title}</Text>)}
    </TouchableOpacity>
  )
}

export default AppButton

const styles = StyleSheet.create({
  btnContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppColors.secondaryColor,
    height: 48,
    width: 326,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  btnText: {
    color: AppColors.textColor,
    fontSize: 18,
  }
})