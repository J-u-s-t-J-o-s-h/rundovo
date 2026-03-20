// src/app/(dashboard)/layout.tsx
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // To build tenant context, we query the user's role from the `users` table
  const { data: profile } = await supabase
    .from('users')
    .select('role, tenant_id, tenants(name)')
    .eq('id', user.id)
    .single()

  const tenantsData = profile?.tenants as any;
  const tenantName = (Array.isArray(tenantsData) ? tenantsData[0]?.name : tenantsData?.name) || 'My Tenant'

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="flex items-center gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold md:text-base">
            <span className="sr-only">Rundovo</span>
            <span className="font-bold">Rundovo</span>
          </Link>
          <Link href="/dashboard" className="text-muted-foreground transition-colors hover:text-foreground">
            Overview
          </Link>
          <Link href="/dashboard/inventory" className="text-muted-foreground transition-colors hover:text-foreground">
            Inventory
          </Link>
          <Link href="/dashboard/bookings" className="text-muted-foreground transition-colors hover:text-foreground">
            Bookings
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-4 border-l pl-4">
          <span className="text-sm font-medium">{tenantName}</span>
          <form action="/auth/signout" method="post">
            <Button variant="outline" size="sm">Sign Out</Button>
          </form>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  )
}
