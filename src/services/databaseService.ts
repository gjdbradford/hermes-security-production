// Database service for Hermes Security leads management
import { Pool, PoolClient } from 'pg';
import { ContactFormData } from './contactApi';

// Database configuration
const dbConfig = {
  connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
  ssl: false, // Disable SSL for development/testing
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 10000, // Return an error after 10 seconds if connection could not be established
};

// Create connection pool
const pool = new Pool(dbConfig);

// Database interfaces
export interface LeadRecord {
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
  captchaToken?: string;
  userAgent?: string;
  ipAddress?: string;
  source: string;
  createdAt: Date;
  updatedAt: Date;
  n8nWebhookSentAt?: Date;
  n8nResponseReceivedAt?: Date;
  n8nResponseData?: any;
  n8nSuccess: boolean;
  n8nErrorMessage?: string;
  n8nRetryCount: number;
  n8nLastRetryAt?: Date;
  status: string;
  processedAt?: Date;
  assignedTo?: string;
  notes?: string;
  leadScore: number;
  priority: string;
  tags?: string[];
  aiAnalysis?: any;
  estimatedValue?: number;
  recommendedResponseTime?: string;
}

export interface CreateLeadData {
  leadId: string;
  formData: ContactFormData;
  userAgent?: string;
  ipAddress?: string;
  captchaToken?: string;
}

export interface UpdateLeadStatusData {
  leadId: string;
  status: string;
  assignedTo?: string;
  notes?: string;
}

export interface UpdateN8nResponseData {
  leadId: string;
  success: boolean;
  responseData?: any;
  errorMessage?: string;
}

export interface LeadStatistics {
  totalLeads: number;
  newLeads: number;
  highPriorityLeads: number;
  avgLeadScore: number;
  totalEstimatedValue: number;
  conversionRate: number;
  n8nSuccessRate: number;
  failedN8nLeads: number;
}

// Database service class
export class DatabaseService {
  private pool: Pool;

  constructor() {
    this.pool = pool;
  }

  // Health check method
  async healthCheck(): Promise<{ status: string; responseTime: number; error?: string }> {
    const startTime = Date.now();
    
    try {
      const client = await this.pool.connect();
      
      try {
        await client.query('SELECT 1');
        const responseTime = Date.now() - startTime;
        
        return {
          status: 'healthy',
          responseTime
        };
      } finally {
        client.release();
      }
    } catch (error) {
      return {
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Create a new lead record
  async createLead(data: CreateLeadData): Promise<LeadRecord> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');
      
      const query = `
        INSERT INTO hermes_leads (
          lead_id, first_name, last_name, email, country, phone_number,
          user_role, problem_description, company_name, company_size,
          service_urgency, agree_to_terms, privacy_consent, marketing_consent,
          captcha_token, user_agent, ip_address, source
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
        RETURNING *
      `;
      
      const values = [
        data.leadId,
        data.formData.firstName,
        data.formData.lastName,
        data.formData.email,
        data.formData.country,
        data.formData.phoneNumber,
        data.formData.userRole,
        data.formData.problemDescription,
        data.formData.companyName,
        data.formData.companySize,
        data.formData.serviceUrgency,
        data.formData.agreeToTerms,
        data.formData.privacyConsent,
        data.formData.marketingConsent,
        data.captchaToken,
        data.userAgent,
        data.ipAddress,
        'hermes-website'
      ];
      
      const result = await client.query(query, values);
      
      await client.query('COMMIT');
      
      return this.mapRowToLeadRecord(result.rows[0]);
    } catch (error) {
      await client.query('ROLLBACK');
      throw new Error(`Failed to create lead: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      client.release();
    }
  }

  // Get lead by ID
  async getLeadById(id: number): Promise<LeadRecord | null> {
    const client = await this.pool.connect();
    
    try {
      const query = 'SELECT * FROM hermes_leads WHERE id = $1';
      const result = await client.query(query, [id]);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      return this.mapRowToLeadRecord(result.rows[0]);
    } catch (error) {
      throw new Error(`Failed to get lead by ID: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      client.release();
    }
  }

  // Get lead by lead ID
  async getLeadByLeadId(leadId: string): Promise<LeadRecord | null> {
    const client = await this.pool.connect();
    
    try {
      const query = 'SELECT * FROM hermes_leads WHERE lead_id = $1';
      const result = await client.query(query, [leadId]);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      return this.mapRowToLeadRecord(result.rows[0]);
    } catch (error) {
      throw new Error(`Failed to get lead by lead ID: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      client.release();
    }
  }

  // Get lead by email
  async getLeadByEmail(email: string): Promise<LeadRecord | null> {
    const client = await this.pool.connect();
    
    try {
      const query = 'SELECT * FROM hermes_leads WHERE email = $1 ORDER BY created_at DESC LIMIT 1';
      const result = await client.query(query, [email.toLowerCase()]);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      return this.mapRowToLeadRecord(result.rows[0]);
    } catch (error) {
      throw new Error(`Failed to get lead by email: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      client.release();
    }
  }

  // Update lead status
  async updateLeadStatus(data: UpdateLeadStatusData): Promise<boolean> {
    const client = await this.pool.connect();
    
    try {
      const query = 'SELECT update_lead_status($1, $2, $3, $4)';
      const result = await client.query(query, [data.leadId, data.status, data.assignedTo, data.notes]);
      
      return result.rows[0].update_lead_status;
    } catch (error) {
      throw new Error(`Failed to update lead status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      client.release();
    }
  }

  // Update 8n8 response
  async updateN8nResponse(data: UpdateN8nResponseData): Promise<boolean> {
    const client = await this.pool.connect();
    
    try {
      const query = 'SELECT update_n8n_response($1, $2, $3, $4)';
      const result = await client.query(query, [data.leadId, data.success, JSON.stringify(data.responseData), data.errorMessage]);
      
      return result.rows[0].update_n8n_response;
    } catch (error) {
      throw new Error(`Failed to update 8n8 response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      client.release();
    }
  }

  // Mark 8n8 webhook as sent
  async markN8nWebhookSent(leadId: string): Promise<boolean> {
    const client = await this.pool.connect();
    
    try {
      const query = `
        UPDATE hermes_leads 
        SET n8n_webhook_sent_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
        WHERE lead_id = $1
        RETURNING id
      `;
      const result = await client.query(query, [leadId]);
      
      return result.rows.length > 0;
    } catch (error) {
      throw new Error(`Failed to mark 8n8 webhook as sent: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      client.release();
    }
  }

  // Increment retry count for failed 8n8 calls
  async incrementN8nRetry(leadId: string): Promise<boolean> {
    const client = await this.pool.connect();
    
    try {
      const query = 'SELECT increment_n8n_retry($1)';
      const result = await client.query(query, [leadId]);
      
      return result.rows[0].increment_n8n_retry;
    } catch (error) {
      throw new Error(`Failed to increment 8n8 retry: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      client.release();
    }
  }

  // Get leads by status
  async getLeadsByStatus(status: string, limit: number = 100): Promise<LeadRecord[]> {
    const client = await this.pool.connect();
    
    try {
      const query = `
        SELECT * FROM hermes_leads 
        WHERE status = $1 
        ORDER BY created_at DESC 
        LIMIT $2
      `;
      const result = await client.query(query, [status, limit]);
      
      return result.rows.map(row => this.mapRowToLeadRecord(row));
    } catch (error) {
      throw new Error(`Failed to get leads by status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      client.release();
    }
  }

  // Get high priority leads
  async getHighPriorityLeads(): Promise<LeadRecord[]> {
    const client = await this.pool.connect();
    
    try {
      const query = 'SELECT * FROM high_priority_leads';
      const result = await client.query(query);
      
      return result.rows.map(row => this.mapRowToLeadRecord(row));
    } catch (error) {
      throw new Error(`Failed to get high priority leads: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      client.release();
    }
  }

  // Get failed 8n8 leads
  async getFailedN8nLeads(): Promise<LeadRecord[]> {
    const client = await this.pool.connect();
    
    try {
      const query = 'SELECT * FROM failed_n8n_leads';
      const result = await client.query(query);
      
      return result.rows.map(row => this.mapRowToLeadRecord(row));
    } catch (error) {
      throw new Error(`Failed to get failed 8n8 leads: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      client.release();
    }
  }

  // Get lead statistics
  async getLeadStatistics(): Promise<LeadStatistics> {
    const client = await this.pool.connect();
    
    try {
      const query = 'SELECT * FROM get_lead_statistics()';
      const result = await client.query(query);
      
      const stats = result.rows[0];
      return {
        totalLeads: parseInt(stats.total_leads) || 0,
        newLeads: parseInt(stats.new_leads) || 0,
        highPriorityLeads: parseInt(stats.high_priority_leads) || 0,
        avgLeadScore: parseFloat(stats.avg_lead_score) || 0,
        totalEstimatedValue: parseFloat(stats.total_estimated_value) || 0,
        conversionRate: parseFloat(stats.conversion_rate) || 0,
        n8nSuccessRate: parseFloat(stats.n8n_success_rate) || 0,
        failedN8nLeads: parseInt(stats.failed_n8n_leads) || 0
      };
    } catch (error) {
      throw new Error(`Failed to get lead statistics: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      client.release();
    }
  }

  // Get total lead count
  async getLeadCount(): Promise<number> {
    const client = await this.pool.connect();
    
    try {
      const query = 'SELECT COUNT(*) as count FROM hermes_leads';
      const result = await client.query(query);
      
      return parseInt(result.rows[0].count) || 0;
    } catch (error) {
      throw new Error(`Failed to get lead count: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      client.release();
    }
  }

  // Update Brevo contact ID
  async updateBrevoContactId(leadId: string, brevoContactId: string): Promise<boolean> {
    const client = await this.pool.connect();
    
    try {
      const query = `
        UPDATE hermes_leads 
        SET brevo_contact_id = $2, updated_at = CURRENT_TIMESTAMP
        WHERE lead_id = $1
        RETURNING id
      `;
      const result = await client.query(query, [leadId, brevoContactId]);
      
      return result.rows.length > 0;
    } catch (error) {
      throw new Error(`Failed to update Brevo contact ID: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      client.release();
    }
  }

  // Clean up old leads (GDPR compliance)
  async cleanupOldLeads(): Promise<number> {
    const client = await this.pool.connect();
    
    try {
      const query = 'SELECT cleanup_old_leads()';
      const result = await client.query(query);
      
      return parseInt(result.rows[0].cleanup_old_leads) || 0;
    } catch (error) {
      throw new Error(`Failed to cleanup old leads: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      client.release();
    }
  }

  // Close database connection pool
  async close(): Promise<void> {
    await this.pool.end();
  }

  // Helper method to map database row to LeadRecord
  private mapRowToLeadRecord(row: any): LeadRecord {
    return {
      id: row.id,
      leadId: row.lead_id,
      brevoContactId: row.brevo_contact_id,
      firstName: row.first_name,
      lastName: row.last_name,
      email: row.email,
      country: row.country,
      phoneNumber: row.phone_number,
      userRole: row.user_role,
      problemDescription: row.problem_description,
      companyName: row.company_name,
      companySize: row.company_size,
      serviceUrgency: row.service_urgency,
      agreeToTerms: row.agree_to_terms,
      privacyConsent: row.privacy_consent,
      marketingConsent: row.marketing_consent,
      captchaToken: row.captcha_token,
      userAgent: row.user_agent,
      ipAddress: row.ip_address,
      source: row.source,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      n8nWebhookSentAt: row.n8n_webhook_sent_at,
      n8nResponseReceivedAt: row.n8n_response_received_at,
      n8nResponseData: row.n8n_response_data,
      n8nSuccess: row.n8n_success,
      n8nErrorMessage: row.n8n_error_message,
      n8nRetryCount: row.n8n_retry_count,
      n8nLastRetryAt: row.n8n_last_retry_at,
      status: row.status,
      processedAt: row.processed_at,
      assignedTo: row.assigned_to,
      notes: row.notes,
      leadScore: row.lead_score,
      priority: row.priority,
      tags: row.tags,
      aiAnalysis: row.ai_analysis,
      estimatedValue: row.estimated_value,
      recommendedResponseTime: row.recommended_response_time
    };
  }
}

// Create singleton instance
export const databaseService = new DatabaseService();

// Export types for use in other modules
export type { LeadRecord, CreateLeadData, UpdateLeadStatusData, UpdateN8nResponseData, LeadStatistics };
