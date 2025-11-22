import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../constants/colors';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'highlight' | 'info' | 'warning' | 'elevated' | 'outlined';
  onPress?: () => void;
}

export default function Card({ 
  children, 
  style, 
  variant = 'default',
  onPress 
}: CardProps) {
  const variantStyles = {
    default: styles.cardDefault,
    highlight: styles.cardHighlight,
    info: styles.cardInfo,
    warning: styles.cardWarning,
    elevated: styles.cardElevated,
    outlined: styles.cardOutlined,
  };

  return (
    <View style={[styles.card, variantStyles[variant], style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    backgroundColor: Colors.card,
  },
  cardDefault: {
    backgroundColor: Colors.card,
    borderWidth: 0,
    shadowColor: Colors.cardShadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
  },
  cardHighlight: {
    backgroundColor: Colors.primaryLight,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  cardInfo: {
    backgroundColor: Colors.infoLight,
    borderWidth: 1.5,
    borderColor: Colors.info,
    shadowColor: Colors.info,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
  },
  cardWarning: {
    backgroundColor: Colors.warningLight,
    borderWidth: 1.5,
    borderColor: Colors.warning,
    shadowColor: Colors.warning,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
  },
  cardElevated: {
    backgroundColor: Colors.card,
    shadowColor: Colors.cardShadowHover,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
  cardOutlined: {
    backgroundColor: Colors.backgroundLight,
    borderWidth: 1.5,
    borderColor: Colors.border,
    shadowColor: 'transparent',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
});
