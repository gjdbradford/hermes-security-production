import { Button } from "@/components/ui/button";
import { Shield, ArrowRight, Target, Zap } from "lucide-react";
import { TriggerHandlers } from "@/utils/crispTriggers";

export default function AboutCTASection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main CTA */}
          <div className="bg-gradient-security/10 border border-accent-security/30 rounded-3xl p-12 md:p-16 mb-12">
            <div className="w-20 h-20 bg-accent-security/20 rounded-full flex items-center justify-center mx-auto mb-8">
              <Shield className="w-10 h-10 text-accent-security" />
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Join the Fight for <span className="text-accent-security">Digital Good</span>
            </h2>
            
            <p className="text-xl text-muted-foreground leading-relaxed mb-8 max-w-2xl mx-auto">
              Partner with us to protect your digital assets and contribute to a safer online world. 
              Together, we can ensure technology remains a force for good.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="hero" 
                size="lg" 
                className="group text-lg px-8 py-4"
                onClick={() => TriggerHandlers.contactForm()}
              >
                Start Your Security Journey
                <ArrowRight className="ml-3 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="group text-lg px-8 py-4 border-accent-security text-accent-security hover:bg-accent-security hover:text-white"
              >
                Learn More About Our Services
                <Target className="ml-3 w-5 h-5 transition-transform group-hover:scale-110" />
              </Button>
            </div>
          </div>

          {/* Supporting Points */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-security/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-accent-security" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Proven Protection</h3>
              <p className="text-muted-foreground">
                Our AI-powered security solutions have protected organizations worldwide from emerging threats.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-security/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-accent-security" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Ethical Approach</h3>
              <p className="text-muted-foreground">
                We believe in doing what's right, not just what's profitable. Your security is our mission.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-security/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-accent-security" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">24/7 Support</h3>
              <p className="text-muted-foreground">
                Round-the-clock monitoring and support to ensure your digital assets are always protected.
              </p>
            </div>
          </div>

          {/* Final Message */}
          <div className="mt-16">
            <div className="bg-gradient-card border border-border/50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-4 text-foreground">
                Ready to Make a Difference?
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Every organization we protect makes the digital world a little safer. Every threat we neutralize 
                strengthens the collective security of our online ecosystem. Join us in building a future where 
                technology serves humanity, not threatens it.
              </p>
              
              <div className="inline-flex items-center gap-2 bg-accent-security/10 text-accent-security font-semibold px-4 py-2 rounded-lg">
                <Shield className="w-4 h-4" />
                <span>Together, we protect the future</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
