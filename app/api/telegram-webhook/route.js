import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CREDITS_PER_PURCHASE = 20;

function getAdminDb() {
  if (!getApps().length) {
    const key = JSON.parse(process.env.FIREBASE_ADMIN_KEY);
    initializeApp({ credential: cert(key) });
  }
  return getFirestore();
}

async function answerPreCheckout(queryId, ok, errorMessage) {
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerPreCheckoutQuery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pre_checkout_query_id: queryId, ok, error_message: errorMessage }),
  });
}

async function sendMessage(chatId, text) {
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
  });
}

export async function POST(request) {
  try {
    const body = await request.json();

    // ── Handle /start FIREBASE_UID (deep link) ─────────────────────
    if (body.message?.text?.startsWith('/start')) {
      const parts = body.message.text.split(' ');
      const chatId = body.message.chat.id;

      if (parts.length < 2) {
        await sendMessage(chatId,
          '👋 <b>Willkommen bei ViralCheck!</b>\n\nÖffne die App und klicke auf "Upgrade", um Credits zu kaufen.'
        );
        return Response.json({ ok: true });
      }

      const uid = parts[1];

      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendInvoice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          title: '✨ ViralCheck – 20 Analysen',
          description: `Kaufe 20 weitere Analysen für ViralCheck. Sofort freigeschaltet!`,
          payload: uid,
          currency: 'XTR',
          prices: [{ label: '20 Analysen', amount: 100 }],
          provider_token: '',
        }),
      });

      return Response.json({ ok: true });
    }

    // ── Pre-checkout query ──────────────────────────────────────────
    if (body.pre_checkout_query) {
      await answerPreCheckout(body.pre_checkout_query.id, true);
      return Response.json({ ok: true });
    }

    // ── Successful payment ─────────────────────────────────────────
    if (body.message?.successful_payment) {
      const payment = body.message.successful_payment;
      const uid = payment.invoice_payload;
      const chatId = body.message.chat.id;

      if (!uid) {
        console.error('No UID in payment payload');
        return Response.json({ ok: true });
      }

      const db = getAdminDb();
      const ref = db.doc(`users/${uid}`);
      const snap = await ref.get();

      if (snap.exists) {
        await ref.update({ credits: FieldValue.increment(CREDITS_PER_PURCHASE) });
      } else {
        await ref.set({ credits: CREDITS_PER_PURCHASE, analysisCount: 0, createdAt: new Date() });
      }

      await sendMessage(chatId,
        `🎉 <b>Zahlung erfolgreich!</b>\n\n` +
        `Du hast <b>${CREDITS_PER_PURCHASE} Analysen</b> erhalten.\n` +
        `Gehe zurück zur App und starte deine nächste Analyse! 🚀\n\n` +
        `<a href="https://viralcheck.me">→ viralcheck.me</a>`
      );

      return Response.json({ ok: true });
    }

    return Response.json({ ok: true });

  } catch (error) {
    console.error('Telegram webhook error:', error);
    return Response.json({ ok: false, error: error.message }, { status: 500 });
  }
}
