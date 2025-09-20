import { VercelRequest, VercelResponse } from '@vercel/node';
import { databaseService } from '../../src/services/databaseService';

interface LeadResponse {
  success: boolean;
  lead?: {
    id: number;
    leadId: string;
    brevoContactId?: string;
    firstName: string;
    lastName: string;
    email: string;
    country: string;
    phoneNumber: string;
    userRole?: string;
    problemDescription: string;
    companyName?: string;
    companySize?: string;
    serviceUrgency: string;
    agreeToTerms: boolean;
    privacyConsent: boolean;
    marketingConsent?: boolean;
    source: string;
    createdAt: string;
    status: string;
    n8nSuccess: boolean;
    n8nRetryCount: number;
    leadScore: number;
    priority: string;
    tags?: string[];
  };
  error?: string;
  timestamp: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
      message: 'Only GET requests are supported',
    });
  }

  try {
    const { id } = req.query;

    // Validate ID parameter
    if (!id || typeof id !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Invalid lead ID',
        message: 'Lead ID is required and must be a string',
        timestamp: new Date().toISOString(),
      });
    }

    console.log(`🔍 Retrieving lead: ${id}`);

    // Try to get lead by numeric ID first, then by lead ID
    let lead;
    const numericId = parseInt(id);

    if (!isNaN(numericId)) {
      lead = await databaseService.getLeadById(numericId);
    } else {
      lead = await databaseService.getLeadByLeadId(id);
    }

    if (!lead) {
      return res.status(404).json({
        success: false,
        error: 'Lead not found',
        message: `No lead found with ID: ${id}`,
        timestamp: new Date().toISOString(),
      });
    }

    // Prepare response (exclude sensitive data)
    const response: LeadResponse = {
      success: true,
      lead: {
        id: lead.id,
        leadId: lead.leadId,
        brevoContactId: lead.brevoContactId,
        firstName: lead.firstName,
        lastName: lead.lastName,
        email: lead.email,
        country: lead.country,
        phoneNumber: lead.phoneNumber,
        userRole: lead.userRole,
        problemDescription: lead.problemDescription,
        companyName: lead.companyName,
        companySize: lead.companySize,
        serviceUrgency: lead.serviceUrgency,
        agreeToTerms: lead.agreeToTerms,
        privacyConsent: lead.privacyConsent,
        marketingConsent: lead.marketingConsent,
        source: lead.source,
        createdAt: lead.createdAt.toISOString(),
        status: lead.status,
        n8nSuccess: lead.n8nSuccess,
        n8nRetryCount: lead.n8nRetryCount,
        leadScore: lead.leadScore,
        priority: lead.priority,
        tags: lead.tags,
      },
      timestamp: new Date().toISOString(),
    };

    console.log(`✅ Lead ${id} retrieved successfully`);

    return res.status(200).json(response);
  } catch (error) {
    console.error('❌ Error retrieving lead:', error);

    const errorResponse: LeadResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    };

    return res.status(500).json(errorResponse);
  }
}
