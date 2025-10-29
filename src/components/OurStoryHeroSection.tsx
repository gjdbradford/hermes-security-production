import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { getImagePath } from '@/utils/imageUtils';
import { useNavigate } from 'react-router-dom';
import { navigateToContact } from '@/utils/ctaNavigation';

export default function OurStoryHeroSection() {
  const navigate = useNavigate();

  const handleCTAClick = () => {
    navigateToContact(navigate, 'our-story-hero');
  };

  return (
    <section
      className='relative min-h-screen text-hero-foreground overflow-hidden flex items-center'
      role='banner'
    >
      {/* Custom Background Image with Subtle Movement */}
      <div
        className='absolute inset-0 bg-cover bg-center bg-no-repeat animate-subtle-float'
        style={{
          backgroundImage: `url(${getImagePath('images/backgrounds/hero-bg.jpg')})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
        aria-hidden='true'
      />

      {/* Overlay for text readability */}
      <div className='absolute inset-0 bg-hero/80 backdrop-blur-sm' aria-hidden='true' />

      {/* Enhanced Background Effects */}
      <div className='absolute inset-0 bg-gradient-security opacity-30' aria-hidden='true' />
      <div
        className='absolute top-1/4 left-1/4 w-96 h-96 bg-accent-security/10 rounded-full blur-3xl animate-pulse-security'
        aria-hidden='true'
      />
      <div
        className='absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-security/5 rounded-full blur-3xl'
        aria-hidden='true'
      />

      {/* Content */}
      <div className='relative container mx-auto px-6'>
        <div className='max-w-6xl mx-auto text-center'>
          {/* Main Headline */}
          <div className='text-center mb-12'>
            <h1 className='text-5xl md:text-7xl font-bold mb-6 leading-tight'>
              Driven by <span className='text-accent-security'>Philosophy</span>
            </h1>
            <p
              className='text-xl md:text-2xl text-hero-muted mb-12 max-w-5xl mx-auto leading-relaxed animate-fade-in font-bold'
              style={{ animationDelay: '0.8s' }}
            >
              Some partnerships are simply destined.
            </p>
          </div>

          {/* Description */}
          <p
            className='text-xl md:text-2xl text-hero-muted mb-12 max-w-5xl mx-auto leading-relaxed animate-fade-in'
            style={{ animationDelay: '0.8s' }}
          >
            For <strong>Artem and Graham</strong>, our meeting wasn't an accident—it was the
            inevitable collision of shared belief. It's a philosophy we live by:{' '}
            <strong>
              Love what you do, work with the best, and approach everything with the highest
              intention, respect, and attitude.
            </strong>{' '}
            The rest, honestly, takes care of itself.
          </p>

          {/* CTA Button */}
          <div className='flex justify-center animate-fade-in' style={{ animationDelay: '1.2s' }}>
            <Button variant='hero' size='lg' className='group' onClick={handleCTAClick}>
              Get In Touch
              <ArrowRight className='ml-2 w-4 h-4 transition-transform group-hover:translate-x-1' />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
