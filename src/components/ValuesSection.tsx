import { Shield, Zap, Heart, Award, Target } from "lucide-react";

const values = [
  {
    icon: Shield,
    title: "Integrity",
    description: "Unwavering commitment to ethical security practices. We believe that how we achieve security is just as important as the security itself. Every action we take is guided by honesty, transparency, and moral principles.",
    highlight: "Ethics first, always"
  },
  {
    icon: Zap,
    title: "Innovation",
    description: "Staying ahead of emerging threats through continuous learning and technological advancement. We don't just react to threats - we anticipate them, developing new solutions before they're needed.",
    highlight: "Future-ready security"
  },
  {
    icon: Heart,
    title: "Humanity",
    description: "Putting human safety above all else. Technology exists to serve people, not the other way around. We protect digital assets because they represent real human lives, businesses, and communities.",
    highlight: "People over technology"
  },
  {
    icon: Award,
    title: "Excellence",
    description: "Uncompromising quality in everything we do. From the smallest security check to the largest enterprise deployment, we maintain the highest standards of performance and reliability.",
    highlight: "Quality without compromise"
  },
  {
    icon: Target,
    title: "Courage",
    description: "Standing up to digital threats fearlessly. We face the darkest aspects of the digital world so our clients don't have to. Courage means doing what's right even when it's difficult or dangerous.",
    highlight: "Brave defenders"
  }
];

export default function ValuesSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Our <span className="text-accent-security">Values</span>
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              These five principles guide every decision we make, every action we take, and every relationship we build.
            </p>
          </div>

          {/* Values Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {values.map((value, index) => (
              <div 
                key={index}
                className="group p-8 bg-gradient-card rounded-2xl border border-border/50 hover:shadow-card-custom transition-all duration-300 h-full hover:-translate-y-2"
              >
                {/* Icon */}
                <div className="w-16 h-16 bg-accent-security/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <value.icon className="w-8 h-8 text-accent-security" />
                </div>
                
                {/* Title */}
                <h3 className="text-2xl font-bold mb-4 text-foreground">{value.title}</h3>
                
                {/* Description */}
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">{value.description}</p>
                
                {/* Highlight */}
                <div className="inline-block bg-accent-security/10 text-accent-security font-semibold px-4 py-2 rounded-lg text-sm">
                  {value.highlight}
                </div>
              </div>
            ))}
          </div>

          {/* Values Statement */}
          <div className="text-center">
            <div className="bg-gradient-security/10 border border-accent-security/30 rounded-2xl p-12 max-w-4xl mx-auto">
              <h3 className="text-3xl font-bold mb-6 text-foreground">
                Living Our Values
              </h3>
              
              <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                These aren't just words on a page - they're the foundation of our culture and the compass that guides our daily work. 
                Every team member, from our founders to our newest security expert, embodies these values in everything they do.
              </p>
              
              <div className="grid md:grid-cols-5 gap-4">
                {values.map((value, index) => (
                  <div key={index} className="text-center">
                    <div className="w-12 h-12 bg-accent-security/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <value.icon className="w-6 h-6 text-accent-security" />
                    </div>
                    <p className="text-sm font-semibold text-foreground">{value.title}</p>
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
