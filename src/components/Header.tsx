import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { TriggerHandlers } from "@/utils/crispTriggers";

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
  { name: 'Services', href: '#services' },
  { name: 'Methodology', href: '#methodology' },
  { name: 'About', href: '#about' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (sectionId: string) => {
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
  };

  return (
    <header className="fixed top-0 w-full bg-hero/95 backdrop-blur-md text-hero-foreground z-50 border-b border-hero-foreground/10">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center justify-center">
            <Link to="/">
              <img 
                src="/hermes-security-production/logo.svg"
                alt="Hermes Security Logo" 
                className="h-8 w-auto"
              />
            </Link>
          </div>

          {/* Desktop Navigation - Always visible for testing */}
          <div className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.href.replace('#', ''))}
                className="text-hero-muted hover:text-hero-foreground transition-colors duration-200 bg-transparent border-none cursor-pointer px-3 py-2 rounded-md hover:bg-hero-foreground/10"
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Button 
              variant="hero" 
              size="sm"
              asChild
            >
              <Link to="/contact">Get In Touch</Link>
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
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    handleNavigation(item.href.replace('#', ''));
                    setMobileMenuOpen(false);
                  }}
                  className="text-hero-muted hover:text-hero-foreground transition-colors duration-200 bg-transparent border-none cursor-pointer text-left px-3 py-2 rounded-md hover:bg-hero-foreground/10"
                >
                  {item.name}
                </button>
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t border-hero-foreground/10">
                <Button 
                  variant="hero" 
                  size="sm"
                  asChild
                >
                  <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>
                    Get In Touch
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}