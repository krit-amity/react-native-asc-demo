import * as A from '@amityco/ts-sdk';
import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import polyfill from '@amityco/react-native-formdata-polyfill';

export const addPostReaction = async (
  postId?: string,
  action: string = 'like',
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    if (!postId) return resolve(false);
    A.runQuery(A.createQuery(A.addReaction, 'post', postId, action), res => {
      const { loading, error, data } = res;
      if (error) return reject(error);
      if (loading) return;
      resolve(true);
    });
  });
};
export const removePostReaction = async (
  postId?: string,
  action: string = 'like',
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    if (!postId) return resolve(false);
    A.runQuery(A.createQuery(A.removeReaction, 'post', postId, action), res => {
      const { loading, error, data } = res;
      if (error) return reject(error);
      if (loading) return;
      resolve(true);
    });
  });
};

export const queryUsers = async ({
  displayName,
  page,
}: {
  displayName?: string;
  page?: Amity.Page;
}): Promise<{ data: Amity.User[]; nextPage?: Amity.Page }> => {
  return new Promise((resolve, reject) => {
    A.runQuery(A.createQuery(A.queryUsers, { displayName, page }), res => {
      const { loading, error, data, nextPage } = res;
      if (error) return reject(error);
      if (loading) return;
      resolve({ data: data ?? [], nextPage });
    });
  });
};

export const queryChannels = async (data?: {
  displayName?: string;
  page?: Amity.Page;
}): Promise<{ data: Amity.Channel[]; nextPage?: Amity.Page }> => {
  return new Promise((resolve, reject) => {
    const { displayName, page } = data ?? {};
    A.runQuery(
      A.createQuery(A.queryChannels, { displayName, page, isDeleted: false }),
      res => {
        const { loading, error, data, nextPage } = res;
        if (error) return reject(error);
        if (loading) return;
        resolve({ data: data ?? [], nextPage });
      },
    );
  });
};

export const createPost = async (
  post: Parameters<typeof A.createPost>[0],
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    A.runQuery(A.createQuery(A.createPost, post), res => {
      const { loading, error, data } = res;
      if (error) return reject(error);
      if (loading) return;
      resolve(true);
    });
  });
};

export const registerDeviceForPushNotification: (data: {
  token?: string | null;
}) => Promise<{ status: string }> = async ({ token }) => {
  if (!token) return { status: 'token empty' };
  const body = {
    deviceId: DeviceInfo.getDeviceId(),
    platform: Platform.OS,
    token,
    userId: A.getActiveClient().userId,
    provider: Platform.select({ android: 'fcm' }),
  };
  return A.getActiveClient().http.post('/v1/notification', body, {
    headers: { 'x-api-key': A.getActiveClient().apiKey },
  });
};

export const unregisterDeviceForPushNotification = async () => {
  return A.getActiveClient().http.delete('/v1/notification', {
    headers: { 'x-api-key': A.getActiveClient().apiKey },
    data: {
      deviceId: DeviceInfo.getDeviceId(),
      userId: A.getActiveClient().userId,
    },
  });
};

export const createImage = async (
  fileObject: any,
): Promise<Amity.File<'image'>[]> => {
  polyfill();
  const newFileObject = {
    name: fileObject.fileName,
    type: fileObject.type,
    uri: fileObject.uri,
  };
  const fileData = new FormData();
  fileData.append('files', newFileObject);
  return new Promise((resolve, reject) => {
    A.runQuery(A.createQuery(A.createImage, fileData), res => {
      const { loading, error, data } = res;
      if (error) reject(error);
      if (!loading) resolve(data);
    });
  });
};

export const createMessageImage = async (data: {
  file: Amity.File<'image'>;
  channelId: string;
}): Promise<Amity.Message> => {
  return new Promise((resolve, reject) => {
    A.runQuery(
      A.createQuery(A.createMessage, {
        channelId: data.channelId,
        type: 'image',
        // @ts-ignore
        fileId: data.file.fileId,
      }),
      res => {
        const { loading, error, data } = res;
        if (error) reject(error);
        if (!loading) resolve(data);
      },
    );
  });
};

export const isFileImage = (file: Amity.File): file is Amity.File<'image'> => {
  let res_ =
    (file as Amity.File<'image'>)?.fileId !== undefined &&
    file.type === 'image';
  return res_;
};

export const isMessageText = (
  message: Amity.Message,
): message is Amity.Message<'text'> => {
  let res_ = (message as Amity.Message<'text'>)?.data?.text !== undefined;
  return res_;
};

export const isMessageImage = (
  message: Amity.Message,
): message is Amity.Message<'image'> => {
  const messageImage = message as Amity.Message<'image'>;
  let res_ =
    messageImage?.fileId !== undefined && messageImage?.fileId !== null;
  return res_;
};
