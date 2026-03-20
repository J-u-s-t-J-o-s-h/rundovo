import { createClient } from '@/utils/supabase/server'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default async function BookingsPage() {
  const supabase = await createClient()

  // Fetch bookings, joining the customers table to display names
  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('*, customers(first_name, last_name, email)')
    .order('created_at', { ascending: false })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bookings & Orders</h1>
          <p className="text-muted-foreground">Manage quotes, active reservations, and completed rentals.</p>
        </div>
        <Button>Create Booking</Button>
      </div>
      
      <div className="rounded-md border bg-card text-card-foreground shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(!bookings || bookings.length === 0) ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-32 text-muted-foreground">
                  No bookings found. Click "Create Booking" to start an order.
                </TableCell>
              </TableRow>
            ) : (
              bookings?.map((b: any) => (
                <TableRow key={b.id}>
                  <TableCell className="font-medium">
                    {b.customers ? `${b.customers.first_name} ${b.customers.last_name}` : 'Unknown Customer'}
                  </TableCell>
                  <TableCell>{new Date(b.start_time).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(b.end_time).toLocaleDateString()}</TableCell>
                  <TableCell>${Number(b.total_amount).toFixed(2)}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-secondary text-secondary-foreground capitalize">
                      {b.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">View Details</Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
