import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { TrendingUp, Users, DollarSign } from 'lucide-react'
import { communityApi } from '@/api/community'
import type { MonthDataPoint } from '@/types/community'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatMonthLabel(key: string) {
  const [year, month] = key.split('-')
  return new Date(Number(year), Number(month) - 1, 1).toLocaleDateString('en-US', {
    month: 'short',
  })
}

function formatCurrency(v: number) {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`
  if (v >= 1_000) return `$${(v / 1_000).toFixed(1)}K`
  return `$${v.toFixed(2)}`
}

function formatCount(v: number) {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`
  if (v >= 1_000) return `${(v / 1_000).toFixed(1)}K`
  return String(v)
}

// ─── BarChart ─────────────────────────────────────────────────────────────────

function BarChart({
  data,
  formatValue = formatCount,
  color = 'bg-primary',
}: {
  data: MonthDataPoint[]
  formatValue?: (v: number) => string
  color?: string
}) {
  const max = Math.max(...data.map((d) => d.value), 1)

  return (
    <div className="space-y-2">
      <div className="flex items-end gap-1.5 h-32">
        {data.map(({ month, value }) => {
          const h = max === 0 ? 0 : Math.round((value / max) * 128)
          return (
            <div key={month} className="flex flex-1 flex-col justify-end h-full">
              <div
                className={`w-full rounded-t-sm ${color} opacity-80`}
                style={{ height: h > 0 ? `${h}px` : '2px', minHeight: '2px' }}
              />
            </div>
          )
        })}
      </div>
      <div className="flex gap-1.5">
        {data.map(({ month, value }) => (
          <div key={month} className="flex-1 text-center">
            <div className="text-[10px] text-muted-foreground">{formatMonthLabel(month)}</div>
            <div className="text-[10px] font-medium text-foreground">{formatValue(value)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── StatCard ─────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
}: {
  label: string
  value: string
  sub?: string
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
    </div>
  )
}

// ─── BreakdownList ────────────────────────────────────────────────────────────

function BreakdownList({
  title,
  rows,
}: {
  title: string
  rows: Array<{ label: string; value: string; share?: number }>
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4">
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <div className="space-y-3">
        {rows.map(({ label, value, share }) => (
          <div key={label}>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground capitalize">{label}</span>
              <span className="font-medium text-foreground">{value}</span>
            </div>
            {share !== undefined && (
              <div className="mt-1 h-1 w-full rounded-full bg-muted">
                <div
                  className="h-1 rounded-full bg-primary/70"
                  style={{ width: `${share}%` }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function AnalyticsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-7 w-40 rounded bg-muted" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 rounded-xl bg-muted" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="h-52 rounded-xl bg-muted" />
        <div className="h-52 rounded-xl bg-muted" />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-40 rounded-xl bg-muted" />
        ))}
      </div>
    </div>
  )
}

// ─── AnalyticsPage ────────────────────────────────────────────────────────────

export function AnalyticsPage() {
  const { id } = useParams<{ id: string }>()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['analytics', id],
    queryFn: () => communityApi.getAnalytics(id!),
    enabled: !!id,
  })

  if (isLoading) return <AnalyticsSkeleton />

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-2">
        <TrendingUp className="h-8 w-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Analytics are only available to creators and admins.
        </p>
      </div>
    )
  }

  const analytics = data?.data
  if (!analytics) return null

  const { members, revenue } = analytics

  const totalMembers = members.total
  const byStatusRows = Object.entries(members.byStatus).map(([status, count]) => ({
    label: status.toLowerCase(),
    value: formatCount(count),
    share: totalMembers > 0 ? Math.round((count / totalMembers) * 100) : 0,
  }))

  const byTierRows = Object.entries(members.byTier).map(([tier, count]) => ({
    label: tier.toLowerCase(),
    value: formatCount(count),
    share: totalMembers > 0 ? Math.round((count / totalMembers) * 100) : 0,
  }))

  const totalRevenue = revenue.total
  const byIntervalRows = Object.entries(revenue.byInterval).map(([interval, amount]) => ({
    label: interval.toLowerCase().replace('_', '-'),
    value: formatCurrency(amount),
    share: totalRevenue > 0 ? Math.round((amount / totalRevenue) * 100) : 0,
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-foreground">Analytics</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Member and revenue overview for the last 6 months.
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          label="Total members"
          value={formatCount(members.total)}
          sub={`${members.active} active`}
        />
        <StatCard
          label="New this month"
          value={`+${members.newThisMonth}`}
        />
        <StatCard
          label="Total revenue"
          value={formatCurrency(revenue.total)}
        />
        <StatCard
          label="Revenue this month"
          value={formatCurrency(revenue.thisMonth)}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm font-semibold text-foreground">Member growth</p>
          </div>
          <BarChart data={members.growthLast6Months} formatValue={formatCount} />
        </div>

        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm font-semibold text-foreground">Revenue</p>
          </div>
          <BarChart
            data={revenue.last6Months}
            formatValue={formatCurrency}
            color="bg-emerald-500"
          />
        </div>
      </div>

      {/* Breakdowns */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {byStatusRows.length > 0 && (
          <BreakdownList title="By status" rows={byStatusRows} />
        )}
        {byTierRows.length > 0 && (
          <BreakdownList title="By tier" rows={byTierRows} />
        )}
        {byIntervalRows.length > 0 ? (
          <BreakdownList title="Revenue by billing" rows={byIntervalRows} />
        ) : (
          <div className="rounded-xl border border-border bg-card p-5 flex items-center justify-center">
            <p className="text-sm text-muted-foreground">No revenue yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
