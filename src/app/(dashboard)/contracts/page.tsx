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

export default async function ContractsPage() {
  const supabase = await createClient()

  // Fetch contracts joined with bookings and customers
  const { data: contracts, error } = await supabase
    .from('contracts')
    .select('*, bookings(*), customers(first_name, last_name, email)')
    .order('created_at', { ascending: false })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contracts & Evidence</h1>
          <p className="text-muted-foreground">Manage signed agreements and condition photos.</p>
        </div>
      </div>
      
      <div className="rounded-md border bg-card text-card-foreground shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Booking Ref</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Sent Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(!contracts || contracts.length === 0) ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-32 text-muted-foreground">
                  No contracts found. Generate one from an active booking.
                </TableCell>
              </TableRow>
            ) : (
              contracts?.map((c: any) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">
                    {c.customers ? `${c.customers.first_name} ${c.customers.last_name}` : 'Unknown'}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {c.booking_id.substring(0, 8)}...
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${c.status === 'signed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-secondary text-secondary-foreground'}`}>
                      {c.status}
                    </span>
                  </TableCell>
                  <TableCell>{new Date(c.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">View evidence</Button>
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
