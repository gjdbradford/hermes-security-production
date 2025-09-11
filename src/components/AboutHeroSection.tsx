import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { getImagePath } from '@/utils/imageUtils';
import { useNavigate } from 'react-router-dom';
import { navigateToContact } from '@/utils/ctaNavigation';

export default function AboutHeroSection() {
  const navigate = useNavigate();

  const handleCTAClick = (ctaSource: string) => {
    navigateToContact(navigate, ctaSource);
  };

  return (
    <section className="relative min-h-screen text-hero-foreground overflow-hidden flex items-center" role="banner">
      {/* Custom Background Image with Subtle Movement */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat animate-subtle-float"
        style={{
          backgroundImage: `url(${getImagePath('images/backgrounds/hero-bg.jpg')})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover'
        }}
        aria-hidden="true"
      />

      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-hero/80 backdrop-blur-sm" aria-hidden="true" />

      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 bg-gradient-security opacity-30" aria-hidden="true" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-security/10 rounded-full blur-3xl animate-pulse-security" aria-hidden="true" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-security/5 rounded-full blur-3xl" aria-hidden="true" />

      {/* Content */}
      <div className="relative container mx-auto px-6">
        <div className="max-w-6xl mx-auto text-center">

          {/* Main Headline */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              About <span className="text-accent-security">Hermes Security</span>
            </h1>
            <p className="text-xl md:text-2xl text-hero-muted mb-12 max-w-5xl mx-auto leading-relaxed animate-fade-in font-bold" style={{ animationDelay: '0.8s' }}>
              Defending the light in a digital world.
            </p>
          </div>

          {/* Description */}
          <p className="text-xl md:text-2xl text-hero-muted mb-12 max-w-5xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.8s' }}>
            We stand at the frontier of cybersecurity, defending humanity's digital future against emerging AI threats.
            Our mission is to ensure technology remains a force for good in an increasingly complex digital landscape.
          </p>

          {/* CTA Button */}
          <div className="flex justify-center animate-fade-in" style={{ animationDelay: '1.2s' }}>
            <Button
              variant="hero"
              size="lg"
              className="group text-lg px-8 py-4"
              onClick={() => handleCTAClick('Start Your Security Journey')}
            >
              Start Your Security Journey
              <ArrowRight className="ml-3 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>

          {/* Remove the bouncing arrow section */}
          {/* <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-hero-foreground/30 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-hero-foreground/50 rounded-full mt-2 animate-pulse"></div>
            </div>
          </div> */}
        </div>
      </div>
    </section>
  );
}
