import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";
import SEOOptimizer from "./components/SEOOptimizer";
import AnalyticsTracker from "./components/AnalyticsTracker";
import CookieConsent from "./components/CookieConsent";
import CaptchaProvider from "./components/CaptchaProvider";
import { getImagePath } from "@/utils/imageUtils";
import { setNavigateFunction } from "@/utils/crispTriggers";
import { getBasePath } from "@/utils/routingUtils";

const queryClient = new QueryClient();

// Component to set up navigation function for trigger handlers
const NavigationSetup = () => {
  const navigate = useNavigate();
  
  // Set the navigate function for trigger handlers
  setNavigateFunction(navigate);
  
  return null;
};

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CaptchaProvider>
          <Toaster />
          <Sonner />
          <SEOOptimizer 
            data={{
              title: "Hermes Security - AI-Driven Penetration Testing with Human Oversight | European Cybersecurity",
              description: "AI-accelerated penetration testing with ethical human oversight. Comprehensive security testing for European enterprises. Web, API, Mobile, Cloud & AI/LLM services.",
              keywords: "penetration testing, AI security, cybersecurity, SOC 2, AI/LLM testing, ethical hacking, security testing, vulnerability assessment, European cybersecurity, cloud security, API security, mobile security, AI/LLM security, security consulting",
              canonical: "https://www.hermessecurity.io",
              ogImage: getImagePath("images/social/og-image.svg"),
              twitterImage: getImagePath("images/social/twitter-image.svg")
            }}
            pageType="home"
          />
          <AnalyticsTracker />
          <CookieConsent />
          <BrowserRouter
            basename={getBasePath()}
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true
            }}
          >
            <NavigationSetup />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CaptchaProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
