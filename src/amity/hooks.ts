import React, { useState, useEffect, useCallback, useContext } from 'react';
import * as A from '@amityco/ts-sdk';
import { isFileImage, queryChannels } from './functions';

export const useUser = (userId?: string) => {
  const [user, setUser] = useState<Amity.User>();
  useEffect(() => {
    if (!userId) return;
    return A.observeUser(userId, ({ data }) => setUser(data));
  }, [userId, setUser]);
  return user;
};

export const useFile = (fileId?: string) => {
  const [file, setFile] = useState<Amity.File>();
  useEffect(() => {
    if (!fileId) return;
    A.runQuery(A.createQuery(A.getFile, fileId), ({ data }) => setFile(data));
  }, [fileId, setFile]);
  return file;
};

export const useImage = (fileId?: string) => {
  const [file, setFile] = useState<Amity.File<'image'>>();
  useEffect(() => {
    if (!fileId) return;
    A.runQuery(A.createQuery(A.getFile, fileId), ({ data }) => {
      if (isFileImage(data)) setFile(data);
      else console.log('TODO error file not image');
    });
  }, [fileId, setFile]);
  return file;
};

export const useChannelMembers = (channelId?: string) => {
  const [data, setData] = useState<Amity.Membership<'channel'>[]>();
  useEffect(() => {
    if (!channelId) return;
    A.runQuery(
      A.createQuery(A.queryChannelMembers, { channelId }),
      ({ data }) => {
        setData(data);
      },
    );
  }, [channelId, setData]);
  return data;
};

export const useMessages = (channelId?: string) => {
  const [messages, setMessages] = useState<Amity.Message[]>();

  const [isLoading, setLoading] = useState(true);
  const [prevPage, setPrevPage] = useState<Amity.Page>();

  const getPrevPage = useCallback(async () => {
    if (!channelId) return;
    if (isLoading) return;
    if (!prevPage) return;
    setLoading(true);
    A.runQuery(
      A.createQuery(A.queryMessages, { channelId, page: prevPage }),
      res => {
        const { data, loading, prevPage } = res;
        if (loading) return;
        setMessages(prevState => {
          const newList = [...(prevState ?? []), ...(data ?? [])];
          return newList.sort(A.sortByLastCreated);
        });
        setLoading(false);
        setPrevPage(prevPage);
      },
    );
  }, [channelId, isLoading, prevPage, messages]);

  useEffect(() => {
    if (!channelId) return;
    setLoading(true);
    A.runQuery(
      A.createQuery(A.queryMessages, { channelId, page: { limit: 20 } }),
      res => {
        const { data, prevPage } = res;
        setMessages(data?.sort(A.sortByLastCreated));
        setPrevPage(prevPage);
        setLoading(false);
      },
      { lifeSpan: 5000 },
    );

    return A.observeMessages(channelId, {
      onEvent: (event, res) => {
        const { data, loading } = res;
        if (!data) return;
        if (data.messageId.includes('0.')) return;
        if (loading) return;
        setMessages(prevState => {
          const newList = [...(prevState ?? [])];
          const i = newList.findIndex(p => p.messageId === data.messageId);
          i === -1 ? newList.unshift(data) : (newList[i] = data);
          newList.sort(A.sortByLastCreated);
          return newList;
        });
      },
    });
  }, [channelId]);
  return { messages, getPrevPage, isLoading };
};

export const useChildrenFile = (children?: string[]) => {
  const [files, setFiles] = useState<Amity.File[]>([]);
  useEffect(() => {
    if (children && children.length > 0) {
      A.runQuery(A.createQuery(A.getPosts, children), ({ loading, data }) => {
        if (loading) return;
        data.map(d => {
          A.runQuery(
            A.createQuery(A.getFile, d.data.fileId),
            ({ loading, data }) => {
              if (loading) return;
              setFiles(p => {
                return [...p, data];
              });
            },
          );
        });
      });
    }
  }, [children, setFiles]);
  return files;
};

export const usePost = (postId: string, option?: {}) => {
  const [post, setPost] = useState<Amity.Post>();
  useEffect(() => {
    return A.observePost(postId, res => {
      const { data } = res;
      setPost(data);
    });
  }, [postId, setPost]);
  return post;
};

export const useGlobalFeed = () => {
  const [posts, setPosts] = useState<Amity.Post[]>();
  const [isLoading, setLoading] = useState(true);
  const [page, setPage] = useState<Amity.Page>();

  const nextPage = useCallback(async () => {
    if (isLoading) return;
    if (!page) return;
    setLoading(true);
    A.runQuery(A.createQuery(A.queryGlobalFeed, { page }), res => {
      const { data, nextPage, loading } = res;
      if (loading) return;
      setPosts(prevState => {
        const newList = [...(prevState ?? []), ...(data ?? [])];
        newList.sort(A.sortByLastCreated);
        return newList;
      });
      setLoading(false);
      setPage(nextPage);
    });
  }, [posts, isLoading, page]);

  useEffect(() => {
    setLoading(true);
    A.runQuery(A.createQuery(A.queryGlobalFeed, {}), res => {
      const { data, nextPage, loading } = res;
      if (loading) return;
      setPosts(data);
      setPage(nextPage);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const { userId } = A.getActiveClient();
    if (!userId) return;
    return A.observePosts(
      { targetId: userId, targetType: 'user' },
      {
        onEvent: (event, data) => {
          setPosts(prevState => {
            const newList = [...(prevState ?? [])];
            const i = newList.findIndex(p => p.postId === data.postId);
            i === -1 ? newList.unshift(data) : (newList[i] = data);
            newList.sort(A.sortByLastCreated);
            return newList;
          });
        },
      },
    );
  }, []);

  return { posts, nextPage, isLoading };
};

type QueryPosts = { targetId: string; targetType: string };
export const useFeed = ({ targetId, targetType }: QueryPosts) => {
  const [posts, setPosts] = useState<Amity.Post[]>();
  const [isLoading, setLoading] = useState(true);
  const [page, setPage] = useState<Amity.PageRaw>();

  const nextPage = useCallback(async () => {
    if (isLoading) return;
    if (!page) return;
    setLoading(true);
    A.runQuery(
      A.createQuery(A.queryPosts, { targetId, targetType, page }),
      res => {
        const { data, nextPage, loading } = res;
        if (loading) return;
        setPosts(prevState => {
          const newList = [...(prevState ?? []), ...(data ?? [])];
          newList.sort(A.sortByLastCreated);
          return newList;
        });
        setLoading(false);
        setPage(nextPage);
      },
    );
  }, [targetId, targetType, posts, isLoading, page]);

  useEffect(() => {
    setLoading(true);
    A.runQuery(A.createQuery(A.queryPosts, { targetId, targetType }), res => {
      const { data, nextPage, loading } = res;
      if (loading) return;
      setPosts(data);
      setPage(nextPage);
      setLoading(false);
    });
  }, [targetId, targetType]);

  useEffect(() => {
    return A.observePosts(
      { targetId, targetType },
      {
        onEvent: (event, data) => {
          setPosts(prevState => {
            const newList = [...(prevState ?? [])];
            const i = newList.findIndex(p => p.postId === data.postId);
            i === -1 ? newList.unshift(data) : (newList[i] = data);
            newList.sort(A.sortByLastCreated);
            return newList;
          });
        },
      },
    );
  }, []);

  return { posts, nextPage, isLoading };
};

export const useChannels = () => {
  const [channels, setChannels] = useState<Amity.Channel[]>();
  const [page, setPage] = useState<Amity.Page>();
  const [isLoading, setLoading] = useState(true);
  const onLanding = useCallback(async () => {
    setLoading(true);
    const { data, nextPage } = await queryChannels();
    setLoading(false);
    setChannels(data);
    setPage(nextPage);
  }, []);
  const loadNextPage = useCallback(async () => {
    // TODO
  }, []);
  useEffect(() => {
    onLanding();
  }, []);
  useEffect(() => {
    const listener = data => {
      console.log('v3.message.didCreate', JSON.stringify(data));
      onLanding();
    };
    A.getActiveClient().ws.on('v3.channel.didCreate', listener);
    return () => {
      A.getActiveClient().ws.off('v3.channel.didCreate', listener);
    };
  }, []);
  useEffect(() => {
    const listener = data => {
      console.log('v3.message.didDelete', data);
      onLanding();
    };
    A.getActiveClient().ws.on('v3.channel.didDelete', listener);
    return () => {
      A.getActiveClient().ws.off('v3.channel.didDelete', listener);
    };
  }, []);
  return { channels, isLoading, loadNextPage };
};
