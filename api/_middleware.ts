import { VercelRequest, VercelResponse } from '@vercel/node';

// API Authentication Middleware
export default function middleware(request: VercelRequest, response: VercelResponse) {
  // Set CORS headers for all API requests
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key');
  response.setHeader('Access-Control-Max-Age', '86400');

  // Handle preflight OPTIONS requests
  if (request.method === 'OPTIONS') {
    response.status(200).end();
    return;
  }

  // Allow API endpoints to proceed without authentication
  // This bypasses Vercel's deployment protection for API routes
  const apiKey = request.headers['x-api-key'] || request.query.apiKey;
  const isInternalRequest =
    request.headers['user-agent']?.includes('vercel') ||
    request.headers['x-forwarded-for']?.includes('127.0.0.1') ||
    request.headers['x-vercel-ip-country'];

  // For staging environment, allow requests with proper API key or internal requests
  if (process.env.NODE_ENV === 'staging' || process.env.VERCEL_ENV === 'preview') {
    if (apiKey === process.env.HERMES_API_KEY || isInternalRequest) {
      return; // Allow request to proceed
    }
  }

  // For production, require API key
  if (process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production') {
    if (apiKey !== process.env.HERMES_API_KEY) {
      response.status(401).json({
        error: 'Unauthorized',
        message: 'Valid API key required for production access',
      });
      return;
    }
  }

  // Allow development and other environments
  return;
}
