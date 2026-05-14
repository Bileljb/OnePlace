import { api } from '@/api/client'
import type { ApiResponse } from '@/types/auth'

export type UploadFolder = 'avatars' | 'courses' | 'lessons' | 'attachments' | 'posts' | 'communities'

interface PresignResponse {
  uploadUrl: string
  fileUrl: string
  maxSize: number
  expiresIn: number
}

export const uploadApi = {
  presign: (data: { filename: string; contentType: string; folder: UploadFolder }) =>
    api
      .post<ApiResponse<PresignResponse>>('/upload/presign', data)
      .then((r) => r.data),
}

export async function uploadFile(file: File, folder: UploadFolder): Promise<string> {
  const res = await uploadApi.presign({ filename: file.name, contentType: file.type, folder })
  const { uploadUrl, fileUrl, maxSize } = res.data!

  if (file.size > maxSize) {
    throw new Error(`File is too large. Maximum size is ${Math.round(maxSize / 1024 / 1024)} MB.`)
  }

  const uploadRes = await fetch(uploadUrl, {
    method: 'PUT',
    body: file,
    headers: { 'Content-Type': file.type },
  })

  if (!uploadRes.ok) {
    throw new Error('Upload to storage failed. Please try again.')
  }

  return fileUrl
}
