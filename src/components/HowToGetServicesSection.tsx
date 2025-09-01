import { Search, Calendar, FileText, Shield, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { TriggerHandlers } from "@/utils/crispTriggers";

const serviceSteps = [
  {
    icon: Search,
    title: "Choose Your Service Needs",
    description: "Select the specific penetration testing services that align with your business goals and security concerns, such as web app, API, or network testing."
  },
  {
    icon: Calendar,
    title: "Schedule a Consultation",
    description: "Book a consultation with our cybersecurity experts to assess your needs and outline a tailored testing plan."
  },
  {
    icon: FileText,
    title: "Receive a Customized Proposal",
    description: "We provide a detailed proposal based on your chosen services, including timelines, costs, and a plan of action to address vulnerabilities."
  },
  {
    icon: Shield,
    title: "Testing & Vulnerability Assessment",
    description: "Our expert team conducts comprehensive penetration testing, simulating real-world attacks to identify security gaps across your digital infrastructure."
  },
  {
    icon: CheckCircle,
    title: "Service Implementation & Reporting",
    description: "After testing, we deliver a detailed report with findings and recommendations, followed by support in implementing the necessary security fixes."
  }
];

export default function HowToGetServicesSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              From <span className="text-accent-security">findings to fixes</span>
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              We go beyond vulnerability lists — providing actionable guidance, validation of fixes, and clear outcomes you can measure and report to the board.
            </p>
          </div>

          {/* Service Steps */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {serviceSteps.map((step, index) => (
              <div 
                key={index}
                className="relative group"
              >
                {/* Step Content */}
                <div className="p-6 bg-gradient-card rounded-xl border border-border/50 hover:shadow-card-custom transition-all duration-300 h-full hover:-translate-y-1">
                  <div className="w-12 h-12 bg-accent-security/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <step.icon className="w-6 h-6 text-accent-security" />
                  </div>
                  <h3 className="text-lg font-semibold mb-3 text-foreground">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                </div>

                {/* Connecting Line (except for last item) */}
                {index < serviceSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-px bg-accent-security/30 transform -translate-y-1/2 z-0" />
                )}
              </div>
            ))}
          </div>

          {/* CTA Section */}
          {/* <div className="text-center">
            <div className="bg-accent-security/10 border border-accent-security/30 rounded-2xl p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-4 text-foreground">
                Ready to Secure Your Digital Assets?
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Book your penetration test today and take the first step towards comprehensive cybersecurity protection.
              </p>
              <Button 
                variant="hero" 
                size="lg" 
                className="group"
                onClick={() => TriggerHandlers.contactForm()}
              >
                Book Your Pen Test Today
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div> */}
        </div>
      </div>
    </section>
  );
}
