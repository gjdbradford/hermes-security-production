import { VercelRequest, VercelResponse } from '@vercel/node';
import { authenticateRequest, requireAuth, logApiRequest } from '../_auth.js';
import { databaseService } from '../../src/services/databaseService';

interface HealthResponse {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  responseTime: number;
  database: {
    connected: boolean;
    responseTime: number;
    error?: string;
  };
  statistics?: {
    totalLeads: number;
    newLeads: number;
    n8nSuccessRate: number;
    failedN8nLeads: number;
  };
  errors?: string[];
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const authRequest = authenticateRequest(req, res);
  logApiRequest(authRequest, '/api/health/database');

  if (!requireAuth(authRequest, res)) {
    return;
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({
      status: 'unhealthy',
      error: 'Method not allowed',
      message: 'Only GET requests are supported',
    });
  }

  const startTime = Date.now();
  const errors: string[] = [];

  try {
    // Test database connection
    console.log('🏥 Performing database health check...');
    const dbHealth = await databaseService.healthCheck();

    const response: HealthResponse = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      responseTime: Date.now() - startTime,
      database: {
        connected: dbHealth.status === 'healthy',
        responseTime: dbHealth.responseTime,
        error: dbHealth.error,
      },
    };

    // If database is unhealthy, mark overall status as unhealthy
    if (dbHealth.status !== 'healthy') {
      response.status = 'unhealthy';
      errors.push(`Database: ${dbHealth.error || 'Connection failed'}`);
    }

    // Try to get basic statistics (optional - don't fail if this doesn't work)
    try {
      const stats = await databaseService.getLeadStatistics();
      response.statistics = {
        totalLeads: stats.totalLeads,
        newLeads: stats.newLeads,
        n8nSuccessRate: stats.n8nSuccessRate,
        failedN8nLeads: stats.failedN8nLeads,
      };

      // Check for concerning statistics
      if (stats.failedN8nLeads > 10) {
        errors.push(`High number of failed 8n8 leads: ${stats.failedN8nLeads}`);
        response.status = response.status === 'healthy' ? 'degraded' : response.status;
      }

      if (stats.n8nSuccessRate < 90 && stats.totalLeads > 0) {
        errors.push(`Low 8n8 success rate: ${stats.n8nSuccessRate.toFixed(1)}%`);
        response.status = response.status === 'healthy' ? 'degraded' : response.status;
      }
    } catch (statsError) {
      console.warn('⚠️ Failed to get statistics:', statsError);
      errors.push('Could not retrieve database statistics');
      response.status = response.status === 'healthy' ? 'degraded' : response.status;
    }

    // Add errors to response if any
    if (errors.length > 0) {
      response.errors = errors;
    }

    console.log(`✅ Database health check completed: ${response.status}`);

    // Return appropriate status code
    const statusCode =
      response.status === 'healthy' ? 200 : response.status === 'degraded' ? 200 : 503;

    return res.status(statusCode).json(response);
  } catch (error) {
    console.error('❌ Database health check failed:', error);

    const errorResponse: HealthResponse = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      responseTime: Date.now() - startTime,
      database: {
        connected: false,
        responseTime: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      errors: ['Database health check failed'],
    };

    return res.status(503).json(errorResponse);
  }
}
