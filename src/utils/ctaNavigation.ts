/**
 * CTA Navigation utilities for consistent routing across all environments
 */
import { NavigateFunction } from "react-router-dom";
import { getBasePath } from "./routingUtils";

/**
 * Navigate to contact page with CTA source tracking
 * @param navigate - React Router navigate function
 * @param ctaSource - Source of the CTA (e.g., "Get In Touch", "Book Your Pen Test Today")
 */
export const navigateToContact = (navigate: NavigateFunction, ctaSource: string): void => {
  console.log('🔘 CTA Button clicked:', ctaSource);
  
  // Store CTA source in sessionStorage for the contact page
  sessionStorage.setItem('cta-source', ctaSource);
  
  // Navigate using React Router to maintain base path context
  const basePath = getBasePath();
  const contactPath = basePath === '/' ? '/contact' : `${basePath}contact`;
  
  console.log('🧭 Navigating to:', contactPath);
  navigate(contactPath);
};

/**
 * Get the correct contact path for the current environment
 * @returns The contact path with proper base path
 */
export const getContactPath = (): string => {
  const basePath = getBasePath();
  return basePath === '/' ? '/contact' : `${basePath}contact`;
};
