// Needs Assessment form service - 8n8 webhook submission
export interface NeedsAssessmentData {
  email: string;
  pentestType: string;
  productionEnvironment: string;
  stagingEnvironment: string;
  preferredTime: string;
  timezone: string;
  additionalInfo?: string;
  selectedServices: string[];

  // Web Applications data
  selectedWebCount?: string;
  selectedWebTechnologies?: string[];
  selectedWebVulnerabilities?: string[];
  webConcernsText?: string;

  // Mobile Applications data
  selectedMobileCount?: string;
  selectedMobilePlatforms?: string[];
  selectedMobileFrameworks?: string[];
  selectedMobileFeatures?: string[];
  mobileConcernsText?: string;

  // API Endpoints data
  selectedApiCount?: string;
  selectedApiTypes?: string[];
  selectedApiAuthMethods?: string[];
  selectedApiSensitiveData?: string[];
  apiConcernsText?: string;

  // Network data
  selectedNetworkComponents?: string[];
  selectedNetworkProtocols?: string[];
  network_concerns?: string;

  // Infrastructure data
  selectedInfrastructureComponents?: string[];
  selectedCloudPlatforms?: string[];
  selectedOperatingSystems?: string[];
  infrastructure_concerns?: string;

  captchaToken?: string;
  assessmentId?: string;
  submittedAt?: string;
}

export interface NeedsAssessmentResponse {
  success: boolean;
  message?: string;
  assessmentId?: string;
}

// Get the appropriate 8n8 webhook URL based on environment
const getWebhookUrl = (): string => {
  const hostname = window.location.hostname;

  // Production: www.hermessecurity.io or hermessecurity.io
  if (hostname === 'www.hermessecurity.io' || hostname === 'hermessecurity.io') {
    return 'https://ilovemylife.app.n8n.cloud/webhook/83ae02df-4b2f-4e3a-aa1b-52e12d046cda';
  }

  // Staging: hermes-security-staging.vercel.app
  if (hostname === 'hermes-security-staging.vercel.app') {
    return 'https://ilovemylife.app.n8n.cloud/webhook-test/83ae02df-4b2f-4e3a-aa1b-52e12d046cda';
  }

  // Local development
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'https://ilovemylife.app.n8n.cloud/webhook-test/83ae02df-4b2f-4e3a-aa1b-52e12d046cda';
  }

  // Default to staging
  return 'https://ilovemylife.app.n8n.cloud/webhook-test/83ae02df-4b2f-4e3a-aa1b-52e12d046cda';
};

const WEBHOOK_URL = getWebhookUrl();

export const submitNeedsAssessment = async (
  formData: NeedsAssessmentData
): Promise<NeedsAssessmentResponse> => {
  try {
    console.log('🚀 Submitting needs assessment to 8n8 webhook:', WEBHOOK_URL);
    console.log('📝 Assessment data:', formData);

    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // Basic information
        email: formData.email,
        pentestType: formData.pentestType,
        productionEnvironment: formData.productionEnvironment,
        stagingEnvironment: formData.stagingEnvironment,
        preferredTime: formData.preferredTime,
        timezone: formData.timezone,
        additionalInfo: formData.additionalInfo,
        selectedServices: formData.selectedServices,

        // Web Applications
        webApplications: {
          count: formData.selectedWebCount,
          technologies: formData.selectedWebTechnologies,
          vulnerabilities: formData.selectedWebVulnerabilities,
          web_concerns: formData.webConcernsText,
        },

        // Mobile Applications
        mobileApplications: {
          count: formData.selectedMobileCount,
          platforms: formData.selectedMobilePlatforms,
          frameworks: formData.selectedMobileFrameworks,
          features: formData.selectedMobileFeatures,
          mobile_concerns: formData.mobileConcernsText,
        },

        // API Endpoints
        apiEndpoints: {
          count: formData.selectedApiCount,
          types: formData.selectedApiTypes,
          authMethods: formData.selectedApiAuthMethods,
          sensitiveData: formData.selectedApiSensitiveData,
          api_concerns: formData.apiConcernsText,
        },

        // Network
        network: {
          components: formData.selectedNetworkComponents,
          protocols: formData.selectedNetworkProtocols,
          network_concerns: formData.network_concerns,
        },

        // Infrastructure
        infrastructure: {
          components: formData.selectedInfrastructureComponents,
          cloudPlatforms: formData.selectedCloudPlatforms,
          operatingSystems: formData.selectedOperatingSystems,
          infrastructure_concerns: formData.infrastructure_concerns,
        },

        // Security and metadata
        captchaToken: formData.captchaToken,
        assessmentId: formData.assessmentId,
        submittedAt: formData.submittedAt || new Date().toISOString(),
        userAgent: navigator.userAgent,
        source: 'hermes-security-needs-assessment',
        formType: 'needs-assessment',
      }),
    });

    console.log('📡 8n8 webhook response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ 8n8 webhook error response:', errorText);
      throw new Error(`8n8 webhook error: ${response.status} ${response.statusText}`);
    }

    // Handle empty response body (common with 8n8 webhooks)
    let result;
    try {
      const responseText = await response.text();
      if (responseText.trim()) {
        result = JSON.parse(responseText);
        console.log('✅ 8n8 webhook success with response:', result);
      } else {
        console.log('✅ 8n8 webhook success (no response body)');
        result = { success: true };
      }
    } catch (_parseError) {
      console.log('✅ 8n8 webhook success (non-JSON response)');
      result = { success: true };
    }

    return {
      success: true,
      message: 'Needs assessment submitted successfully',
      assessmentId: formData.assessmentId,
    };
  } catch (error) {
    console.error('❌ Needs assessment submission error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to submit needs assessment',
    };
  }
};
