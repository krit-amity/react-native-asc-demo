import {
  BottomTabNavigationProp,
  BottomTabScreenProps,
} from '@react-navigation/bottom-tabs';
import {
  CompositeNavigationProp,
  CompositeScreenProps,
  useNavigation,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import React, { FC } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  Text,
  View,
} from 'react-native';
import { useFeed, useFile, useUser } from '../amity/hooks';
import { HomeTabParamList } from '../navigation/HomeTab';
import { RootStackParamList } from '../navigation/RootStack';
import * as A from '@amityco/ts-sdk';
import { Post } from '../components/Post/Post';
import { Button } from '../components/Button/Button';
import { navigationRef } from '../navigation/navigation';
import { colors } from '../colors';

type UserProfileProps = StackScreenProps<RootStackParamList, 'UserProfile'>;
type MyProfileProps = CompositeScreenProps<
  BottomTabScreenProps<HomeTabParamList, 'MyProfile'>,
  StackScreenProps<RootStackParamList>
>;

export const Profile: FC<{ userId: string }> = ({ userId }) => {
  const user = useUser(userId);
  const avatar = useFile(user?.avatarFileId);
  const { posts, nextPage, isLoading } = useFeed({
    targetType: 'user',
    targetId: userId,
  });
  return (
    <FlatList
      style={{ flex: 1 }}
      onEndReached={() => {
        nextPage();
      }}
      onEndReachedThreshold={0.7}
      keyExtractor={item => item.postId}
      data={posts}
      renderItem={({ item }) => <Post postId={item.postId} />}
      ListHeaderComponent={() => (
        <View
          style={{
            alignItems: 'center',
            backgroundColor: colors.surface,
            borderRadius: 6,
            marginHorizontal: 8,
            marginTop: 8,
            paddingTop: 16,
            paddingBottom: 8,
          }}>
          <Image
            style={{ width: 150, height: 150, borderRadius: 75 }}
            source={{ uri: `${avatar?.fileUrl}?size=medium` }}
          />
          <Text style={{ fontSize: 22, marginTop: 8 }}>
            {user?.displayName}
          </Text>
          <View style={{ flexDirection: 'row' }}>
            <Button
              style={{ flex: 1 }}
              title="Chat"
              onPress={() => {
                A.runQuery(
                  A.createQuery(A.createChannel, {
                    type: 'live',
                    userIds: [userId],
                  }),
                  res => {
                    const { loading, data } = res;
                    if (loading) return;
                    if (!data.channelId) return;
                    if (navigationRef.isReady()) {
                      navigationRef.navigate('ChatMessage', {
                        channelId: data.channelId,
                      });
                    }
                  },
                );
              }}
            />
          </View>
        </View>
      )}
      ListFooterComponent={() => (
        <View>{isLoading && <ActivityIndicator />}</View>
      )}
    />
  );
};

export const UserProfile: FC<UserProfileProps> = ({
  route: {
    params: { userId },
  },
}) => {
  return <Profile userId={userId} />;
};
export const MyProfile: FC<MyProfileProps> = () => {
  return <Profile userId={A.getActiveClient().userId!} />;
};
