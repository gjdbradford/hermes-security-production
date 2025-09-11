import { Suspense, lazy } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Lazy load components for better performance
const AboutHeroSection = lazy(() => import('@/components/AboutHeroSection'));
const CompanyStorySection = lazy(() => import('@/components/CompanyStorySection'));
const VisionMissionSection = lazy(() => import('@/components/VisionMissionSection'));
const ValuesSection = lazy(() => import('@/components/ValuesSection'));
const ManifestoSection = lazy(() => import('@/components/ManifestoSection'));
const TeamSection = lazy(() => import('@/components/TeamSection'));
const WhyChooseSection = lazy(() => import('@/components/WhyChooseSection'));
const AboutCTASection = lazy(() => import('@/components/AboutCTASection'));

export default function About() {
  return (
    <>
      <Helmet>
        <title>About Us - Hermes Security | Defending the Light in a Digital World</title>
        <meta name="description" content="Learn about Hermes Security's mission to protect the digital realm. Founded by Graham and Artem, we combine AI speed with human expertise to defend against emerging threats." />
        <meta name="keywords" content="about us, Hermes Security, cybersecurity, AI security, founders, Graham John, Artem, digital protection, ethical security" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.hermessecurity.io/about" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Header />

        {/* Main Content */}
        <main>
          {/* Hero Section */}
          <Suspense fallback={<div className="py-24 bg-hero flex items-center justify-center"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent-security"></div></div>}>
            <AboutHeroSection />
          </Suspense>

          {/* Company Story Section */}
          <Suspense fallback={<div className="py-24 bg-background flex items-center justify-center"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent-security"></div></div>}>
            <CompanyStorySection />
          </Suspense>

          {/* Vision & Mission Section */}
          <Suspense fallback={<div className="py-24 bg-hero flex items-center justify-center"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent-security"></div></div>}>
            <VisionMissionSection />
          </Suspense>

          {/* Values Section */}
          <Suspense fallback={<div className="py-24 bg-background flex items-center justify-center"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent-security"></div></div>}>
            <ValuesSection />
          </Suspense>

          {/* Manifesto Section */}
          <Suspense fallback={<div className="py-24 bg-hero flex items-center justify-center"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent-security"></div></div>}>
            <ManifestoSection />
          </Suspense>

          {/* Team Section */}
          <Suspense fallback={<div className="py-24 bg-background flex items-center justify-center"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent-security"></div></div>}>
            <TeamSection />
          </Suspense>

          {/* Why Choose Section */}
          <Suspense fallback={<div className="py-24 bg-hero flex items-center justify-center"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent-security"></div></div>}>
            <WhyChooseSection />
          </Suspense>

          {/* CTA Section */}
          <Suspense fallback={<div className="py-24 bg-background flex items-center justify-center"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent-security"></div></div>}>
            <AboutCTASection />
          </Suspense>
        </main>

        <Footer />
      </div>
    </>
  );
}
