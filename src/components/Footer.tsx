import {} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { navigateToContact } from '@/utils/ctaNavigation';
import OptimizedImage from '@/components/ui/optimized-image';
import { IMAGE_PATHS } from '@/utils/imageUtils';

const footerLinks = {
  services: [
    { name: 'Web App Pentest', href: '#' },
    { name: 'API Pentest', href: '#' },
    { name: 'Mobile App Pentest', href: '#' },
    { name: 'Cloud Pentest', href: '#' },
    { name: 'Network Pentest', href: '#' },
    { name: 'AI/LLM', href: '#' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Services', href: '#services', type: 'anchor' },
    { name: 'Methodology', href: '#methodology', type: 'anchor' },
    { name: 'Get In Touch', href: '/contact', type: 'contact' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Use', href: '/terms' },
  ],
};

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    const headerHeight = 80; // Approximate header height in pixels

    // Different offset values for different sections
    let offset = 110; // Default offset
    if (sectionId === 'methodology') {
      offset = 60; // Methodology section gets closer positioning
    }

    const elementPosition = element.offsetTop - headerHeight - offset;

    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth',
    });
  }
};

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (link: any) => {
    if (link.type === 'contact') {
      // Handle contact navigation using the CTA navigation utility
      navigateToContact(navigate, 'Get In Touch');
    } else if (link.type === 'anchor') {
      // Handle anchor navigation (Services, Methodology)
      const sectionId = link.href.replace('#', '');
      // If we're not on the homepage, navigate there first
      if (location.pathname !== '/') {
        navigate('/');
        // Wait for navigation to complete, then scroll to section
        setTimeout(() => {
          scrollToSection(sectionId);
        }, 100);
      } else {
        // If we're already on the homepage, just scroll to section
        scrollToSection(sectionId);
      }
    } else {
      // Handle regular route navigation (About Us, Privacy, Terms)
      navigate(link.href);
    }
  };

  return (
    <footer className='bg-hero text-hero-foreground'>
      <div className='container mx-auto px-6 py-16'>
        <div className='grid md:grid-cols-2 lg:grid-cols-5 gap-8'>
          {/* Company Info */}
          <div className='lg:col-span-2'>
            <div className='flex items-center gap-2 mb-4'>
              <OptimizedImage
                src={IMAGE_PATHS.favicon()}
                alt='Hermes Security'
                className='h-8 w-8 mt-1'
                loading='eager'
              />
              <span className='text-xl font-bold text-hero-foreground mt-0.5'>HERMES SECURITY</span>
            </div>
            <p className='text-hero-muted mb-6 leading-relaxed max-w-md'>
              AI-driven penetration testing with expert oversight — helping European enterprises
              reduce risk, prove compliance, and secure their digital assets with confidence.
            </p>
            {/* Contact Information - Hidden for now */}
            {/* <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-hero-muted">
                <Mail className="w-4 h-4" />
                contact@hermessecurity.io
              </div>
              <div className="flex items-center gap-2 text-hero-muted">
                <Phone className="w-4 h-4" />
                +44 (0) 20 7946 0958
              </div>
              <div className="flex items-center gap-2 text-hero-muted">
                <MapPin className="w-4 h-4" />
                London, UK | Amsterdam, NL
              </div>
            </div> */}
          </div>

          {/* Services */}
          <div>
            <h3 className='font-semibold mb-4'>Services</h3>
            <ul className='space-y-2 text-sm'>
              {footerLinks.services.map(link => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className='text-hero-muted hover:text-hero-foreground transition-colors'
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className='font-semibold mb-4'>Company</h3>
            <ul className='space-y-2 text-sm'>
              {footerLinks.company.map(link => (
                <li key={link.name}>
                  <button
                    onClick={() => handleNavigation(link)}
                    className='text-hero-muted hover:text-hero-foreground transition-colors text-left bg-transparent border-none cursor-pointer p-0'
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className='font-semibold mb-4'>Legal</h3>
            <ul className='space-y-2 text-sm'>
              {footerLinks.legal.map(link => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className='text-hero-muted hover:text-hero-foreground transition-colors'
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className='border-t border-hero-foreground/10 mt-12 pt-8'>
          <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
            <p className='text-sm text-hero-muted'>© 2024 Hermes Security. All rights reserved.</p>
            <div className='flex items-center gap-4 text-sm text-hero-muted'>
              <span>🇪🇺 EU-based security experts</span>
              <span>•</span>
              <span>AI + Human excellence</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
