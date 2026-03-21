import { NextResponse } from 'next/server'
import { stripe } from '@/utils/stripe/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('Stripe-Signature') as string
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  let event

  try {
    if (!sig || !webhookSecret) throw new Error('Missing Stripe signature or webhook secret')
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`)
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
  }

  const supabase = await createClient() // Admin rights might be required depending on RLS

  switch (event.type) {
    case 'checkout.session.completed':
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
      // Placeholder: Handle subscription status updates in Supabase `tenants` table
      console.log(`Unhandled relevant event! ${event.type}`)
      break
    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  return new NextResponse('Webhook processed successfully', { status: 200 })
}
