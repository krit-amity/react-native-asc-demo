import React, {FC, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  Text,
  View,
} from 'react-native';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {CompositeScreenProps} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {HomeTabParamList} from '../../navigation/HomeTab';
import {RootStackParamList} from '../../navigation/RootStack';
import {Post} from '../../components/Post/Post';
import {useGlobalFeed} from '../../amity/hooks';
import {styles} from './GlobalFeed.style';

type Props = CompositeScreenProps<
  BottomTabScreenProps<HomeTabParamList, 'GlobalFeed'>,
  StackScreenProps<RootStackParamList>
>;

export const GlobalFeed: FC<Props> = ({navigation}) => {
  const {posts, nextPage, isLoading} = useGlobalFeed();

  return (
    <FlatList
      style={{flex: 1}}
      onEndReached={() => {
        nextPage();
      }}
      onEndReachedThreshold={0.7}
      keyExtractor={item => item.postId}
      data={posts}
      renderItem={({item}) => <Post postId={item.postId} />}
      ListHeaderComponent={() => (
        <Pressable
          onPress={() => {
            navigation.navigate('CreatePost');
          }}>
          <View style={styles.createPostContainer}>
            <Text style={styles.createPostText}>Create Post</Text>
          </View>
        </Pressable>
      )}
      ListFooterComponent={() => (
        <View>{isLoading && <ActivityIndicator />}</View>
      )}
    />
  );
};
