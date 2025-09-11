import { Shield, Zap, Heart, Award, Users, Clock, CheckCircle } from 'lucide-react';
import { getImagePath } from '@/utils/imageUtils';

const reasons = [
  {
    icon: Shield,
    title: 'Decades of Combined Expertise',
    description:
      "Our team brings together over 50 years of combined cybersecurity experience. From Fortune 500 CISOs to offensive security specialists, we've seen every threat and developed every countermeasure.",
    highlight: '50+ years combined experience',
  },
  {
    icon: Zap,
    title: 'AI-Powered Innovation',
    description:
      "We don't just use AI - we pioneer it. Our proprietary AI systems detect threats faster, analyze vulnerabilities deeper, and provide insights that human analysts alone could never achieve.",
    highlight: 'Cutting-edge AI technology',
  },
  {
    icon: Heart,
    title: 'Unwavering Ethical Commitment',
    description:
      "Every security measure we implement, every threat we neutralize, is guided by our core principle: technology should serve humanity, not endanger it. We do what's right, not just what's profitable.",
    highlight: 'Ethics-first approach',
  },
  {
    icon: Award,
    title: 'Proven Track Record',
    description:
      "We've protected organizations from the smallest startups to the largest enterprises. Our clients trust us because we deliver results - measurable improvements in security posture and risk reduction.",
    highlight: 'Proven results',
  },
];

const metrics = [
  { number: '50+', label: 'Years Combined Experience' },
  { number: '100%', label: 'Ethical Commitment' },
  { number: '24/7', label: 'AI-Powered Monitoring' },
  { number: '99.9%', label: 'Client Satisfaction' },
];

export default function WhyChooseSection() {
  return (
    <section className='relative py-24 bg-hero text-hero-foreground overflow-hidden'>
      {/* Background Image with Overlay */}
      <div
        className='absolute inset-0 bg-cover bg-center bg-no-repeat'
        style={{
          backgroundImage: `url(${getImagePath('images/backgrounds/hero-bg.jpg')})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
        aria-hidden='true'
      />

      {/* Overlay for text readability */}
      <div className='absolute inset-0 bg-hero/85 backdrop-blur-sm' aria-hidden='true' />

      {/* Enhanced Background Effects */}
      <div className='absolute inset-0 bg-gradient-security opacity-40' aria-hidden='true' />

      {/* Content */}
      <div className='relative container mx-auto px-6'>
        <div className='max-w-6xl mx-auto'>
          {/* Header */}
          <div className='text-center mb-16'>
            <h2 className='text-4xl md:text-5xl font-bold mb-6'>
              Why Choose <span className='text-accent-security'>Hermes</span>
            </h2>
            <p className='text-xl text-hero-muted leading-relaxed max-w-3xl mx-auto'>
              In a world where security companies promise everything, we deliver what matters most:
              real protection, real results, and real peace of mind.
            </p>
          </div>

          {/* Reasons Grid */}
          <div className='grid md:grid-cols-2 gap-8 mb-16'>
            {reasons.map((reason, index) => (
              <div
                key={index}
                className='group p-8 bg-hero-foreground/10 backdrop-blur-sm rounded-2xl border border-hero-foreground/20 hover:bg-hero-foreground/20 transition-all duration-300 hover:-translate-y-2'
              >
                {/* Icon */}
                <div className='w-16 h-16 bg-accent-security/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300'>
                  <reason.icon className='w-8 h-8 text-accent-security' />
                </div>

                {/* Title */}
                <h3 className='text-2xl font-bold mb-4 text-hero-foreground'>{reason.title}</h3>

                {/* Description */}
                <p className='text-hero-muted text-lg leading-relaxed mb-6'>{reason.description}</p>

                {/* Highlight */}
                <div className='inline-block bg-accent-security/20 text-accent-security font-semibold px-4 py-2 rounded-lg text-sm'>
                  {reason.highlight}
                </div>
              </div>
            ))}
          </div>

          {/* Metrics Section */}
          <div className='text-center mb-16'>
            <div className='bg-hero-foreground/10 backdrop-blur-sm border border-hero-foreground/20 rounded-2xl p-12 max-w-4xl mx-auto'>
              <h3 className='text-3xl font-bold mb-8 text-hero-foreground'>
                The Numbers Don't Lie
              </h3>

              <div className='grid grid-cols-2 md:grid-cols-4 gap-8'>
                {metrics.map((metric, index) => (
                  <div key={index} className='text-center'>
                    <div className='text-4xl md:text-5xl font-bold text-accent-security mb-2'>
                      {metric.number}
                    </div>
                    <div className='text-hero-muted text-sm'>{metric.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className='text-center'>
            <div className='bg-hero-foreground/10 backdrop-blur-sm border border-hero-foreground/20 rounded-2xl p-12 max-w-4xl mx-auto'>
              <h3 className='text-3xl font-bold mb-8 text-hero-foreground'>
                Trusted by Organizations Worldwide
              </h3>

              <div className='grid md:grid-cols-3 gap-8'>
                <div className='text-center'>
                  <div className='w-16 h-16 bg-accent-security/20 rounded-full flex items-center justify-center mx-auto mb-4'>
                    <Users className='w-8 h-8 text-accent-security' />
                  </div>
                  <h4 className='text-xl font-semibold mb-2 text-hero-foreground'>
                    Enterprise Grade
                  </h4>
                  <p className='text-hero-muted'>
                    Trusted by Fortune 500 companies and government agencies
                  </p>
                </div>

                <div className='text-center'>
                  <div className='w-16 h-16 bg-accent-security/20 rounded-full flex items-center justify-center mx-auto mb-4'>
                    <Clock className='w-8 h-8 text-accent-security' />
                  </div>
                  <h4 className='text-xl font-semibold mb-2 text-hero-foreground'>
                    Always Available
                  </h4>
                  <p className='text-hero-muted'>
                    24/7 monitoring and support when you need it most
                  </p>
                </div>

                <div className='text-center'>
                  <div className='w-16 h-16 bg-accent-security/20 rounded-full flex items-center justify-center mx-auto mb-4'>
                    <CheckCircle className='w-8 h-8 text-accent-security' />
                  </div>
                  <h4 className='text-xl font-semibold mb-2 text-hero-foreground'>
                    Proven Results
                  </h4>
                  <p className='text-hero-muted'>
                    Measurable improvements in security posture and risk reduction
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
