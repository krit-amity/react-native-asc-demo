
import * as A from '@amityco/ts-sdk'


//concept of mix all data to make full post with one funtion call

type UserFull = Amity.User & { avatarFile?: Amity.File }
export type PostFile = Amity.Post & { file?: Amity.File }
export type PostFull = Amity.Post & { postedUser: UserFull, childrenFile: PostFile[] }

export const queryGlobalFeed = async (page?: Amity.Page): Promise<Amity.Paged<PostFull, Amity.Page>> => {
  return new Promise((resolve, reject) => {
    A.runQuery(A.createQuery(A.queryGlobalFeed, { page }),
      async res => {
        const { loading, error, data, nextPage } = res
        if (loading) return;
        if (!data) return resolve({ data: [] })

        const posts = await Promise.all(data?.map(async p => {
          const postedUser = await getUser(p.postedUserId)

          const childrenPost = await getPosts(p.children)
          const childrenFile: PostFile[] = await Promise.all(childrenPost.map(async cp => {
            const file = await getFile(cp.data.fileId)
            const postFile: PostFile = { ...cp, file }
            return postFile
          }))

          const postFull: PostFull = { ...p, postedUser, childrenFile }
          return postFull
        }))
        const newData: Amity.Paged<PostFull, Amity.Page> = { data: posts, nextPage }
        resolve(newData)
      })
  })
}

export const getPosts = async (postId: string[]): Promise<Amity.Post[]> => {
  return new Promise((resolve, reject) => {
    if (postId.length === 0) return resolve([])
    A.runQuery(A.createQuery(A.getPosts, postId), res => {
      const { loading, data } = res
      if (loading) return;
      resolve(data)
    })
  })
}


export const getUser = async (userId: string): Promise<UserFull> => {
  return new Promise((resolve, reject) => {
    A.runQuery(A.createQuery(A.getUser, userId),
      async res => {
        const { loading, data } = res
        if (loading) return;
        const avatarFile = await getFile(data.avatarFileId)
        const userFull: UserFull = { ...data, avatarFile }
        resolve(userFull)
      })
  })
}

export const getFile = async (fileId?: string): Promise<Amity.File | undefined> => {
  return new Promise((resolve, reject) => {
    if (!fileId) return resolve(undefined)
    A.runQuery(A.createQuery(A.getFile, fileId),
      res => {
        const { loading, error, data } = res
        if (error) return reject(res)
        if (loading) return;
        resolve(data)
      })
  })
}