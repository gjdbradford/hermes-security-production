import { Shield, Mail, Phone, MapPin } from "lucide-react";

const footerLinks = {
  services: [
    { name: 'Web App Pentest', href: '#' },
    { name: 'API Pentest', href: '#' },
    { name: 'Mobile App Pentest', href: '#' },
    { name: 'Cloud Pentest', href: '#' },
    { name: 'Network Pentest', href: '#' },
    { name: 'AI Red Teaming', href: '#' },
  ],
  company: [
    { name: 'About Us', href: '#' },
    { name: 'Methodology', href: '#' },
    { name: 'Compliance', href: '#' },
    { name: 'Careers', href: '#' },
    { name: 'Blog', href: '#' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
    { name: 'GDPR Compliance', href: '#' },
    { name: 'SOC 2 Report', href: '#' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-hero text-hero-foreground">
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-accent-security rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-accent-security-foreground" />
              </div>
              <span className="text-xl font-bold">Hermes Security</span>
            </div>
            <p className="text-hero-muted mb-6 leading-relaxed max-w-md">
              AI-driven penetration testing with human oversight. 
              Helping European enterprises secure their digital assets with speed, ethics, and compliance.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-hero-muted">
                <Mail className="w-4 h-4" />
                hello@hermessecurity.eu
              </div>
              <div className="flex items-center gap-2 text-hero-muted">
                <Phone className="w-4 h-4" />
                +44 (0) 20 7946 0958
              </div>
              <div className="flex items-center gap-2 text-hero-muted">
                <MapPin className="w-4 h-4" />
                London, UK | Amsterdam, NL
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-hero-muted hover:text-hero-foreground transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-hero-muted hover:text-hero-foreground transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal & Compliance</h3>
            <ul className="space-y-2 text-sm">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-hero-muted hover:text-hero-foreground transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-hero-foreground/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-hero-muted">
              © 2024 Hermes Security. All rights reserved. SOC 2 Type II certified, GDPR compliant.
            </p>
            <div className="flex items-center gap-4 text-sm text-hero-muted">
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