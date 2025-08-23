import { useEffect, lazy, Suspense } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import SkipLink from "@/components/SkipLink";

// Lazy load non-critical components
const ValueProposition = lazy(() => import("@/components/ValueProposition"));
const ServicesSection = lazy(() => import("@/components/ServicesSection"));
const ComplianceSection = lazy(() => import("@/components/ComplianceSection"));
const CTASection = lazy(() => import("@/components/CTASection"));
const Footer = lazy(() => import("@/components/Footer"));

const Index = () => {
  useEffect(() => {
    // Update page metadata for SEO
    document.title = "Hermes Security - AI-Driven Penetration Testing with Human Oversight";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'AI-accelerated penetration testing with ethical human oversight. SOC 2 aligned, GDPR compliant security testing for European enterprises. Web, API, Mobile, Cloud & AI Red Teaming.');
    }

    // Add structured data for SEO
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Hermes Security",
      "description": "AI-driven penetration testing with human oversight",
      "url": "https://hermessecurity.eu",
      "logo": "https://hermessecurity.eu/logo.png",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+44-20-7946-0958",
        "contactType": "sales",
        "email": "hello@hermessecurity.eu"
      },
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "GB",
        "addressLocality": "London"
      },
      "sameAs": [
        "https://linkedin.com/company/hermes-security"
      ]
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SkipLink />
      <Header />
      <main id="main-content">
        <HeroSection />
        <Suspense fallback={<div className="py-24 bg-background"><div className="container mx-auto px-6 text-center">Loading...</div></div>}>
          <ValueProposition />
        </Suspense>
        <div id="services">
          <Suspense fallback={<div className="py-24 bg-hero text-hero-foreground"><div className="container mx-auto px-6 text-center">Loading services...</div></div>}>
            <ServicesSection />
          </Suspense>
        </div>
        <div id="compliance">
          <Suspense fallback={<div className="py-24 bg-background"><div className="container mx-auto px-6 text-center">Loading compliance...</div></div>}>
            <ComplianceSection />
          </Suspense>
        </div>
        <Suspense fallback={<div className="py-24 bg-gradient-hero text-hero-foreground"><div className="container mx-auto px-6 text-center">Loading...</div></div>}>
          <CTASection />
        </Suspense>
      </main>
      <Suspense fallback={<div className="bg-hero text-hero-foreground py-16"><div className="container mx-auto px-6 text-center">Loading...</div></div>}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default Index;
