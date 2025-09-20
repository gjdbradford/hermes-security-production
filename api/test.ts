import { VercelRequest, VercelResponse } from '@vercel/node';
import { authenticateRequest, requireAuth, logApiRequest } from './_auth.js';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const authRequest = authenticateRequest(req, res);
  logApiRequest(authRequest, '/api/test');

  if (!requireAuth(authRequest, res)) {
    return;
  }

  res.status(200).json({
    message: 'API is working!',
    timestamp: new Date().toISOString(),
    method: authRequest.method,
    url: authRequest.url,
    environment: authRequest.environment,
    authenticated: authRequest.isAuthenticated,
  });
}
