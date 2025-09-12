/**
 * ChatBot utility functions for Crisp Chat integration
 * ONLY for specific approved CTAs - protected by CHATBOT_MASTER_RULES.md
 */
import { ContactFormData } from '@/services/contactApi';

// Declare Crisp global variable
declare global {
  interface Window {
    $crisp: any[] & {
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
    console.log('🤖 ChatBot: Launching service inquiry chat', { source });

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
        if (typeof window !== 'undefined' && (window as any).analyticsTracker) {
          (window as any).analyticsTracker.trackEvent({
            action: 'chatbot_launched',
            category: 'engagement',
            label: 'service_inquiry',
            custom_parameters: {
              source: source,
              context: 'service_inquiry',
            },
          });
        }

        console.log('✅ ChatBot: Service inquiry chat launched successfully');
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
    console.log('🤖 ChatBot: Launching contact form chat', {
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

        // Set comprehensive context data for the chat session
        const sessionData = [
          ['context', 'contact_form_submission'],
          ['cta_source', ctaSource],
          ['timestamp', new Date().toISOString()],
          ['user_name', `${formData.firstName} ${formData.lastName}`],
          ['user_email', formData.email],
          ['user_company', formData.companyName || 'Not provided'],
          ['service_urgency', formData.serviceUrgency],
          ['company_size', formData.companySize],
          ['country', formData.country],
          ['problem_description', formData.problemDescription],
          ['user_intent', 'contact_form_followup'],
        ];

        window.$crisp.push(['set', 'session:data', sessionData]);

        // Track analytics event
        if (typeof window !== 'undefined' && (window as any).analyticsTracker) {
          (window as any).analyticsTracker.trackEvent({
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
        }

        console.log('✅ ChatBot: Contact form chat launched successfully');
      } catch (error) {
        console.error('❌ ChatBot: Error launching contact form chat:', error);
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
