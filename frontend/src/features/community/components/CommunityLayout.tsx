import { useState, useEffect } from 'react'
import { OnePlaceLogo } from '@/components/shared/OnePlaceLogo'
import { NavLink, Navigate, Outlet, Link, useNavigate, useParams, useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ChevronDown, ChevronLeft, Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/auth.store'
import { authApi } from '@/api/auth'
import { communityApi } from '@/api/community'
import { leaderboardApi } from '@/api/leaderboard'
import { getMockCommunityDetail, getMockMembership } from '@/mocks/communities.mock'
import { formatCount, getGradient, getPricingLabel } from '../utils/community.utils'
import type { CommunityDetail } from '@/types/community'
import { JoinModal } from './JoinModal'
import { UpgradeModal } from './UpgradeModal'
import { NotificationBell } from '@/components/shared/NotificationBell'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// ─── NavTab ───────────────────────────────────────────────────────────────────

function NavTab({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'flex h-10 shrink-0 items-center border-b-2 px-4 text-sm font-medium whitespace-nowrap transition-colors',
          isActive
            ? 'border-primary text-foreground'
            : 'border-transparent text-muted-foreground hover:text-foreground',
        )
      }
    >
      {children}
    </NavLink>
  )
}

// ─── UserMenu ─────────────────────────────────────────────────────────────────

function UserMenu() {
  const { user, clear } = useAuthStore()
  const navigate = useNavigate()

  async function handleSignOut() {
    try {
      await authApi.signOut()
    } finally {
      clear()
      navigate('/sign-in')
    }
  }

  if (!user) return null

  const initials = `${user.firstname[0]}${user.lastname[0]}`.toUpperCase()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-lg px-2 py-1 transition-colors hover:bg-muted focus:outline-none">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.firstname}
              className="h-7 w-7 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
              {initials}
            </div>
          )}
          <span className="hidden text-sm font-medium text-foreground sm:block">
            {user.firstname}
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>
          {user.firstname} {user.lastname}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/profile">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleSignOut}
          className="text-destructive focus:text-destructive"
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// ─── CommunitySidebar ─────────────────────────────────────────────────────────

function CommunitySidebar({ community }: { community: CommunityDetail }) {
  const [joinOpen, setJoinOpen] = useState(false)
  const [upgradeOpen, setUpgradeOpen] = useState(false)
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const isMock = community.id.startsWith('mock-')

  const { data: membershipData } = useQuery({
    queryKey: ['membership', community.id],
    queryFn: () => communityApi.getMyMembership(community.id),
    enabled: !isMock,
  })

  const membership = isMock
    ? getMockMembership(community.id)
    : membershipData?.data?.membership

  const isActiveMember = membership?.status === 'ACTIVE'
  const isFreeTierInFreemium =
    isActiveMember &&
    community.pricingModel === 'FREEMIUM' &&
    membership?.membershipTier === 'FREE'

  const gradient = getGradient(community.id)

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      {/* Avatar + name */}
      <div className="mb-4 flex items-center gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg overflow-hidden ${community.iconUrl ? '' : `bg-gradient-to-br ${gradient}`}`}
        >
          {community.iconUrl ? (
            <img src={community.iconUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="text-sm font-bold text-white">
              {community.name.slice(0, 2).toUpperCase()}
            </span>
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">{community.name}</p>
          <p className="text-xs text-muted-foreground">
            By {community.creator.firstname} {community.creator.lastname}
          </p>
        </div>
      </div>

      {/* Description */}
      {community.description && (
        <p className="mb-4 line-clamp-4 text-xs leading-relaxed text-muted-foreground">
          {community.description}
        </p>
      )}

      {/* Stats */}
      <div className="mb-4 flex gap-5 border-t border-border pt-4">
        <div>
          <p className="text-sm font-semibold text-foreground">
            {formatCount(community._count.memberships)}
          </p>
          <p className="text-xs text-muted-foreground">Members</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">
            {formatCount(community._count.posts)}
          </p>
          <p className="text-xs text-muted-foreground">Posts</p>
        </div>
      </div>

      {/* Pricing badge */}
      <span className="inline-flex items-center rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs font-medium text-foreground/80">
        {getPricingLabel(community.pricingModel, community.pricing)}
      </span>

      {/* Join / Upgrade action */}
      {!isActiveMember && (
        <Button
          size="sm"
          className="mt-4 w-full"
          onClick={() => {
            if (!user) {
              navigate('/sign-in', { state: { from: location.pathname } })
              return
            }
            setJoinOpen(true)
          }}
        >
          Join
        </Button>
      )}
      {isFreeTierInFreemium && (
        <Button
          size="sm"
          variant="outline"
          className="mt-4 w-full"
          onClick={() => setUpgradeOpen(true)}
        >
          Upgrade
        </Button>
      )}

      <JoinModal open={joinOpen} onOpenChange={setJoinOpen} community={community} />
      <UpgradeModal open={upgradeOpen} onOpenChange={setUpgradeOpen} community={community} />
    </div>
  )
}

// ─── LeaderboardSidebar ───────────────────────────────────────────────────────

const RANK_COLORS = ['text-amber-400', 'text-slate-400', 'text-amber-700']
const RANK_MEDALS = ['🥇', '🥈', '🥉']

function LeaderboardSidebar({ communityId, isActiveMember }: { communityId: string; isActiveMember: boolean }) {
  const isMock = communityId.startsWith('mock-')

  const { data, isLoading } = useQuery({
    queryKey: ['leaderboard', communityId],
    queryFn: () => leaderboardApi.get(communityId),
    enabled: !isMock && isActiveMember,
    staleTime: 60_000,
  })

  const top5 = data?.data?.leaderboardAllTime?.slice(0, 5) ?? []

  if (!isActiveMember || isMock) return null

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-amber-400" />
          <span className="text-sm font-semibold text-foreground">Leaderboard</span>
        </div>
        <NavLink
          to={`/communities/${communityId}/leaderboards`}
          className="text-xs text-primary hover:underline"
        >
          View all
        </NavLink>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-4">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-primary" />
        </div>
      ) : top5.length === 0 ? (
        <p className="py-4 text-center text-xs text-muted-foreground">No points yet. Be the first!</p>
      ) : (
        <ol className="space-y-2.5">
          {top5.map((entry) => {
            const initials = `${entry.firstname[0]}${entry.lastname[0]}`.toUpperCase()
            return (
              <li key={entry.userId} className="flex items-center gap-2">
                <span className={cn('w-5 shrink-0 text-center text-sm', RANK_COLORS[entry.rank - 1])}>
                  {entry.rank <= 3 ? RANK_MEDALS[entry.rank - 1] : entry.rank}
                </span>
                {entry.avatarUrl ? (
                  <img
                    src={entry.avatarUrl}
                    alt={entry.firstname}
                    className="h-6 w-6 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                    {initials}
                  </div>
                )}
                <span className="min-w-0 flex-1 truncate text-sm text-foreground">
                  {entry.firstname} {entry.lastname}
                </span>
                <span className="shrink-0 text-xs font-medium text-muted-foreground">
                  {entry.points} pts
                </span>
              </li>
            )
          })}
        </ol>
      )}
    </div>
  )
}

// ─── CommunityLayout ──────────────────────────────────────────────────────────

export function CommunityLayout() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuthStore()
  const location = useLocation()
  const hideSidebar =
    location.pathname.includes('/classroom') || location.pathname.includes('/analytics')

  const mockCommunity = getMockCommunityDetail(id ?? '')

  const { data, isLoading } = useQuery({
    queryKey: ['community', id],
    queryFn: () => communityApi.getById(id!),
    enabled: !!id && !mockCommunity,
  })

  const { data: membershipData } = useQuery({
    queryKey: ['membership', id],
    queryFn: () => communityApi.getMyMembership(id!),
    enabled: !!id && !mockCommunity,
  })

  const memberRole = membershipData?.data?.membership?.role
  const canViewAnalytics = memberRole === 'creator' || memberRole === 'admin'

  const community: CommunityDetail | undefined = mockCommunity ?? data?.data?.community

  useEffect(() => {
    if (community && id) {
      localStorage.setItem('lastCommunityId', id)
    }
  }, [community, id])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-primary" />
      </div>
    )
  }

  if (!community) return <Navigate to="/communities" replace />

  return (
    <div className="min-h-screen bg-background">
      {/* ── Header ── */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4">
          {/* Top row: logo + community name + user menu */}
          <div className="flex h-14 items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <Link
                to="/communities"
                className="flex shrink-0 items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
              >
                <ChevronLeft className="h-4 w-4" />
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary">
                  <OnePlaceLogo className="h-3.5 w-3.5 text-white" />
                </div>
              </Link>
              <div className="h-5 w-px shrink-0 bg-border" />
              <span className="truncate font-semibold text-foreground">{community.name}</span>
            </div>
            <div className="flex items-center gap-1">
              <NotificationBell />
              <UserMenu />
            </div>
          </div>

          {/* Tabs row */}
          <div className="-mb-px flex overflow-x-auto">
            <NavTab to={`/communities/${id}/community`}>Community</NavTab>
            <NavTab to={`/communities/${id}/classroom`}>Classroom</NavTab>
            <NavTab to={`/communities/${id}/calendar`}>Calendar</NavTab>
            <NavTab to={`/communities/${id}/members`}>Members</NavTab>
            <NavTab to={`/communities/${id}/leaderboards`}>Leaderboards</NavTab>
            <NavTab to={`/communities/${id}/about`}>About</NavTab>
            {canViewAnalytics && (
              <NavTab to={`/communities/${id}/analytics`}>Analytics</NavTab>
            )}
            {community.creator.id === user?.id && (
              <NavTab to={`/communities/${id}/settings/general`}>Settings</NavTab>
            )}
          </div>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex gap-6">
          {/* Main content */}
          <main className="min-w-0 flex-1">
            <Outlet />
          </main>

          {/* Sidebar */}
          {!hideSidebar && (
            <aside className="hidden w-72 shrink-0 space-y-4 lg:block">
              <CommunitySidebar community={community} />
              <LeaderboardSidebar
                communityId={id!}
                isActiveMember={membershipData?.data?.membership?.status === 'ACTIVE'}
              />
            </aside>
          )}
        </div>
      </div>
    </div>
  )
}
