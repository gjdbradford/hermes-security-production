# Vercel Environment Variables Setup

## Staging Environment (Preview Deployments)
vercel env add DATABASE_URL staging
vercel env add POSTGRES_URL staging

## Production Environment
vercel env add DATABASE_URL production  
vercel env add POSTGRES_URL production

## Commands:
# Deploy to staging
vercel --target staging

# Deploy to production
vercel --prod
