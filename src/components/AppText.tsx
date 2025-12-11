import { StyleSheet, Text, View, TextStyle, StyleProp } from 'react-native';
import React, { ReactNode } from 'react';
import { scale as s } from 'react-native-size-matters';
import { AppColors } from '../styles/colors';

interface AppTextProps {
  children: ReactNode;
  variant?: 'medium' | 'bold';
  style?: StyleProp<TextStyle>;
}

const AppText = ({ children, variant = 'medium', style }: AppTextProps) => {
  return <Text style={[styles[variant], style]}>{children}</Text>;
};

export default AppText;

const styles = StyleSheet.create({
    text: {
        fontSize: s(14),
        color: AppColors.secondaryColor,
    },
    bold: {
        fontWeight: 'bold',
        fontSize: s(15),
        color: AppColors.textColor,
    },
    medium: {
        fontSize: s(15),
        color: AppColors.textColor,
    }
});
