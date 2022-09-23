import React, { FC } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { images } from '../../assets';
import { styles } from './ItemRow.style';

export const ItemRow: FC<{
  imageUri?: string;
  title?: string;
  subTitle?: string;
  onPress?: Function;
}> = ({ imageUri, title, subTitle, onPress }) => {
  return (
    <Pressable onPress={() => onPress?.()}>
      <View style={styles.headerContainer}>
        <Image
          style={styles.headerImage}
          source={{ uri: imageUri }}
          defaultSource={images.avatar}
        />
        <View style={styles.headerBody}>
          <Text>{title}</Text>
          <Text style={styles.headerSubTitle}>{subTitle}</Text>
        </View>
      </View>
    </Pressable>
  );
};
