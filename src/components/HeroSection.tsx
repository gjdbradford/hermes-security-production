import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Shield, Zap, Users, Target, ChevronRight, ArrowRight } from "lucide-react";
import { TriggerHandlers } from "@/utils/crispTriggers";

const heroContent = [
  {
    id: 1,
    subtitle: "AI speed. Human ethics. Real impact.",
    title: "Stay Out of Tomorrow's News.",
    description: "We influence businesses unlike other security contractors and make a difference by eliminating incorrect development and security processes.",
    cta: "Book a discovery call",
    icon: Target
  },
  {
    id: 2,
    subtitle: "Fix the Asymmetry",
    title: "AI + Human Excellence.",
    description: "A typical enterprise faces nearly 2,000 cyberattacks every week. Cybersecurity is inherently asymmetric—a nonstop game of cat and mouse. Hermes closes the gap with machine speed plus human judgement.",
    cta: "Book a discovery call",
    icon: Shield
  },
  {
    id: 3,
    subtitle: "The old way is gone",
    title: "Ethical Hacking.",
    description: "Organised as Initiate · Discover · Attack · Prioritise. Transform your security posture with AI-accelerated testing that maintains human ethics and oversight.",
    cta: "Book a discovery call",
    icon: Zap
  },
  {
    id: 4,
    subtitle: "From alerts to action",
    title: "Prioritise Vulnerabilities.",
    description: "Focus where it counts and get your teams focused so they can act immediately.",
    cta: "Book a discovery call",
    icon: Users
  }
];

export default function HeroSection() {
  const [currentHero, setCurrentHero] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [pauseTimer, setPauseTimer] = useState(false);

  // Performance optimization: Memoize hero content to prevent unnecessary re-renders
  const currentHeroData = useMemo(() => heroContent[currentHero], [currentHero]);

  const handleHeroChange = useCallback((newIndex: number) => {
    if (isTransitioning || newIndex === currentHero) return;
    
    setIsTransitioning(true);
    
    // Fade out current content
    setTimeout(() => {
      setCurrentHero(newIndex);
      setIsTransitioning(false);
    }, 300);
  }, [isTransitioning, currentHero]);

  // Optimized auto-rotation effect with performance improvements
  useEffect(() => {
    if (!isAutoRotating || pauseTimer) return;
    
    const interval = setInterval(() => {
      handleHeroChange((currentHero + 1) % heroContent.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [currentHero, isAutoRotating, pauseTimer, handleHeroChange]);

  // Optimized resume auto-rotation after pause
  useEffect(() => {
    if (pauseTimer) {
      const timeout = setTimeout(() => {
        setPauseTimer(false);
      }, 10000);
      return () => clearTimeout(timeout);
    }
  }, [pauseTimer]);

  const handleManualChange = (index: number) => {
    setPauseTimer(true);
    handleHeroChange(index);
  };

  return (
    <section className="relative min-h-screen text-hero-foreground overflow-hidden" role="banner" aria-labelledby="hero-title">
      {/* Custom Background Image with Subtle Movement */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat animate-subtle-float"
        style={{
          backgroundImage: 'url(/hermes-security-production/images/backgrounds/hero-bg.jpg)',
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
      
      <div className="relative container mx-auto px-6 pt-32 pb-16 flex items-center min-h-screen">
        <div className="w-full max-w-6xl mx-auto">
          {/* Hero Content */}
          <div 
            className={`transition-all duration-300 ${
              isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
            }`}
            onMouseEnter={() => setIsAutoRotating(false)}
            onMouseLeave={() => setIsAutoRotating(true)}
          >
            <div className="flex items-center gap-2 mb-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center justify-center w-8 h-8 bg-accent-security/20 rounded-lg transition-all duration-300 hover:scale-110">
                {(() => {
                  const IconComponent = currentHeroData.icon;
                  return <IconComponent className="w-4 h-4 text-accent-security" />;
                })()}
              </div>
              <span className="text-hero-muted text-sm font-medium tracking-wide uppercase">
                {currentHeroData.subtitle}
              </span>
            </div>
            
            <h1 id="hero-title" className="text-5xl md:text-7xl font-bold mb-8 leading-tight animate-fade-in" style={{ animationDelay: '0.4s' }}>
              {currentHeroData.title}
            </h1>
            
            <p className="text-xl md:text-2xl text-hero-muted mb-12 max-w-4xl leading-relaxed animate-fade-in" style={{ animationDelay: '0.6s' }}>
              {currentHeroData.description}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: '0.8s' }}>
              <Button 
                variant="hero" 
                size="lg" 
                className="group" 
                aria-label={`${currentHeroData.cta} - ${currentHeroData.title}`}
                onClick={() => {
                  if (currentHeroData.cta.includes("discovery call")) {
                    TriggerHandlers.discoveryCall();
                  } else if (currentHeroData.cta.includes("methodology")) {
                    TriggerHandlers.downloadGuide();
                  }
                }}
              >
                {currentHeroData.cta}
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Button>
              <Button variant="outline-hero" size="lg" aria-label="Learn more about Hermes Security">
                Learn More
                <ChevronRight className="ml-2 w-4 h-4" aria-hidden="true" />
              </Button>
            </div>
          </div>

          {/* Hero Navigation */}
          <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2" role="navigation" aria-label="Hero carousel navigation">
            <div className="flex items-center gap-4">
              <div className="flex gap-3" role="tablist" aria-label="Hero slides">
                {heroContent.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleManualChange(index)}
                    className={`relative w-3 h-3 rounded-full transition-all duration-300 hover-scale ${
                      index === currentHero 
                        ? 'bg-accent-security scale-125' 
                        : 'bg-hero-foreground/30 hover:bg-hero-foreground/50'
                    }`}
                    role="tab"
                    aria-selected={index === currentHero}
                    aria-label={`Go to slide ${index + 1} of ${heroContent.length}`}
                  >
                    {index === currentHero && (
                      <div 
                        className="absolute inset-0 rounded-full bg-accent-security/30 animate-pulse"
                        style={{ animation: isAutoRotating ? 'pulse 10s linear infinite' : 'none' }}
                        aria-hidden="true"
                      />
                    )}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setIsAutoRotating(!isAutoRotating)}
                className="ml-2 text-xs text-hero-muted hover:text-hero-foreground transition-colors"
                aria-label={isAutoRotating ? 'Pause auto-rotation' : 'Resume auto-rotation'}
              >
                {isAutoRotating ? '⏸️' : '▶️'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}