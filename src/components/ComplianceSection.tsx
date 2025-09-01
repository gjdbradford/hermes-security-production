import { Shield, CheckCircle, Globe, FileText, TrendingUp, Target, Award, Users } from "lucide-react";
import { getImagePath } from "@/utils/imageUtils";

const resultFeatures = [
  {
    icon: TrendingUp,
    title: "Proven Risk Reduction",
    items: [
      "Measurable decrease in attack surface",
      "Validated vulnerability remediation",
      "Quantified security posture improvements",
      "Board-ready impact metrics"
    ]
  },
  {
    icon: Target,
    title: "Compliance Gains",
    items: [
      "SOC 2 Type II evidence collection",
      "GDPR compliance validation",
      "Regulatory audit readiness",
      "Stakeholder confidence building"
    ]
  },
  {
    icon: Award,
    title: "Tangible Outcomes",
    items: [
      "Actionable remediation roadmaps",
      "Validated security improvements",
      "Clear ROI measurement",
      "Ongoing security guidance"
    ]
  }
];

const impactMetrics = [
  { metric: "78%", label: "Average Risk Reduction" },
  { metric: "95%", label: "Vulnerability Fix Rate" },
  { metric: "30 Days", label: "Average Time to Zero Criticals" },
  { metric: "100%", label: "Compliance Readiness" }
];

export default function ComplianceSection() {
  return (
    <section className="relative py-24 bg-hero text-hero-foreground overflow-hidden">
      {/* Custom Background Image with Subtle Movement */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat animate-subtle-float"
        style={{
          backgroundImage: `url(${getImagePath('images/backgrounds/hero-bg.jpg')})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover'
        }}
        aria-hidden="true"
      />
      
      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-hero/80 backdrop-blur-sm" aria-hidden="true" />
      
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 bg-gradient-security opacity-30" aria-hidden="true" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-security/10 rounded-full blur-3xl animate-pulse-security" aria-hidden="true" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-security/5 rounded-full blur-3xl" aria-hidden="true" />
      
      <div className="relative container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              From <span className="text-accent-security">testing to tangible results</span>
            </h2>
            <p className="text-xl text-hero-muted leading-relaxed max-w-3xl mx-auto">
              Hermes delivers proven risk reduction and compliance gains from every engagement — turning vulnerabilities into measurable improvements in your security posture.
            </p>
          </div>

          {/* Result Features */}
          <div className="grid md:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto">
            {resultFeatures.filter((feature, index) => index !== 1).map((feature, index) => (
              <div 
                key={index}
                className="group p-6 bg-hero-foreground/5 backdrop-blur-sm rounded-xl border border-hero-foreground/10 hover:bg-hero-foreground/10 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-accent-security/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6 text-accent-security" />
                </div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <ul className="space-y-2">
                  {feature.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-hero-muted">
                      <CheckCircle className="w-4 h-4 text-accent-security mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Impact Metrics - Hidden */}
          {/* <div className="bg-gradient-security rounded-xl p-8 border border-accent-security/20">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold text-foreground mb-2">Real Impact Across Our Client Base</h3>
              <p className="text-muted-foreground">Measurable results from real engagements</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {impactMetrics.map((metric, index) => (
                <div 
                  key={index}
                  className="text-center p-4 bg-background/80 backdrop-blur-sm rounded-lg border border-border/30"
                >
                  <div className="text-3xl font-bold text-accent-security mb-1">{metric.metric}</div>
                  <div className="text-sm text-muted-foreground">{metric.label}</div>
                </div>
              ))}
            </div>
          </div> */}
        </div>
      </div>
    </section>
  );
}