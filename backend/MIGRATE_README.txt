// Get your Railway DATABASE_URL from Railway Dashboard:
// 1. Go to https://railway.app/dashboard
// 2. Click your backend service
// 3. Click "Variables" tab
// 4. Look for DATABASE_URL
// 5. Copy the full connection string starting with "postgresql://..."
// 6. Replace the example below with your actual URL

// Example format:
// postgresql://postgres:password@something.railway.app:5432/dbname

// Paste your Railway DATABASE_URL here:
const RAILWAY_DATABASE_URL = 'YOUR_RAILWAY_DATABASE_URL_HERE';

const NEON_DATABASE_URL = 'postgresql://neondb_owner:npg_HZXRi6rCg3OG@ep-dawn-paper-a18b60ms-pooler.ap-southeast-1.aws.neon.tech/taskflow?sslmode=require';

console.log(`
📋 MIGRATION SETUP

Railway (Source):
  ${RAILWAY_DATABASE_URL}

Neon (Destination):
  ${NEON_DATABASE_URL}

NEXT STEPS:
1. Get your Railway DATABASE_URL from Railway dashboard
2. Update RAILWAY_DATABASE_URL in this file
3. Run: node migrate-data-railway-to-neon.js
`);
