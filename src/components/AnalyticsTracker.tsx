import { useEffect, useCallback } from 'react';

interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

interface ConversionEvent {
  event_name: string;
  value?: number;
  currency?: string;
  items?: Array<{
    item_id: string;
    item_name: string;
    category: string;
    quantity: number;
    price: number;
  }>;
}

const AnalyticsTracker = () => {
  // Track page views
  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: document.title,
        page_location: window.location.href,
        page_type: 'home'
      });
    }
  }, []);

  // Track custom events
  const trackEvent = useCallback((event: AnalyticsEvent) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        ...event.custom_parameters
      });
    }
  }, []);

  // Track conversions
  const trackConversion = useCallback((conversion: ConversionEvent) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', conversion.event_name, {
        value: conversion.value,
        currency: conversion.currency || 'EUR',
        items: conversion.items
      });
    }
  }, []);

  // Track user engagement
  const trackEngagement = useCallback((engagementType: string, details?: any) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'user_engagement', {
        engagement_type: engagementType,
        engagement_details: details,
        page_title: document.title,
        page_location: window.location.href
      });
    }
  }, []);

  // Track scroll depth
  useEffect(() => {
    const trackScrollDepth = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);

      // Track scroll depth at 25%, 50%, 75%, and 100%
      if (scrollPercent >= 25 && scrollPercent < 50) {
        trackEngagement('scroll_25_percent');
      } else if (scrollPercent >= 50 && scrollPercent < 75) {
        trackEngagement('scroll_50_percent');
      } else if (scrollPercent >= 75 && scrollPercent < 100) {
        trackEngagement('scroll_75_percent');
      } else if (scrollPercent >= 100) {
        trackEngagement('scroll_100_percent');
      }
    };

    window.addEventListener('scroll', trackScrollDepth);
    return () => window.removeEventListener('scroll', trackScrollDepth);
  }, [trackEngagement]);

  // Track time on page
  useEffect(() => {
    const startTime = Date.now();

    const trackTimeOnPage = () => {
      const timeOnPage = Math.round((Date.now() - startTime) / 1000);
      trackEngagement('time_on_page', { seconds: timeOnPage });
    };

    // Track time on page when user leaves
    window.addEventListener('beforeunload', trackTimeOnPage);

    // Track time on page every 30 seconds
    const interval = setInterval(() => {
      const timeOnPage = Math.round((Date.now() - startTime) / 1000);
      if (timeOnPage % 30 === 0) {
        trackEngagement('time_on_page_interval', { seconds: timeOnPage });
      }
    }, 1000);

    return () => {
      window.removeEventListener('beforeunload', trackTimeOnPage);
      clearInterval(interval);
    };
  }, [trackEngagement]);

  // Track form interactions
  useEffect(() => {
    const trackFormInteraction = (event: Event) => {
      const target = event.target as HTMLElement;
      if (target.tagName === 'FORM' || target.closest('form')) {
        trackEvent({
          action: 'form_interaction',
          category: 'engagement',
          label: target.tagName === 'FORM' ? 'form_submit' : 'form_field_interaction'
        });
      }
    };

    document.addEventListener('submit', trackFormInteraction);
    document.addEventListener('focus', trackFormInteraction);

    return () => {
      document.removeEventListener('submit', trackFormInteraction);
      document.removeEventListener('focus', trackFormInteraction);
    };
  }, [trackEvent]);

  // Track button clicks
  useEffect(() => {
    const trackButtonClick = (event: Event) => {
      const target = event.target as HTMLElement;
      if (target.tagName === 'BUTTON' || target.closest('button')) {
        const buttonText = target.textContent?.trim() || 'unknown_button';
        trackEvent({
          action: 'button_click',
          category: 'engagement',
          label: buttonText
        });
      }
    };

    document.addEventListener('click', trackButtonClick);
    return () => document.removeEventListener('click', trackButtonClick);
  }, [trackEvent]);

  // Track link clicks
  useEffect(() => {
    const trackLinkClick = (event: Event) => {
      const target = event.target as HTMLElement;
      if (target.tagName === 'A' || target.closest('a')) {
        const link = target.tagName === 'A' ? target : target.closest('a') as HTMLAnchorElement;
        const linkText = link.textContent?.trim() || 'unknown_link';
        const linkHref = link.href || 'unknown_url';

        trackEvent({
          action: 'link_click',
          category: 'engagement',
          label: linkText,
          custom_parameters: {
            link_url: linkHref
          }
        });
      }
    };

    document.addEventListener('click', trackLinkClick);
    return () => document.removeEventListener('click', trackLinkClick);
  }, [trackEvent]);

  // Expose tracking functions globally for use in components
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).analyticsTracker = {
        trackEvent,
        trackConversion,
        trackEngagement
      };
    }
  }, [trackEvent, trackConversion, trackEngagement]);

  return null; // This component doesn't render anything
};

export default AnalyticsTracker;

