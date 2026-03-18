#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function setupFirebase() {
  console.log('\n🔥 Firebase Setup Wizard\n');
  console.log(
    'Sicherstelle, dass du mit "firebase login" eingeloggt bist!\n'
  );

  try {
    // Check if firebase CLI is available
    execSync('firebase --version', { stdio: 'ignore' });
  } catch {
    console.error(
      '❌ Firebase CLI nicht gefunden. Bitte installiere: npm install -g firebase-tools'
    );
    process.exit(1);
  }

  // Get project ID
  const projectId = await question('📝 Firebase Project ID: ');

  if (!projectId) {
    console.error('❌ Project ID erforderlich!');
    process.exit(1);
  }

  console.log('\n⏳ Konfiguriere Firebase...\n');

  // Update .firebaserc
  const firebaserc = {
    projects: {
      default: projectId,
    },
  };

  fs.writeFileSync('.firebaserc', JSON.stringify(firebaserc, null, 2));
  console.log('✅ .firebaserc aktualisiert');

  // Deploy Firestore rules
  try {
    console.log('📋 Deploye Firestore Rules...');
    execSync('firebase deploy --only firestore:rules', {
      stdio: 'inherit',
    });
    console.log('✅ Firestore Rules deployed\n');
  } catch (error) {
    console.warn('⚠️  Firestore Rules Deploy fehlgeschlagen');
  }

  // Get Firebase config
  try {
    console.log('🔍 Lese Firebase Konfiguration...');
    const configOutput = execSync(
      `firebase --project=${projectId} --json firebaserc`,
      {
        encoding: 'utf-8',
      }
    );
    console.log('✅ Firebase Konfiguration gelesen\n');
  } catch {
    console.log('⚠️  Config konnte nicht automatisch gelesen werden\n');
  }

  // Prompt for Firebase config
  console.log(
    '📝 Gehe zu https://console.firebase.google.com → Projekteinstellungen → Deine Apps\n'
  );

  const apiKey = await question('Firebase API Key: ');
  const authDomain = await question('Firebase Auth Domain: ');
  const storageBucket = await question('Firebase Storage Bucket: ');
  const messagingSenderId = await question('Firebase Messaging Sender ID: ');
  const appId = await question('Firebase App ID: ');

  // Prompt for Google OAuth
  console.log(
    '\n📝 Gehe zu https://console.cloud.google.com → APIs & Services → Credentials\n'
  );

  const googleClientId = await question('Google Client ID: ');
  const googleClientSecret = await question('Google Client Secret: ');

  // Prompt for Stripe
  console.log('\n📝 Stripe Konfiguration (von deinem Dashboard)\n');

  const stripePublishableKey = await question('Stripe Publishable Key: ');
  const stripeSecretKey = await question('Stripe Secret Key: ');
  const stripeWebhookSecret = await question('Stripe Webhook Secret: ');
  const stripePriceId = await question('Stripe Price ID (price_...): ');

  // Generate .env.local
  const envContent = `# Firebase Client
NEXT_PUBLIC_FIREBASE_API_KEY=${apiKey}
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=${authDomain}
NEXT_PUBLIC_FIREBASE_PROJECT_ID=${projectId}
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=${storageBucket}
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=${messagingSenderId}
NEXT_PUBLIC_FIREBASE_APP_ID=${appId}

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=${googleClientId}
GOOGLE_CLIENT_SECRET=${googleClientSecret}

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=${stripePublishableKey}
STRIPE_SECRET_KEY=${stripeSecretKey}
STRIPE_WEBHOOK_SECRET=${stripeWebhookSecret}
NEXT_PUBLIC_STRIPE_PRICE_ID=${stripePriceId}

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
`;

  fs.writeFileSync('.env.local', envContent);
  console.log('\n✅ .env.local erstellt');

  // Prompt for Firebase Admin
  console.log(
    '\n📝 Gehe zu Firebase Console → Projekteinstellungen → Dienstkonten'
  );
  console.log('Dort "Neuen privaten Schlüssel generieren" und als JSON speichern\n');

  const serviceAccountPath = await question('Pfad zur Service Account JSON: ');

  if (serviceAccountPath && fs.existsSync(serviceAccountPath)) {
    const serviceAccount = JSON.parse(
      fs.readFileSync(serviceAccountPath, 'utf-8')
    );

    const adminEnvContent = `
FIREBASE_ADMIN_PROJECT_ID=${serviceAccount.project_id}
FIREBASE_ADMIN_CLIENT_EMAIL=${serviceAccount.client_email}
FIREBASE_ADMIN_PRIVATE_KEY=${serviceAccount.private_key}
`;

    fs.appendFileSync('.env.local', adminEnvContent);
    console.log('✅ Firebase Admin Credentials hinzugefügt');
  } else {
    console.log(
      '\n⚠️  Service Account JSON nicht gefunden. Bitte manuell hinzufügen:'
    );
    console.log('FIREBASE_ADMIN_PROJECT_ID=...');
    console.log('FIREBASE_ADMIN_CLIENT_EMAIL=...');
    console.log('FIREBASE_ADMIN_PRIVATE_KEY=...');
  }

  console.log('\n✅ Firebase Setup abgeschlossen!\n');
  console.log('🚀 Nächste Schritte:');
  console.log('1. npm run dev');
  console.log('2. Teste die Authentifizierung auf http://localhost:3000\n');

  rl.close();
}

setupFirebase().catch(console.error);
