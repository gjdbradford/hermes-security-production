import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import SEOOptimizer from "./components/SEOOptimizer";
import AnalyticsTracker from "./components/AnalyticsTracker";
import { getImagePath } from "@/utils/imageUtils";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <SEOOptimizer 
          data={{
            title: "Hermes Security - AI-Driven Penetration Testing with Human Oversight | European Cybersecurity",
            description: "AI-accelerated penetration testing with ethical human oversight. SOC 2 aligned, GDPR compliant security testing for European enterprises. Web, API, Mobile, Cloud & AI Red Teaming services.",
            keywords: "penetration testing, AI security, cybersecurity, GDPR compliance, SOC 2, AI red teaming, ethical hacking, security testing, vulnerability assessment, European cybersecurity, cloud security, API security, mobile security, AI red teaming, security consulting",
            canonical: "https://www.hermessecurity.io",
            ogImage: getImagePath("images/social/og-image.svg"),
            twitterImage: getImagePath("images/social/twitter-image.svg")
          }}
          pageType="home"
        />
        <AnalyticsTracker />
        <HashRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </HashRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
