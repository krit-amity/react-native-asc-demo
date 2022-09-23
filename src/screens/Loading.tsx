import React, {FC, useEffect, useRef} from 'react';
import {AppState, Text, View} from 'react-native';
import * as A from '@amityco/ts-sdk';
import {useAsyncStorage} from '@react-native-async-storage/async-storage';
import {CONSTANT} from '../const';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/RootStack';
import messaging from '@react-native-firebase/messaging';

import {registerDeviceForPushNotification} from '../amity/functions';

const timeout = (ms: number, message: string) => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(message));
    }, ms);
  });
};

export const Loading: FC<
  NativeStackScreenProps<RootStackParamList, 'Loading'>
> = ({navigation, route}) => {
  const {page = ''} = route.params ?? {};
  const {getItem} = useAsyncStorage(CONSTANT.KEY_USER_CONTEXT);

  const onLanding = async () => {
    const str = await getItem();
    if (!str) return navigation.replace('Login');
    const {userId, displayName} = JSON.parse(str);
    if (!userId) return navigation.replace('Login');
    if (A.isConnected()) {
      try {
        await Promise.race([A.disconnectClient(), timeout(5000, 'timeout')]);
      } catch (e) {}
    }
    const isConnect = await A.connectClient({userId, displayName}).catch(
      () => false,
    );
    if (!isConnect) return navigation.replace('Login');

    if (page === 'Login') {
      const fcmToken = await messaging().getToken();
      console.log('fcmToken', fcmToken);
      await registerDeviceForPushNotification({token: fcmToken});
    }
    navigation.replace('HomeTab', {screen: 'GlobalFeed'});
  };

  useEffect(() => {
    onLanding();
  }, []);

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Loading</Text>
    </View>
  );
};
