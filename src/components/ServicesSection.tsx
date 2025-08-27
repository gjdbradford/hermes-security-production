import { Play, Search, Target, ListOrdered, Smartphone, Cloud, Network, Globe, Bot, Shield, Wifi, Building } from "lucide-react";
import { Button } from "@/components/ui/button";

const stages = [
  {
    icon: Play,
    title: "Initiate",
    subtitle: "set the stage",
    description: "Scoping & rules of engagement (asset catalogues, data handling, lawful basis, DPA where required).",
    details: ["Safe AI enablement (controlled agent tooling, guardrails, logging)", "Access & environment readiness (cloud roles, test accounts, network paths)"],
    benefit: "Faster starts, lower operational risk, clean audit trail."
  },
  {
    icon: Search,
    title: "Discover",
    subtitle: "map the attack surface",
    description: "Automated asset discovery + targeted manual recon (subdomains, APIs, identities, cloud services).",
    details: ["AI-assisted enumeration to expand coverage", "Analysts curate and de-dupe"],
    benefit: "Complete visibility of your digital footprint."
  },
  {
    icon: Target,
    title: "Attack",
    subtitle: "validate what's real",
    description: "Web App, API, Mobile App, Cloud, Network Pentesting — exploit-led, not checklist-only.",
    details: ["AI-assisted chaining of misconfigs/bugs", "Human experts control exploitation depth and safety"],
    benefit: "Proof of actual impact, not theoretical vulnerabilities."
  },
  {
    icon: ListOrdered,
    title: "Prioritise",
    subtitle: "fix what matters",
    description: "Exploitability × Impact scoring, mapped to business services.",
    details: ["Executive & engineering reports", "Fix validation (re-test) and target-state hardening guidance"],
    benefit: "Clear roadmap for maximum security ROI."
  }
];

const services = [
  {
    icon: Globe,
    title: "Web Application Pentest",
    description: "OWASP-aligned, exploit-led testing of custom and off-the-shelf apps.",
    benefit: "Prevent account takeover, data exfiltration, and business logic abuse."
  },
  {
    icon: Network,
    title: "API Pentest",
    description: "Discovery of shadow/undocumented APIs, auth flaws, injection, and broken object-level access.",
    benefit: "Protect the backbone of your modern apps; stop data-level exposures."
  },
  {
    icon: Smartphone,
    title: "Mobile App Pentest",
    description: "Client-side controls, API calls, storage, jailbreak/root detection, transport security.",
    benefit: "Safeguard customers and brand on iOS/Android."
  },
  {
    icon: Cloud,
    title: "Cloud Pentest",
    description: "IaC review, misconfig chaining, identity/permissions abuse, exposed services across AWS/Azure/GCP.",
    benefit: "Reduce blast radius and lateral-movement paths."
  },
  {
    icon: Shield,
    title: "Vulnerability Scanning",
    description: "AI-powered continuous asset discovery and vulnerability assessment across your entire digital estate — automated scanning with smart prioritization and false positive reduction.",
    benefit: "Maintain continuous visibility into your security posture; catch issues before they become critical exposures."
  },
  {
    icon: Wifi,
    title: "External Network Testing",
    description: "Internet-facing perimeter assessment — public services, firewall rules, exposed assets, and attack paths from outside your organization.",
    benefit: "Understand what attackers see from the internet; reduce your external attack surface."
  },
  {
    icon: Building,
    title: "Internal Network Testing",
    description: "Lateral movement simulation from compromised endpoints — domain privilege escalation, network segmentation testing, and internal service vulnerabilities.",
    benefit: "Contain breaches by validating internal defenses; prevent attackers from moving freely inside your network."
  },
  {
    icon: Bot,
    title: "AI Red Teaming",
    description: "Adversarial testing for LLMs/agents/guardrails (prompt injection, data leakage, model abuse, jailbreaks).",
    benefit: "Make AI features safe to ship; meet rising stakeholder scrutiny."
  }
];

export default function ServicesSection() {
  return (
    <section className="py-24 bg-hero text-hero-foreground">
      <div className="container mx-auto px-6">
        {/* Methodology */}
        <div id="methodology" className="max-w-6xl mx-auto mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Our <span className="text-accent-security">Methodology</span>
            </h2>
            <p className="text-xl text-hero-muted leading-relaxed max-w-3xl mx-auto">
              Organised around your security lifecycle: Deploy · Discover · Attack · Prioritise
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stages.map((stage, index) => (
              <div 
                key={index}
                className="group p-6 bg-hero-foreground/5 backdrop-blur-sm rounded-xl border border-hero-foreground/10 hover:bg-hero-foreground/10 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-accent-security/20 rounded-lg flex items-center justify-center mb-4">
                  <stage.icon className="w-6 h-6 text-accent-security" />
                </div>
                <h3 className="text-xl font-semibold mb-1">{stage.title}</h3>
                <p className="text-accent-security text-sm font-medium mb-3">{stage.subtitle}</p>
                <p className="text-hero-muted text-sm mb-4 leading-relaxed">{stage.description}</p>
                <div className="text-xs text-hero-muted/80 space-y-1 mb-4">
                  {stage.details.map((detail, i) => (
                    <p key={i}>• {detail}</p>
                  ))}
                </div>
                <div className="pt-3 border-t border-hero-foreground/10">
                  <p className="text-xs font-medium text-accent-security">Benefit: {stage.benefit}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Services */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Service <span className="text-accent-security">Catalogue</span>
            </h2>
            <p id="services" className="text-xl text-hero-muted leading-relaxed max-w-3xl mx-auto">
              Comprehensive security testing across your entire technology stack
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

          <div className="text-center">
            <Button variant="hero" size="lg" className="group">
              Get Started with Hermes Security
              <Target className="ml-2 w-4 h-4 transition-transform group-hover:rotate-12" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}