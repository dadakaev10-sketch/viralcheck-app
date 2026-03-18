import Stripe from 'stripe';
import { adminDb } from '@/lib/firebaseAdmin';
import admin from 'firebase-admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook error:', err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'charge.succeeded':
      const charge = event.data.object;
      const userId = charge.metadata?.userId;

      if (userId) {
        const premiumExpiresAt = new Date();
        premiumExpiresAt.setDate(premiumExpiresAt.getDate() + 30); // 30-day subscription

        await adminDb.collection('users').doc(userId).update({
          isPremium: true,
          premiumExpiresAt: admin.firestore.Timestamp.fromDate(premiumExpiresAt),
          testsUsed: 0,
          stripeChargeId: charge.id,
          premiumStartedAt: admin.firestore.Timestamp.now(),
        });
      }
      break;

    case 'charge.failed':
      console.log('Charge failed:', event.data.object);
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
}
