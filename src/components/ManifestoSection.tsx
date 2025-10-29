import { Target, Zap } from 'lucide-react';
import { getImagePath } from '@/utils/imageUtils';

export default function ManifestoSection() {
  return (
    <section className='relative py-24 bg-hero text-hero-foreground overflow-hidden'>
      {/* Dark Background with Subtle Effects */}
      <div
        className='absolute inset-0 bg-cover bg-center bg-no-repeat'
        style={{
          backgroundImage: `url(${getImagePath('images/backgrounds/hero-bg.jpg')})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
        aria-hidden='true'
      />

      {/* Dark Overlay for Dramatic Effect */}
      <div className='absolute inset-0 bg-hero/95 backdrop-blur-sm' aria-hidden='true' />

      {/* Enhanced Dark Effects */}
      <div
        className='absolute inset-0 bg-gradient-to-b from-hero via-hero/98 to-black opacity-80'
        aria-hidden='true'
      />

      {/* Floating Security Icons */}
      <div
        className='absolute top-1/4 left-1/6 w-32 h-32 bg-accent-security/5 rounded-full blur-2xl animate-pulse'
        aria-hidden='true'
      />
      <div
        className='absolute bottom-1/4 right-1/6 w-40 h-40 bg-accent-security/5 rounded-full blur-2xl animate-pulse'
        style={{ animationDelay: '2s' }}
        aria-hidden='true'
      />
      <div
        className='absolute top-1/2 right-1/3 w-24 h-24 bg-accent-security/5 rounded-full blur-2xl animate-pulse'
        style={{ animationDelay: '4s' }}
        aria-hidden='true'
      />

      {/* Content */}
      <div className='relative container mx-auto px-6'>
        <div className='max-w-5xl mx-auto text-center'>
          {/* Manifesto Header */}
          <div className='mb-16'>
            <h2 className='text-5xl md:text-6xl font-bold mb-6'>
              The <span className='text-accent-security'>Hermes</span> Manifesto
            </h2>

            <p className='text-xl text-hero-muted leading-relaxed max-w-3xl mx-auto'>
              A declaration of our principles, our purpose, and our promise to humanity
            </p>
          </div>

          {/* Manifesto Content */}
          <div className='bg-hero-foreground/10 backdrop-blur-sm border border-accent-security/30 rounded-3xl p-12 md:p-16 mb-16'>
            <div className='space-y-8 text-lg md:text-xl leading-relaxed'>
              <p className='text-hero-muted'>
                In the digital age, where light and darkness battle for control of our future, we
                stand as defenders of the light. We are Hermes Security, and we refuse to let
                technology become humanity's downfall.
              </p>

              <p className='text-hero-muted'>
                <span className='text-accent-security font-semibold'>We believe</span> that
                artificial intelligence, like fire, can warm our homes or burn them down. We choose
                to be the guardians who ensure AI serves humanity, not destroys it.
              </p>

              <p className='text-hero-muted'>
                <span className='text-accent-security font-semibold'>We recognise</span> that in the
                wrong hands, technology becomes a weapon. We stand against those who would use AI to
                harm, exploit, or control others.
              </p>

              <p className='text-hero-muted'>
                <span className='text-accent-security font-semibold'>We commit</span> to combining
                the speed of machines with the wisdom of humans. To using AI as a shield, not a
                sword. To protecting what matters most.
              </p>

              <p className='text-hero-muted'>
                <span className='text-accent-security font-semibold'>We promise</span> to stay
                vigilant, to adapt, to innovate, and to never compromise our principles. To be the
                light that guides others through the digital darkness.
              </p>
            </div>
          </div>

          {/* Manifesto Signature */}
          <div className='space-y-6'>
            <div className='flex justify-center items-center gap-4 mb-8'>
              <div className='w-px h-16 bg-accent-security/30'></div>
              <div className='w-16 h-16 bg-accent-security/20 rounded-full flex items-center justify-center'>
                <Target className='w-8 h-8 text-accent-security' />
              </div>
              <div className='w-px h-16 bg-accent-security/30'></div>
            </div>

            <div className='text-2xl md:text-3xl font-bold text-accent-security mb-4'>
              We stand for good.
            </div>

            <div className='text-xl md:text-2xl font-semibold text-hero-foreground mb-4'>
              We fight for humanity.
            </div>

            <div className='text-lg md:text-xl text-hero-muted'>We protect the future.</div>
          </div>

          {/* Call to Action */}
          <div className='mt-16'>
            <div className='inline-flex items-center gap-3 bg-accent-security/20 text-accent-security font-semibold px-6 py-3 rounded-full border border-accent-security/30'>
              <Zap className='w-5 h-5' />
              <span>Join the fight for digital good</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
