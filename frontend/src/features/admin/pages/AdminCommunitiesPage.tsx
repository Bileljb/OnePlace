import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Search, ArrowRight } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { adminApi } from '@/api/admin'
import type { AdminCommunity } from '@/types/admin'
import { getGradient } from '@/features/community/utils/community.utils'

const PRICING_COLORS: Record<string, string> = {
  FREE: 'bg-muted text-muted-foreground',
  FREEMIUM: 'bg-blue-100 text-blue-700',
  SUBSCRIPTION: 'bg-violet-100 text-violet-700',
  ONE_TIME: 'bg-amber-100 text-amber-700',
}

function CommunityRow({ community }: { community: AdminCommunity }) {
  const gradient = getGradient(community.id)

  return (
    <tr className="border-b border-border last:border-0">
      <td className="py-3 pr-4">
        <div className="flex items-center gap-2.5">
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${gradient}`}
          >
            <span className="text-xs font-bold text-white">
              {community.name.slice(0, 2).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">{community.name}</p>
            {community.isPrivate && (
              <p className="text-xs text-muted-foreground">Private</p>
            )}
          </div>
        </div>
      </td>

      <td className="py-3 pr-4">
        <p className="text-sm text-foreground">
          {community.creator.firstname} {community.creator.lastname}
        </p>
        <p className="text-xs text-muted-foreground">{community.creator.email}</p>
      </td>

      <td className="py-3 pr-4">
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
            PRICING_COLORS[community.pricingModel] ?? 'bg-muted text-muted-foreground'
          }`}
        >
          {community.pricingModel.replace('_', ' ')}
        </span>
      </td>

      <td className="py-3 pr-4 text-xs text-muted-foreground">
        {community._count.memberships}
      </td>

      <td className="py-3 pr-4 text-xs text-muted-foreground">
        {community._count.posts}
      </td>

      <td className="py-3 pr-4 text-xs text-muted-foreground">
        {formatDistanceToNow(new Date(community.createdAt), { addSuffix: true })}
      </td>

      <td className="py-3">
        <Link
          to={`/communities/${community.id}/community`}
          className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground inline-flex"
          title="View community"
        >
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </td>
    </tr>
  )
}

export function AdminCommunitiesPage() {
  const [search, setSearch] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['admin-communities'],
    queryFn: adminApi.listCommunities,
  })

  const communities = data?.data?.communities ?? []

  const filtered = search.trim()
    ? communities.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          `${c.creator.firstname} ${c.creator.lastname}`
            .toLowerCase()
            .includes(search.toLowerCase()),
      )
    : communities

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Communities</h1>
          <p className="mt-1 text-sm text-muted-foreground">{communities.length} total</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search communities..."
            className="h-9 rounded-lg border border-border bg-background pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 focus:ring-offset-background"
          />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {isLoading ? (
          <div className="flex h-32 items-center justify-center">
            <div className="h-5 w-5 animate-spin rounded-full border-4 border-border border-t-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            {search ? `No communities found for "${search}"` : 'No communities yet.'}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  {['Community', 'Creator', 'Pricing', 'Members', 'Posts', 'Created', ''].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {filtered.map((community) => (
                  <CommunityRow key={community.id} community={community} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
