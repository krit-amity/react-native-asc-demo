import React, {FC} from 'react';
import {NavigatorScreenParams} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Login} from '../screens/Login';
import {HomeTab, HomeTabParamList} from './HomeTab';
import {Loading} from '../screens/Loading';
import {UserProfile} from '../screens/UserProfile';
import {ChatMessage} from '../screens/ChatMessage';
import {Pressable, Text, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as A from '@amityco/ts-sdk';
import {CONSTANT} from '../const';
import {CreatePost} from '../screens/CreatePost/CreatePost';
import messaging from '@react-native-firebase/messaging';
import DeviceInfo from 'react-native-device-info';
import {Setting} from '../screens/Setting';
import {unregisterDeviceForPushNotification} from '../amity/functions';

export type RootStackParamList = {
  Login: undefined;
  Loading?: {page?: 'Login' | ''};
  HomeTab: NavigatorScreenParams<HomeTabParamList>;
  UserProfile: {userId: string};
  ChatMessage: {channelId: string};
  CreatePost: undefined;
  Setting: undefined;
};

const RootStack = createStackNavigator<RootStackParamList>();
export const RootStackNavigation = () => (
  <RootStack.Navigator initialRouteName="Loading">
    <RootStack.Screen name="Login" component={Login} />
    <RootStack.Screen name="Loading" component={Loading} />
    <RootStack.Screen
      name="HomeTab"
      component={HomeTab}
      options={({navigation}) => ({
        headerLeft: () => (
          <TouchableOpacity
            onPress={async () => {
              try {
                await unregisterDeviceForPushNotification();
              } catch (err) {
                console.log(err);
              }
              try {
                messaging().deleteToken();
              } catch (err) {
                console.log(err);
              }
              try {
                A.disconnectClient();
              } catch (err) {
                console.log(err);
              }
              try {
                AsyncStorage.removeItem(CONSTANT.KEY_USER_CONTEXT);
              } catch (err) {
                console.log(err);
              }
              navigation.replace('Login');
            }}>
            <Text>Logout</Text>
          </TouchableOpacity>
        ),
        headerRight: () => {
          return (
            <TouchableOpacity
              onPress={async () => {
                navigation.navigate('Setting');
              }}>
              <Text>Setting</Text>
            </TouchableOpacity>
          );
        },
      })}
    />
    <RootStack.Screen name="UserProfile" component={UserProfile} />
    <RootStack.Screen name="ChatMessage" component={ChatMessage} />
    <RootStack.Screen name="CreatePost" component={CreatePost} />
    <RootStack.Screen name="Setting" component={Setting} />
  </RootStack.Navigator>
);
