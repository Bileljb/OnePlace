import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { postApi } from '@/api/post'
import type { PostType } from '@/types/post'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface CreatePostModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  communityId: string
}

const POST_TYPES: PostType[] = ['TEXT', 'IMAGE', 'VIDEO']

export function CreatePostModal({ open, onOpenChange, communityId }: CreatePostModalProps) {
  const queryClient = useQueryClient()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [type, setType] = useState<PostType>('TEXT')
  const [category, setCategory] = useState('')

  const { mutate: create, isPending, error } = useMutation({
    mutationFn: () =>
      postApi.create(communityId, {
        title,
        content,
        type,
        category: category.trim() || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', communityId] })
      setTitle('')
      setContent('')
      setType('TEXT')
      setCategory('')
      onOpenChange(false)
    },
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    create()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>New post</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Post type */}
          <div className="flex gap-2">
            {POST_TYPES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`flex-1 rounded-lg border py-2 text-sm font-medium transition-colors ${
                  type === t
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border text-muted-foreground hover:border-primary/40'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="post-title">Title</Label>
            <Input
              id="post-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's this about?"
              required
            />
          </div>

          {/* Content */}
          <div className="space-y-1.5">
            <Label htmlFor="post-content">Content</Label>
            <textarea
              id="post-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write something..."
              required
              rows={5}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background resize-none"
            />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <Label htmlFor="post-category">
              Category <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="post-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Announcements, Discussion..."
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">{(error as Error).message}</p>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Posting...' : 'Post'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
