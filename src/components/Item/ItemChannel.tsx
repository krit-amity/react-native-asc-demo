import { getActiveClient } from "@amityco/ts-sdk";
import React, { FC } from "react";
import { useChannelMembers, useFile, useUser } from "../../amity/hooks";
import { ItemRow } from "./ItemRow.pure";

export const ItemChannel: FC<{ channel: Amity.Channel, onPress?: Function }> = ({ channel, onPress }) => {
  // TODO check is chat to member or community
  const members = useChannelMembers(channel.channelId)
  const chatToUser = members?.filter(m => m.userId != getActiveClient().userId)[0]
  const user = useUser(chatToUser?.userId)
  const avatarFile = useFile(user?.avatarFileId)
  return <ItemRow title={user?.displayName} subTitle={channel.channelId} imageUri={avatarFile?.fileUrl} onPress={onPress} />
}