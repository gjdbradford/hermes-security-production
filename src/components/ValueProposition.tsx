import { Brain, FileText, Shield, Globe, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TriggerHandlers } from "@/utils/crispTriggers";

// Helper function to convert markdown-style bold text to JSX
const renderBoldText = (text: string) => {
  const parts = text.split(/\*\*(.*?)\*\*/);
  return parts.map((part, index) => {
    if (index % 2 === 1) {
      return <strong key={index}>{part}</strong>;
    }
    return part;
  });
};

const values = [
  {
    icon: Brain,
    title: "Faster Testing, Trusted Oversight",
    description: "AI accelerates reconnaissance and exploit chaining, while human researchers validate and control every finding, ensuring speed **without sacrificing accuracy or safety.**"
  },
  {
    icon: FileText,
    title: "Board-Ready Reporting",
    description: "Concise executive narratives, proof-of-exploit, and prioritised remediation steps, giving leadership **clarity for decisions** and engineers **actionable fixes.**"
  },
  {
    icon: Shield,
    title: "Compliance You Can Trust",
    description: "We perform comprehensive penetration testing to identify and address vulnerabilities in your systems. **Our detailed reports are designed to meet all your specific compliance needs, ensuring a seamless alignment with the standards you are required to uphold.**"
  },
  {
    icon: Globe,
    title: "Future-Proof Testing",
    description: "Specialised red teaming for AI/LLM apps, APIs, and cloud environments, **protecting today's systems and tomorrow's innovations.**"
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
          <p className="text-xl text-muted-foreground leading-relaxed font-bold">
            The perfect balance between AI speed and human judgment.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed mt-4">
            {renderBoldText("Hermes combines the scale and efficiency of AI-driven reconnaissance with the insight and control of expert ethical hackers. The result: penetration testing that's faster and more comprehensive, delivering **proof of real impact** and **clear guidance for remediation**, not just scanner noise.")}
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
              <p className="text-muted-foreground leading-relaxed">{renderBoldText(value.description)}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button 
            variant="hero" 
            size="lg" 
            className="group"
            onClick={() => TriggerHandlers.contactForm("Book Your Pen Test Today")}
          >
            Book Your Pen Test Today
            <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  );
}