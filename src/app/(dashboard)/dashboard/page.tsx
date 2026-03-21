import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, ClipboardList, Package, CalendarClock } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()

  // Fetch real data metrics
  const { count: pendingBookings } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending')

  const { count: activeRentals } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')

  const { count: pendingContracts } = await supabase
    .from('contracts')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending_signature')

  const { count: inventoryItems } = await supabase
    .from('inventory_items')
    .select('*', { count: 'exact', head: true })

  // Calculate gross revenue from completed and active bookings
  const { data: revenueData } = await supabase
    .from('bookings')
    .select('total_amount')
    .in('status', ['completed', 'active'])

  const totalRevenue = revenueData?.reduce((sum, b) => sum + Number(b.total_amount || 0), 0) || 0

  return (
    <div className="flex flex-col gap-6 p-2">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground text-sm font-medium">Financial & Logistics</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Purple Glow */}
        <Card className="relative overflow-hidden border-white/5 bg-card/50 backdrop-blur-xl">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-indigo-500/30 blur-3xl rounded-full" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Bookings</CardTitle>
            <Activity className="h-4 w-4 text-indigo-400" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl font-bold">{pendingBookings || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting fulfillment</p>
          </CardContent>
        </Card>

        {/* Card 2: Lime/Yellow Glow */}
        <Card className="relative overflow-hidden border-white/5 bg-card/50 backdrop-blur-xl">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-lime-500/30 blur-3xl rounded-full" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Rentals</CardTitle>
            <Package className="h-4 w-4 text-lime-400" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl font-bold">{activeRentals || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Currently tracked out</p>
          </CardContent>
        </Card>

        {/* Card 3: Orange Glow */}
        <Card className="relative overflow-hidden border-white/5 bg-card/50 backdrop-blur-xl">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-orange-500/30 blur-3xl rounded-full" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Contracts</CardTitle>
            <ClipboardList className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl font-bold">{pendingContracts || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Require signatures</p>
          </CardContent>
        </Card>

        {/* Card 4: Teal Glow */}
        <Card className="relative overflow-hidden border-white/5 bg-card/50 backdrop-blur-xl">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-teal-500/30 blur-3xl rounded-full" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Inventory</CardTitle>
            <CalendarClock className="h-4 w-4 text-teal-400" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl font-bold">{inventoryItems || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Assets in database</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 mt-4">
        {/* Large Invoice / Financial overview mimicking the bottom left chart */}
        <Card className="col-span-4 relative overflow-hidden border-white/5 bg-card/50 backdrop-blur-xl flex flex-col justify-between min-h-[300px]">
          <div className="absolute left-1/2 bottom-0 w-80 h-80 bg-lime-500/10 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none" />
          <CardHeader className="relative z-10">
            <CardTitle className="text-xl">Financial Overview</CardTitle>
          </CardHeader>
          <CardContent className="relative z-10 flex flex-col items-center justify-center p-6 pb-8">
            <div className="w-full max-w-[240px] aspect-[2/1] relative flex items-end justify-center overflow-hidden mb-6">
              {/* Fake semi-circle chart */}
              <div className="absolute top-0 w-[240px] h-[240px] rounded-full border-[30px] border-white/5"></div>
              <div className="absolute top-0 w-[240px] h-[240px] rounded-full border-[30px] border-lime-500 border-b-transparent border-r-transparent -rotate-45"></div>
              <div className="text-3xl font-bold z-10 pb-4">45%</div>
            </div>
            
            <div className="text-center p-6 rounded-2xl bg-white/5 border border-white/10 w-full backdrop-blur-sm max-w-sm">
              <p className="text-sm text-muted-foreground mb-1">Gross Revenue</p>
              <h3 className="text-4xl font-bold tracking-tight text-white">${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
              <p className="text-xs font-bold text-lime-400 mt-2">Verified in bookings</p>
            </div>
          </CardContent>
        </Card>

        {/* Right side stats */}
        <Card className="col-span-3 relative overflow-hidden border-white/5 bg-card/50 backdrop-blur-xl flex flex-col justify-end p-6 min-h-[300px]">
           <div className="absolute inset-0 w-full h-full bg-gradient-to-t from-lime-500/5 to-transparent pointer-events-none" />
           <div className="relative z-10 h-64 flex items-end justify-between gap-3">
              <div className="w-full bg-lime-400/90 rounded-sm h-[60%] hover:brightness-110 transition-all cursor-pointer relative group">
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-black px-3 py-1.5 text-xs font-bold rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                  March
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rotate-45"></div>
                </div>
              </div>
              <div className="w-full bg-lime-400/90 rounded-sm h-[80%] hover:brightness-110 transition-all cursor-pointer"></div>
              <div className="w-full bg-lime-400/90 rounded-sm h-[40%] hover:brightness-110 transition-all cursor-pointer"></div>
              <div className="w-full bg-lime-400/90 rounded-sm h-[80%] hover:brightness-110 transition-all cursor-pointer"></div>
              <div className="w-full bg-lime-400/90 rounded-sm h-[60%] hover:brightness-110 transition-all cursor-pointer"></div>
              <div className="w-full bg-lime-400/90 rounded-sm h-[50%] hover:brightness-110 transition-all cursor-pointer relative group">
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-black px-3 py-1.5 text-xs font-bold rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                  August
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rotate-45"></div>
                </div>
              </div>
           </div>
           <div className="relative z-10 flex justify-between mt-6 px-1 text-xs font-medium text-muted-foreground w-full">
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
              <span>Aug</span>
           </div>
        </Card>
      </div>
    </div>
  )
}
