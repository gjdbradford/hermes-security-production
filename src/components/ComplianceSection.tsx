import { Shield, CheckCircle, Globe, FileText } from "lucide-react";

const complianceFeatures = [
  {
    icon: Shield,
    title: "GDPR Compliance",
    items: [
      "Data minimisation principles",
      "Lawful basis for testing established",
      "Data Processing Agreements (DPAs)",
      "EU data localisation options",
      "Right-to-audit cooperation"
    ]
  },
  {
    icon: CheckCircle,
    title: "SOC 2 Aligned",
    items: [
      "Change management processes",
      "Access control documentation",
      "Vulnerability management evidence",
      "Incident response protocols",
      "Audit-ready test artifacts"
    ]
  },
  {
    icon: FileText,
    title: "Procurement Ready",
    items: [
      "Professional indemnity insurance",
      "Background-checked security staff",
      "Secure client portals",
      "EU-only delivery model available",
      "Vendor risk assessment support"
    ]
  }
];

const certifications = [
  { name: "SOC 2 Type II", status: "Compliant" },
  { name: "GDPR", status: "By Design" },
  { name: "ISO 27001", status: "Aligned" },
  { name: "CREST", status: "Certified" }
];

export default function ComplianceSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-accent-security">Enterprise-Grade</span> Compliance
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Built for European buyers with strict regulatory requirements. 
              We understand the importance of compliance in security engagements.
            </p>
          </div>

          {/* Compliance Features */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {complianceFeatures.map((feature, index) => (
              <div 
                key={index}
                className="group p-6 bg-gradient-card rounded-xl border border-border/50 hover:shadow-card-custom transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-security rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6 text-accent-security" />
                </div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <ul className="space-y-2">
                  {feature.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-accent-security mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Certifications Bar */}
          <div className="bg-gradient-security rounded-xl p-8 border border-accent-security/20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Certifications & Standards</h3>
                <p className="text-muted-foreground">Maintaining the highest industry standards for security and compliance</p>
              </div>
              <div className="flex flex-wrap gap-4">
                {certifications.map((cert, index) => (
                  <div 
                    key={index}
                    className="px-4 py-2 bg-background/80 backdrop-blur-sm rounded-lg border border-border/30"
                  >
                    <div className="text-sm font-medium">{cert.name}</div>
                    <div className="text-xs text-accent-security">{cert.status}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}