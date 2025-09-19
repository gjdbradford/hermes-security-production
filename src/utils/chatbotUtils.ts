/**
 * ChatBot utility functions for Crisp Chat integration
 * ONLY for specific approved CTAs - protected by CHATBOT_MASTER_RULES.md
 */
import { ContactFormData } from '@/services/contactApi';

// Declare Crisp global variable
declare global {
  interface Window {
    $crisp: unknown[] & {
      is: (property: string) => boolean;
    };
    crispErrorHandlerAdded?: boolean;
  }
}

/**
 * ChatBot utility functions - PROTECTED BY MASTER RULES
 * Only 2 CTAs can use these functions:
 * 1. "Learn More About Our Services" button
 * 2. Contact form submission
 */
export const ChatBotUtils = {
  /**
   * Launch ChatBot for service inquiry
   * ONLY for "Learn More About Our Services" button
   * @param source - Source of the ChatBot activation
   */
  launchServiceInquiry: (source: string) => {
    console.warn('🤖 ChatBot: Launching service inquiry chat', { source });

    if (window.$crisp) {
      try {
        // Open the chat widget
        window.$crisp.push(['do', 'chat:open']);

        // Set context data for the chat session
        const sessionData = [
          ['context', 'service_inquiry'],
          ['source', source],
          ['timestamp', new Date().toISOString()],
          ['user_intent', 'learn_about_services'],
        ];

        window.$crisp.push(['set', 'session:data', sessionData]);

        // Track analytics event
        if (
          typeof window !== 'undefined' &&
          (window as unknown as { analyticsTracker?: { trackEvent: (event: unknown) => void } })
            .analyticsTracker
        ) {
          (
            window as unknown as { analyticsTracker: { trackEvent: (event: unknown) => void } }
          ).analyticsTracker.trackEvent({
            action: 'chatbot_launched',
            category: 'engagement',
            label: 'service_inquiry',
            custom_parameters: {
              source: source,
              context: 'service_inquiry',
            },
          });
        }

        console.warn('✅ ChatBot: Service inquiry chat launched successfully');
      } catch (error) {
        console.error('❌ ChatBot: Error launching service inquiry chat:', error);
      }
    } else {
      console.warn('⚠️ ChatBot: Crisp widget not available');
    }
  },

  /**
   * Launch ChatBot after contact form submission
   * ONLY for contact form success flow
   * @param formData - Submitted form data
   * @param ctaSource - Original CTA source that led to form
   */
  launchContactFormChat: (formData: ContactFormData, ctaSource: string) => {
    console.warn('🤖 ChatBot: Launching contact form chat', {
      ctaSource,
      formData: {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        company: formData.companyName,
        urgency: formData.serviceUrgency,
      },
    });

    if (window.$crisp) {
      try {
        // Add global error handler for Crisp to prevent unhandled promise rejections
        if (!window.crispErrorHandlerAdded) {
          window.addEventListener('unhandledrejection', (event) => {
            if (event.reason && event.reason.message && event.reason.message.includes('Invalid data')) {
              console.warn('⚠️ ChatBot: Caught and handled Crisp Invalid data error');
              event.preventDefault(); // Prevent the error from showing in console
            }
          });
          window.crispErrorHandlerAdded = true;
        }

        // Open the chat widget
        window.$crisp.push(['do', 'chat:open']);

        // Helper function to sanitize data for Crisp - more aggressive approach
        const sanitizeForCrisp = (value: unknown): string => {
          if (value === null || value === undefined) {
            return 'Not provided';
          }
          
          // Convert to string and aggressively clean
          let stringValue = String(value).trim();
          
          // Remove any potentially problematic characters that could cause Crisp errors
          stringValue = stringValue
            .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
            .replace(/[^\u0020-\u007E]/g, '') // Keep only printable ASCII characters
            .replace(/[<>"'&]/g, '') // Remove HTML/XML special characters
            .replace(/[{}[\]()]/g, '') // Remove brackets and parentheses
            .replace(/[|\\]/g, '') // Remove pipes and backslashes
            .replace(/[`~!@#$%^&*+=]/g, '') // Remove special symbols
            .replace(/\s+/g, ' ') // Normalize whitespace
            .trim();
          
          // Ensure we have a valid string
          if (!stringValue || stringValue.length === 0) {
            return 'Not provided';
          }
          
          // Limit length to prevent issues
          return stringValue.length > 50 ? stringValue.substring(0, 50) + '...' : stringValue;
        };

        // Use minimal, safe session data to avoid Crisp errors
        const sessionData: [string, string][] = [
          ['context', 'contact_form_submission'],
          ['timestamp', new Date().toISOString().substring(0, 19)], // Simplified timestamp
        ];

        // Only add essential data that we're confident is safe
        const safeCtaSource = sanitizeForCrisp(ctaSource);
        if (safeCtaSource !== 'Not provided') {
          sessionData.push(['cta_source', safeCtaSource]);
        }

        const safeName = sanitizeForCrisp(`${formData.firstName || ''} ${formData.lastName || ''}`.trim());
        if (safeName !== 'Not provided') {
          sessionData.push(['user_name', safeName]);
        }

        const safeEmail = sanitizeForCrisp(formData.email);
        if (safeEmail !== 'Not provided') {
          sessionData.push(['user_email', safeEmail]);
        }

        const safeCompany = sanitizeForCrisp(formData.companyName);
        if (safeCompany !== 'Not provided') {
          sessionData.push(['user_company', safeCompany]);
        }

        // Validate session data before sending to Crisp
        const validatedSessionData = sessionData.filter(([key, value]) => {
          // Ensure both key and value are valid strings
          return (
            typeof key === 'string' &&
            typeof value === 'string' &&
            key.length > 0 &&
            value.length > 0 &&
            value !== 'Not provided' && // Skip empty values
            /^[a-zA-Z0-9_]+$/.test(key) && // Only alphanumeric keys
            value.length <= 50 // Limit value length
          );
        });

        // Set session data with error handling - use minimal approach with delay
        setTimeout(() => {
          try {
            // Use only the most basic, safe data
            const minimalSafeData = [
              ['context', 'contact_form_submission'],
              ['timestamp', new Date().toISOString().substring(0, 19)],
            ];
            
            window.$crisp.push(['set', 'session:data', minimalSafeData]);
            console.warn('✅ ChatBot: Minimal session data set successfully');
          } catch (sessionError) {
            console.error('❌ ChatBot: Error setting session data:', sessionError);
            
            // If even minimal data fails, skip session data entirely
            console.warn('⚠️ ChatBot: Skipping session data to prevent errors');
          }
        }, 500); // Wait 500ms for Crisp to fully initialize

        // Track analytics event
        if (
          typeof window !== 'undefined' &&
          (window as unknown as { analyticsTracker?: { trackEvent: (event: unknown) => void } })
            .analyticsTracker
        ) {
          try {
            (
              window as unknown as { analyticsTracker: { trackEvent: (event: unknown) => void } }
            ).analyticsTracker.trackEvent({
              action: 'chatbot_launched',
              category: 'engagement',
              label: 'contact_form_submission',
              custom_parameters: {
                cta_source: ctaSource,
                context: 'contact_form_submission',
                urgency: formData.serviceUrgency,
                company_size: formData.companySize,
              },
            });
          } catch (analyticsError) {
            console.error('❌ ChatBot: Error tracking analytics:', analyticsError);
          }
        }

        console.warn('✅ ChatBot: Contact form chat launched successfully');
      } catch (error) {
        console.error('❌ ChatBot: Error launching contact form chat:', error);
        console.warn('📊 ChatBot: Form data that caused error:', {
          ctaSource,
          formData: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            companyName: formData.companyName,
            serviceUrgency: formData.serviceUrgency,
            companySize: formData.companySize,
            country: formData.country,
            problemDescription: formData.problemDescription?.substring(0, 100) + '...',
          },
        });
      }
    } else {
      console.warn('⚠️ ChatBot: Crisp widget not available');
    }
  },

  /**
   * Check if Crisp widget is available
   * @returns boolean indicating if Crisp is loaded
   */
  isCrispAvailable: (): boolean => {
    return typeof window !== 'undefined' && !!window.$crisp;
  },

  /**
   * Get current chat status
   * @returns object with chat status information
   */
  getChatStatus: () => {
    if (window.$crisp) {
      try {
        return {
          isAvailable: true,
          isOpen: window.$crisp.is('chat:visible'),
          isOperatorAvailable: window.$crisp.is('chat:operator:available'),
        };
      } catch (error) {
        console.error('❌ ChatBot: Error getting chat status:', error);
        return { isAvailable: false, isOpen: false, isOperatorAvailable: false };
      }
    }
    return { isAvailable: false, isOpen: false, isOperatorAvailable: false };
  },
};

/**
 * Protected CTA validation
 * Ensures only approved CTAs can launch ChatBot
 */
export const validateChatBotCTA = (ctaSource: string): boolean => {
  const allowedCTAs = [
    'Learn More About Our Services',
    'contact_form_submission', // Special case for form submission
  ];

  const isAllowed = allowedCTAs.includes(ctaSource);

  if (!isAllowed) {
    console.warn(
      `⚠️ ChatBot: CTA "${ctaSource}" is not allowed to launch ChatBot. Allowed CTAs:`,
      allowedCTAs
    );
  }

  return isAllowed;
};

/**
 * Emergency ChatBot disable function
 * Use only if ChatBot is interfering with other functionality
 */
export const emergencyDisableChatBot = () => {
  console.warn('🚨 ChatBot: Emergency disable activated');

  // Override ChatBot functions to prevent activation
  ChatBotUtils.launchServiceInquiry = () => {
    console.warn('🚨 ChatBot: Emergency disabled - service inquiry blocked');
  };

  ChatBotUtils.launchContactFormChat = () => {
    console.warn('🚨 ChatBot: Emergency disabled - contact form chat blocked');
  };
};
