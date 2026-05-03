import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Pin, MessageSquare, Trash2, Plus, Image, Video, FileText, BarChart2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { toast } from 'sonner'
import { postApi } from '@/api/post'
import { useAuthStore } from '@/store/auth.store'
import type { Post } from '@/types/post'
import { Button } from '@/components/ui/button'
import { CreatePostModal } from '../components/CreatePostModal'
import { ConfirmModal } from '@/components/ui/confirm-modal'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function authorInitials(post: Post) {
  return `${post.author.firstname[0]}${post.author.lastname[0]}`.toUpperCase()
}

const TYPE_ICON = {
  TEXT: FileText,
  IMAGE: Image,
  VIDEO: Video,
}

function parsePoll(content: string): { options: string[] } | null {
  try {
    const data = JSON.parse(content)
    if (data?.poll === true && Array.isArray(data.options)) return data as { options: string[] }
    return null
  } catch {
    return null
  }
}

// ─── PostCard ─────────────────────────────────────────────────────────────────

function PostCard({
  post,
  communityId,
  onDelete,
  canDelete,
}: {
  post: Post
  communityId: string
  onDelete: (postId: string) => void
  canDelete: boolean
}) {
  const navigate = useNavigate()
  const TypeIcon = TYPE_ICON[post.type]

  return (
    <div
      onClick={() => navigate(`/communities/${communityId}/community/posts/${post.id}`)}
      className="group cursor-pointer rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
    >
      {/* Top row */}
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
            {authorInitials(post)}
          </div>
          <div className="flex items-center gap-1.5 text-sm">
            <span className="font-medium text-foreground">
              {post.author.firstname} {post.author.lastname}
            </span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {post.isPinned && <Pin className="h-3.5 w-3.5 text-primary" />}
          {canDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete(post.id)
              }}
              className="rounded p-1 text-muted-foreground opacity-0 transition-all hover:text-destructive group-hover:opacity-100"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <h3 className="mb-1.5 font-semibold text-foreground">{post.title}</h3>
      {(() => {
        const poll = parsePoll(post.content)
        if (poll) {
          return (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <BarChart2 className="h-3.5 w-3.5 shrink-0" />
              <span>{poll.options.length} options</span>
            </div>
          )
        }
        return <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{post.content}</p>
      })()}

      {/* Footer */}
      <div className="mt-4 flex items-center gap-3">
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <TypeIcon className="h-3.5 w-3.5" />
          {post.type}
        </span>
        {post.category && (
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-foreground/70">
            {post.category}
          </span>
        )}
        <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
          <MessageSquare className="h-3.5 w-3.5" />
          {post._count.comments}
        </div>
      </div>
    </div>
  )
}

// ─── Feed ─────────────────────────────────────────────────────────────────────

export function Feed() {
  const { id: communityId } = useParams<{ id: string }>()
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  const [createOpen, setCreateOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null)

  const isMock = communityId?.startsWith('mock-')

  const { data, isLoading } = useQuery({
    queryKey: ['posts', communityId],
    queryFn: () => postApi.list(communityId!),
    enabled: !!communityId && !isMock,
  })

  const { mutate: deletePost, isPending: deletingPost } = useMutation({
    mutationFn: (postId: string) => postApi.delete(communityId!, postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', communityId] })
      toast.success('Post deleted')
      setDeletingPostId(null)
    },
    onError: (err) => toast.error((err as Error).message),
  })

  const posts = data?.data?.posts ?? []

  // Derive category list from posts
  const categories = [
    'All',
    ...Array.from(new Set(posts.map((p) => p.category).filter(Boolean) as string[])),
  ]

  const filtered =
    activeCategory === 'All'
      ? posts
      : posts.filter((p) => p.category === activeCategory)

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-4 border-border border-t-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Feed</h2>
        {!isMock && (
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4" />
            New post
          </Button>
        )}
      </div>

      {isMock && (
        <div className="rounded-lg border border-border bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
          This is a demo community. Create a real community to post and interact.
        </div>
      )}

      {/* Category tabs */}
      {categories.length > 1 && (
        <div className="flex gap-1 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Posts */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-16 text-center">
          <MessageSquare className="h-9 w-9 text-muted-foreground" />
          <p className="mt-3 font-semibold text-foreground">No posts yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Be the first to post something.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              communityId={communityId!}
              canDelete={user?.id === post.authorId}
              onDelete={(id) => setDeletingPostId(id)}
            />
          ))}
        </div>
      )}

      <CreatePostModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        communityId={communityId!}
      />

      <ConfirmModal
        open={!!deletingPostId}
        onOpenChange={(v) => { if (!v) setDeletingPostId(null) }}
        title="Delete post?"
        description="This post and all its comments will be permanently deleted."
        confirmLabel="Delete"
        onConfirm={() => deletingPostId && deletePost(deletingPostId)}
        isPending={deletingPost}
      />
    </div>
  )
}
