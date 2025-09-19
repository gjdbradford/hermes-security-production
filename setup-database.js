#!/usr/bin/env node

// Database Setup Helper Script
// This script will help you set up your database connection

import readline from 'readline';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 Hermes Security Database Setup Helper');
console.log('==========================================');
console.log('');

async function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function setupDatabase() {
  try {
    console.log('📋 Let\'s set up your database connection step by step:');
    console.log('');
    
    console.log('1. First, go to your Vercel Dashboard: https://vercel.com/dashboard');
    console.log('2. Find your Hermes project and click on it');
    console.log('3. Go to the "Storage" tab');
    console.log('4. Click "Create Database" → "Postgres"');
    console.log('5. Choose "Free" tier and name it "hermes-database"');
    console.log('6. After creating, you\'ll see connection strings');
    console.log('');
    
    const continueSetup = await askQuestion('Have you created the database in Vercel? (y/n): ');
    
    if (continueSetup.toLowerCase() !== 'y') {
      console.log('Please create the database first, then run this script again.');
      rl.close();
      return;
    }
    
    console.log('');
    console.log('Great! Now let\'s get your connection strings:');
    console.log('');
    
    const databaseUrl = await askQuestion('Paste your DATABASE_URL here: ');
    const postgresUrl = await askQuestion('Paste your POSTGRES_URL here: ');
    
    if (!databaseUrl || !postgresUrl) {
      console.log('❌ Connection strings are required. Please try again.');
      rl.close();
      return;
    }
    
    // Create .env.local file
    const envContent = `# Local environment variables for database connection
DATABASE_URL=${databaseUrl}
POSTGRES_URL=${postgresUrl}
NODE_ENV=development
VERCEL_ENV=development
`;
    
    fs.writeFileSync('.env.local', envContent);
    console.log('');
    console.log('✅ Created .env.local file with your connection strings');
    
    // Add to Vercel environment variables
    console.log('');
    console.log('📋 Next steps:');
    console.log('1. Go to your Vercel project → Settings → Environment Variables');
    console.log('2. Add these variables:');
    console.log(`   - DATABASE_URL: ${databaseUrl.substring(0, 50)}...`);
    console.log(`   - POSTGRES_URL: ${postgresUrl.substring(0, 50)}...`);
    console.log('3. Make sure to select all environments (Production, Preview, Development)');
    console.log('');
    
    const testConnection = await askQuestion('Would you like to test the database connection now? (y/n): ');
    
    if (testConnection.toLowerCase() === 'y') {
      console.log('');
      console.log('🧪 Testing database connection...');
      
      // Test connection
      exec('npm run db:health', (error, stdout, stderr) => {
        console.log(stdout);
        if (error) {
          console.log('❌ Connection test failed. Please check your connection strings.');
        } else {
          console.log('✅ Database connection successful!');
          console.log('');
          console.log('🎉 Setup complete! You can now:');
          console.log('- Run "npm run db:migrate" to create the database tables');
          console.log('- Deploy to Vercel with "vercel --prod"');
        }
      });
    }
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  } finally {
    rl.close();
  }
}

setupDatabase();
