'use client'

import { useState } from 'react'
import { createInventoryItem } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useFormStatus } from 'react-dom'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Saving...' : 'Save Item'}
    </Button>
  )
}

export function AddItemDialog() {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function clientAction(formData: FormData) {
    const result = await createInventoryItem(formData)
    if (result?.error) {
      setError(result.error)
    } else {
      setOpen(false)
      setError(null)
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>Add Item</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Inventory Item</DialogTitle>
          <DialogDescription>
            Create a new asset available for rent.
          </DialogDescription>
        </DialogHeader>
        <form action={clientAction}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Item Name</Label>
              <Input id="name" name="name" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="sku">SKU (Optional)</Label>
              <Input id="sku" name="sku" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea id="description" name="description" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="daily_rate">Daily Rate ($)</Label>
              <Input id="daily_rate" name="daily_rate" type="number" step="0.01" min="0" required defaultValue="0.00" />
            </div>
            {error && <div className="text-sm text-red-500 font-medium">{error}</div>}
          </div>
          <DialogFooter>
            <SubmitButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
    </>
  )
}
