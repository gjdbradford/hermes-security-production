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
        // Open the chat widget
        window.$crisp.push(['do', 'chat:open']);

        // Helper function to sanitize data for Crisp
        const sanitizeForCrisp = (value: unknown): string => {
          if (value === null || value === undefined) {
            return 'Not provided';
          }
          // Convert to string and limit length to prevent issues
          const stringValue = String(value).trim();
          // Remove any potentially problematic characters and limit length
          return stringValue.length > 100 ? stringValue.substring(0, 100) + '...' : stringValue;
        };

        // Set comprehensive context data for the chat session with sanitized values
        const sessionData = [
          ['context', 'contact_form_submission'],
          ['cta_source', sanitizeForCrisp(ctaSource)],
          ['timestamp', new Date().toISOString()],
          [
            'user_name',
            sanitizeForCrisp(`${formData.firstName || ''} ${formData.lastName || ''}`.trim()),
          ],
          ['user_email', sanitizeForCrisp(formData.email)],
          ['user_company', sanitizeForCrisp(formData.companyName)],
          ['service_urgency', sanitizeForCrisp(formData.serviceUrgency)],
          ['company_size', sanitizeForCrisp(formData.companySize)],
          ['country', sanitizeForCrisp(formData.country)],
          ['user_intent', 'contact_form_followup'],
        ];

        // Only add problem_description if it's not too long and contains valid content
        if (formData.problemDescription && formData.problemDescription.trim().length > 0) {
          const sanitizedDescription = sanitizeForCrisp(formData.problemDescription);
          if (sanitizedDescription.length <= 200) {
            sessionData.push(['problem_description', sanitizedDescription]);
          }
        }

        // Set session data with error handling
        try {
          window.$crisp.push(['set', 'session:data', sessionData]);
          console.warn('✅ ChatBot: Session data set successfully');
        } catch (sessionError) {
          console.error('❌ ChatBot: Error setting session data:', sessionError);
          console.warn('📊 ChatBot: Session data that caused error:', sessionData);
          // Continue with chat opening even if session data fails
        }

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
