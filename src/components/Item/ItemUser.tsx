import React, { FC } from "react";
import { Image, Text, View } from "react-native";
import { useFile } from "../../amity/hooks";
import { ItemRow } from "./ItemRow.pure";

export const ItemUser: FC<{ user: Amity.User, onPress?: Function }> = ({ user, onPress }) => {
  const userAvatarFile = useFile(user?.avatarFileId)
  return <ItemRow title={user.displayName} subTitle={user.userId} imageUri={userAvatarFile?.fileUrl} onPress={onPress} />
}