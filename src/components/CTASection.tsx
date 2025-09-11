import { Button } from '@/components/ui/button';
import { ArrowRight, Download, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { navigateToContact } from '@/utils/ctaNavigation';

const ctaOptions = [
  {
    icon: Calendar,
    title: 'Schedule a Discovery Call',
    description: 'Discuss your security needs with our experts',
    buttonText: 'Schedule a Discovery Call',
    variant: 'hero' as const,
    primary: true
  },
  {
    icon: Download,
    title: 'Start a Pen Test Today',
    description: 'Begin your security assessment immediately',
    buttonText: 'Start a Pen Test Today',
    variant: 'outline-hero' as const,
    primary: false
  }
];

export default function CTASection() {
  const navigate = useNavigate();

  const handleCTAClick = (ctaSource: string) => {
    navigateToContact(navigate, ctaSource);
  };

  return (
    <section className="py-24 bg-gradient-hero text-hero-foreground relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-security opacity-30" />
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-accent-security/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-accent-security/5 rounded-full blur-3xl" />

      <div className="relative container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Don't Wait for Your Next <span className="text-accent-security">Breach or Audit</span>
          </h2>
          <p className="text-xl text-hero-muted leading-relaxed max-w-3xl mx-auto">
            Join leading enterprises who trust Hermes Security for penetration testing with AI speed and human expertise.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {ctaOptions.map((cta, index) => (
            <div
              key={index}
              className={`group p-6 rounded-xl border transition-all duration-300 hover:-translate-y-1 ${
                cta.primary
                  ? 'bg-accent-security/10 border-accent-security/30 hover:bg-accent-security/20'
                  : 'bg-hero-foreground/5 border-hero-foreground/10 hover:bg-hero-foreground/10'
              }`}
            >
              <div className="w-12 h-12 bg-accent-security/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <cta.icon className="w-6 h-6 text-accent-security" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{cta.title}</h3>
              <p className="text-hero-muted mb-6 leading-relaxed">{cta.description}</p>
              <Button
                variant={cta.variant}
                className="w-full group"
                size="lg"
                onClick={() => handleCTAClick(cta.title)}
              >
                {cta.buttonText}
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          ))}
        </div>

        {/* Contact Information - Hidden */}
        {/* <div className="mt-16 text-center">
          <div className="max-w-2xl mx-auto p-6 bg-hero-foreground/5 backdrop-blur-sm rounded-xl border border-hero-foreground/10">
            <p className="text-hero-muted mb-2">Questions? Speak directly with our security experts</p>
            <p className="text-accent-security font-semibold">contact@hermessecurity.io | +44 (0) 20 7946 0958</p>
          </div>
        </div> */}
      </div>
    </section>
  );
}
