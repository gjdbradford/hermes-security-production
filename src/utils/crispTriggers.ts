// Declare Crisp global variable
declare global {
  interface Window {
    $crisp: any[];
  }
}

export const CrispTriggers = {
  // Open chat with context
  openChat: (context: string, data?: Record<string, any>) => {
    if (window.$crisp) {
      // First, open the chat
      window.$crisp.push(["do", "chat:open"]);
      
      // Then set session data in a single call with proper format
      if (data) {
        const sessionData = [
          ["context", context],
          ...Object.entries(data).map(([key, value]) => [key, String(value)])
        ];
        window.$crisp.push(["set", "session:data", sessionData]);
      } else {
        window.$crisp.push(["set", "session:data", [["context", context]]]);
      }
    }
  },

  // Set user preferences
  setPreferences: (preferences: Record<string, any>) => {
    if (window.$crisp) {
      const sessionData = Object.entries(preferences).map(([key, value]) => [key, String(value)]);
      window.$crisp.push(["set", "session:data", sessionData]);
    }
  },

  // Track events
  trackEvent: (event: string, data?: Record<string, any>) => {
    if (window.$crisp) {
      const sessionData = [["event", event]];
      if (data) {
        sessionData.push(...Object.entries(data).map(([key, value]) => [key, String(value)]));
      }
      window.$crisp.push(["set", "session:data", sessionData]);
    }
  },

  // Check if chat is visible
  isVisible: (): boolean => {
    if (window.$crisp) {
      return window.$crisp.is("visible");
    }
    return false;
  },

  // Set custom data for AI agent context
  setContext: (context: string, value: any) => {
    if (window.$crisp) {
      window.$crisp.push(["set", "session:data", [[context, String(value)]]]);
    }
  },

  // Send message to chat
  sendMessage: (message: string) => {
    if (window.$crisp) {
      window.$crisp.push(["do", "message:send", [message]]);
    }
  }
};

// Predefined trigger handlers
export const TriggerHandlers = {
  // Contact form trigger
  contactForm: () => {
    try {
      // Navigate to contact page
      window.location.href = '/#/contact';
    } catch (error) {
      console.error('Error in contact form trigger:', error);
      // Fallback: navigate to contact page
      window.location.href = '/#/contact';
    }
  },

  // Discovery call trigger
  discoveryCall: () => {
    try {
      CrispTriggers.openChat('discovery_call', {
        intent: 'high_value',
        source: 'discovery_call_button',
        timestamp: new Date().toISOString()
      });
      
      // Send initial message asking for phone number
      setTimeout(() => {
        CrispTriggers.sendMessage(
          "Hi! I see you're interested in booking a discovery call. I can help you schedule this right away.\n\n" +
          "Would you prefer to:\n" +
          "1. 📞 Have a phone call with our security expert\n" +
          "2. 💬 Chat with us on WhatsApp\n" +
          "3. 📧 Schedule a video call\n" +
          "4. 🗓️ Book a time slot in our calendar\n\n" +
          "What's your preferred contact method?"
        );
      }, 1000); // Wait 1 second for chat to open
    } catch (error) {
      console.error('Error in discovery call trigger:', error);
      // Fallback: just open chat without data
      if (window.$crisp) {
        window.$crisp.push(["do", "chat:open"]);
      }
    }
  },

  // Get started trigger
  getStarted: () => {
    try {
      CrispTriggers.openChat('get_started', {
        intent: 'conversion',
        source: 'get_started_button',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error in get started trigger:', error);
      if (window.$crisp) {
        window.$crisp.push(["do", "chat:open"]);
      }
    }
  },

  // Download guide trigger
  downloadGuide: () => {
    try {
      CrispTriggers.openChat('download_guide', {
        intent: 'content_engagement',
        source: 'methodology_download',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error in download guide trigger:', error);
      if (window.$crisp) {
        window.$crisp.push(["do", "chat:open"]);
      }
    }
  },

  // Request sample trigger
  requestSample: () => {
    try {
      CrispTriggers.openChat('request_sample', {
        intent: 'content_engagement',
        source: 'sample_report_request',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error in request sample trigger:', error);
      if (window.$crisp) {
        window.$crisp.push(["do", "chat:open"]);
      }
    }
  },

  // Service specific trigger
  serviceInquiry: (serviceName: string) => {
    CrispTriggers.openChat('service_inquiry', {
      intent: 'service_specific',
      service: serviceName,
      source: 'service_card_click',
      timestamp: new Date().toISOString()
    });
  },

  // Methodology stage trigger
  methodologyStage: (stageName: string) => {
    CrispTriggers.openChat('methodology_stage', {
      intent: 'methodology_interest',
      stage: stageName,
      source: 'methodology_stage_click',
      timestamp: new Date().toISOString()
    });
  },

  // Phone call request trigger
  requestPhoneCall: () => {
    CrispTriggers.openChat('phone_call_request', {
      intent: 'phone_communication',
      source: 'phone_call_button',
      timestamp: new Date().toISOString()
    });
    
    setTimeout(() => {
      CrispTriggers.sendMessage(
        "Perfect! I can arrange a call with our security expert right away.\n\n" +
        "Could you please provide:\n" +
        "📱 Your phone number\n" +
        "⏰ Your preferred time (we're available 9 AM - 6 PM GMT)\n" +
        "🌍 Your timezone\n\n" +
        "I'll have our expert call you within 30 minutes, or we can schedule for a specific time that works for you."
      );
    }, 1000);
  },

  // WhatsApp request trigger
  requestWhatsApp: () => {
    CrispTriggers.openChat('whatsapp_request', {
      intent: 'whatsapp_communication',
      source: 'whatsapp_button',
      timestamp: new Date().toISOString()
    });
    
    setTimeout(() => {
      CrispTriggers.sendMessage(
        "Great choice! WhatsApp is perfect for ongoing support.\n\n" +
        "Here's our WhatsApp number: +44 (0) 20 7946 0958\n\n" +
        "I'll send you a WhatsApp message right now with:\n" +
        "📋 A quick security assessment questionnaire\n" +
        "📅 Available appointment slots\n" +
        "💬 Direct access to our security experts\n\n" +
        "Would you like me to initiate the WhatsApp conversation now?"
      );
    }, 1000);
  },

  // Video call request trigger
  requestVideoCall: () => {
    CrispTriggers.openChat('video_call_request', {
      intent: 'video_communication',
      source: 'video_call_button',
      timestamp: new Date().toISOString()
    });
    
    setTimeout(() => {
      CrispTriggers.sendMessage(
        "Excellent! Video calls are great for detailed security discussions.\n\n" +
        "I can schedule a video call with our senior security consultant. Available slots:\n\n" +
        "📅 Today: 2 PM, 4 PM GMT\n" +
        "📅 Tomorrow: 10 AM, 2 PM, 4 PM GMT\n" +
        "📅 This week: Multiple slots available\n\n" +
        "What time works best for you? I'll send you a calendar invite with the video call link."
      );
    }, 1000);
  }
};

// Mobile and accessibility detection
export const DeviceDetection = {
  isMobile: (): boolean => {
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  },

  hasScreenReader: (): boolean => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  // Set device-specific preferences
  setDevicePreferences: () => {
    const isMobile = DeviceDetection.isMobile();
    const hasScreenReader = DeviceDetection.hasScreenReader();

    if (isMobile) {
      CrispTriggers.setPreferences({
        device: 'mobile',
        preferred_communication: 'whatsapp'
      });
    }

    if (hasScreenReader) {
      CrispTriggers.setPreferences({
        accessibility: 'screen_reader',
        preferred_communication: 'phone'
      });
    }
  }
};

// Intent-based triggers
export const IntentTriggers = {
  // Page timer trigger
  startPageTimer: (delay: number = 30000) => {
    setTimeout(() => {
      if (!CrispTriggers.isVisible()) {
        CrispTriggers.openChat('page_timer', {
          trigger: 'time_spent',
          page: window.location.pathname,
          timestamp: new Date().toISOString()
        });
      }
    }, delay);
  },

  // Scroll-based trigger
  handleScroll: () => {
    const scrollPercentage = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    
    if (scrollPercentage > 80 && !CrispTriggers.isVisible()) {
      CrispTriggers.openChat('scroll_bottom', {
        trigger: 'scroll_percentage',
        scroll_percentage: scrollPercentage,
        page: window.location.pathname,
        timestamp: new Date().toISOString()
      });
    }
  },

  // Exit intent trigger
  handleExitIntent: (e: MouseEvent) => {
    if (e.clientY <= 0 && !CrispTriggers.isVisible()) {
      CrispTriggers.openChat('exit_intent', {
        trigger: 'mouse_leave',
        page: window.location.pathname,
        timestamp: new Date().toISOString()
      });
    }
  }
};

// Analytics tracking
export const AnalyticsTracking = {
  // Track trigger performance
  trackTriggerPerformance: (trigger: string, conversion: boolean) => {
    CrispTriggers.trackEvent('trigger_clicked', {
      trigger,
      conversion,
      timestamp: new Date().toISOString(),
      page: window.location.pathname
    });
  },

  // Track chat engagement
  trackChatEngagement: (action: string, data?: Record<string, any>) => {
    CrispTriggers.trackEvent('chat_engagement', {
      action,
      timestamp: new Date().toISOString(),
      page: window.location.pathname,
      ...data
    });
  }
};

// Advanced discovery call triggers
export const DiscoveryCallTriggers = {
  // Generic discovery call with custom message
  triggerDiscoveryCall: (customMessage?: string) => {
    CrispTriggers.openChat('discovery_call', {
      intent: 'high_value',
      source: 'discovery_call_button',
      timestamp: new Date().toISOString()
    });
    
    const defaultMessage = 
      "Hi! I see you're interested in booking a discovery call. I can help you schedule this right away.\n\n" +
      "Would you prefer to:\n" +
      "1. 📞 Have a phone call with our security expert\n" +
      "2. 💬 Chat with us on WhatsApp\n" +
      "3. 📧 Schedule a video call\n" +
      "4. 🗓️ Book a time slot in our calendar\n\n" +
      "What's your preferred contact method?";
    
    setTimeout(() => {
      CrispTriggers.sendMessage(customMessage || defaultMessage);
    }, 1000);
  },

  // Direct phone call request
  triggerPhoneCall: () => {
    TriggerHandlers.requestPhoneCall();
  },

  // Direct WhatsApp request
  triggerWhatsApp: () => {
    TriggerHandlers.requestWhatsApp();
  },

  // Direct video call request
  triggerVideoCall: () => {
    TriggerHandlers.requestVideoCall();
  },

  // Urgent discovery call (for super urgent cases)
  triggerUrgentCall: () => {
    CrispTriggers.openChat('urgent_discovery_call', {
      intent: 'super_urgent',
      source: 'urgent_call_button',
      timestamp: new Date().toISOString()
    });
    
    setTimeout(() => {
      CrispTriggers.sendMessage(
        "🚨 URGENT: I understand you have an immediate security concern.\n\n" +
        "I'm connecting you with our senior security expert right now.\n\n" +
        "For immediate assistance:\n" +
        "📞 Call: +44 (0) 20 7946 0958\n" +
        "💬 WhatsApp: +44 (0) 20 7946 0958\n\n" +
        "Our expert will respond within 5 minutes. What type of security issue are you experiencing?"
      );
    }, 1000);
  }
};
