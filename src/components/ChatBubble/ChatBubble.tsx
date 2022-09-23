import React from 'react';
import { Image, Text, View } from 'react-native';
import { ASCImage } from '../../amity/components/ASCImage';
import { isMessageImage, isMessageText } from '../../amity/functions';
import { colors } from '../../colors';

export const ChatBubble = ({
  isRight = false,
  message,
}: {
  isRight?: boolean;
  message: Amity.Message;
}) => {
  let detail = null;
  if (isMessageText(message)) {
    detail = (
      <Text style={{ color: isRight ? colors.on_primary : colors.on_surface }}>
        {message.data.text}
      </Text>
    );
  }
  if (isMessageImage(message)) {
    detail = (
    
      <ASCImage
        fileId={message.fileId}
        style={{ width: 180, height: 180 }}
      />
    );
  }
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        justifyContent: isRight ? 'flex-end' : 'flex-start',
      }}>
      <View
        style={{
          minWidth: 40,
          maxWidth: 200,
          backgroundColor: isRight ? colors.primary : colors.surface,
          marginLeft: 12,
          borderRadius: 20,
          padding: 8,
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 8,
          marginBottom: 8,
        }}>
        {detail}
      </View>
    </View>
  );
};
