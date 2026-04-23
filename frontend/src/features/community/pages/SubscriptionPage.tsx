import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { communityApi } from '@/api/community'
import { Button } from '@/components/ui/button'
import type { BillingInterval } from '@/types/community'

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  EXPIRED: 'bg-amber-50 text-amber-700 border-amber-200',
  CANCELLED: 'bg-muted text-muted-foreground border-border',
  BANNED: 'bg-destructive/10 text-destructive border-destructive/20',
}

function formatDate(d: string | null) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export function SubscriptionPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [confirmLeave, setConfirmLeave] = useState(false)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['subscription', id],
    queryFn: () => communityApi.getSubscription(id!),
    enabled: !!id,
  })

  const details = data?.data

  const {
    mutate: renew,
    isPending: isRenewing,
    isSuccess: renewSuccess,
    error: renewError,
  } = useMutation({
    mutationFn: (billingInterval?: BillingInterval) =>
      communityApi.renew(id!, billingInterval),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription', id] })
      queryClient.invalidateQueries({ queryKey: ['membership', id] })
    },
  })

  const {
    mutate: leave,
    isPending: isLeaving,
    error: leaveError,
  } = useMutation({
    mutationFn: () => communityApi.leave(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-communities'] })
      queryClient.invalidateQueries({ queryKey: ['membership', id] })
      navigate('/profile/communities')
    },
  })

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-6 w-48 animate-pulse rounded bg-muted" />
        <div className="h-40 w-full animate-pulse rounded-xl bg-muted" />
        <div className="h-32 w-full animate-pulse rounded-xl bg-muted" />
      </div>
    )
  }

  if (isError || !details) {
    return (
      <p className="py-8 text-center text-sm text-destructive">
        Failed to load subscription details.
      </p>
    )
  }

  const { status, membershipTier, pricingModel, subscription, pricing } = details
  const canRenew = pricingModel === 'SUBSCRIPTION' && !!subscription

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Subscription</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your membership details for this community.
        </p>
      </div>

      {/* Status card */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">Membership status</span>
          <span
            className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${
              STATUS_STYLES[status] ?? STATUS_STYLES.CANCELLED
            }`}
          >
            {status}
          </span>
        </div>

        <div className="flex items-center justify-between border-t border-border pt-4">
          <span className="text-sm font-medium text-foreground">Tier</span>
          <span className="text-sm text-muted-foreground">
            {membershipTier === 'PAID' ? 'Paid' : 'Free'}
          </span>
        </div>

        <div className="flex items-center justify-between border-t border-border pt-4">
          <span className="text-sm font-medium text-foreground">Pricing model</span>
          <span className="text-sm text-muted-foreground capitalize">
            {pricingModel.toLowerCase().replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Billing record */}
      {subscription && (
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h2 className="text-base font-semibold text-foreground">Billing</h2>

          {subscription.billingInterval && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Billing interval</span>
              <span className="text-sm text-muted-foreground capitalize">
                {subscription.billingInterval.toLowerCase()}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between border-t border-border pt-4">
            <span className="text-sm font-medium text-foreground">Started</span>
            <span className="text-sm text-muted-foreground">
              {formatDate(subscription.subscriptionStart)}
            </span>
          </div>

          {subscription.subscriptionEnd && (
            <div className="flex items-center justify-between border-t border-border pt-4">
              <span className="text-sm font-medium text-foreground">
                {subscription.isExpired ? 'Expired' : 'Renews'}
              </span>
              <span
                className={`text-sm ${
                  subscription.isExpired ? 'text-destructive' : 'text-muted-foreground'
                }`}
              >
                {formatDate(subscription.subscriptionEnd)}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between border-t border-border pt-4">
            <span className="text-sm font-medium text-foreground">Amount paid</span>
            <span className="text-sm font-semibold text-foreground">
              ${Number(subscription.pricePaid).toFixed(2)}
            </span>
          </div>

          {canRenew && (
            <div className="border-t border-border pt-4 space-y-2">
              {renewError && (
                <p className="text-sm text-destructive">{(renewError as Error).message}</p>
              )}
              {renewSuccess && (
                <p className="text-sm text-emerald-600">Subscription renewed successfully.</p>
              )}
              <Button
                onClick={() =>
                  renew(subscription.billingInterval as BillingInterval | undefined)
                }
                disabled={isRenewing}
                className="w-full"
              >
                {isRenewing ? 'Processing...' : 'Renew subscription'}
              </Button>
              {subscription.billingInterval === 'MONTHLY' && pricing?.yearlyPrice && (
                <p className="text-center text-xs text-muted-foreground">
                  Save by switching to yearly — ${Number(pricing.yearlyPrice).toFixed(2)}/year
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Leave community */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <div>
          <h2 className="text-base font-semibold text-foreground">Leave community</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            You will lose access immediately. This cannot be undone.
          </p>
        </div>

        {leaveError && (
          <p className="text-sm text-destructive">{(leaveError as Error).message}</p>
        )}

        {confirmLeave ? (
          <div className="flex gap-3">
            <Button
              variant="destructive"
              onClick={() => leave()}
              disabled={isLeaving}
              className="flex-1"
            >
              {isLeaving ? 'Leaving...' : 'Yes, leave community'}
            </Button>
            <Button
              variant="outline"
              onClick={() => setConfirmLeave(false)}
              disabled={isLeaving}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            onClick={() => setConfirmLeave(true)}
            className="border-destructive/30 text-destructive hover:bg-destructive/5 hover:text-destructive"
          >
            Leave community
          </Button>
        )}
      </div>
    </div>
  )
}
