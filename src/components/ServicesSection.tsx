import { Smartphone, Cloud, Network, Globe, Bot, Shield, Wifi, FileText, CheckCircle, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { renderBoldText } from "@/utils/textUtils";

const services = [
  {
    icon: Globe,
    title: "Web Application Pentest",
    description: "OWASP-aligned, exploit-led testing of custom and off-the-shelf apps.",
    benefit: "Prevent account takeover, data leaks, and business logic abuse."
  },
  {
    icon: Network,
    title: "API Pentest",
    description: "Assess authentication, shadow APIs, injection flaws, and broken object-level access.",
    benefit: "Protect the backbone of modern apps and stop data-level exposures."
  },
  {
    icon: Smartphone,
    title: "Mobile App Pentest",
    description: "iOS/Android security including API calls, storage, jailbreak/root detection.",
    benefit: "Safeguard customer data and brand reputation on mobile."
  },
  {
    icon: Cloud,
    title: "Cloud Pentest",
    description: "AWS, Azure, GCP misconfigurations, identity/permission abuse, exposed services.",
    benefit: "Reduce blast radius and lateral movement paths in the cloud."
  },
  {
    icon: Wifi,
    title: "Network Testing (External & Internal)",
    description: "Internet perimeter + lateral movement from inside.",
    benefit: "Understand what attackers see externally and validate internal segmentation controls."
  },
  {
    icon: Shield,
    title: "Vulnerability Scanning",
    description: "Continuous AI-powered asset discovery and vulnerability assessment.",
    benefit: "Maintain always-on visibility and catch issues before they escalate."
  },
  {
    icon: Bot,
    title: "AI/LLM",
    description: "Adversarial testing for LLMs, agents, and guardrails (prompt injection, data leakage, model abuse).",
    benefit: "Make AI features safe to deploy and meet rising stakeholder scrutiny."
  }
];

export default function ServicesSection() {
  const handleCTAClick = (ctaSource: string) => {
    console.log('🔘 Services CTA Button clicked:', ctaSource);
    // Use URL parameters instead of sessionStorage
    const contactUrl = `${window.location.origin}/contact?cta=${encodeURIComponent(ctaSource)}`;
    console.log('🧭 Navigating to:', contactUrl);
    window.location.href = contactUrl;
  };

  return (
    <section className="py-24 bg-hero text-hero-foreground">
      <div className="container mx-auto px-6">
        {/* Services */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-accent-security">Services</span>
            </h2>
            <p id="services" className="text-xl text-hero-muted leading-relaxed max-w-3xl mx-auto">
              Comprehensive penetration testing tailored to your stack, with clear outcomes you can act on.
            </p>
            <p className="text-lg text-accent-security font-semibold mt-4">
              Core PTaaS Services
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {services.map((service, index) => (
              <div 
                key={index}
                className="p-6 bg-hero-foreground/5 backdrop-blur-sm rounded-xl border border-hero-foreground/10 hover:bg-hero-foreground/10 transition-all duration-300 group"
              >
                <div className="w-10 h-10 bg-accent-security/20 rounded-lg flex items-center justify-center mb-4">
                  <service.icon className="w-5 h-5 text-accent-security" />
                </div>
                <h3 className="text-lg font-semibold mb-3">{service.title}</h3>
                <p className="text-hero-muted text-sm mb-4 leading-relaxed">{service.description}</p>
                <div className="pt-3 border-t border-hero-foreground/10">
                  <p className="text-xs font-medium text-accent-security">Benefit: {service.benefit}</p>
                </div>
              </div>
            ))}
          </div>

          {/* What You Get Every Time */}
          <div className="mt-16 p-8 bg-hero-foreground/5 backdrop-blur-sm rounded-xl border border-hero-foreground/10">
            <h3 className="text-2xl font-bold text-center mb-6">What You Get Every Time</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-accent-security/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Target className="w-6 h-6 text-accent-security" />
                </div>
                <p className="text-sm text-hero-muted">Prioritised reporting by exploitability × impact</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-accent-security/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-6 h-6 text-accent-security" />
                </div>
                <p className="text-sm text-hero-muted">Clear remediation guidance for engineers</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-accent-security/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-accent-security" />
                </div>
                <p className="text-sm text-hero-muted">Re-test validation to confirm fixes</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-accent-security/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-accent-security" />
                </div>
                <p className="text-sm text-hero-muted">Aligned with OWASP, NIST, ISO 27001, PCI DSS, and SOC 2</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button 
              variant="hero" 
              size="lg" 
              className="group"
              onClick={() => handleCTAClick("Book Your Security Assessment Today")}
            >
              Book Your Security Assessment Today
              <Target className="ml-2 w-4 h-4 transition-transform group-hover:rotate-12" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}