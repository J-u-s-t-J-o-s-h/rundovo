import Stripe from 'stripe'

export const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY || 'sk_test_mock_key',
  {
    // @ts-ignore: Bypass strict literal union check on apiVersion 
    apiVersion: '2023-10-16',
    appInfo: {
      name: 'Rundovo',
      url: 'https://rundovo.com'
    }
  }
)
