#!/usr/bin/env node

const fs = require('fs');
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

async function setupVercel() {
  console.log('\n🚀 Vercel Environment Variables Setup\n');

  // Check if .env.local exists
  if (!fs.existsSync('.env.local')) {
    console.error('❌ .env.local nicht gefunden!');
    console.log('Bitte führe erst "npm run setup:firebase" aus.\n');
    process.exit(1);
  }

  // Read .env.local
  const envContent = fs.readFileSync('.env.local', 'utf-8');
  const envVars = envContent
    .split('\n')
    .filter((line) => line && !line.startsWith('#'))
    .reduce((acc, line) => {
      const [key, ...valueParts] = line.split('=');
      acc[key.trim()] = valueParts.join('=').trim();
      return acc;
    }, {});

  console.log('📋 Env-Variablen gefunden:\n');
  Object.keys(envVars).forEach((key) => {
    console.log(`  ✓ ${key}`);
  });

  const confirm = await question('\n✅ Zu Vercel hinzufügen? (j/n): ');

  if (confirm.toLowerCase() !== 'j') {
    console.log('⏭️  Abgebrochen');
    rl.close();
    return;
  }

  console.log('\n⏳ Setze Vercel Env-Variablen...\n');

  try {
    for (const [key, value] of Object.entries(envVars)) {
      execSync(`vercel env add ${key}`, {
        input: value,
        stdio: 'pipe',
      });
      console.log(`✅ ${key}`);
    }

    console.log('\n✅ Vercel Setup abgeschlossen!\n');
    console.log('🎉 Deine App ist bereit zum Deployen:\n');
    console.log('  vercel deploy\n');
  } catch (error) {
    console.error('❌ Fehler beim Setup:', error.message);
    console.log('\nAlternative: Manuell in Vercel Dashboard hinzufügen:');
    console.log('1. Projekt öffnen');
    console.log('2. Settings → Environment Variables');
    console.log('3. Jede Variable aus .env.local kopieren\n');
  }

  rl.close();
}

setupVercel().catch(console.error);
