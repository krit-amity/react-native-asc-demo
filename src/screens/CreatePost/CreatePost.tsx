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
import * as A from '@amityco/ts-sdk';
import {launchImageLibrary, Asset} from 'react-native-image-picker';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../../navigation/RootStack';
import {styles} from './CreatePost.style';
import {TextInput} from 'react-native-gesture-handler';
import {Button} from '../../components/Button/Button';
import {createPost} from '../../amity/functions';
import {colors} from '../../colors';

type Props = StackScreenProps<RootStackParamList, 'CreatePost'>;

export const CreatePost: FC<Props> = ({navigation}) => {
  const [text, setText] = useState('');
  const [target, setTarget] = useState<'timeline' | 'community'>('community');
  const [image, setImage] = useState<Asset>();
  return (
    <View style={styles.container}>
      <Text>Create Post</Text>
      <TextInput
        multiline
        style={styles.createPostText}
        onChangeText={setText}
      />
      <View style={{flexDirection: 'row'}}>
        <Image source={{uri: image?.uri}} style={{width: 100, height: 100}} />
      </View>
      <View style={{flexDirection: 'row'}}>
        <Pressable
          onPress={async () => {
            const result = await launchImageLibrary({mediaType: 'mixed'});
            if (result.didCancel) {
              return;
            }
            setImage(result?.assets?.[0]);
          }}
          style={{margin: 16}}>
          <Text>Add Image</Text>
        </Pressable>
        <Pressable style={{margin: 16}}>
          <Text>Add File</Text>
        </Pressable>
      </View>

      <View style={{flexDirection: 'row'}}>
        <Text style={{margin: 16}}>Post to:</Text>
        <Pressable
          onPress={() => setTarget('timeline')}
          style={{
            margin: 16,
            backgroundColor: target == 'timeline' ? colors.primary : undefined,
          }}>
          <Text>Timeline</Text>
        </Pressable>
        <Pressable
          onPress={() => setTarget('community')}
          style={{
            margin: 16,
            backgroundColor: target == 'community' ? colors.primary : undefined,
          }}>
          <Text>Community</Text>
        </Pressable>
      </View>
      <Button
        title="Create Post"
        onPress={async () => {
          let attachments: Parameters<typeof createPost>[0]['attachments'] = [];
          if (image) {
            const data = new FormData();
            const asset = image;
            const file = {
              name: asset.fileName,
              type: asset.type,
              uri: asset.uri,
            };
            data.append('file', file);
            data.getAll = data.getParts;
            const amityFile = (await A.createFile(data)).data;
            attachments.push({fileId: amityFile.fileId, type: amityFile.type});
          }

          if (target === 'community') {
            await createPost({
              targetType: 'community',
              targetId: '6221ef46c1a0aa00da987f26',
              data: {text},
              attachments,
            });
          } else {
            await createPost({
              targetType: 'user',
              targetId: A.getActiveClient().userId!,
              data: {text},
              attachments,
            });
          }
          setText('');
          navigation.pop();
        }}
      />
    </View>
  );
};
