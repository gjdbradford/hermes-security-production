import { Suspense, lazy } from "react";
import { Helmet } from "react-helmet-async";

// Lazy load components for better performance
const Header = lazy(() => import("@/components/Header"));
const HeroSection = lazy(() => import("@/components/HeroSection"));
const ValueProposition = lazy(() => import("@/components/ValueProposition"));
const ServicesSection = lazy(() => import("@/components/ServicesSection"));
const CaseStudySection = lazy(() => import("@/components/CaseStudySection"));
const CTASection = lazy(() => import("@/components/CTASection"));
const Footer = lazy(() => import("@/components/Footer"));

export default function Index() {
  return (
    <>
      <Helmet>
        <title>Hermes Security - AI-Driven Penetration Testing with Human Ethics</title>
        <meta 
          name="description" 
          content="Enterprise-grade cybersecurity with AI speed and human oversight. Web app, API, mobile, cloud, and network penetration testing with SOC 2 alignment and GDPR compliance." 
        />
        <meta name="keywords" content="penetration testing, cybersecurity, AI security, ethical hacking, web app security, API security, cloud security, network security" />
        <meta property="og:title" content="Hermes Security - AI-Driven Penetration Testing" />
        <meta property="og:description" content="Enterprise-grade cybersecurity with AI speed and human oversight." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hermes-security.com" />
        <meta property="og:image" content="/hermes-security-production/images/social/og-image.svg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Hermes Security - AI-Driven Penetration Testing" />
        <meta name="twitter:description" content="Enterprise-grade cybersecurity with AI speed and human oversight." />
        <meta name="twitter:image" content="/hermes-security-production/images/social/twitter-image.svg" />
        <link rel="canonical" href="https://hermes-security.com" />
      </Helmet>

      <Suspense fallback={<div className="fixed top-0 w-full bg-hero/95 backdrop-blur-md z-50 h-16 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-security"></div></div>}>
        <Header />
      </Suspense>

      <main className="min-h-screen">
        <Suspense fallback={<div className="min-h-screen bg-hero flex items-center justify-center"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent-security"></div></div>}>
          <HeroSection />
        </Suspense>

        <Suspense fallback={<div className="py-24 bg-background flex items-center justify-center"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent-security"></div></div>}>
          <ValueProposition />
        </Suspense>

        <Suspense fallback={<div className="py-24 bg-hero flex items-center justify-center"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent-security"></div></div>}>
          <ServicesSection />
        </Suspense>

        <Suspense fallback={<div className="py-24 bg-background flex items-center justify-center"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent-security"></div></div>}>
          <CaseStudySection />
        </Suspense>

        <Suspense fallback={<div className="py-24 bg-background flex items-center justify-center"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent-security"></div></div>}>
          <CTASection />
        </Suspense>

        <Suspense fallback={<div className="py-24 bg-hero flex items-center justify-center"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent-security"></div></div>}>
          <Footer />
        </Suspense>
      </main>
    </>
  );
}
