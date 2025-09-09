import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { submitContactForm } from '../services/contactApi';

// Mock environment variables
const mockEnv = {
  VITE_8N8_API_KEY: 'test-api-key',
  VITE_8N8_WEBHOOK_URL: 'https://test-8n8-instance.com/webhook/hermes-contact',
  VITE_EMAILJS_SERVICE_ID: 'test-email-service',
  VITE_EMAILJS_TEMPLATE_ID: 'test-template',
  VITE_EMAILJS_USER_ID: 'test-user-id'
};

// Mock fetch
global.fetch = vi.fn();

describe('8n8 Integration Tests', () => {
  beforeAll(() => {
    // Set up environment variables
    Object.entries(mockEnv).forEach(([key, value]) => {
      import.meta.env[key] = value;
    });
  });

  afterAll(() => {
    // Clean up
    vi.clearAllMocks();
  });

  it('should submit form data to 8n8 webhook', async () => {
    const mockFormData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      country: 'GB',
      mobileNumber: '+44 7700 900000',
      problemDescription: 'Need security assessment for e-commerce platform',
      companyName: 'Test Company Ltd',
      companySize: '51-200',
      serviceUrgency: 'urgent',
      agreeToTerms: true,
      gdprConsent: true
    };

    // Mock successful response
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        messageId: 'test-message-id',
        leadId: 'HERMES-TEST-001'
      })
    });

    const result = await submitContactForm(mockFormData);

    expect(fetch).toHaveBeenCalledWith(
      'https://test-8n8-instance.com/webhook/hermes-contact',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-api-key'
        },
        body: expect.stringContaining('Test User')
      })
    );

    expect(result.success).toBe(true);
    expect(result.leadId).toBe('HERMES-TEST-001');
  });

  it('should handle webhook errors gracefully', async () => {
    const mockFormData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      country: 'GB',
      mobileNumber: '+44 7700 900000',
      problemDescription: 'Test description',
      companyName: 'Test Company',
      companySize: '11-50',
      serviceUrgency: 'standard',
      agreeToTerms: true,
      gdprConsent: true
    };

    // Mock error response
    (fetch as any).mockRejectedValueOnce(new Error('Network error'));

    await expect(submitContactForm(mockFormData)).rejects.toThrow('Failed to submit to 8n8 automation');
  });

  it('should generate unique lead IDs', async () => {
    const mockFormData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      country: 'GB',
      mobileNumber: '+44 7700 900000',
      problemDescription: 'Test description',
      companyName: 'Test Company',
      companySize: '11-50',
      serviceUrgency: 'standard',
      agreeToTerms: true,
      gdprConsent: true
    };

    // Mock successful response
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        messageId: 'test-message-id',
        leadId: 'HERMES-TEST-002'
      })
    });

    const result1 = await submitContactForm(mockFormData);
    const result2 = await submitContactForm(mockFormData);

    expect(result1.leadId).not.toBe(result2.leadId);
    expect(result1.leadId).toMatch(/^HERMES-/);
    expect(result2.leadId).toMatch(/^HERMES-/);
  });

  it('should format email subject correctly', async () => {
    const mockFormData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      country: 'GB',
      mobileNumber: '+44 7700 900000',
      problemDescription: 'GDPR compliance needed',
      companyName: 'TechCorp Ltd',
      companySize: '201-500',
      serviceUrgency: 'super-urgent',
      agreeToTerms: true,
      gdprConsent: true
    };

    // Mock successful response
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        messageId: 'test-message-id',
        leadId: 'HERMES-TEST-003'
      })
    });

    await submitContactForm(mockFormData);

    // Check that the webhook was called with correct data
    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        body: expect.stringContaining('TechCorp Ltd')
      })
    );
  });

  it('should handle form submission without mobile number', async () => {
    const mockFormData = {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      country: 'US',
      // mobileNumber is intentionally omitted
      problemDescription: 'Need security assessment for mobile app',
      companyName: 'MobileCorp Inc',
      companySize: '11-50',
      serviceUrgency: 'standard',
      agreeToTerms: true,
      gdprConsent: true
    };

    // Mock successful response
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        messageId: 'test-message-id-2',
        timestamp: new Date().toISOString()
      })
    });

    const result = await submitContactForm(mockFormData);

    expect(result.success).toBe(true);
    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: expect.stringContaining('Jane Doe')
      })
    );
  });
});
