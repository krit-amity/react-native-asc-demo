import React, {
  FC,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  forwardRef,
  useCallback,
} from 'react';
import { Animated, Image, PanResponder, View } from 'react-native';
import { Asset } from 'react-native-image-picker';
import { colors } from '../../colors';
import { Button } from '../Button/Button';
export type ActionSheetImageRef = {
  show: () => void;
  hide: () => void;
};
export const ActionSheetImage = forwardRef<
  ActionSheetImageRef,
  { image?: Asset; onSend: () => Promise<void> }
>(({ image, onSend }, ref) => {
  const layoutRef = useRef({ height: 1000, y: 0 }).current;
  const [isSending, setIsSending] = useState(false);
  const valueRef = useRef(new Animated.Value(1000));
  const value = valueRef.current;
  const translateY = value.interpolate({
    inputRange: [0, layoutRef.height],
    outputRange: [0, layoutRef.height],
    extrapolate: 'clamp',
  });

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        value.stopAnimation();
        value.extractOffset();
      },
      onPanResponderMove: (e, g) => {
        return Animated.event([null, { dy: value }], {
          useNativeDriver: false,
        })(e, g);
      },
      onPanResponderRelease: (e, gs) => {
        value.flattenOffset();

        if (gs.vy > 0) {
          Animated.spring(value, {
            velocity: gs.vy,
            useNativeDriver: true,
            toValue: layoutRef.height,
          }).start();
        } else {
          Animated.spring(value, {
            velocity: gs.vy,
            useNativeDriver: true,
            toValue: 0,
          }).start();
        }
      },
    }),
  ).current;

  const hide = useCallback(() => {
    Animated.timing(value, {
      useNativeDriver: true,
      toValue: layoutRef.height,
      duration: 200,
    }).start();
  }, [value, layoutRef]);

  useImperativeHandle(
    ref,
    () => ({
      show: () => {
        Animated.timing(value, {
          useNativeDriver: true,
          toValue: 0,
          duration: 200,
        }).start();
      },
      hide: hide,
    }),
    [hide],
  );

  return (
    <Animated.View
      onLayout={e => {
        layoutRef.height = e.nativeEvent.layout.height;
        layoutRef.y = e.nativeEvent.layout.y;
        value.setValue(layoutRef.height);
      }}
      style={{
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        transform: [{ translateY }],
      }}
      {...panResponder.panHandlers}>
      <View
        style={{
          height: 400,
          backgroundColor: colors.surface,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 24,
          borderRadius: 16,
        }}>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <Image
            style={{
              flex: 1,
              height: 250,
              borderRadius: 8,
            }}
            source={image}
            resizeMode="cover"
          />
        </View>

        <View style={{ flexDirection: 'row', height: 100 }}>
          <Button
            isLoading={isSending}
            title="Send"
            style={{ flex: 1 }}
            onPress={async () => {
              try {
                setIsSending(true);
                await onSend();
              } catch (err) {
                throw err;
              } finally {
                setIsSending(false);
              }
            }}
          />
          <Button title="Cancel" style={{ flex: 1 }} onPress={hide} />
        </View>
      </View>
    </Animated.View>
  );
});
