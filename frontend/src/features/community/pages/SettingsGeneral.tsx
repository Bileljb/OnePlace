import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { communityApi } from '@/api/community'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function SettingsGeneral() {
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()

  const { data } = useQuery({
    queryKey: ['community', id],
    queryFn: () => communityApi.getById(id!),
    enabled: !!id,
  })

  const community = data?.data?.community

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)

  useEffect(() => {
    if (community) {
      setName(community.name)
      setDescription(community.description ?? '')
      setIsPrivate(community.isPrivate)
    }
  }, [community])

  const { mutate: save, isPending, error, isSuccess } = useMutation({
    mutationFn: () =>
      communityApi.update(id!, {
        name,
        description: description || undefined,
        isPrivate,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community', id] })
    },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">General</h1>
        <p className="mt-1 text-sm text-muted-foreground">Basic community information and visibility.</p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="name">Community name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Community name"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="description">
            Description <span className="text-muted-foreground">(optional)</span>
          </Label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your community..."
            rows={4}
            className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
          />
        </div>

        <div className="flex items-center justify-between rounded-lg border border-border p-4">
          <div>
            <p className="text-sm font-medium text-foreground">Private community</p>
            <p className="text-xs text-muted-foreground mt-0.5">Hidden from the Discover page.</p>
          </div>
          <button
            type="button"
            onClick={() => setIsPrivate((v) => !v)}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
              isPrivate ? 'bg-primary' : 'bg-muted'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                isPrivate ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {error && <p className="text-sm text-destructive">{(error as Error).message}</p>}
        {isSuccess && <p className="text-sm text-emerald-600">Saved successfully.</p>}

        <div className="flex justify-end">
          <Button onClick={() => save()} disabled={isPending || !name.trim()}>
            {isPending ? 'Saving...' : 'Save changes'}
          </Button>
        </div>
      </div>
    </div>
  )
}
