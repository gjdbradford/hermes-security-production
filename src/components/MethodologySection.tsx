import { Play, Search, Target, ListOrdered } from 'lucide-react';

const stages = [
  {
    icon: Play,
    title: 'Initiate',
    subtitle: 'Define scope, rules, and environment',
    description: 'We align with your business objectives, set clear rules of engagement, and prepare safe test environments.',
    details: ['Faster starts, safe testing, clean audit trail'],
    benefit: 'Faster starts, reduced operational risk, and a clean audit trail for compliance.'
  },
  {
    icon: Search,
    title: 'Discover',
    subtitle: 'Automated + manual asset mapping',
    description: 'Automated asset discovery combined with targeted manual reconnaissance reveals hidden exposures.',
    details: ['Complete visibility of your attack surface'],
    benefit: 'Complete visibility of your digital footprint with no blind spots left behind.'
  },
  {
    icon: Target,
    title: 'Attack',
    subtitle: 'AI-assisted exploitation with human oversight',
    description: 'AI-assisted exploitation safely chains misconfigurations and flaws, while human experts control depth and safety.',
    details: ['Proof of real-world impact, not just theoretical flaws'],
    benefit: 'Proof of real-world impact, not just theoretical scanner findings.'
  },
  {
    icon: ListOrdered,
    title: 'Prioritise',
    subtitle: 'Actionable reporting & re-testing',
    description: 'We score vulnerabilities by exploitability × business impact and deliver clear executive + engineering reports, followed by fix validation.',
    details: ['Fix what matters most first, validate improvements'],
    benefit: 'Maximum ROI on remediation, validated improvements you can trust.'
  }
];

export default function MethodologySection() {
  return (
    <section className="py-24 bg-hero text-hero-foreground">
      <div className="container mx-auto px-6">
        {/* Methodology */}
        <div id="methodology" className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Our <span className="text-accent-security">Methodology</span>
            </h2>
            <p className="text-xl text-hero-muted leading-relaxed max-w-3xl mx-auto">
              A proven 4-step process that accelerates testing, strengthens compliance, and delivers maximum security ROI.
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
      </div>
    </section>
  );
}
