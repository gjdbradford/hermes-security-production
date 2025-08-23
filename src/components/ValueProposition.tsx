import { Brain, FileText, Shield, Globe } from "lucide-react";

const values = [
  {
    icon: Brain,
    title: "AI speed, human judgement",
    description: "AI accelerates reconnaissance and exploitation paths; ethical researchers supervise, validate, and document every finding."
  },
  {
    icon: FileText,
    title: "Enterprise-ready reporting",
    description: "Board and regulator-friendly outputs: risk narratives, proof-of-exploit, fix-verification, and prioritised remediation — not just scanner noise."
  },
  {
    icon: Shield,
    title: "AI/LLM coverage",
    description: "Go beyond classic apps: AI Red Teaming for LLM apps, agents, and guardrails — addressing a fast-rising risk area."
  },
  {
    icon: Globe,
    title: "European compliance DNA",
    description: "GDPR principles by design (data minimisation, DPAs, EU hosting options), SOC 2-aligned processes for third-party assurance."
  }
];

export default function ValueProposition() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Why <span className="text-accent-security">Hermes Security</span>
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            The perfect balance between automated efficiency and human expertise. 
            Built for enterprise security teams who demand both speed and reliability.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div 
              key={index}
              className="group p-6 bg-gradient-card rounded-xl border border-border/50 hover:shadow-card-custom transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-gradient-security rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <value.icon className="w-6 h-6 text-accent-security" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}