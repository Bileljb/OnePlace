import { api } from './client'
import type { ApiResponse } from '@/types/auth'
import type { Comment, Post, PostType } from '@/types/post'

export const postApi = {
  list: (communityId: string, q?: string) =>
    api
      .get<ApiResponse<{ posts: Post[] }>>(`/communities/${communityId}/posts`, { params: q ? { q } : undefined })
      .then((r) => r.data),

  getById: (communityId: string, postId: string) =>
    api
      .get<ApiResponse<{ post: Post }>>(`/communities/${communityId}/posts/${postId}`)
      .then((r) => r.data),

  create: (
    communityId: string,
    data: { title: string; content: string; type?: PostType; category?: string },
  ) =>
    api
      .post<ApiResponse<{ post: Post }>>(`/communities/${communityId}/posts`, data)
      .then((r) => r.data),

  delete: (communityId: string, postId: string) =>
    api.delete(`/communities/${communityId}/posts/${postId}`).then((r) => r.data),

  getComments: (communityId: string, postId: string) =>
    api
      .get<ApiResponse<{ comments: Comment[] }>>(
        `/communities/${communityId}/posts/${postId}/comments`,
      )
      .then((r) => r.data),

  createComment: (communityId: string, postId: string, content: string) =>
    api
      .post<ApiResponse<{ comment: Comment }>>(
        `/communities/${communityId}/posts/${postId}/comments`,
        { content },
      )
      .then((r) => r.data),

  deleteComment: (communityId: string, postId: string, commentId: string) =>
    api
      .delete(`/communities/${communityId}/posts/${postId}/comments/${commentId}`)
      .then((r) => r.data),
}
