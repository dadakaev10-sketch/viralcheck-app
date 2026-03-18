import Stripe from 'stripe';
import { adminDb } from '@/lib/firebaseAdmin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return new Response(JSON.stringify({ error: 'User ID required' }), {
        status: 400,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/premium-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/`,
      metadata: {
        userId,
      },
    });

    return new Response(JSON.stringify({ sessionId: session.id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Stripe error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
