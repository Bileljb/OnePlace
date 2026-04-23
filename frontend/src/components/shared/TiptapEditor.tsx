import { useEffect, useRef, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import {
  Bold,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  Quote,
  Strikethrough,
  Upload,
  Video,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Toolbar button ───────────────────────────────────────────────────────────

function ToolbarBtn({
  onClick,
  isActive,
  title,
  children,
}: {
  onClick: () => void
  isActive?: boolean
  title: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault()
        onClick()
      }}
      title={title}
      className={cn(
        'flex h-7 min-w-[1.75rem] items-center justify-center rounded px-1.5 text-xs font-medium transition-colors',
        isActive
          ? 'bg-foreground text-background'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
      )}
    >
      {children}
    </button>
  )
}

function Divider() {
  return <div className="mx-1 h-4 w-px shrink-0 bg-border" />
}

// ─── Video modal ──────────────────────────────────────────────────────────────

function VideoModal({
  onConfirm,
  onClose,
}: {
  onConfirm: (url: string) => void
  onClose: () => void
}) {
  const [url, setUrl] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  function handleConfirm() {
    const trimmed = url.trim()
    if (!trimmed) return
    onConfirm(trimmed)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Add a video</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* URL input */}
        <div className="flex items-center gap-2.5 rounded-lg border border-border px-3 py-2.5 focus-within:ring-2 focus-within:ring-ring">
          <Link2 className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleConfirm() }}
            placeholder="YouTube, Loom, Vimeo, or Wistia link"
            autoFocus
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
        </div>

        {/* Dropzone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragging(false)
            // File upload not yet implemented — user can paste URL above
          }}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            'mt-3 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed py-10 transition-colors',
            dragging
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-muted-foreground/40 hover:bg-muted/30',
          )}
        >
          <Upload className="h-6 w-6 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Drag and drop video here</p>
          <span className="text-sm text-muted-foreground underline underline-offset-2">
            or select file
          </span>
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={() => {
              // File upload not yet implemented
            }}
          />
        </div>

        {/* Actions */}
        <div className="mt-5 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!url.trim()}
            className={cn(
              'rounded-lg px-5 py-2 text-sm font-semibold uppercase tracking-wide transition-colors',
              url.trim()
                ? 'bg-muted text-foreground hover:bg-muted/70'
                : 'cursor-not-allowed bg-muted/40 text-muted-foreground',
            )}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── TiptapEditor ─────────────────────────────────────────────────────────────

interface TiptapEditorProps {
  content: string
  onChange: (html: string) => void
  /** Called when the user confirms a video URL from the video modal. */
  onVideoAdd?: (url: string) => void
  /** Change this value to reset the editor to `content` (e.g. when switching lessons). */
  resetKey?: string | number
  className?: string
}

export function TiptapEditor({ content, onChange, onVideoAdd, resetKey, className }: TiptapEditorProps) {
  const [videoModalOpen, setVideoModalOpen] = useState(false)

  const editor = useEditor({
    extensions: [StarterKit, Link.configure({ openOnClick: false })],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  })

  // Reset editor content when resetKey changes (e.g. switching lessons)
  useEffect(() => {
    if (!editor) return
    editor.commands.setContent(content || '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey])

  if (!editor) return null

  const handleAddLink = () => {
    const url = window.prompt('Enter URL')
    if (!url) return
    editor.chain().focus().setLink({ href: url }).run()
  }

  return (
    <>
      <div className={cn('flex flex-col overflow-hidden', className)}>
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-0.5 border-b border-border bg-background/50 px-2 py-1.5">
          <ToolbarBtn
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editor.isActive('heading', { level: 1 })}
            title="Heading 1"
          >
            H1
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive('heading', { level: 2 })}
            title="Heading 2"
          >
            H2
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            isActive={editor.isActive('heading', { level: 3 })}
            title="Heading 3"
          >
            H3
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
            isActive={editor.isActive('heading', { level: 4 })}
            title="Heading 4"
          >
            H4
          </ToolbarBtn>
          <Divider />
          <ToolbarBtn
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            title="Bold"
          >
            <Bold className="h-3.5 w-3.5" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            title="Italic"
          >
            <Italic className="h-3.5 w-3.5" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive('strike')}
            title="Strikethrough"
          >
            <Strikethrough className="h-3.5 w-3.5" />
          </ToolbarBtn>
          <Divider />
          <ToolbarBtn
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            title="Bullet list"
          >
            <List className="h-3.5 w-3.5" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            title="Ordered list"
          >
            <ListOrdered className="h-3.5 w-3.5" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive('blockquote')}
            title="Blockquote"
          >
            <Quote className="h-3.5 w-3.5" />
          </ToolbarBtn>
          <Divider />
          <ToolbarBtn
            onClick={handleAddLink}
            isActive={editor.isActive('link')}
            title="Add link"
          >
            <Link2 className="h-3.5 w-3.5" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            isActive={false}
            title="Horizontal rule"
          >
            <Minus className="h-3.5 w-3.5" />
          </ToolbarBtn>
          {onVideoAdd && (
            <>
              <Divider />
              <ToolbarBtn
                onClick={() => setVideoModalOpen(true)}
                isActive={false}
                title="Add video"
              >
                <Video className="h-3.5 w-3.5" />
              </ToolbarBtn>
            </>
          )}
        </div>

        {/* Editor area */}
        <EditorContent editor={editor} className="tiptap-body flex-1 overflow-y-auto" />
      </div>

      {/* Video modal */}
      {videoModalOpen && (
        <VideoModal
          onConfirm={(url) => onVideoAdd!(url)}
          onClose={() => setVideoModalOpen(false)}
        />
      )}
    </>
  )
}
