import { Linkedin, Shield, Target, Zap, Globe, Network, Bot } from "lucide-react";

const founders = [
  {
    name: "Graham Bradford",
    role: "Co-Founder & CEO",
    photo: "/images/team/graham.jpg",
    bio: "20+ years in cybersecurity and digital innovation, with deep expertise in AI security and strategic security planning. Former CISO at Fortune 500 companies, Graham brings unparalleled experience in protecting organizations from emerging threats.",
    expertise: ["AI Security", "Penetration Testing", "Strategic Security", "CISO Leadership"],
    experience: "Former CISO at Fortune 500 companies, led security teams of 100+ professionals",
    linkedin: "https://linkedin.com/in/graham-bradford", 
    icon: Shield
  },
  {
    name: "Artem",
    role: "Co-Founder & CTO",
    photo: "/images/team/artem.jpg",
    bio: "A cybersecurity visionary with extensive experience in offensive security and AI red teaming. Artem has spent years on the front lines of digital warfare, understanding how attackers think and developing countermeasures.",
    expertise: ["AI Red Teaming", "Offensive Security", "Threat Intelligence", "Security Architecture"],
    experience: "Led offensive security teams, developed AI security frameworks",
    linkedin: "https://linkedin.com/in/artem",
    icon: Target
  }
];

const securityExperts = [
  {
    name: "Sarah Chen",
    role: "Senior Security Specialist",
    photo: "/images/team/sarah.jpg",
    bio: "Specialized in web application security and API testing with 8+ years of experience. Sarah has uncovered critical vulnerabilities in major platforms and developed innovative testing methodologies.",
    expertise: ["Web Security", "API Security", "OWASP Top 10", "Security Testing"],
    certifications: ["OSCP", "CISSP", "CEH"],
    linkedin: "https://linkedin.com/in/sarah-chen",
    icon: Globe
  },
  {
    name: "Marcus Rodriguez",
    role: "Cloud Security Expert",
    photo: "/images/team/marcus.jpg",
    bio: "Cloud security specialist with deep knowledge of AWS, Azure, and GCP security. Marcus has helped organizations secure their cloud infrastructure and prevent data breaches.",
    expertise: ["Cloud Security", "AWS/Azure/GCP", "DevSecOps", "Infrastructure Security"],
    certifications: ["AWS Security", "Azure Security", "CCSP"],
    linkedin: "https://linkedin.com/in/marcus-rodriguez",
    icon: Network
  },
  {
    name: "Dr. Elena Petrova",
    role: "AI Security Researcher",
    photo: "/images/team/elena.jpg",
    bio: "Leading researcher in AI security and adversarial machine learning. Elena's work focuses on making AI systems robust against attacks while maintaining their effectiveness.",
    expertise: ["AI Security", "Adversarial ML", "Model Security", "Research"],
    certifications: ["PhD Computer Science", "AI Security Certifications"],
    linkedin: "https://linkedin.com/in/elena-petrova",
    icon: Bot
  }
];

export default function TeamSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Meet the <span className="text-accent-security">Team</span>
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              The brilliant minds and skilled professionals who make Hermes Security the force for good that it is today.
            </p>
          </div>

          {/* Founders Section */}
          <div className="mb-20">
            <h3 className="text-3xl font-bold text-center mb-12 text-foreground">
              Our <span className="text-accent-security">Founders</span>
            </h3>
            
            <div className="grid md:grid-cols-2 gap-12">
              {founders.map((founder, index) => (
                <div 
                  key={index}
                  className="group p-8 bg-gradient-card rounded-2xl border border-border/50 hover:shadow-card-custom transition-all duration-300 hover:-translate-y-2"
                >
                  {/* Photo Placeholder */}
                  <div className="w-32 h-32 bg-accent-security/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <founder.icon className="w-16 h-16 text-accent-security" />
                  </div>
                  
                  {/* Name & Role */}
                  <div className="text-center mb-6">
                    <h4 className="text-2xl font-bold text-foreground mb-2">{founder.name}</h4>
                    <p className="text-accent-security font-semibold text-lg">{founder.role}</p>
                  </div>
                  
                  {/* Bio */}
                  <p className="text-muted-foreground text-lg leading-relaxed mb-6">{founder.bio}</p>
                  
                  {/* Expertise */}
                  <div className="mb-6">
                    <h5 className="font-semibold text-foreground mb-3">Areas of Expertise:</h5>
                    <div className="flex flex-wrap gap-2">
                      {founder.expertise.map((skill, skillIndex) => (
                        <span 
                          key={skillIndex}
                          className="bg-accent-security/10 text-accent-security px-3 py-1 rounded-lg text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Experience */}
                  <p className="text-muted-foreground text-sm mb-4 italic">"{founder.experience}"</p>
                  
                  {/* LinkedIn */}
                  <a 
                    href={founder.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-accent-security hover:text-accent-security/80 transition-colors"
                  >
                    <Linkedin className="w-5 h-5" />
                    <span className="text-sm">Connect on LinkedIn</span>
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Security Experts Section */}
          <div>
            <h3 className="text-3xl font-bold text-center mb-12 text-foreground">
              Our <span className="text-accent-security">Security Experts</span>
            </h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {securityExperts.map((expert, index) => (
                <div 
                  key={index}
                  className="group p-6 bg-gradient-card rounded-xl border border-border/50 hover:shadow-card-custom transition-all duration-300 hover:-translate-y-2"
                >
                  {/* Photo Placeholder */}
                  <div className="w-24 h-24 bg-accent-security/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <expert.icon className="w-12 h-12 text-accent-security" />
                  </div>
                  
                  {/* Name & Role */}
                  <div className="text-center mb-4">
                    <h4 className="text-xl font-bold text-foreground mb-1">{expert.name}</h4>
                    <p className="text-accent-security font-semibold">{expert.role}</p>
                  </div>
                  
                  {/* Bio */}
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">{expert.bio}</p>
                  
                  {/* Expertise */}
                  <div className="mb-4">
                    <h5 className="font-semibold text-foreground mb-2 text-sm">Expertise:</h5>
                    <div className="flex flex-wrap gap-1">
                      {expert.expertise.map((skill, skillIndex) => (
                        <span 
                          key={skillIndex}
                          className="bg-accent-security/10 text-accent-security px-2 py-1 rounded text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Certifications */}
                  {expert.certifications && (
                    <div className="mb-4">
                      <h5 className="font-semibold text-foreground mb-2 text-sm">Certifications:</h5>
                      <div className="flex flex-wrap gap-1">
                        {expert.certifications.map((cert, certIndex) => (
                          <span 
                            key={certIndex}
                            className="bg-accent-security/5 text-accent-security px-2 py-1 rounded text-xs border border-accent-security/20"
                          >
                            {cert}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* LinkedIn */}
                  <a 
                    href={expert.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-accent-security hover:text-accent-security/80 transition-colors text-sm"
                  >
                    <Linkedin className="w-4 h-4" />
                    <span>Connect</span>
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Join the Team CTA */}
          <div className="text-center mt-16">
            <div className="bg-gradient-security/10 border border-accent-security/30 rounded-2xl p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-4 text-foreground">
                Join Our Mission
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                We're always looking for talented security professionals who share our values and want to make a difference in the digital world.
              </p>
              <a 
                href="mailto:careers@hermessecurity.io"
                className="inline-flex items-center gap-2 bg-accent-security text-white px-6 py-3 rounded-lg font-semibold hover:bg-accent-security/90 transition-colors"
              >
                <Zap className="w-5 h-5" />
                Explore Opportunities
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
