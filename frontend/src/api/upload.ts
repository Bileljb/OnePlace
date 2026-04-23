import { api } from './client'
import type { ApiResponse } from '@/types/auth'

type UploadFolder = 'courses' | 'lessons' | 'attachments' | 'posts'

export const uploadApi = {
  presign: (data: { filename: string; contentType: string; folder: UploadFolder }) =>
    api
      .post<ApiResponse<{ uploadUrl: string; fileUrl: string }>>('/upload/presign', data)
      .then((r) => r.data),
}

export async function uploadFile(file: File, folder: UploadFolder = 'courses'): Promise<string> {
  const { data } = await uploadApi.presign({
    filename: file.name,
    contentType: file.type,
    folder,
  })
  await fetch(data.uploadUrl, {
    method: 'PUT',
    body: file,
    headers: { 'Content-Type': file.type },
  })
  return data.fileUrl
}
