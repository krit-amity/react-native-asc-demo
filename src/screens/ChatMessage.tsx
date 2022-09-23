import React, { FC, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  KeyboardAvoidingView,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { StackScreenProps } from '@react-navigation/stack';
import { launchImageLibrary, Asset } from 'react-native-image-picker';
import { RootStackParamList } from '../navigation/RootStack';
import { useGlobalFeed, useMessages } from '../amity/hooks';
import { useHeaderHeight } from '@react-navigation/elements';
import * as A from '@amityco/ts-sdk';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getActiveClient } from '@amityco/ts-sdk';
import { colors } from '../colors';
import {
  ActionSheetImage,
  ActionSheetImageRef,
} from '../components/ActionSheetImage/ActionSheetImage';
import { createImage, createMessageImage } from '../amity/functions';
import { ChatBubble } from '../components/ChatBubble/ChatBubble';

type Props = StackScreenProps<RootStackParamList, 'ChatMessage'>;

export const ChatMessage: FC<Props> = ({
  navigation,
  route: {
    params: { channelId },
  },
}) => {
  const actionSheetImageRef = useRef<ActionSheetImageRef>(null);
  const [text, setText] = useState('');
  const [image, setImage] = useState<Asset>();
  const { messages, getPrevPage, isLoading } = useMessages(channelId);
  const headerHeight = useHeaderHeight();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={async () => {
            await A.deleteChannel(channelId);
            navigation.goBack();
          }}>
          <Text>delete</Text>
        </TouchableOpacity>
      ),
    });
  }, []);
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.surface }}
      edges={['bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior="padding"
        keyboardVerticalOffset={headerHeight}>
        <FlatList
          inverted
          onEndReached={getPrevPage}
          style={{ flex: 1, backgroundColor: colors.background }}
          keyExtractor={item => item.messageId}
          data={messages}
          renderItem={({ item }) => {
            if (item.userId === getActiveClient().userId) {
              return <ChatBubble message={item} isRight />;
            } else return <ChatBubble message={item} />;
          }}
          ListFooterComponent={() => (
            <View>{isLoading && <ActivityIndicator />}</View>
          )}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: 8,
            marginTop: 8,
            marginBottom: 8,
          }}>
          <Pressable
            style={{
              height: 24,
              width: 24,
              paddingTop: -100,
              marginRight: 8,
              backgroundColor: colors.primary,
              borderRadius: 20,
            }}
            onPress={async () => {
              const result = await launchImageLibrary({ mediaType: 'mixed' });
              if (result.didCancel) {
                return;
              }
              setImage(result?.assets?.[0]);
              actionSheetImageRef.current?.show();
            }}>
            <Text
              style={{
                color: colors.on_primary,
                fontSize: 30,
                marginTop: -8,
                marginLeft: 3,
              }}>
              +
            </Text>
          </Pressable>
          <TextInput
            style={{
              flex: 1,
              backgroundColor: colors.background,
              borderRadius: 6,
              padding: 8,
              height: 36,
            }}
            value={text}
            onChangeText={setText}
          />
          <Pressable
            style={{
              height: 36,
              backgroundColor: colors.primary,
              marginLeft: 12,
              borderRadius: 20,
              padding: 8,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => {
              if (text.length == 0) return;
              A.runQuery(
                A.createQuery(A.createMessage, { channelId, data: { text } }),
                res => {
                  setText('');
                },
              );
            }}>
            <Text style={{ color: colors.on_primary }}>Send</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
      <ActionSheetImage
        ref={actionSheetImageRef}
        image={image}
        onSend={async () => {
          const imageFile = await createImage(image).then(f => f[0]);
          await createMessageImage({ channelId, file: imageFile });
          actionSheetImageRef.current?.hide()
        }}
      />
    </SafeAreaView>
  );
};
