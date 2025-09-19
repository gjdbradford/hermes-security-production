// Simple database connection test
import { config } from 'dotenv';

// Load environment variables from .env file
config();

console.log('🧪 Database Connection Test');
console.log('==========================');

// Check if environment variables are set
const databaseUrl = process.env.DATABASE_URL;
const postgresUrl = process.env.POSTGRES_URL;

console.log('Environment Variables:');
console.log('DATABASE_URL:', databaseUrl ? '✅ Set' : '❌ Not set');
console.log('POSTGRES_URL:', postgresUrl ? '✅ Set' : '❌ Not set');

if (!databaseUrl) {
  console.log('');
  console.log('❌ DATABASE_URL is not set');
  console.log('');
  console.log('To fix this:');
  console.log('1. Create a Postgres database in Vercel Dashboard');
  console.log('2. Copy the connection string');
  console.log('3. Add it as an environment variable');
  console.log('');
  console.log('Or create a .env.local file with:');
  console.log('DATABASE_URL=postgres://postgres.dvnseutnwfhrvzkwdnsa:lxZuUbhXQGXQ6pFE@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true');
  console.log('POSTGRES_URL=postgres://postgres.dvnseutnwfhrvzkwdnsa:lxZuUbhXQGXQ6pFE@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x');
} else {
  console.log('');
  console.log('✅ Environment variables are set!');
  console.log('You can now run: npm run db:migrate');
}
