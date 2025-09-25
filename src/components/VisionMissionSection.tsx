import { Eye, Target, Globe, Shield } from 'lucide-react';
import { getImagePath } from '@/utils/imageUtils';

const visionMissionData = [
  {
    icon: Eye,
    title: 'Our Vision',
    content:
      'A world where AI serves humanity, not threatens it. We envision a digital landscape where technology amplifies human potential while maintaining the highest standards of security and ethics.',
    highlight: 'AI for humanity',
  },
  {
    icon: Target,
    title: 'Our Mission',
    content:
      'To be the shield that protects the digital realm, ensuring technology remains a force for good. We combine AI speed with human wisdom to create unstoppable protection against emerging threats.',
    highlight: 'Protecting the digital realm',
  },
  {
    icon: Globe,
    title: 'Why It Matters',
    content:
      "In today's interconnected world, the security of one organization affects us all. AI threats don't discriminate - they target any vulnerability they can find. Our work protects not just our clients, but the entire digital ecosystem.",
    highlight: 'Security for all',
  },
];

export default function VisionMissionSection() {
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
      <div className='absolute inset-0 bg-hero/90 backdrop-blur-sm' aria-hidden='true' />

      {/* Enhanced Background Effects */}
      <div className='absolute inset-0 bg-gradient-security opacity-40' aria-hidden='true' />

      {/* Content */}
      <div className='relative container mx-auto px-6'>
        <div className='max-w-6xl mx-auto'>
          {/* Header */}
          <div className='text-center mb-16'>
            <h2 className='text-4xl md:text-5xl font-bold mb-6'>
              Vision & <span className='text-accent-security'>Mission</span>
            </h2>
            <p className='text-xl text-hero-muted leading-relaxed max-w-3xl mx-auto'>
              Our purpose is clear: to ensure technology remains a force for good in an increasingly
              complex digital world.
            </p>
          </div>

          {/* Vision Mission Cards */}
          <div className='grid md:grid-cols-3 gap-8 mb-16'>
            {visionMissionData.map((item, index) => (
              <div
                key={index}
                className='group p-8 bg-hero-foreground/10 backdrop-blur-sm rounded-2xl border border-hero-foreground/20 hover:bg-hero-foreground/20 transition-all duration-300 hover:-translate-y-2'
              >
                {/* Icon */}
                <div className='w-16 h-16 bg-accent-security/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300'>
                  <item.icon className='w-8 h-8 text-accent-security' />
                </div>

                {/* Title */}
                <h3 className='text-2xl font-bold mb-4 text-hero-foreground'>{item.title}</h3>

                {/* Content */}
                <p className='text-hero-muted text-lg leading-relaxed mb-6'>{item.content}</p>

                {/* Highlight */}
                <div className='inline-block bg-accent-security/20 text-accent-security font-semibold px-4 py-2 rounded-lg text-sm'>
                  {item.highlight}
                </div>
              </div>
            ))}
          </div>

          {/* Core Belief Statement */}
          <div className='text-center'>
            <div className='bg-hero-foreground/10 backdrop-blur-sm border border-hero-foreground/20 rounded-2xl p-12 max-w-4xl mx-auto'>
              <div className='w-20 h-20 bg-accent-security/20 rounded-full flex items-center justify-center mx-auto mb-8'>
                <Shield className='w-10 h-10 text-accent-security' />
              </div>

              <h3 className='text-3xl font-bold mb-6 text-hero-foreground'>Our Core Belief</h3>

              <p className='text-xl text-hero-muted leading-relaxed mb-8'>
                Technology should empower humanity, not endanger it. Every line of code we write,
                every security measure we implement, and every threat we neutralize is guided by
                this fundamental principle.
              </p>

              <div className='inline-block bg-accent-security/20 text-accent-security font-bold px-6 py-3 rounded-lg text-lg'>
                "We stand for good. We fight for humanity. We protect the future."
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
