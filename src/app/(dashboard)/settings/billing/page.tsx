import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function BillingPage() {
  return (
    <div className="flex flex-col gap-6 max-w-4xl py-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Billing & Plans</h1>
        <p className="text-muted-foreground">Manage your subscription, team seats, and payment methods.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Starter (Current)</CardTitle>
            <CardDescription>Perfect for new operations just getting started.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="text-4xl font-bold">$49<span className="text-lg font-normal text-muted-foreground">/mo</span></p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>✓ Up to 100 Active Bookings per month</li>
              <li>✓ 1 Location</li>
              <li>✓ Standard Support</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" disabled>Active Plan</Button>
          </CardFooter>
        </Card>

        <Card className="flex flex-col border-primary/50 shadow-md">
          <CardHeader>
            <CardTitle>Pro Engine</CardTitle>
            <CardDescription>For growing businesses with high volume rentals.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="text-4xl font-bold">$149<span className="text-lg font-normal text-muted-foreground">/mo</span></p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>✓ Unlimited Bookings</li>
              <li>✓ Multiple Locations (up to 5)</li>
              <li>✓ DocuSign Integration Included</li>
              <li>✓ Priority Support</li>
            </ul>
          </CardContent>
          <CardFooter>
            {/* When you define Stripe products, you will wire this button to `/api/stripe/checkout` */}
            <Button type="button" className="w-full">Upgrade to Pro</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
