import { Users, Shield, Target, Zap } from 'lucide-react';

const storySteps = [
  {
    icon: Users,
    title: 'The Beginning',
    description:
      'Graham and Artem, two cybersecurity veterans with decades of combined experience, recognized a growing threat in the digital landscape. They saw AI being weaponized by malicious actors, creating unprecedented security challenges for organizations worldwide.',
    highlight: 'Two experts, one vision',
  },
  {
    icon: Shield,
    title: 'The Problem',
    description:
      'As AI technology advanced, so did its potential for harm. Traditional security approaches were becoming obsolete against AI-powered attacks. The digital world needed a new kind of defender - one that could match AI speed with human wisdom.',
    highlight: 'AI threats require AI solutions',
  },
  {
    icon: Target,
    title: 'The Solution',
    description:
      'Hermes Security was born from the belief that AI should serve humanity, not threaten it. By combining cutting-edge AI technology with deep human expertise and ethical principles, we created a new paradigm in cybersecurity.',
    highlight: 'AI + Human = Unstoppable protection',
  },
  {
    icon: Zap,
    title: 'The Mission',
    description:
      'Today, we stand as guardians of the digital realm, protecting organizations from AI threats while ensuring technology remains a force for good. Our mission is clear: defend the light in a world of digital darkness.',
    highlight: 'Protecting what matters most',
  },
];

export default function CompanyStorySection() {
  return (
    <section className='py-24 bg-background'>
      <div className='container mx-auto px-6'>
        <div className='max-w-6xl mx-auto'>
          {/* Header */}
          <div className='text-center mb-16'>
            <h2 className='text-4xl md:text-5xl font-bold mb-6'>
              Our <span className='text-accent-security'>Story</span>
            </h2>
            <p className='text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto'>
              From recognizing a threat to building a solution, this is how Hermes Security came to
              be the defender of the digital realm.
            </p>
          </div>

          {/* Story Steps */}
          <div className='grid md:grid-cols-2 gap-12'>
            {storySteps.map((step, index) => (
              <div key={index} className='group relative'>
                {/* Step Content */}
                <div className='p-8 bg-gradient-card rounded-2xl border border-border/50 hover:shadow-card-custom transition-all duration-300 h-full hover:-translate-y-2'>
                  {/* Icon */}
                  <div className='w-16 h-16 bg-accent-security/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300'>
                    <step.icon className='w-8 h-8 text-accent-security' />
                  </div>

                  {/* Title */}
                  <h3 className='text-2xl font-bold mb-4 text-foreground'>{step.title}</h3>

                  {/* Description */}
                  <p className='text-muted-foreground text-lg leading-relaxed mb-6'>
                    {step.description}
                  </p>

                  {/* Highlight */}
                  <div className='inline-block bg-accent-security/10 text-accent-security font-semibold px-4 py-2 rounded-lg text-sm'>
                    {step.highlight}
                  </div>
                </div>

                {/* Connecting Line (except for last item) */}
                {index < storySteps.length - 1 && (
                  <div className='hidden md:block absolute top-1/2 -right-6 w-12 h-px bg-accent-security/30 transform -translate-y-1/2 z-0' />
                )}
              </div>
            ))}
          </div>

          {/* Founding Quote */}
          <div className='mt-20 text-center'>
            <div className='bg-gradient-security/10 border border-accent-security/30 rounded-2xl p-12 max-w-4xl mx-auto'>
              <blockquote className='text-2xl md:text-3xl font-medium text-foreground mb-6 leading-relaxed'>
                "We didn't just see a problem - we saw an opportunity to make the digital world
                safer for everyone. AI can be humanity's greatest tool or its greatest threat. We
                choose to make it the former."
              </blockquote>
              <div className='flex items-center justify-center gap-4'>
                <div className='w-12 h-12 bg-accent-security/20 rounded-full flex items-center justify-center'>
                  <Users className='w-6 h-6 text-accent-security' />
                </div>
                <div className='text-left'>
                  <p className='font-semibold text-foreground'>Graham & Artem</p>
                  <p className='text-muted-foreground'>Co-Founders, Hermes Security</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
