import { useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { BarChart2, Link2, Paperclip, X } from 'lucide-react'
import { toast } from 'sonner'
import { postApi } from '@/api/post'
import { communityApi } from '@/api/community'
import { useAuthStore } from '@/store/auth.store'
import { uploadFile } from '@/api/upload'
import type { PostType } from '@/types/post'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface CreatePostModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  communityId: string
}

export function CreatePostModal({ open, onOpenChange, communityId }: CreatePostModalProps) {
  const queryClient = useQueryClient()
  const { user } = useAuthStore()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const linkInputRef = useRef<HTMLInputElement>(null)

  const [title, setTitle] = useState('')
  const [textContent, setTextContent] = useState('')
  const [uploading, setUploading] = useState(false)
  const [sendEmail, setSendEmail] = useState(false)

  // Media
  const [mediaUrl, setMediaUrl] = useState('')
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null)

  // Link panel
  const [showLinkPanel, setShowLinkPanel] = useState(false)
  const [linkInput, setLinkInput] = useState('')

  // Poll
  const [showPoll, setShowPoll] = useState(false)
  const [pollOptions, setPollOptions] = useState(['', '', ''])

  const { data: communityData } = useQuery({
    queryKey: ['community', communityId],
    queryFn: () => communityApi.getById(communityId),
    enabled: !!communityId,
  })
  const communityName = communityData?.data?.community?.name ?? ''

  function buildSubmission(): { content: string; type: PostType } {
    if (showPoll) {
      const payload: Record<string, unknown> = {
        poll: true,
        options: pollOptions.filter((o) => o.trim()),
      }
      if (textContent.trim()) payload.text = textContent.trim()
      if (mediaUrl) { payload.mediaUrl = mediaUrl; payload.mediaType = mediaType }
      return { content: JSON.stringify(payload), type: 'TEXT' }
    }
    const type: PostType = mediaType === 'image' ? 'IMAGE' : mediaType === 'video' ? 'VIDEO' : 'TEXT'
    const content = textContent.trim() || mediaUrl
    return { content, type }
  }

  const { mutate: create, isPending } = useMutation({
    mutationFn: () => {
      const { content, type } = buildSubmission()
      return postApi.create(communityId, { title, content, type })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', communityId] })
      toast.success('Post published')
      resetForm()
      onOpenChange(false)
    },
    onError: (err) => toast.error((err as Error).message),
  })

  function resetForm() {
    setTitle('')
    setTextContent('')
    setUploading(false)
    setSendEmail(false)
    setMediaUrl('')
    setMediaType(null)
    setShowLinkPanel(false)
    setLinkInput('')
    setShowPoll(false)
    setPollOptions(['', '', ''])
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) { toast.error('Title is required'); return }
    create()
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    const isImage = file.type.startsWith('image/')
    const isVideo = file.type.startsWith('video/')
    if (!isImage && !isVideo) { toast.error('Only images and videos are supported'); return }
    setUploading(true)
    try {
      const url = await uploadFile(file, 'posts')
      setMediaUrl(url)
      setMediaType(isImage ? 'image' : 'video')
    } catch (err) {
      toast.error((err as Error).message ?? 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  function addLink() {
    const url = linkInput.trim()
    if (!url) return
    setTextContent((prev) => (prev ? `${prev}\n${url}` : url))
    setLinkInput('')
    setShowLinkPanel(false)
  }

  function toggleLinkPanel() {
    setShowLinkPanel((v) => {
      if (!v) setTimeout(() => linkInputRef.current?.focus(), 50)
      return !v
    })
  }

  function updateOption(i: number, val: string) {
    setPollOptions((prev) => prev.map((o, idx) => (idx === i ? val : o)))
  }

  function removeOption(i: number) {
    setPollOptions((prev) => prev.filter((_, idx) => idx !== i))
  }

  const initials = user
    ? `${user.firstname?.[0] ?? ''}${user.lastname?.[0] ?? ''}`.toUpperCase()
    : '?'
  const fullName = user ? `${user.firstname} ${user.lastname}` : ''

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) resetForm(); onOpenChange(v) }}>
      <DialogContent className="max-w-xl p-0 gap-0 overflow-hidden">
        <form onSubmit={handleSubmit} className="flex flex-col">

          {/* Header */}
          <div className="flex items-center gap-3 px-5 pt-5 pb-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
              {initials}
            </div>
            <div className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{fullName}</span>
              {communityName && (
                <> posting in <span className="font-semibold text-foreground">{communityName}</span></>
              )}
            </div>
          </div>

          {/* Title */}
          <div className="px-5">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="w-full bg-transparent text-xl font-semibold text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
            />
          </div>

          {/* Text area — always visible */}
          <div className="px-5 pt-3">
            <textarea
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="Write something..."
              rows={4}
              className="w-full resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
            />
          </div>

          {/* Link panel */}
          {showLinkPanel && (
            <div className="mx-5 mt-2 rounded-lg border border-border bg-muted/30 p-3">
              <input
                ref={linkInputRef}
                type="url"
                value={linkInput}
                onChange={(e) => setLinkInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addLink() } }}
                placeholder="https://..."
                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
              />
              <div className="mt-2.5 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => { setShowLinkPanel(false); setLinkInput('') }}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  size="sm"
                  className="h-7 text-xs"
                  disabled={!linkInput.trim()}
                  onClick={addLink}
                >
                  Add
                </Button>
              </div>
            </div>
          )}

          {/* Poll panel */}
          {showPoll && (
            <div className="mx-5 mt-2 rounded-lg border border-border p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">Poll</span>
                <button
                  type="button"
                  onClick={() => { setShowPoll(false); setPollOptions(['', '', '']) }}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Remove
                </button>
              </div>
              <div className="space-y-2">
                {pollOptions.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2 rounded-lg border border-border px-3 py-2">
                    <input
                      value={opt}
                      onChange={(e) => updateOption(i, e.target.value)}
                      placeholder={`Option ${i + 1}`}
                      className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
                    />
                    {pollOptions.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(i)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setPollOptions((prev) => [...prev, ''])}
                className="mt-2 rounded-lg border border-border px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:text-foreground transition-colors"
              >
                Add Option
              </button>
            </div>
          )}

          {/* Media preview */}
          {mediaUrl && (
            <div className="relative mx-5 mt-2 overflow-hidden rounded-lg border border-border">
              {mediaType === 'image' && (
                <img src={mediaUrl} alt="attachment" className="max-h-60 w-full object-cover" />
              )}
              {mediaType === 'video' && (
                <video src={mediaUrl} controls className="max-h-60 w-full" />
              )}
              <button
                type="button"
                onClick={() => { setMediaUrl(''); setMediaType(null) }}
                className="absolute right-2 top-2 rounded-full bg-background/80 p-1 text-foreground shadow hover:bg-background"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {/* Uploading indicator */}
          {uploading && (
            <div className="mx-5 mt-2 flex items-center gap-2 text-xs text-muted-foreground">
              <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-border border-t-primary" />
              Uploading…
            </div>
          )}

          {/* Bottom bar */}
          <div className="mt-4 border-t border-border px-5 py-3">
            <div className="flex items-center justify-between">
              {/* Toolbar */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  title="Attach image or video"
                  disabled={uploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Paperclip className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  title="Add link"
                  onClick={toggleLinkPanel}
                  className={`rounded-md p-1.5 transition-colors hover:bg-muted hover:text-foreground ${showLinkPanel ? 'bg-muted text-foreground' : 'text-muted-foreground'}`}
                >
                  <Link2 className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  title="Add poll"
                  onClick={() => setShowPoll((v) => !v)}
                  className={`rounded-md p-1.5 transition-colors hover:bg-muted hover:text-foreground ${showPoll ? 'bg-muted text-foreground' : 'text-muted-foreground'}`}
                >
                  <BarChart2 className="h-4 w-4" />
                </button>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-xs uppercase tracking-wide"
                  onClick={() => { resetForm(); onOpenChange(false) }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="text-xs uppercase tracking-wide"
                  disabled={isPending || uploading}
                >
                  {isPending ? 'Posting…' : 'Post'}
                </Button>
              </div>
            </div>

            {/* Send email toggle */}
            <div className="mt-2 flex items-center justify-end gap-2">
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-muted-foreground/40 text-[9px] font-bold text-muted-foreground">i</span>
                Send email to all members
              </span>
              <button
                type="button"
                onClick={() => setSendEmail((v) => !v)}
                className={`relative h-5 w-9 rounded-full transition-colors ${sendEmail ? 'bg-primary' : 'bg-muted'}`}
              >
                <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${sendEmail ? 'translate-x-4' : 'translate-x-0.5'}`} />
              </button>
            </div>
          </div>
        </form>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/quicktime,video/webm"
          className="hidden"
          onChange={handleFileChange}
        />
      </DialogContent>
    </Dialog>
  )
}
