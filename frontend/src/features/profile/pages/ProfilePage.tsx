import { useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { userApi } from '@/api/user'
import { useAuthStore } from '@/store/auth.store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function ProfilePage() {
  const { user, setUser } = useAuthStore()

  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')

  useEffect(() => {
    if (user) {
      setFirstname(user.firstname)
      setLastname(user.lastname)
    }
  }, [user])

  const {
    mutate: saveName,
    isPending: isSavingName,
    isSuccess: nameSaved,
    error: nameError,
  } = useMutation({
    mutationFn: () => userApi.updateMe({ firstname, lastname }),
    onSuccess: (res) => {
      if (res.data?.user) setUser(res.data.user)
    },
  })

  const {
    mutate: savePassword,
    isPending: isSavingPassword,
    isSuccess: passwordSaved,
    error: passwordMutationError,
    reset: resetPasswordMutation,
  } = useMutation({
    mutationFn: () => userApi.updateMe({ currentPassword, newPassword }),
    onSuccess: () => {
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    },
  })

  function handlePasswordSubmit() {
    setPasswordError('')
    resetPasswordMutation()
    if (!currentPassword) return setPasswordError('Current password is required.')
    if (newPassword.length < 8) return setPasswordError('New password must be at least 8 characters.')
    if (newPassword !== confirmPassword) return setPasswordError('Passwords do not match.')
    savePassword()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">Your name and account details.</p>
      </div>

      {/* Account info */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="firstname">First name</Label>
            <Input
              id="firstname"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              placeholder="First name"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lastname">Last name</Label>
            <Input
              id="lastname"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              placeholder="Last name"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Email</Label>
          <Input value={user?.email ?? ''} disabled />
        </div>

        {nameError && (
          <p className="text-sm text-destructive">{(nameError as Error).message}</p>
        )}
        {nameSaved && (
          <p className="text-sm text-emerald-600">Saved successfully.</p>
        )}

        <div className="flex justify-end">
          <Button
            onClick={() => saveName()}
            disabled={isSavingName || !firstname.trim() || !lastname.trim()}
          >
            {isSavingName ? 'Saving...' : 'Save changes'}
          </Button>
        </div>
      </div>

      {/* Change password */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-5">
        <div>
          <h2 className="text-base font-semibold text-foreground">Change password</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">Must be at least 8 characters.</p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="current-password">Current password</Label>
          <Input
            id="current-password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Current password"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="new-password">New password</Label>
          <Input
            id="new-password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New password"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirm-password">Confirm new password</Label>
          <Input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
          />
        </div>

        {(passwordError || passwordMutationError) && (
          <p className="text-sm text-destructive">
            {passwordError || (passwordMutationError as Error).message}
          </p>
        )}
        {passwordSaved && (
          <p className="text-sm text-emerald-600">Password updated.</p>
        )}

        <div className="flex justify-end">
          <Button onClick={handlePasswordSubmit} disabled={isSavingPassword}>
            {isSavingPassword ? 'Updating...' : 'Update password'}
          </Button>
        </div>
      </div>
    </div>
  )
}
