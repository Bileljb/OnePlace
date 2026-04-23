import { Users } from 'lucide-react'

export function Members() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-20 text-center">
      <Users className="h-10 w-10 text-muted-foreground" />
      <p className="mt-3 font-semibold text-foreground">Members</p>
      <p className="mt-1 text-sm text-muted-foreground">Not in scope yet.</p>
    </div>
  )
}
