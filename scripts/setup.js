#!/usr/bin/env node

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

async function runSetup() {
  console.log(`
╔════════════════════════════════════════╗
║     🚀 ViralCheck Firebase Setup 🔥    ║
╚════════════════════════════════════════╝
`);

  const runFirebase = await question(
    'Firebase Setup ausführen? (j/n) [j]: '
  );

  if (runFirebase.toLowerCase() !== 'n') {
    console.log('\n');
    execSync('node scripts/setup-firebase.js', { stdio: 'inherit' });
  }

  const runVercel = await question('\nVercel Setup ausführen? (j/n) [j]: ');

  if (runVercel.toLowerCase() !== 'n') {
    console.log('\n');
    execSync('node scripts/setup-vercel.js', { stdio: 'inherit' });
  }

  console.log(`
╔════════════════════════════════════════╗
║           ✅ Setup fertig! 🎉           ║
╚════════════════════════════════════════╝

🚀 Starte dein Projekt:
  npm run dev

📖 Dokumentation:
  FIREBASE_SETUP.md

💬 Fragen? Schau in die README.md
`);

  rl.close();
}

runSetup().catch(console.error);
