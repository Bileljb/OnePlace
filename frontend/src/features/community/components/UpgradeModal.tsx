import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { communityApi } from '@/api/community'
import type { CommunityDetail } from '@/types/community'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface UpgradeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  community: CommunityDetail
}

export function UpgradeModal({ open, onOpenChange, community }: UpgradeModalProps) {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { mutate: upgrade, isPending, error } = useMutation({
    mutationFn: () => communityApi.upgrade(community.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['membership', community.id] })
      onOpenChange(false)
      navigate(`/communities/${community.id}/classroom`)
    },
  })

  const upgradePrice = community.pricing?.upgradePrice

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upgrade your membership</DialogTitle>
          <DialogDescription>
            Unlock premium content and courses in {community.name}.
          </DialogDescription>
        </DialogHeader>

        {upgradePrice && (
          <div className="mb-4 rounded-lg border border-border bg-muted/50 p-4">
            <p className="text-sm text-muted-foreground">One-time upgrade</p>
            <p className="mt-1 text-2xl font-bold text-foreground">${upgradePrice}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Full access to all premium content. No recurring charges.
            </p>
          </div>
        )}

        {error && (
          <p className="mb-3 text-sm text-destructive">
            {(error as Error).message ?? 'Something went wrong. Please try again.'}
          </p>
        )}

        <Button onClick={() => upgrade()} disabled={isPending} className="w-full">
          {isPending
            ? 'Upgrading...'
            : upgradePrice
            ? `Upgrade — $${upgradePrice}`
            : 'Upgrade to paid'}
        </Button>
      </DialogContent>
    </Dialog>
  )
}
