import React, {FC} from 'react';
import {Image, Pressable, Text, View} from 'react-native';
import {addPostReaction, removePostReaction} from '../../amity/functions';
import {useChildrenFile, useFile, usePost, useUser} from '../../amity/hooks';
import {navigationRef} from '../../navigation/navigation';

import {styles} from './Post.style';

export const Post: FC<{postId: string}> = ({postId}) => {
  const post = usePost(postId);
  const user = useUser(post?.postedUserId);
  const userAvatarFile = useFile(user?.avatarFileId);
  const childrenFile = useChildrenFile(post?.children);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Pressable
          onPress={() => {
            if (!post?.postedUserId) return;
            if (navigationRef.isReady()) {
              navigationRef.navigate('UserProfile', {
                userId: post?.postedUserId,
              });
            }
          }}>
          <Image
            style={styles.headerImage}
            source={{uri: userAvatarFile?.fileUrl}}
          />
        </Pressable>
        <View style={styles.headerBody}>
          <Text>{user?.displayName}</Text>
          <Text style={styles.headerSubTitle}>{post?.createdAt}</Text>
        </View>
      </View>

      {post?.data.text ? (
        <Text style={styles.bodyText}>{post.data.text}</Text>
      ) : null}
      {childrenFile?.[0]?.fileUrl ? (
        <Image
          style={styles.bodyImage}
          source={{uri: childrenFile?.[0]?.fileUrl + '?size=medium'}}
        />
      ) : null}

      <View style={styles.footerCountContainer}>
        <Text style={styles.footerCountText}>{post?.reactionsCount} like</Text>
        <Text style={styles.footerCountText}>
          {post?.commentsCount} comment
        </Text>
      </View>
      <View style={styles.footerActionContainer}>
        {post?.myReactions?.includes('like') ? (
          <Pressable
            onPress={() => {
              removePostReaction(post.postId);
            }}>
            <Text style={styles.likedText}>Like</Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={() => {
              addPostReaction(post?.postId);
            }}>
            <Text>Like</Text>
          </Pressable>
        )}
        <Text>Comment</Text>
      </View>
    </View>
  );
};
