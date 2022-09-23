import React, { FC, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  LayoutAnimation,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  Text,
  TextInput,
  UIManager,
  View,
} from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { HomeTabParamList } from '../navigation/HomeTab';
import { RootStackParamList } from '../navigation/RootStack';
import { Post } from '../components/Post/Post';
import { useChannels, useGlobalFeed } from '../amity/hooks';
import { queryChannels, queryUsers } from '../amity/functions';
import { ItemUser } from '../components/Item/ItemUser';
import { ItemChannel } from '../components/Item/ItemChannel';
import { Swipeable } from '../components/Swipeable/Swipeable';
import { Deletable } from '../components/Swipeable/Deletable';
import * as A from '@amityco/ts-sdk';

type Props = CompositeScreenProps<
  BottomTabScreenProps<HomeTabParamList, 'ChatChannel'>,
  StackScreenProps<RootStackParamList>
>;

export const ChatChannel: FC<Props> = ({ navigation }) => {
  const { channels, isLoading } = useChannels();

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        style={{ flex: 1 }}
        keyExtractor={item => item.channelId}
        data={channels}
        renderItem={({ item, index }) => (
          <Deletable
            key={index}
            onDelete={async () => {
              await A.deleteChannel(item.channelId);
            }}>
            <ItemChannel
              channel={item}
              onPress={() =>
                navigation.navigate('ChatMessage', {
                  channelId: item.channelId,
                })
              }
            />
          </Deletable>
        )}
        ListFooterComponent={() => (
          <View>{isLoading && <ActivityIndicator />}</View>
        )}
      />
    </View>
  );
};
