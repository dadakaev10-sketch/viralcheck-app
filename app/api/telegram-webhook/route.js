import { doc, updateDoc, increment, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CREDITS_PER_PURCHASE = 20;

// Answer Telegram pre_checkout_query so payment can proceed
async function answerPreCheckout(queryId, ok, errorMessage) {
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerPreCheckoutQuery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pre_checkout_query_id: queryId, ok, error_message: errorMessage }),
  });
}

// Send a message to a Telegram chat
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
        // No UID → just greet
        await sendMessage(chatId,
          '👋 <b>Willkommen bei ViralCheck!</b>\n\nÖffne die App und klicke auf "Upgrade", um Credits zu kaufen.'
        );
        return Response.json({ ok: true });
      }

      const uid = parts[1];

      // Send payment invoice (Telegram Stars)
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendInvoice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          title: '✨ ViralCheck – 20 Analysen',
          description: `Kaufe 20 weitere Analysen für ViralCheck. Sofort freigeschaltet!`,
          payload: uid, // Firebase UID als payload → verknüpft Zahlung mit User
          currency: 'XTR', // Telegram Stars
          prices: [{ label: '20 Analysen', amount: 100 }], // 100 Stars
          provider_token: '', // Leer bei Stars
        }),
      });

      return Response.json({ ok: true });
    }

    // ── Pre-checkout query (Telegram fragt: darf Zahlung durch?) ───
    if (body.pre_checkout_query) {
      await answerPreCheckout(body.pre_checkout_query.id, true);
      return Response.json({ ok: true });
    }

    // ── Successful payment ─────────────────────────────────────────
    if (body.message?.successful_payment) {
      const payment = body.message.successful_payment;
      const uid = payment.invoice_payload; // Firebase UID
      const chatId = body.message.chat.id;

      if (!uid) {
        console.error('No UID in payment payload');
        return Response.json({ ok: true });
      }

      // Add credits to Firestore
      const ref = doc(db, 'users', uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        await updateDoc(ref, { credits: increment(CREDITS_PER_PURCHASE) });
      } else {
        // Fallback: create user doc
        await setDoc(ref, { credits: CREDITS_PER_PURCHASE, analysisCount: 0, createdAt: new Date() });
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
