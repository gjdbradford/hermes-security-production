// Client Introduction Form service - 8n8 webhook submission
export interface OnboardingFormData {
  serviceType: string;
  expectedOutcomes: string[];
  currentChallenges: string;
  serviceStartTimeline: string;
  decisionTimeline: string;
  hasBudget: boolean;
  currency: string;
  budgetRange: string;
  projectLead: string;
  projectLeadRole: string;
  projectLeadRoleOther: string;
  decisionFactors: string[];
  howDidYouHear: string;
  howDidYouHearOther?: string;
  email: string;
  country?: string;
  captchaToken?: string;
  onboardingId?: string;
  submittedAt?: string;
}

export interface OnboardingResponse {
  success: boolean;
  message?: string;
  onboardingId?: string;
}

// Get the appropriate 8n8 webhook URL based on environment
const getWebhookUrl = (): string => {
  const hostname = window.location.hostname;

  // Production: www.hermessecurity.io or hermessecurity.io
  if (hostname === 'www.hermessecurity.io' || hostname === 'hermessecurity.io') {
    return 'https://ilovemylife.app.n8n.cloud/webhook/a950a091-b046-4e0d-9bd5-d712cff65b76';
  }

  // Staging: hermes-security-staging.vercel.app
  if (hostname === 'hermes-security-staging.vercel.app') {
    return 'https://ilovemylife.app.n8n.cloud/webhook-test/a950a091-b046-4e0d-9bd5-d712cff65b76';
  }

  // Local development
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'https://ilovemylife.app.n8n.cloud/webhook-test/a950a091-b046-4e0d-9bd5-d712cff65b76';
  }

  // Default to staging
  return 'https://ilovemylife.app.n8n.cloud/webhook-test/a950a091-b046-4e0d-9bd5-d712cff65b76';
};

const WEBHOOK_URL = getWebhookUrl();

export const submitOnboardingForm = async (
  formData: OnboardingFormData
): Promise<OnboardingResponse> => {
  try {
    console.log('🚀 Submitting client introduction form to 8n8 webhook:', WEBHOOK_URL);
    console.log('📝 Client introduction data:', formData);

    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // Service needs
        serviceType: formData.serviceType,
        expectedOutcomes: formData.expectedOutcomes,
        currentChallenges: formData.currentChallenges,

        // Timing & urgency
        serviceStartTimeline: formData.serviceStartTimeline,
        decisionTimeline: formData.decisionTimeline,

        // Budget information
        hasBudget: formData.hasBudget,
        currency: formData.currency,
        budgetRange: formData.budgetRange,

        // Decision process
        projectLead: formData.projectLead,
        projectLeadRole: formData.projectLeadRole,
        projectLeadRoleOther: formData.projectLeadRoleOther,
        decisionFactors: formData.decisionFactors,

        // Source information
        howDidYouHear: formData.howDidYouHear,
        howDidYouHearOther: formData.howDidYouHearOther,

        // Contact information
        email: formData.email,
        country: formData.country,

        // Security and metadata
        captchaToken: formData.captchaToken,
        onboardingId: formData.onboardingId,
        submittedAt: formData.submittedAt || new Date().toISOString(),
        userAgent: navigator.userAgent,
        source: 'hermes-security-client-introduction',
        formType: 'client-introduction',
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
      message: 'Client introduction form submitted successfully',
      onboardingId: formData.onboardingId,
    };
  } catch (error) {
    console.error('❌ Client introduction form submission error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to submit client introduction form',
    };
  }
};
