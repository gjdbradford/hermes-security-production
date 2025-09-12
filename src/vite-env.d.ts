/// <reference types="vite/client" />

// Extend Window interface to include our custom properties
declare global {
  interface Window {
    urlBuildLogged?: boolean;
    environmentInfoLogged?: boolean;
    contactFormCaptchaLogged?: boolean;
    contactFormCtaLogged?: boolean;
  }
}
