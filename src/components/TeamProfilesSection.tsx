import { Linkedin, Award, Shield, Target } from 'lucide-react';
import { getAssetUrl } from '@/config/assets';

export default function TeamProfilesSection() {
  return (
    <section id='team-profiles' className='py-24 bg-hero text-hero-foreground'>
      <div className='container mx-auto px-6'>
        <div className='max-w-6xl mx-auto'>
          {/* Section Header */}
          <div className='text-center mb-16'>
            <h2 className='text-3xl md:text-4xl font-bold mb-6'>
              Meet the <span className='text-accent-security'>Founders</span>
            </h2>
            <p className='text-xl text-hero-muted max-w-3xl mx-auto'>
              The visionaries behind Hermes Security, combining decades of experience with a shared
              philosophy of excellence and integrity.
            </p>
          </div>

          {/* Team Profiles */}
          <div className='grid lg:grid-cols-2 gap-12'>
            {/* Graham Profile */}
            <div className='bg-hero-foreground/5 backdrop-blur-sm rounded-2xl p-8 border border-hero-foreground/10'>
              <div className='text-center mb-8'>
                {/* Graham's Profile Image */}
                <div className='w-32 h-32 rounded-full mx-auto mb-6 overflow-hidden border-4 border-accent-security/20'>
                  <img
                    src={getAssetUrl('profile-graham')}
                    alt='Graham John - Co-Founder & CEO'
                    className='w-full h-full object-cover'
                  />
                </div>
                <h3 className='text-2xl font-bold mb-2'>Graham John</h3>
                <p className='text-accent-security font-semibold mb-4'>Co-Founder & CEO</p>

                {/* LinkedIn Link */}
                <a
                  href='https://www.linkedin.com/in/graham-john-8b6982396/'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex items-center gap-2 text-hero-muted hover:text-accent-security transition-colors'
                >
                  <Linkedin className='h-5 w-5' />
                  <span>Connect on LinkedIn</span>
                </a>
              </div>

              {/* Bio */}
              <div className='mb-8'>
                <h4 className='text-lg font-semibold mb-4 flex items-center gap-2'>
                  <Shield className='h-5 w-5 text-accent-security' />
                  About Graham
                </h4>
                <p className='text-hero-muted leading-relaxed'>
                  Graham brings over 25 years of cybersecurity experience to Hermes Security. His
                  journey began in the trenches of enterprise security, where he developed a deep
                  understanding of both the technical and business aspects of cybersecurity.
                  Graham's philosophy centers on building a safer digital world for future
                  generations, combining technical expertise with strategic vision.
                </p>
              </div>

              {/* Qualifications */}
              <div className='mb-8'>
                <h4 className='text-lg font-semibold mb-4 flex items-center gap-2'>
                  <Award className='h-5 w-5 text-accent-security' />
                  Qualifications & Experience
                </h4>
                <ul className='space-y-2 text-hero-muted'>
                  <li className='flex items-center gap-2'>
                    <Target className='h-4 w-4 text-accent-security' />
                    <span>25+ years in cybersecurity leadership</span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Target className='h-4 w-4 text-accent-security' />
                    <span>Enterprise security architecture expertise</span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Target className='h-4 w-4 text-accent-security' />
                    <span>Strategic cybersecurity consulting</span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Target className='h-4 w-4 text-accent-security' />
                    <span>AI and emerging technology security</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Artem Profile */}
            <div className='bg-hero-foreground/5 backdrop-blur-sm rounded-2xl p-8 border border-hero-foreground/10'>
              <div className='text-center mb-8'>
                {/* Artem's Profile Image */}
                <div className='w-32 h-32 rounded-full mx-auto mb-6 overflow-hidden border-4 border-accent-security/20'>
                  <img
                    src={getAssetUrl('profile-artem')}
                    alt='Artem - Co-Founder & CTO'
                    className='w-full h-full object-cover'
                  />
                </div>
                <h3 className='text-2xl font-bold mb-2'>Artem</h3>
                <p className='text-accent-security font-semibold mb-4'>Co-Founder & CTO</p>

                {/* LinkedIn Link */}
                <a
                  href='https://www.linkedin.com/in/artem-pasechnik/'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex items-center gap-2 text-hero-muted hover:text-accent-security transition-colors'
                >
                  <Linkedin className='h-5 w-5' />
                  <span>Connect on LinkedIn</span>
                </a>
              </div>

              {/* Bio */}
              <div className='mb-8'>
                <h4 className='text-lg font-semibold mb-4 flex items-center gap-2'>
                  <Shield className='h-5 w-5 text-accent-security' />
                  About Artem
                </h4>
                <p className='text-hero-muted leading-relaxed'>
                  Artem is a technical visionary with over 25 years of experience in cybersecurity
                  and emerging technologies. His expertise spans from traditional penetration
                  testing to cutting-edge AI security challenges. Artem's approach combines deep
                  technical knowledge with innovative thinking, always pushing the boundaries of
                  what's possible in cybersecurity defence.
                </p>
              </div>

              {/* Qualifications */}
              <div className='mb-8'>
                <h4 className='text-lg font-semibold mb-4 flex items-center gap-2'>
                  <Award className='h-5 w-5 text-accent-security' />
                  Qualifications & Experience
                </h4>
                <ul className='space-y-2 text-hero-muted'>
                  <li className='flex items-center gap-2'>
                    <Target className='h-4 w-4 text-accent-security' />
                    <span>25+ years in technical cybersecurity</span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Target className='h-4 w-4 text-accent-security' />
                    <span>AI and machine learning security expert</span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Target className='h-4 w-4 text-accent-security' />
                    <span>Advanced penetration testing specialist</span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Target className='h-4 w-4 text-accent-security' />
                    <span>Emerging technology security research</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Combined Experience Summary */}
          <div className='mt-16 bg-gradient-to-r from-accent-security/10 to-accent-security/5 rounded-2xl p-8 border border-accent-security/20'>
            <div className='text-center'>
              <h3 className='text-2xl font-bold mb-4'>
                <span className='text-accent-security'>50+ Years</span> of Combined Experience
              </h3>
              <p className='text-lg text-hero-muted max-w-3xl mx-auto'>
                Together, Graham and Artem bring over five decades of cybersecurity expertise,
                combining strategic vision with technical innovation to deliver unparalleled
                security solutions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
