import { VercelRequest, VercelResponse } from '@vercel/node';
import { databaseService, CreateLeadData } from '../src/services/databaseService';
import { ContactFormData } from '../src/services/contactApi';

interface BackupLeadRequest {
  formData: ContactFormData;
  metadata?: {
    userAgent?: string;
    ipAddress?: string;
    timestamp?: string;
    captchaToken?: string;
  };
}

interface BackupLeadResponse {
  success: boolean;
  leadId: string;
  backupId: number;
  n8nResponse?: {
    success: boolean;
    messageId?: string;
    error?: string;
    retryCount?: number;
  };
  timestamp: string;
  nextSteps?: string[];
}

// Generate unique lead ID
function generateLeadId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `HERMES-${timestamp}-${random}`.toUpperCase();
}

// Forward data to 8n8 webhook
async function forwardToN8n(formData: ContactFormData, leadId: string): Promise<{
  success: boolean;
  messageId?: string;
  error?: string;
}> {
  try {
    // Get webhook URL based on environment
    const getWebhookUrl = (): string => {
      const hostname = process.env.VERCEL_URL || 'localhost';
      
      // Production
      if (hostname.includes('hermessecurity.io')) {
        return 'https://ilovemylife.app.n8n.cloud/webhook/a57cf53e-c2d6-4e59-8e38-44b774355629';
      }
      
      // Staging or development
      return 'https://ilovemylife.app.n8n.cloud/webhook-test/a57cf53e-c2d6-4e59-8e38-44b774355629';
    };

    const webhookUrl = getWebhookUrl();
    
    // Create webhook payload with lead ID
    const webhookPayload = {
      // Lead ID for tracking
      leadId: leadId,
      backupId: leadId, // For backward compatibility
      
      // Form data
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      country: formData.country,
      phoneNumber: formData.phoneNumber,
      userRole: formData.userRole,
      problemDescription: formData.problemDescription,
      companyName: formData.companyName,
      companySize: formData.companySize,
      serviceUrgency: formData.serviceUrgency,
      agreeToTerms: formData.agreeToTerms,
      privacyConsent: formData.privacyConsent,
      marketingConsent: formData.marketingConsent,

      // Metadata
      timestamp: new Date().toISOString(),
      userAgent: 'Hermes-Database-Backup-API',
      termsConsent: formData.agreeToTerms,

      // reCAPTCHA token
      captchaToken: formData.captchaToken,
      recaptchaToken: formData.captchaToken,
      recaptcha_response: formData.captchaToken,

      // Original nested structure for backward compatibility
      formData: formData,
    };

    console.log(`🔄 Forwarding lead ${leadId} to 8n8 webhook: ${webhookUrl}`);

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Hermes-Source': 'database-backup-api',
        'X-Hermes-Lead-ID': leadId,
        'X-Hermes-Environment': process.env.NODE_ENV || 'development',
        'X-Hermes-Version': '2.0.0',
      },
      body: JSON.stringify(webhookPayload),
    });

    console.log(`📡 8n8 Response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ 8n8 Error response:', errorText);
      throw new Error(`8n8 API Error: ${response.status} ${response.statusText}`);
    }

    // Handle response
    const responseText = await response.text();
    console.log(`📄 8n8 Raw response: ${responseText}`);

    let result;
    if (responseText.trim() === '') {
      // Empty response - treat as success
      result = {
        success: true,
        messageId: new Date().toISOString(),
      };
    } else {
      try {
        result = JSON.parse(responseText);
        result.success = true;
      } catch (parseError) {
        console.warn('⚠️ Failed to parse 8n8 JSON response, treating as success');
        result = {
          success: true,
          messageId: new Date().toISOString(),
        };
      }
    }

    console.log(`✅ 8n8 Response processed:`, result);
    return result;

  } catch (error) {
    console.error('❌ 8n8 Forwarding Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false,
      error: 'Method not allowed',
      message: 'Only POST requests are supported'
    });
  }

  try {
    const requestData: BackupLeadRequest = req.body;

    // Validate request data
    if (!requestData.formData) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: formData',
        message: 'Form data is required'
      });
    }

    const { formData, metadata = {} } = requestData;

    // Validate required form fields
    const requiredFields = [
      'firstName', 'lastName', 'email', 'country', 
      'phoneNumber', 'problemDescription', 'serviceUrgency',
      'agreeToTerms', 'privacyConsent'
    ];

    const missingFields = requiredFields.filter(field => !formData[field as keyof ContactFormData]);
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`,
        message: 'All required form fields must be provided'
      });
    }

    // Generate unique lead ID
    const leadId = generateLeadId();
    
    console.log(`🚀 Processing lead backup: ${leadId}`);

    // 1. First, backup to database
    const backupData: CreateLeadData = {
      leadId,
      formData,
      userAgent: metadata.userAgent || req.headers['user-agent'],
      ipAddress: metadata.ipAddress || req.headers['x-forwarded-for'] as string || req.connection.remoteAddress,
      captchaToken: metadata.captchaToken || formData.captchaToken
    };

    console.log(`💾 Backing up lead ${leadId} to database...`);
    const leadRecord = await databaseService.createLead(backupData);
    console.log(`✅ Lead ${leadId} backed up with ID: ${leadRecord.id}`);

    // 2. Mark 8n8 webhook as sent
    await databaseService.markN8nWebhookSent(leadId);

    // 3. Forward to 8n8
    console.log(`🔄 Forwarding lead ${leadId} to 8n8...`);
    const n8nResult = await forwardToN8n(formData, leadId);

    // 4. Update database with 8n8 response
    await databaseService.updateN8nResponse({
      leadId,
      success: n8nResult.success,
      responseData: n8nResult,
      errorMessage: n8nResult.error
    });

    // 5. If 8n8 failed, increment retry count
    if (!n8nResult.success) {
      await databaseService.incrementN8nRetry(leadId);
    }

    console.log(`🎉 Lead ${leadId} processing complete`);

    // Prepare response
    const response: BackupLeadResponse = {
      success: true,
      leadId,
      backupId: leadRecord.id,
      timestamp: new Date().toISOString(),
      n8nResponse: {
        success: n8nResult.success,
        messageId: n8nResult.messageId,
        error: n8nResult.error,
        retryCount: !n8nResult.success ? 1 : 0
      },
      nextSteps: [
        "Lead successfully backed up to database",
        n8nResult.success 
          ? "Data forwarded to 8n8 successfully" 
          : "8n8 forwarding failed - will retry automatically",
        "You can link this lead to Brevo using the leadId",
        "Check database for complete lead information"
      ]
    };

    // Return success response (even if 8n8 failed, database backup succeeded)
    return res.status(200).json(response);

  } catch (error) {
    console.error('❌ Backup API Error:', error);

    // Determine if this is a database error or other error
    const isDatabaseError = error instanceof Error && 
      (error.message.includes('database') || 
       error.message.includes('connection') ||
       error.message.includes('query'));

    const errorResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      message: isDatabaseError 
        ? 'Database backup failed - please try again'
        : 'Lead processing failed - please try again'
    };

    // Return appropriate status code
    const statusCode = isDatabaseError ? 503 : 500;
    return res.status(statusCode).json(errorResponse);
  }
}
