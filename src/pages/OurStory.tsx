import { Suspense, lazy } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Lazy load components for better performance
const OurStoryHeroSection = lazy(() => import('@/components/OurStoryHeroSection'));
const DestinyPhilosophySection = lazy(() => import('@/components/DestinyPhilosophySection'));
const IntentionallyPickySection = lazy(() => import('@/components/IntentionallyPickySection'));
const StrongFocusedDiscreetSection = lazy(
  () => import('@/components/StrongFocusedDiscreetSection')
);
const TeamProfilesSection = lazy(() => import('@/components/TeamProfilesSection'));
const OurStoryCTASection = lazy(() => import('@/components/OurStoryCTASection'));

export default function OurStory() {
  return (
    <>
      <Helmet>
        <title>Our Story - Hermes Security | Driven by Philosophy</title>
        <meta
          name='description'
          content='Discover the story behind Hermes Security. Founded by Graham and Artem, we combine over 50 years of experience with a philosophy of love, respect, and the highest intention in cybersecurity.'
        />
        <meta
          name='keywords'
          content='our story, Hermes Security founders, Graham John, Artem, cybersecurity philosophy, company story, team profiles, cybersecurity experience'
        />
        <meta name='robots' content='index, follow' />
        <link rel='canonical' href='https://www.hermessecurity.io/our-story' />
      </Helmet>

      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100'>
        <Header />

        {/* Main Content */}
        <main>
          {/* Hero Section */}
          <Suspense
            fallback={
              <div className='py-24 bg-hero flex items-center justify-center'>
                <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-accent-security'></div>
              </div>
            }
          >
            <OurStoryHeroSection />
          </Suspense>

          {/* Destiny Philosophy Section */}
          <Suspense
            fallback={
              <div className='py-24 bg-background flex items-center justify-center'>
                <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-accent-security'></div>
              </div>
            }
          >
            <DestinyPhilosophySection />
          </Suspense>

          {/* Intentionally Picky Section */}
          <Suspense
            fallback={
              <div className='py-24 bg-hero flex items-center justify-center'>
                <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-accent-security'></div>
              </div>
            }
          >
            <IntentionallyPickySection />
          </Suspense>

          {/* Strong Focused Discreet Section */}
          <Suspense
            fallback={
              <div className='py-24 bg-background flex items-center justify-center'>
                <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-accent-security'></div>
              </div>
            }
          >
            <StrongFocusedDiscreetSection />
          </Suspense>

          {/* Team Profiles Section */}
          <Suspense
            fallback={
              <div className='py-24 bg-hero flex items-center justify-center'>
                <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-accent-security'></div>
              </div>
            }
          >
            <TeamProfilesSection />
          </Suspense>

          {/* CTA Section */}
          <Suspense
            fallback={
              <div className='py-24 bg-background flex items-center justify-center'>
                <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-accent-security'></div>
              </div>
            }
          >
            <OurStoryCTASection />
          </Suspense>
        </main>

        <Footer />
      </div>
    </>
  );
}
