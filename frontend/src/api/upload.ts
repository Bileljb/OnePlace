import { api } from './client'
import type { ApiResponse } from '@/types/auth'

export type UploadFolder = 'courses' | 'lessons' | 'attachments' | 'posts' | 'communities'

export const uploadApi = {
  presign: (data: { filename: string; contentType: string; folder: UploadFolder }) =>
    api
      .post<ApiResponse<{ uploadUrl: string; fileUrl: string }>>('/upload/presign', data)
      .then((r) => r.data),
}

export async function uploadFile(file: File, folder: UploadFolder = 'courses'): Promise<string> {
  const result = await uploadApi.presign({
    filename: file.name,
    contentType: file.type,
    folder,
  })
  if (!result.data) throw new Error('Failed to get presigned URL')
  await fetch(result.data.uploadUrl, {
    method: 'PUT',
    body: file,
    headers: { 'Content-Type': file.type },
  })
  return result.data.fileUrl
}
