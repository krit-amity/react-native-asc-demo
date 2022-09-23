import React, { VFC } from 'react';
import { Image, ImageStyle, StyleProp } from 'react-native';
import { useImage } from '../hooks';

export const ASCImage: VFC<{
  fileId?: string;
  style?: StyleProp<ImageStyle>;
}> = ({ fileId, style }) => {
  const image = useImage(fileId);
  const uri =
    image?.fileUrl != undefined ? `${image?.fileUrl}?size=medium` : undefined; //TODO empty image
  return ( 
    <Image style={[{ width: 150, height: 150 }, style]} source={{ uri }} />
  );
};
