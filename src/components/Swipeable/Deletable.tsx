import React, { FC, useRef } from 'react';
import { Animated, Text, TouchableOpacity } from 'react-native';
import { colors } from '../../colors';
import { Swipeable } from './Swipeable';

export const Deletable: FC<{ onDelete: Function }> = ({
  children,
  onDelete,
}) => {

  return (
    <Swipeable
      backgroundComponent={
        <TouchableOpacity
          onPress={() => {
            onDelete?.();
          }}
          style={{
            flex: 1,
            backgroundColor: 'red',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{ color: colors.on_primary }}>Delete</Text>
        </TouchableOpacity>
      }>
      {children}
    </Swipeable>
  );
};
