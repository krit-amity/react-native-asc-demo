import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {GlobalFeed} from '../screens/GlobalFeed/GlobalFeed';
import {UserSearch} from '../screens/UserSearch';
import {ChatChannel} from '../screens/ChatChannel';
import {MyProfile, UserProfile} from '../screens/UserProfile';

export type HomeTabParamList = {
  GlobalFeed: undefined;
  CommunitySearch: undefined;
  UserSearch: undefined;
  ChatChannel: undefined;
  MyProfile: undefined;
};

const Tab = createBottomTabNavigator<HomeTabParamList>();

export const HomeTab = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="GlobalFeed" component={GlobalFeed} />
      <Tab.Screen name="CommunitySearch" component={GlobalFeed} />
      <Tab.Screen name="UserSearch" component={UserSearch} />
      <Tab.Screen name="ChatChannel" component={ChatChannel} />
      <Tab.Screen name="MyProfile" component={MyProfile} />
    </Tab.Navigator>
  );
};
