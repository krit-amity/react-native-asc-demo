import React, {
  FC,
  useRef,
  FunctionComponent,
  ReactComponentElement,
  ReactElement,
} from 'react';
import { Animated, View, StyleSheet, PanResponder, Text } from 'react-native';

export const Swipeable: FC<{ backgroundComponent?: React.ReactNode }> = ({
  children,
  backgroundComponent,
}) => {
  const pan = useRef(new Animated.Value(0)).current;
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.stopAnimation();
        pan.extractOffset();
      },
      onPanResponderMove: Animated.event([null, { dx: pan }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (e, gs) => {
        pan.flattenOffset();
        if (gs.vx > 0) {
          Animated.spring(pan, {
            velocity: gs.vx,
            useNativeDriver: true,
            toValue: 0,
          }).start();
        } else {
          Animated.spring(pan, {
            velocity: gs.vx,
            useNativeDriver: true,
            toValue: -100,
          }).start();
        }
      },
    }),
  ).current;

  return (
    <View style={{ flex: 1 }}>
      <Animated.View
        style={{
          transform: [{ translateX: pan }],
        }}
        {...panResponder.panHandlers}>
        {children}
      </Animated.View>
      <View
        style={{
          width: 100,
          height: '100%',
          position: 'absolute',
          zIndex: -10,
          right: 0,
          bottom: 0,
        }}>
        {backgroundComponent}
      </View>
    </View>
  );
};
