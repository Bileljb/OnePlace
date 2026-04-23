import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  ArrowLeft,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Edit2,
  MoreHorizontal,
  Plus,
  Trash2,
} from 'lucide-react'
import { courseApi } from '@/api/course'
import { communityApi } from '@/api/community'
import { useAuthStore } from '@/store/auth.store'
import type { CourseSection } from '@/types/course'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SectionModal } from '../components/SectionModal'
import { LessonPanel } from '../components/LessonPanel'
import { cn } from '@/lib/utils'

// ── SidebarSection ─────────────────────────────────────────────────────────────

function SidebarSection({
  section,
  communityId,
  courseId,
  activeLesson,
  onSelectLesson,
  onAddLesson,
  onEditSection,
  onDeleteSection,
  onDeleteLesson,
}: {
  section: CourseSection
  communityId: string
  courseId: string
  activeLesson: { sectionId: string; lessonId: string | null } | null
  onSelectLesson: (sectionId: string, lessonId: string) => void
  onAddLesson: (sectionId: string) => void
  onEditSection: (section: CourseSection) => void
  onDeleteSection: (section: CourseSection) => void
  onDeleteLesson: (sectionId: string, lessonId: string) => void
}) {
  const [open, setOpen] = useState(true)

  return (
    <div>
      {/* Section header */}
      <div className="group flex items-center gap-1 px-3 py-1.5">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex flex-1 items-center gap-1.5 text-left"
        >
          {open ? (
            <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          )}
          <span className="truncate text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {section.title}
          </span>
        </button>
        <div className="flex shrink-0 gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={() => onEditSection(section)}
            className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <Edit2 className="h-3 w-3" />
          </button>
          <button
            onClick={() => onDeleteSection(section)}
            className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Lessons */}
      {open && (
        <div className="pb-1">
          {section.lessons.map((lesson) => {
            const isActive =
              activeLesson?.sectionId === section.id &&
              activeLesson?.lessonId === lesson.id
            return (
              <div
                key={lesson.id}
                onClick={() => onSelectLesson(section.id, lesson.id)}
                className={cn(
                  'group flex cursor-pointer items-center gap-2 px-5 py-2 transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
                )}
              >
                <span className={cn('min-w-0 flex-1 truncate text-sm', isActive && 'font-medium')}>
                  {lesson.title}
                </span>
                <span
                  className={cn(
                    'shrink-0 text-[10px] font-medium',
                    lesson.isPublished ? 'text-emerald-500' : 'text-muted-foreground/50',
                  )}
                >
                  {lesson.isPublished ? '●' : '○'}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteLesson(section.id, lesson.id)
                  }}
                  className="shrink-0 rounded p-0.5 opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            )
          })}
          {/* Add lesson */}
          <button
            onClick={() => onAddLesson(section.id)}
            className="flex w-full items-center gap-2 px-5 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <Plus className="h-3 w-3" />
            Add lesson
          </button>
        </div>
      )}
    </div>
  )
}

// ── CourseEditor ───────────────────────────────────────────────────────────────

export function CourseEditor() {
  const { id: communityId, courseId } = useParams<{ id: string; courseId: string }>()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const queryClient = useQueryClient()

  const [sectionModalOpen, setSectionModalOpen] = useState(false)
  const [editingSection, setEditingSection] = useState<CourseSection | undefined>()
  const [deletingSection, setDeletingSection] = useState<CourseSection | undefined>()
  const [activeLesson, setActiveLesson] = useState<{
    sectionId: string
    lessonId: string | null
  } | null>(null)
  const [deletingLesson, setDeletingLesson] = useState<{
    sectionId: string
    lessonId: string
  } | null>(null)

  const { data: communityData } = useQuery({
    queryKey: ['community', communityId],
    queryFn: () => communityApi.getById(communityId!),
    enabled: !!communityId,
  })
  const community = communityData?.data?.community

  const { data: membershipData } = useQuery({
    queryKey: ['membership', communityId],
    queryFn: () => communityApi.getMyMembership(communityId!),
    enabled: !!communityId,
  })
  const membership = membershipData?.data?.membership

  const { data: courseData, isLoading } = useQuery({
    queryKey: ['course', communityId, courseId],
    queryFn: () => courseApi.getById(communityId!, courseId!),
    enabled: !!communityId && !!courseId,
  })
  const course = courseData?.data?.course

  const { mutate: deleteSection, isPending: deletingSecPending } = useMutation({
    mutationFn: (sectionId: string) =>
      courseApi.deleteSection(communityId!, courseId!, sectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course', communityId, courseId] })
      setDeletingSection(undefined)
    },
  })

  const { mutate: deleteLesson, isPending: deletingLessonPending } = useMutation({
    mutationFn: ({ sectionId, lessonId }: { sectionId: string; lessonId: string }) =>
      courseApi.deleteLesson(communityId!, courseId!, sectionId, lessonId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course', communityId, courseId] })
      if (
        activeLesson?.lessonId === deletingLesson?.lessonId &&
        activeLesson?.sectionId === deletingLesson?.sectionId
      ) {
        setActiveLesson(null)
      }
      setDeletingLesson(null)
    },
  })

  if (!communityId || !courseId) return null

  const isManager = community?.creator.id === user?.id || membership?.role === 'admin'
  if (community && !isManager) {
    return <Navigate to={`/communities/${communityId}/classroom`} replace />
  }

  if (isLoading || !course) {
    return (
      <div className="-my-6 flex h-[calc(100vh-6rem)] items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-4 border-border border-t-primary" />
      </div>
    )
  }

  const sections = course.sections
  const totalLessons = sections.reduce((acc, s) => acc + s.lessons.length, 0)
  const publishedLessons = sections.reduce(
    (acc, s) => acc + s.lessons.filter((l) => l.isPublished).length,
    0,
  )
  const publishedPct = totalLessons > 0 ? Math.round((publishedLessons / totalLessons) * 100) : 0

  return (
    <>
      {/* Full-height two-panel layout — cancels CommunityLayout py-6 */}
      <div className="-my-6 flex h-[calc(100vh-6rem)] overflow-hidden">
        {/* ── Left sidebar ── */}
        <aside className="flex w-64 shrink-0 flex-col border-r border-border bg-card">
          {/* Back + course name */}
          <div className="border-b border-border px-4 py-3">
            <button
              onClick={() => navigate(`/communities/${communityId}/classroom/manage`)}
              className="mb-2 flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to courses
            </button>
            <div className="flex items-center justify-between gap-2">
              <span className="min-w-0 truncate text-sm font-semibold text-foreground">
                {course.title}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="shrink-0 rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => navigate(`/communities/${communityId}/classroom/manage`)}
                  >
                    All courses
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Progress */}
          <div className="border-b border-border px-4 py-2.5">
            <div className="mb-1 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>
                {publishedLessons}/{totalLessons} published
              </span>
              <span>{publishedPct}%</span>
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${publishedPct}%` }}
              />
            </div>
          </div>

          {/* Sections list — scrollable */}
          <div className="flex-1 overflow-y-auto py-2">
            {sections.length === 0 ? (
              <p className="px-4 py-6 text-center text-xs text-muted-foreground">
                No sections yet.
                <br />
                Add one to start.
              </p>
            ) : (
              sections.map((section) => (
                <SidebarSection
                  key={section.id}
                  section={section}
                  communityId={communityId}
                  courseId={courseId}
                  activeLesson={activeLesson}
                  onSelectLesson={(sectionId, lessonId) =>
                    setActiveLesson({ sectionId, lessonId })
                  }
                  onAddLesson={(sectionId) => setActiveLesson({ sectionId, lessonId: null })}
                  onEditSection={(s) => {
                    setEditingSection(s)
                    setSectionModalOpen(true)
                  }}
                  onDeleteSection={(s) => setDeletingSection(s)}
                  onDeleteLesson={(sectionId, lessonId) =>
                    setDeletingLesson({ sectionId, lessonId })
                  }
                />
              ))
            )}
          </div>

          {/* Add section */}
          <div className="border-t border-border p-3">
            <button
              onClick={() => {
                setEditingSection(undefined)
                setSectionModalOpen(true)
              }}
              className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-border py-2 text-xs text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
            >
              <Plus className="h-3.5 w-3.5" />
              Add section
            </button>
          </div>
        </aside>

        {/* ── Right main ── */}
        <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
          {activeLesson ? (
            <LessonPanel
              communityId={communityId}
              courseId={courseId}
              sectionId={activeLesson.sectionId}
              lessonId={activeLesson.lessonId}
              onClose={() => setActiveLesson(null)}
              onSaved={() =>
                queryClient.invalidateQueries({ queryKey: ['course', communityId, courseId] })
              }
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <BookOpen className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Select a lesson</p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Click a lesson in the sidebar to edit it, or add a new one.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Delete section confirmation */}
      {deletingSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-xl">
            <p className="font-semibold text-foreground">Delete section?</p>
            <p className="mt-1 text-sm text-muted-foreground">
              "{deletingSection.title}" and all its lessons will be permanently deleted.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDeletingSection(undefined)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                disabled={deletingSecPending}
                onClick={() => deleteSection(deletingSection.id)}
              >
                {deletingSecPending ? 'Deleting…' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete lesson confirmation */}
      {deletingLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-xl">
            <p className="font-semibold text-foreground">Delete lesson?</p>
            <p className="mt-1 text-sm text-muted-foreground">
              This lesson will be permanently deleted.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDeletingLesson(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                disabled={deletingLessonPending}
                onClick={() => deleteLesson(deletingLesson)}
              >
                {deletingLessonPending ? 'Deleting…' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <SectionModal
        open={sectionModalOpen}
        onOpenChange={setSectionModalOpen}
        communityId={communityId}
        courseId={courseId}
        section={editingSection}
      />
    </>
  )
}
