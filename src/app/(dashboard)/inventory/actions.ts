'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createInventoryItem(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Get user's tenant_id securely on the server
  const { data: profile } = await supabase
    .from('users')
    .select('tenant_id')
    .eq('id', user.id)
    .single()

  if (!profile?.tenant_id) {
    return { error: 'Tenant not found' }
  }

  const name = formData.get('name') as string
  const sku = formData.get('sku') as string
  const description = formData.get('description') as string
  const dailyRate = Number(formData.get('daily_rate'))

  const { error } = await supabase
    .from('inventory_items')
    .insert({
      tenant_id: profile.tenant_id,
      name,
      sku: sku || null,
      description: description || null,
      daily_rate: dailyRate,
      is_active: true
    })

  if (error) {
    console.error('Error creating inventory item:', error)
    return { error: 'Failed to create inventory item.' }
  }

  revalidatePath('/dashboard/inventory')
  return { success: true }
}
