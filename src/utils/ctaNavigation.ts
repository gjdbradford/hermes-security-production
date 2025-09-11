/**
 * CTA Navigation utilities for consistent routing across all environments
 * Preserves CTA source tracking while maintaining proper base path context
 */
import { NavigateFunction } from 'react-router-dom';
import { getBasePath } from './routingUtils';

/**
 * Navigate to contact page with CTA source tracking
 * @param navigate - React Router navigate function
 * @param ctaSource - Source of the CTA (e.g., "Get In Touch", "Book Your Pen Test Today")
 */
export const navigateToContact = (navigate: NavigateFunction, ctaSource: string): void => {
  // console.log('🔘 CTA Button clicked:', ctaSource);

  // Store CTA source in sessionStorage for the contact page
  sessionStorage.setItem('cta-source', ctaSource);

  // Navigate using React Router - it handles base path automatically
  // Always use relative path, React Router will add the base path
  const contactPath = '/contact';

  // console.log('🧭 Navigating to:', contactPath);
  navigate(contactPath);
};

/**
 * Navigate to contact page with URL parameters (fallback method)
 * @param ctaSource - Source of the CTA
 */
export const navigateToContactWithParams = (ctaSource: string): void => {
  // console.log('🔘 CTA Button clicked:', ctaSource);

  // Use URL parameters as backup method
  const basePath = getBasePath();
  const contactUrl = `${window.location.origin}${basePath}contact?cta=${encodeURIComponent(ctaSource)}`;

  // console.log('🧭 Navigating to:', contactUrl);
  window.location.href = contactUrl;
};

/**
 * Get the correct contact path for the current environment
 * @returns The contact path with proper base path
 */
export const getContactPath = (): string => {
  // Always return relative path - React Router handles base path
  return '/contact';
};
