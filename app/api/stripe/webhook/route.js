import Stripe from 'stripe';
import { db } from '../../../lib/firebase-admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const body = await request.text();
    const sig = request.headers.get('stripe-signature');
    const secret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!sig || !secret) {
      return Response.json({ error: 'Missing signature or secret' }, { status: 400 });
    }

    // Verify and construct the event
    let event;
    try {
      event = stripe.webhooks.constructEvent(body, sig, secret);
    } catch (error) {
      console.error('Webhook signature verification failed:', error);
      return Response.json({ error: 'Invalid signature' }, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const customerEmail = session.customer_email || session.customer_details?.email;

      if (customerEmail) {
        // Find user by email and set premium
        const usersRef = db.collection('users');
        const snapshot = await usersRef.where('email', '==', customerEmail).get();

        if (!snapshot.empty) {
          const userDoc = snapshot.docs[0];
          await userDoc.ref.update({ premium: true, premiumSince: new Date().toISOString() });
          console.log(`Premium activated for ${customerEmail}`);
        } else {
          // Store pending premium activation for when user signs up
          await db.collection('pending_premium').doc(customerEmail).set({
            email: customerEmail,
            sessionId: session.id,
            activatedAt: new Date().toISOString(),
          });
          console.log(`Pending premium stored for ${customerEmail}`);
        }
      }
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return Response.json({ error: 'Webhook failed' }, { status: 500 });
  }
}
