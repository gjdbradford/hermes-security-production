import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DiscoveryCallTestRunner from "@/components/DiscoveryCallTestRunner";
import DiscoveryCallButtons from "@/components/DiscoveryCallButtons";

export default function TestPage() {
  return (
    <>
      <Helmet>
        <title>Test Page - Hermes Security</title>
        <meta name="description" content="Testing page for Hermes Security discovery call triggers and Crisp chat functionality." />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Header />
        
        {/* Main Content */}
        <div className="pt-20 pb-12">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                🧪 Test Page
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Test discovery call triggers, Crisp chat functionality, and AI agent responses.
              </p>
            </div>
            
            {/* Test Components */}
            <div className="space-y-8">
              <DiscoveryCallTestRunner />
              <DiscoveryCallButtons />
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    </>
  );
}
