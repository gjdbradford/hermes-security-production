import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Building2, Shield, Globe, Heart, Monitor, Users, ArrowUpRight } from "lucide-react";
import { TriggerHandlers } from "@/utils/crispTriggers";
import OptimizedImage from "@/components/ui/optimized-image";
import { IMAGE_PATHS } from "@/utils/imageUtils";

// Case study data
const caseStudies = [
  {
    slug: "tier1-uk-bank-api-hardening",
    label: "Tier-1 UK Bank",
    sector_badge: "Banking",
    region_badge: "EU/UK",
    headline_metric: "12 criticals fixed in 14 days",
    subhead: "Shadow APIs and weak authentication were exposing sensitive PII. Hermes mapped and safely exploited these flaws, guiding the bank to rapid hardening.",
    bullets: [
      "Impact: MTTR cut from 41 days → 16 days",
      "Key Fixes: BOLA and token scope flaws chained to data access; exploit-led proof with safe re-test validation",
      "Services Used: API & Web App Pentest",
      "Compliance: GDPR, SOC 2"
    ],
    services_used: ["API Pentest", "Web App Pentest"],
    compliance_flags: ["GDPR", "SOC 2"],
    logo_url: null,
    hero_image_url: IMAGE_PATHS.caseStudies.apiAttackPath(),
    alt_text: "API attack path snapshot",
    primary_cta: { label: "Read the case", url: "#" },
    source_urls: []
  },
  {
    slug: "eu-insurer-cloud-segmentation",
    label: "EU Insurer",
    sector_badge: "Insurance",
    region_badge: "EU",
    headline_metric: "Blast radius reduced by 78%",
    subhead: "AWS misconfigurations enabled lateral movement across cloud assets. Hermes exposed the attack paths and redesigned IAM policies with least-privilege principles.",
    bullets: [
      "Impact: Lateral movement risk ↓78%",
      "Key Fixes: IAM escalation closed, egress & segmentation validated, DORA audit runbooks updated",
      "Services Used: Cloud & Network Pentest",
      "Compliance: DORA, SOC 2"
    ],
    services_used: ["Cloud Pentest", "Network Pentest"],
    compliance_flags: ["DORA", "SOC 2"],
    logo_url: null,
    hero_image_url: IMAGE_PATHS.caseStudies.cloudLateralMovement(),
    alt_text: "Cloud lateral movement diagram",
    primary_cta: { label: "Read the case", url: "#" },
    source_urls: []
  },
  {
    slug: "healthcare-mobile-app-security",
    label: "Healthcare Provider",
    sector_badge: "Healthcare",
    region_badge: "EU",
    headline_metric: "Patient data exposure ↓95%",
    subhead: "A mobile app was leaking data through insecure storage and weak APIs, risking HIPAA violations. Hermes secured client-side controls and hardened API endpoints.",
    bullets: [
      "Impact: Exposure risk reduced by 95%",
      "Key Fixes: Client-side vulnerabilities fixed, encryption enforced, authentication hardened",
      "Services Used: Mobile App & API Pentest",
      "Compliance: HIPAA, GDPR"
    ],
    services_used: ["Mobile App Pentest", "API Pentest"],
    compliance_flags: ["HIPAA", "GDPR"],
    logo_url: null,
    hero_image_url: IMAGE_PATHS.caseStudies.mobileSecurity(),
    alt_text: "Mobile security assessment",
    primary_cta: { label: "Read the case", url: "#" },
    source_urls: []
  },
  {
    slug: "saas-platform-web-security",
    label: "SaaS Platform",
    sector_badge: "SaaS",
    region_badge: "Global",
    headline_metric: "Zero criticals in 30 days",
    subhead: "Critical vulnerabilities in a core web app threatened customer data. Hermes identified and guided remediation of all issues within one month.",
    bullets: [
      "Impact: Zero critical vulnerabilities in production within 30 days",
      "Key Fixes: SQL injection & XSS eliminated, authentication bypass closed",
      "Services Used: Web App & API Pentest",
      "Compliance: SOC 2, GDPR"
    ],
    services_used: ["Web App Pentest", "API Pentest"],
    compliance_flags: ["SOC 2", "GDPR"],
    logo_url: null,
    hero_image_url: IMAGE_PATHS.caseStudies.webSecurity(),
    alt_text: "Web application security",
    primary_cta: { label: "Read the case", url: "#" },
    source_urls: []
  }
];

// Sector icons mapping
const sectorIcons = {
  Banking: Building2,
  Insurance: Shield,
  Healthcare: Heart,
  SaaS: Monitor,
  "Public Sector": Users,
  default: Globe
};

export default function CaseStudySection() {
  const [currentCase, setCurrentCase] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isAutoRotating, setIsAutoRotating] = useState(true);

  // Performance optimization: Memoize current case data
  const currentCaseData = useMemo(() => caseStudies[currentCase], [currentCase]);

  const handleCaseChange = useCallback((newIndex: number) => {
    if (isTransitioning || newIndex === currentCase) return;
    
    setIsTransitioning(true);
    
    // Fade out current content
    setTimeout(() => {
      setCurrentCase(newIndex);
      setIsTransitioning(false);
    }, 300);
  }, [isTransitioning, currentCase]);

  // Auto-rotation effect
  useEffect(() => {
    if (!isAutoRotating) return;
    
    const interval = setInterval(() => {
      handleCaseChange((currentCase + 1) % caseStudies.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [currentCase, isAutoRotating, handleCaseChange]);

  const handleManualChange = (index: number) => {
    setIsAutoRotating(false);
    handleCaseChange(index);
    
    // Resume auto-rotation after 10 seconds
    setTimeout(() => setIsAutoRotating(true), 10000);
  };

  const SectorIcon = sectorIcons[currentCaseData.sector_badge as keyof typeof sectorIcons] || sectorIcons.default;

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              From <span className="text-accent-security">pentest to proof</span>
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Every engagement with Hermes produces board-ready reports, verified fixes, and compliance evidence you can trust.
            </p>
          </div>

          {/* Case Study Card */}
          <div className="relative">
            <Card className="overflow-hidden border-0 shadow-lg">
              <CardContent className="p-0">
                <div 
                  className={`transition-all duration-300 ${
                    isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
                  }`}
                  onMouseEnter={() => setIsAutoRotating(false)}
                  onMouseLeave={() => setIsAutoRotating(true)}
                >
                  {/* Header with badges and metrics */}
                  <div className="bg-gradient-to-r from-accent-security/10 to-accent-security/5 p-8 border-b border-border/50">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="flex items-center gap-2">
                            <SectorIcon className="w-5 h-5 text-accent-security" />
                            <Badge variant="secondary" className="bg-accent-security/10 text-accent-security border-accent-security/20">
                              {currentCaseData.sector_badge}
                            </Badge>
                          </div>
                          <Badge variant="outline" className="border-border/50">
                            {currentCaseData.region_badge}
                          </Badge>
                        </div>
                        
                        <h3 className="text-2xl font-bold mb-2">{currentCaseData.label}</h3>
                        <div className="text-3xl font-bold text-accent-security mb-3">
                          {currentCaseData.headline_metric}
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                          {currentCaseData.subhead}
                        </p>
                      </div>
                      
                      <div className="lg:text-right">
                        {/* Primary CTA Button - Hidden */}
                        {/* <Button 
                          onClick={TriggerHandlers.contactForm}
                          className="bg-accent-security hover:bg-accent-security/90 text-accent-security-foreground"
                        >
                          {currentCaseData.primary_cta.label}
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Button> */}
                      </div>
                    </div>
                  </div>

                  {/* Case Study Image - Hidden */}
                  {/* <div className="px-8 py-6">
                    <OptimizedImage
                      src={currentCaseData.hero_image_url}
                      alt={currentCaseData.alt_text}
                      className="w-full h-64 object-cover rounded-lg shadow-md"
                      fallback={IMAGE_PATHS.placeholder()}
                    />
                  </div> */}

                  {/* Content */}
                  <div className="p-8">
                    <div className="grid lg:grid-cols-2 gap-8">
                      {/* Key Highlights */}
                      <div>
                        <h4 className="font-semibold text-lg mb-4">Key Highlights</h4>
                        <ul className="space-y-3">
                          {currentCaseData.bullets.map((bullet, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <div className="w-2 h-2 bg-accent-security rounded-full mt-2 flex-shrink-0" />
                              <span className="text-muted-foreground">{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Services and Compliance */}
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-semibold text-lg mb-4">Services Used</h4>
                          <div className="flex flex-wrap gap-2">
                            {currentCaseData.services_used.map((service, index) => (
                              <Badge key={index} variant="outline" className="border-accent-security/20 text-accent-security">
                                {service}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-lg mb-4">Compliance & Standards</h4>
                          <div className="flex flex-wrap gap-2">
                            {currentCaseData.compliance_flags.map((flag, index) => (
                              <Badge key={index} variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                                {flag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Navigation Dots */}
            <div className="flex justify-center mt-8">
              <div className="flex gap-3">
                {caseStudies.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleManualChange(index)}
                    className={`relative w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 ${
                      index === currentCase 
                        ? 'bg-accent-security scale-125' 
                        : 'bg-muted hover:bg-muted-foreground/50'
                    }`}
                    aria-label={`Go to case study ${index + 1} of ${caseStudies.length}`}
                  >
                    {index === currentCase && (
                      <div 
                        className="absolute inset-0 rounded-full bg-accent-security/30 animate-pulse"
                        style={{ animation: isAutoRotating ? 'pulse 8s linear infinite' : 'none' }}
                        aria-hidden="true"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Auto-rotation control */}
            <div className="text-center mt-4">
              <button
                onClick={() => setIsAutoRotating(!isAutoRotating)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                aria-label={isAutoRotating ? 'Pause auto-rotation' : 'Resume auto-rotation'}
              >
                {isAutoRotating ? '⏸️ Pause' : '▶️ Resume'} auto-rotation
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
