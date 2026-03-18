import Stripe from 'stripe';
import { doc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

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
        const userRef = doc(db, 'users', userId);
        const premiumExpiresAt = new Date();
        premiumExpiresAt.setDate(premiumExpiresAt.getDate() + 30); // 30-day subscription

        await updateDoc(userRef, {
          isPremium: true,
          premiumExpiresAt: Timestamp.fromDate(premiumExpiresAt),
          testsUsed: 0,
          stripeChargeId: charge.id,
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
