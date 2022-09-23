import React, { FC, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { HomeTabParamList } from '../navigation/HomeTab';
import { RootStackParamList } from '../navigation/RootStack';
import { Post } from '../components/Post/Post';
import { useGlobalFeed } from '../amity/hooks';
import { queryUsers } from '../amity/functions';
import { ItemUser } from '../components/Item/ItemUser';
import { colors } from '../colors';

type Props = CompositeScreenProps<
  BottomTabScreenProps<HomeTabParamList, 'UserSearch'>,
  StackScreenProps<RootStackParamList>
>;

export const UserSearch: FC<Props> = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [users, setUsers] = useState<Amity.User[]>([]);
  const [page, setPage] = useState<Amity.Page>();
  const [isLoading, setLoading] = useState(true);

  const search = async ({ reset = false } = {}) => {
    setLoading(true);
    const { data, nextPage } = await queryUsers({
      displayName: searchText,
      page,
    });
    console.log(page);
    setLoading(false);
    if (reset) {
      setUsers(data);
      setPage(nextPage);
    } else {
      setUsers([...users, ...data]);
      setPage(nextPage);
    }
  };

  useEffect(() => {
    search({ reset: true });
  }, [searchText]);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ backgroundColor: colors.surface, padding: 12 }}>
        <TextInput
          style={{
            backgroundColor: colors.background,
            borderRadius: 6,
            padding: 8,
          }}
          placeholder="Search"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>
      <FlatList
        style={{ flex: 1 }}
        keyExtractor={item => item.userId}
        data={users}
        renderItem={({ item }) => (
          <ItemUser
            user={item}
            onPress={() => {
              navigation.navigate('UserProfile', { userId: item.userId });
            }}
          />
        )}
        onEndReached={() => {
          if (isLoading || !page) return;
          search();
        }}
        ListFooterComponent={() => (
          <>
            {isLoading && (
              <View style={{ marginTop: 40 }}>
                <ActivityIndicator />
              </View>
            )}
          </>
        )}
      />
    </View>
  );
};
