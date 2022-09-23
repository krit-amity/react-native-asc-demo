import React, { FC, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { colors } from '../../colors';

import { styles } from './Button.style';

export const Button: FC<{
  isLoading?: boolean;
  title?: string;
  onPress?: Function;
  style: StyleProp<ViewStyle>;
}> = ({ title, onPress, style, isLoading = false }) => {
  return (
    <TouchableOpacity
      disabled={isLoading}
      style={[styles.container, style]}
      onPress={() => onPress?.()}>
      {isLoading ? (
        <ActivityIndicator color={colors.on_primary} />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};
