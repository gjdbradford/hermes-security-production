import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { navigateToContact } from '@/utils/ctaNavigation';

export default function OurStoryCTASection() {
  const navigate = useNavigate();

  const handleCTAClick = () => {
    navigateToContact(navigate, 'our-story-cta');
  };

  return (
    <section className='py-24 bg-gradient-hero text-hero-foreground relative overflow-hidden'>
      {/* Background Effects */}
      <div className='absolute inset-0 bg-gradient-security opacity-30' />
      <div className='absolute top-0 left-1/3 w-96 h-96 bg-accent-security/10 rounded-full blur-3xl' />
      <div className='absolute bottom-0 right-1/3 w-80 h-80 bg-accent-security/5 rounded-full blur-3xl' />

      <div className='relative container mx-auto px-6'>
        <div className='max-w-4xl mx-auto text-center'>
          <h2 className='text-4xl md:text-5xl font-bold mb-6'>
            Ready to Work with the <span className='text-accent-security'>Best?</span>
          </h2>
          <p className='text-xl text-hero-muted leading-relaxed max-w-3xl mx-auto mb-12'>
            Join the select group of organisations who trust Hermes Security for their most critical
            cybersecurity needs. Experience the difference that comes from working with founders who
            truly love what they do.
          </p>

          {/* Value Propositions */}
          <div className='grid md:grid-cols-3 gap-8 mb-12'>
            <div className='text-center p-6'>
              <Shield className='h-12 w-12 text-accent-security mx-auto mb-4' />
              <h3 className='text-xl font-semibold mb-3'>50+ Years Experience</h3>
              <p className='text-hero-muted'>
                Decades of combined expertise in cybersecurity and emerging technologies.
              </p>
            </div>

            <div className='text-center p-6'>
              <Users className='h-12 w-12 text-accent-security mx-auto mb-4' />
              <h3 className='text-xl font-semibold mb-3'>Selective Partnership</h3>
              <p className='text-hero-muted'>
                We only work with clients who share our commitment to excellence and security.
              </p>
            </div>

            <div className='text-center p-6'>
              <ArrowRight className='h-12 w-12 text-accent-security mx-auto mb-4' />
              <h3 className='text-xl font-semibold mb-3'>Proven Results</h3>
              <p className='text-hero-muted'>
                Our success speaks in private results, not public noise.
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Button onClick={handleCTAClick} variant='hero' size='lg' className='group'>
              Start Your Security Journey
              <ArrowRight className='ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform' />
            </Button>
            <Button
              variant='outline-hero'
              size='lg'
              onClick={() => {
                const element = document.getElementById('destiny-philosophy');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Learn More About Our Philosophy
            </Button>
          </div>

          {/* Trust Statement */}
          <div className='mt-12 bg-hero-foreground/5 backdrop-blur-sm rounded-xl p-6 border border-hero-foreground/10'>
            <p className='text-hero-muted font-medium'>
              <strong>Remember:</strong> We're intentionally picky about who we work with. If you're
              selected, you'll experience cybersecurity at its finest—focused, tailored, and truly
              top-tier.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
