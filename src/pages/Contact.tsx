import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowLeft, Mail, Phone, Clock, MessageCircle, Bot } from "lucide-react";
import { ContactFormData } from "@/services/contactApi";

export default function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<ContactFormData | null>(null);
  const [ctaSource, setCtaSource] = useState<string>("Get In Touch");

  // Debug: Track ctaSource changes
  useEffect(() => {
    console.log('🔄 Contact page: ctaSource state changed to:', ctaSource);
  }, [ctaSource]);
  const [formKey, setFormKey] = useState<number>(0);

  // Get CTA source from URL parameters (much more reliable than sessionStorage)
  useEffect(() => {
    console.log('🔍 Contact page: Reading CTA source from URL parameters...');
    console.log('🔍 Current URL:', window.location.href);
    
    const urlParams = new URLSearchParams(window.location.search);
    const ctaFromUrl = urlParams.get('cta');
    console.log('🔍 Retrieved cta from URL:', ctaFromUrl);
    
    if (ctaFromUrl) {
      console.log('✅ Contact page: Setting CTA source to:', ctaFromUrl);
      setCtaSource(ctaFromUrl);
    } else {
      console.log('⚠️ Contact page: No CTA parameter found, using default: Get In Touch');
    }
    
    // Reset form key to force form reset
    setFormKey(prev => prev + 1);
    
    // Scroll to top of page when contact page loads
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []); // Remove ctaSource dependency to prevent loop

  const handleFormSuccess = (data: ContactFormData) => {
    setFormData(data);
    setIsSubmitted(true);
  };

  const handleBackToForm = () => {
    setIsSubmitted(false);
    setFormData(null);
  };

  if (isSubmitted && formData) {
    return (
      <>
        <Helmet>
          <title>Thank You - Hermes Security</title>
          <meta name="description" content="Thank you for contacting Hermes Security. We'll be in touch soon." />
        </Helmet>
        
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
          <Header />
          
          {/* Breadcrumbs */}
          <div className="pt-20 pb-4">
            <div className="container mx-auto px-4">
              <nav className="flex items-center space-x-2 text-sm text-gray-600">
                <Link to="/" className="flex items-center hover:text-primary transition-colors">
                  <Home className="w-4 h-4 mr-1" />
                  Home
                </Link>
                <ChevronRight className="w-4 h-4" />
                <Link to="/contact" className="hover:text-primary transition-colors">
                  Contact
                </Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-gray-900">Thank You</span>
              </nav>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="py-12">
            <div className="container mx-auto px-4">
              <Card className="max-w-2xl mx-auto">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-blue-600">
                    Thank You for Contacting Us!
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-blue-800 mb-3">
                      We are connecting you to our security expert team, who will be in touch as soon as possible.
                    </p>
                    <p className="text-blue-800">
                      Feel free to engage with our AI Bot, ask it anything you can think of.
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Your Information Summary:</h4>
                    <div className="text-sm space-y-1">
                      <p><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
                      <p><strong>Email:</strong> {formData.email}</p>
                      <p><strong>Country:</strong> {formData.country}</p>
                      {formData.companyName && <p><strong>Company:</strong> {formData.companyName}</p>}
                      <p><strong>Urgency:</strong> {formData.serviceUrgency.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button onClick={handleBackToForm} variant="outline" className="flex-1">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Send Another Message
                    </Button>
                    <Button asChild className="flex-1">
                      <Link to="/">Return to Home</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
                  <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Contact Us - Hermes Security</title>
        <meta name="description" content="Contact Hermes Security for expert cybersecurity services, penetration testing, and compliance solutions." />
        <meta name="keywords" content="contact, cybersecurity, penetration testing, security consultation" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Header />
        
        {/* Breadcrumbs */}
        <div className="pt-20 pb-4">
          <div className="container mx-auto px-4">
            <nav className="flex items-center space-x-2 text-sm text-gray-600">
              <Link to="/" className="flex items-center hover:text-primary transition-colors">
                <Home className="w-4 h-4 mr-1" />
                Home
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900">Contact Us</span>
            </nav>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="py-12">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-accent-security mb-4">
                {ctaSource}
              </h1>
              {/* Debug info - remove after testing */}
              <div style={{fontSize: '12px', color: 'red', marginTop: '10px'}}>
                DEBUG: ctaSource = "{ctaSource}" | Type: {typeof ctaSource}
              </div>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Tell us your urgency and a little about your security needs and we'll get back to you ASAP!
              </p>
            </div>
            
            <ContactForm 
              key={`contact-form-${formKey}`} 
              onSuccess={handleFormSuccess} 
              ctaSource={ctaSource} 
            />
          </div>
        </div>
        
        <Footer />
      </div>
    </>
  );
}
