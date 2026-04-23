import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ChevronDown, Link2, Loader2, Plus, Trash2, Video } from 'lucide-react'
import { courseApi } from '@/api/course'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { TiptapEditor } from '@/components/shared/TiptapEditor'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { LessonAttachment } from '@/types/course'
import { cn } from '@/lib/utils'

interface LessonPanelProps {
  communityId: string
  courseId: string
  sectionId: string
  lessonId: string | null
  onClose: () => void
  onSaved: () => void
}

export function LessonPanel({
  communityId,
  courseId,
  sectionId,
  lessonId,
  onClose,
  onSaved,
}: LessonPanelProps) {
  const queryClient = useQueryClient()
  const isNew = lessonId === null

  const { data: lessonData, isLoading } = useQuery({
    queryKey: ['lesson', communityId, courseId, sectionId, lessonId],
    queryFn: () => courseApi.getLesson(communityId, courseId, sectionId, lessonId!),
    enabled: !isNew,
  })
  const lesson = lessonData?.data?.lesson

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [isPublished, setIsPublished] = useState(false)
  const [attachments, setAttachments] = useState<LessonAttachment[]>([])
  const [error, setError] = useState('')

  // ADD dropdown panels
  const [showVideoField, setShowVideoField] = useState(false)
  const [showLinkField, setShowLinkField] = useState(false)
  const [linkName, setLinkName] = useState('')
  const [linkUrl, setLinkUrl] = useState('')

  useEffect(() => {
    if (isNew) {
      setTitle(''); setContent(''); setVideoUrl('')
      setIsPublished(false); setError('')
      setAttachments([]); setShowVideoField(false); setShowLinkField(false)
    }
  }, [isNew])

  useEffect(() => {
    if (lesson) {
      setTitle(lesson.title)
      setContent(lesson.content ?? '')
      setVideoUrl(lesson.videoUrl ?? '')
      setIsPublished(lesson.isPublished)
      setAttachments(lesson.attachments)
      setError('')
    }
  }, [lesson])

  const { mutate: save, isPending: saving } = useMutation({
    mutationFn: () => {
      const data = {
        title: title.trim(),
        videoUrl: videoUrl.trim() || undefined,
        content: content || undefined,
        isPublished,
      }
      return isNew
        ? courseApi.createLesson(communityId, courseId, sectionId, data)
        : courseApi.updateLesson(communityId, courseId, sectionId, lessonId!, data)
    },
    onSuccess: () => {
      onSaved()
      if (isNew) onClose()
    },
    onError: (err) => setError((err as Error).message),
  })

  const { mutate: addLink, isPending: addingLink } = useMutation({
    mutationFn: () =>
      courseApi.addAttachment(communityId, courseId, sectionId, lessonId!, {
        name: linkName.trim(),
        url: linkUrl.trim(),
        type: 'LINK',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['lesson', communityId, courseId, sectionId, lessonId],
      })
      setLinkName(''); setLinkUrl(''); setShowLinkField(false)
    },
    onError: (err) => setError((err as Error).message),
  })

  const { mutate: removeAttachment } = useMutation({
    mutationFn: (attachmentId: string) =>
      courseApi.deleteAttachment(communityId, courseId, sectionId, lessonId!, attachmentId),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['lesson', communityId, courseId, sectionId, lessonId],
      }),
  })

  function handleSave() {
    if (!title.trim()) { setError('Title is required'); return }
    setError('')
    save()
  }

  if (!isNew && (isLoading || !lesson)) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col bg-card">
      {/* Title */}
      <div className="border-b border-border px-5 pt-4 pb-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Lesson title..."
          autoFocus={isNew}
          className="w-full bg-transparent text-xl font-semibold text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
        />
      </div>

      {/* Tiptap editor */}
      <TiptapEditor
        content={content}
        onChange={setContent}
        onVideoAdd={(url) => { setVideoUrl(url); setShowVideoField(true) }}
        resetKey={lessonId ?? 'new'}
        className="flex-1 overflow-hidden"
      />

      {/* Inline add-ons */}
      {(showVideoField || showLinkField || attachments.length > 0) && (
        <div className="space-y-2 border-t border-border px-4 py-3">
          {/* Video URL */}
          {showVideoField && (
            <div className="flex items-center gap-2">
              <Video className="h-4 w-4 shrink-0 text-muted-foreground" />
              <Input
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="YouTube, Vimeo, or direct URL"
                className="h-8 flex-1 text-sm"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowVideoField(false)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Done
              </button>
            </div>
          )}
          {/* Resource link form */}
          {showLinkField && (
            <div className="space-y-1.5 rounded-lg border border-border p-2.5">
              <Input
                value={linkName}
                onChange={(e) => setLinkName(e.target.value)}
                placeholder="Link name"
                className="h-7 text-sm"
              />
              <Input
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://..."
                className="h-7 text-sm"
              />
              <div className="flex gap-1.5">
                <Button
                  type="button"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => addLink()}
                  disabled={!linkName.trim() || !linkUrl.trim() || addingLink}
                >
                  Add
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs"
                  onClick={() => { setShowLinkField(false); setLinkName(''); setLinkUrl('') }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
          {/* Attachments list */}
          {attachments.map((a) => (
            <div
              key={a.id}
              className="flex items-center gap-2 rounded-md border border-border bg-muted/30 px-3 py-1.5"
            >
              <Link2 className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <a
                href={a.url}
                target="_blank"
                rel="noopener noreferrer"
                className="min-w-0 flex-1 truncate text-sm text-foreground hover:underline"
              >
                {a.name}
              </a>
              <button
                type="button"
                onClick={() => removeAttachment(a.id)}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {error && (
        <p className="px-4 pb-1 text-xs text-destructive">{error}</p>
      )}

      {/* Bottom action bar */}
      <div className="flex items-center justify-between border-t border-border px-4 py-3">
        {/* Left: ADD + Published */}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1 text-xs">
                ADD
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="top">
              <DropdownMenuItem onClick={() => setShowVideoField(true)}>
                <Video className="mr-2 h-3.5 w-3.5" />
                Video URL
              </DropdownMenuItem>
              {!isNew && (
                <DropdownMenuItem onClick={() => setShowLinkField(true)}>
                  <Link2 className="mr-2 h-3.5 w-3.5" />
                  Resource link
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Published toggle */}
          <button
            type="button"
            onClick={() => setIsPublished((v) => !v)}
            className={cn(
              'flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors',
              isPublished
                ? 'bg-emerald-600/15 text-emerald-600 hover:bg-emerald-600/25'
                : 'bg-muted text-muted-foreground hover:bg-muted/80',
            )}
          >
            <div
              className={cn(
                'h-1.5 w-1.5 rounded-full',
                isPublished ? 'bg-emerald-500' : 'bg-muted-foreground/50',
              )}
            />
            Published
          </button>
        </div>

        {/* Right: Cancel + Save */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 text-xs" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" className="h-8 text-xs" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save'}
          </Button>
        </div>
      </div>
    </div>
  )
}
