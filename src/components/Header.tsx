import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { TriggerHandlers } from "@/utils/crispTriggers";
import OptimizedImage from "@/components/ui/optimized-image";
import { IMAGE_PATHS } from "@/utils/imageUtils";

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    const headerHeight = 80; // Approximate header height in pixels
    
    // Different offset values for different sections
    let offset = 110; // Default offset
    if (sectionId === 'methodology') {
      offset = 60; // Methodology section gets closer positioning
    }
    
    const elementPosition = element.offsetTop - headerHeight - offset;
    
    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth'
    });
  }
};

const navigation = [
  { name: 'Services', href: '#services', type: 'anchor' },
  { name: 'Methodology', href: '#methodology', type: 'anchor' },
  { name: 'About', href: '/about', type: 'route' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (item: typeof navigation[0]) => {
    if (item.type === 'route') {
      // For route navigation, use React Router navigate
      navigate(item.href);
    } else {
      // For anchor navigation, scroll to section
      const sectionId = item.href.replace('#', '');
      // If we're not on the homepage, navigate there first
      if (location.pathname !== '/') {
        navigate('/');
        // Wait for navigation to complete, then scroll to section
        setTimeout(() => {
          scrollToSection(sectionId);
        }, 100);
      } else {
        // If we're already on the homepage, just scroll to section
        scrollToSection(sectionId);
      }
    }
  };

  return (
    <header className="fixed top-0 w-full bg-hero/95 backdrop-blur-md text-hero-foreground z-50 border-b border-hero-foreground/10">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center justify-center">
            <Link 
              to="/" 
              onClick={() => {
                // Always scroll to top when clicking logo
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <OptimizedImage 
                src={IMAGE_PATHS.logo()}
                alt="Hermes Security Logo" 
                className="h-8 w-auto"
                loading="eager"
              />
            </Link>
          </div>

          {/* Desktop Navigation - Always visible for testing */}
          <div className="hidden md:flex items-center gap-8">
            {navigation.map((item) => {
              const isActive = item.type === 'route' && location.pathname === item.href;
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item)}
                  className={`transition-colors duration-200 bg-transparent border-none cursor-pointer px-3 py-2 rounded-md hover:bg-hero-foreground/10 ${
                    isActive 
                      ? 'text-hero-foreground bg-hero-foreground/20' 
                      : 'text-hero-muted hover:text-hero-foreground'
                  }`}
                >
                  {item.name}
                </button>
              );
            })}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Button 
              variant="hero" 
              size="sm"
              onClick={() => {
                TriggerHandlers.contactForm('Get In Touch');
              }}
            >
              Get In Touch
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="p-2 text-hero-foreground hover:bg-hero-foreground/10 rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-hero-foreground/10">
            <div className="flex flex-col gap-4 pt-4">
              {navigation.map((item) => {
                const isActive = item.type === 'route' && location.pathname === item.href;
                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      handleNavigation(item);
                      setMobileMenuOpen(false);
                    }}
                    className={`transition-colors duration-200 bg-transparent border-none cursor-pointer text-left px-3 py-2 rounded-md hover:bg-hero-foreground/10 ${
                      isActive 
                        ? 'text-hero-foreground bg-hero-foreground/20' 
                        : 'text-hero-muted hover:text-hero-foreground'
                    }`}
                  >
                    {item.name}
                  </button>
                );
              })}
              <div className="flex flex-col gap-2 pt-4 border-t border-hero-foreground/10">
                <Button 
                  variant="hero" 
                  size="sm"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    TriggerHandlers.contactForm('Get In Touch');
                  }}
                >
                  Get In Touch
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}