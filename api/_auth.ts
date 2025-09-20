import { VercelRequest, VercelResponse } from '@vercel/node';

export interface AuthenticatedRequest extends VercelRequest {
  isAuthenticated: boolean;
  environment: string;
  apiKey?: string;
}

export function authenticateRequest(
  request: VercelRequest,
  response: VercelResponse
): AuthenticatedRequest {
  const authRequest = request as AuthenticatedRequest;

  // Set CORS headers
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key');
  response.setHeader('Access-Control-Max-Age', '86400');

  // Handle preflight OPTIONS requests
  if (request.method === 'OPTIONS') {
    response.status(200).end();
    return authRequest;
  }

  // Determine environment
  const environment = process.env.VERCEL_ENV || process.env.NODE_ENV || 'development';
  authRequest.environment = environment;

  // Get API key from headers or query params
  const apiKey =
    (request.headers['x-api-key'] as string) ||
    (request.headers['authorization']?.replace('Bearer ', '') as string) ||
    (request.query.apiKey as string);

  authRequest.apiKey = apiKey;

  // Check if request is from internal sources
  const isInternalRequest =
    request.headers['user-agent']?.includes('vercel') ||
    request.headers['x-forwarded-for']?.includes('127.0.0.1') ||
    request.headers['x-vercel-ip-country'] ||
    request.headers['host']?.includes('localhost');

  // Authentication logic based on environment
  switch (environment) {
    case 'development':
      authRequest.isAuthenticated = true; // Allow all in development
      break;

    case 'preview':
    case 'staging':
      // Allow requests with valid API key or internal requests
      authRequest.isAuthenticated = Boolean(
        apiKey === process.env.HERMES_API_KEY || isInternalRequest || !process.env.HERMES_API_KEY // Allow if no API key is set
      );
      break;

    case 'production':
      // Require valid API key in production
      authRequest.isAuthenticated = apiKey === process.env.HERMES_API_KEY;
      break;

    default:
      authRequest.isAuthenticated = false;
  }

  return authRequest;
}

export function requireAuth(request: AuthenticatedRequest, response: VercelResponse): boolean {
  if (!request.isAuthenticated) {
    response.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication required',
      environment: request.environment,
    });
    return false;
  }
  return true;
}

export function logApiRequest(request: AuthenticatedRequest, endpoint: string) {
  console.warn(
    `[API] ${request.method} ${endpoint} - Environment: ${request.environment}, Auth: ${request.isAuthenticated}`
  );
}
