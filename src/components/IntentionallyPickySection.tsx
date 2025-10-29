import { CheckCircle, Users, Shield } from 'lucide-react';

export default function IntentionallyPickySection() {
  return (
    <section className='py-24 bg-hero text-hero-foreground'>
      <div className='container mx-auto px-6'>
        <div className='max-w-4xl mx-auto'>
          {/* Section Header */}
          <div className='text-center mb-16'>
            <h2 className='text-3xl md:text-4xl font-bold mb-6'>
              <span className='text-accent-security'>Intentionally Picky</span>, Uniquely Focused
            </h2>
          </div>

          {/* Main Content */}
          <div className='prose prose-lg max-w-none mb-16'>
            <p className='text-xl text-hero-muted leading-relaxed mb-8'>
              With <strong>over 50 combined years of experience</strong> in the trenches, we've set
              out to build a company that isn't just good, but one that{' '}
              <strong>only the best want to partner with</strong>.
            </p>

            <p className='text-xl text-hero-muted leading-relaxed mb-8'>
              Our commitment to <strong>service level and attention to detail</strong> isn't a
              marketing line—it's the core of how we operate. And to maintain that quality?{' '}
              <strong>We're intentionally picky.</strong> We don't work with just anyone. By being
              selective about who we help, we ensure that every client receives the absolute best in{' '}
              <strong>Cyber Defence</strong>—focused, tailored, and truly top-tier.
            </p>
          </div>

          {/* Quality Principles */}
          <div className='grid md:grid-cols-3 gap-6'>
            <div className='text-center p-6'>
              <CheckCircle className='h-12 w-12 text-accent-security mx-auto mb-4' />
              <h3 className='text-xl font-semibold mb-3'>Service Level</h3>
              <p className='text-hero-muted'>
                Uncompromising commitment to the highest service standards in every engagement.
              </p>
            </div>

            <div className='text-center p-6'>
              <Users className='h-12 w-12 text-accent-security mx-auto mb-4' />
              <h3 className='text-xl font-semibold mb-3'>Attention to Detail</h3>
              <p className='text-hero-muted'>
                Every aspect of our work is executed with meticulous attention to detail and
                precision.
              </p>
            </div>

            <div className='text-center p-6'>
              <Shield className='h-12 w-12 text-accent-security mx-auto mb-4' />
              <h3 className='text-xl font-semibold mb-3'>Top-Tier Results</h3>
              <p className='text-hero-muted'>
                Focused, tailored, and truly top-tier cybersecurity solutions for every client.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
