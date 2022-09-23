import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { FC } from "react";
import { Button, Pressable, Text, View } from "react-native";
import { CONSTANT } from "../const";
import { RootStackParamList } from "../navigation/RootStack";

const userList = [["1", "มิลิน"], ["2", "มินตรา"], ["3", "มะปราง"], ["4", "แพรใจ"]]

export const Login: FC<NativeStackScreenProps<RootStackParamList, 'Login'>> = ({ navigation }) => {
  const { setItem } = useAsyncStorage(CONSTANT.KEY_USER_CONTEXT)
  const login = async (userId: string, displayName: string) => {
    setItem(JSON.stringify({ userId, displayName }))
    navigation.replace("Loading",{page:"Login"})
  }
  return <View>
    {userList.map(([userId, displayName]) => <Button key={userId} title={displayName} onPress={() => { login(userId, displayName) }} />)}
  </View>
}
