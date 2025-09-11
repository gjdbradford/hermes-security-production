import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Crisp global variable is declared in crispTriggers.ts
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, Loader2, Shield } from "lucide-react";
import { submitContactForm, ContactFormData } from "@/services/contactApi";
import { useCaptchaVerification } from "@/components/CaptchaVerification";
import { isCaptchaEnabled, isCaptchaDebugMode } from "@/config/captcha";
import { allCountries } from "@/data/countries";

// Sort countries alphabetically by name for better UX
const sortedCountries = [...allCountries].sort((a, b) => a.name.localeCompare(b.name));

// Form validation schema
const contactFormSchema = z.object({
  firstName: z.string().min(3, "First name must be at least 3 characters"),
  lastName: z.string().min(3, "Last name must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  country: z.string().min(1, "Please select your country"),
  mobileNumber: z.string()
    .optional()
    .refine((val) => !val || /^[\+]?[1-9][\d]{0,15}$/.test(val), "Please enter a valid mobile number"),
  problemDescription: z.string().min(20, "Please provide a brief description (at least 20 characters)"),
  companyName: z.string().min(1, "Company name is required"),
  companySize: z.string().min(1, "Please select company size"),
  serviceUrgency: z.string().min(1, "Please select service urgency"),
  agreeToTerms: z.boolean().refine(val => val === true, "You must agree to the terms of use"),
  privacyConsent: z.boolean().refine(val => val === true, "You must consent to data processing"),
  marketingConsent: z.boolean().optional()
});

interface ContactFormProps {
  onSuccess: (data: ContactFormData) => void;
  ctaSource: string;
}

// Empty default values for production form
const defaultFormData = {
  firstName: '',
  lastName: '',
  email: '',
  country: '',
  mobileNumber: '',
  problemDescription: '',
  companyName: '',
  companySize: '',
  serviceUrgency: '',
  agreeToTerms: false,
  privacyConsent: false,
  marketingConsent: false
};

export default function ContactForm({ onSuccess, ctaSource }: ContactFormProps) {
  // Debug: Log the ctaSource prop received
  console.log('📝 ContactForm: Received ctaSource prop:', ctaSource, 'Type:', typeof ctaSource);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState<string | null>(null);
  
  // CAPTCHA verification hook
  const { verifyCaptcha, isVerifying: isCaptchaVerifying } = useCaptchaVerification('contact_form_submit');
  const captchaEnabled = isCaptchaEnabled();

  // Debug logging for CAPTCHA status (only once)
  useEffect(() => {
    if (!window.contactFormCaptchaLogged) {
      console.log('🔐 ContactForm CAPTCHA Status:', {
        enabled: captchaEnabled,
        isVerifying: isCaptchaVerifying,
        environment: window.location.hostname
      });
      window.contactFormCaptchaLogged = true;
    }
  }, [captchaEnabled, isCaptchaVerifying]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: defaultFormData
  });

  // Initialize form with empty values and set CTA source
  useEffect(() => {
    // Reset form to empty state for production
    reset(defaultFormData);
    
    // Clear any error states
    setSubmitError(null);
    setCaptchaError(null);
    setCaptchaToken(null);
    
    // CTA source is now passed as a prop, no need to read from sessionStorage
    // Only log once to avoid spam
    if (!window.contactFormCtaLogged) {
      console.log('✅ ContactForm: Received CTA source from parent:', ctaSource);
      window.contactFormCtaLogged = true;
    }
  }, [reset, ctaSource]); // Include ctaSource to reset when it changes


  const handleTermsChange = (checked: boolean) => {
    setValue("agreeToTerms", checked);
  };

  const onSubmit = async (data: ContactFormData) => {
    console.log('🚀 Form submission started with data:', data);
    setIsSubmitting(true);
    setSubmitError(null);
    setCaptchaError(null);

    try {
      // Verify CAPTCHA if enabled
      let captchaTokenToUse = null;
      if (captchaEnabled) {
        if (isCaptchaDebugMode()) {
          console.log('🔐 CAPTCHA verification required');
        }
        
        const captchaResult = await verifyCaptcha();
        if (!captchaResult.success) {
          setCaptchaError(captchaResult.error || 'CAPTCHA verification failed');
          setIsSubmitting(false);
          return;
        }
        
        captchaTokenToUse = captchaResult.token || null;
        if (isCaptchaDebugMode()) {
          console.log('🔐 CAPTCHA verification successful');
        }
      }

      // Add CTA source and CAPTCHA token to form data
      const formDataWithSource = {
        ...data,
        ctaSource: ctaSource,
        captchaToken: captchaTokenToUse
      };
      
      const result = await submitContactForm(formDataWithSource);
      console.log('📡 Webhook response:', result);
      
      if (result.success) {
        console.log('✅ Webhook successful!');
        // Trigger Crisp chat after successful form submission
        if (window.$crisp) {
          window.$crisp.push(["do", "chat:open"]);
        }
        onSuccess(formDataWithSource);
      } else {
        console.log('❌ Webhook failed:', result);
        setSubmitError("Failed to submit form. Please try again.");
      }
    } catch (error) {
      console.error('❌ Form submission error:', error);
      setSubmitError("An error occurred while submitting the form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-8">

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Personal Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-accent-security">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                  First Name *
                </label>
                <Input
                  id="firstName"
                  {...register("firstName")}
                  placeholder="First name"
                  className={`h-12 ${errors.firstName ? "border-red-500" : ""}`}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-2">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                  Last Name *
                </label>
                <Input
                  id="lastName"
                  {...register("lastName")}
                  placeholder="Last name"
                  className={`h-12 ${errors.lastName ? "border-red-500" : ""}`}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-2">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email Address *
                </label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="your.email@company.com"
                  className={`h-12 ${errors.email ? "border-red-500" : ""}`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-2">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="country" className="block text-sm font-medium mb-2">
                  Country *
                </label>
                <Select onValueChange={(value) => setValue("country", value)}>
                  <SelectTrigger className={`h-12 ${errors.country ? "border-red-500" : ""}`}>
                    <SelectValue placeholder="Select your country" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px] overflow-y-auto" position="popper">
                    {sortedCountries.map(country => (
                      <SelectItem 
                        key={country.code} 
                        value={country.code}
                        className="cursor-pointer focus:bg-accent focus:text-accent-foreground"
                      >
                        <span 
                          className="mr-2 flag-emoji" 
                          style={{
                            fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", "Android Emoji", "EmojiSymbols", "EmojiOne Mozilla", "Twemoji Mozilla", "Segoe UI Symbol", sans-serif',
                            fontSize: '1.1em',
                            display: 'inline-block',
                            width: '1.2em',
                            textAlign: 'center',
                            // Additional inline styles for production compatibility
                            fontVariantEmoji: 'emoji',
                            fontFeatureSettings: '"liga" 1, "kern" 1',
                            WebkitFontFeatureSettings: '"liga" 1, "kern" 1',
                            MozFontFeatureSettings: '"liga" 1, "kern" 1',
                            textRendering: 'optimizeLegibility',
                            WebkitFontSmoothing: 'antialiased',
                            MozOsxFontSmoothing: 'grayscale',
                            unicodeBidi: 'bidi-override',
                            direction: 'ltr',
                            fontDisplay: 'block',
                            fontSynthesis: 'none',
                            WebkitTextStroke: '0.01em transparent',
                            fontWeight: 'normal',
                            fontStyle: 'normal'
                          }}
                          title={`${country.name} flag`}
                          aria-label={`${country.name} flag`}
                        >
                          {country.flag || '🏳️'}
                        </span>
                        {country.name}
                      </SelectItem>
                    ))}
                    <SelectItem value="NOT_IN_LIST" className="text-gray-500 italic border-t pt-2 mt-2">
                      Not in list
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.country && (
                  <p className="text-red-500 text-xs mt-2">{errors.country.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="mobileNumber" className="block text-sm font-medium mb-2">
                Mobile Number
              </label>
              <Input
                id="mobileNumber"
                type="tel"
                {...register("mobileNumber")}
                placeholder="+44 7700 900000"
                className={`h-12 ${errors.mobileNumber ? "border-red-500" : ""}`}
              />
              {errors.mobileNumber && (
                <p className="text-red-500 text-xs mt-2">{errors.mobileNumber.message}</p>
              )}
            </div>
          </div>

          {/* Company Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-accent-security">Company Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium mb-2">
                  Company Name *
                </label>
                <Input
                  id="companyName"
                  {...register("companyName")}
                  placeholder="Company name"
                  className={`h-12 ${errors.companyName ? "border-red-500" : ""}`}
                />
                {errors.companyName && (
                  <p className="text-red-500 text-xs mt-2">{errors.companyName.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="companySize" className="block text-sm font-medium mb-2">
                  Company Size *
                </label>
                <Select onValueChange={(value) => setValue("companySize", value)}>
                  <SelectTrigger className={`h-12 ${errors.companySize ? "border-red-500" : ""}`}>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-10">1-10 employees</SelectItem>
                    <SelectItem value="11-50">11-50 employees</SelectItem>
                    <SelectItem value="51-200">51-200 employees</SelectItem>
                    <SelectItem value="201-500">201-500 employees</SelectItem>
                    <SelectItem value="501-1000">501-1000 employees</SelectItem>
                    <SelectItem value="1000+">1000+ employees</SelectItem>
                  </SelectContent>
                </Select>
                {errors.companySize && (
                  <p className="text-red-500 text-xs mt-2">{errors.companySize.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="serviceUrgency" className="block text-sm font-medium mb-2">
                  Service Urgency *
                </label>
                <Select onValueChange={(value) => setValue("serviceUrgency", value)}>
                  <SelectTrigger className={`h-12 ${errors.serviceUrgency ? "border-red-500" : ""}`}>
                    <SelectValue placeholder="Select urgency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Super urgent">Super urgent</SelectItem>
                    <SelectItem value="Urgent">Urgent</SelectItem>
                    <SelectItem value="Not urgent">Not urgent</SelectItem>
                  </SelectContent>
                </Select>
                {errors.serviceUrgency && (
                  <p className="text-red-500 text-xs mt-2">{errors.serviceUrgency.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Problem Description */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-accent-security">How Can We Help?</h3>
            
            <div>
              <label htmlFor="problemDescription" className="block text-sm font-medium mb-2">
                Brief Description of Your Security Needs *
              </label>
              <Textarea
                id="problemDescription"
                {...register("problemDescription")}
                placeholder="Describe your cybersecurity challenges or specific services..."
                rows={4}
                className={`p-4 ${errors.problemDescription ? "border-red-500" : ""}`}
              />
              {errors.problemDescription && (
                <p className="text-red-500 text-xs mt-2">{errors.problemDescription.message}</p>
              )}
            </div>
          </div>

          {/* Terms and Privacy Consent */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-accent-security">Terms & Privacy</h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="agreeToTerms"
                  onCheckedChange={handleTermsChange}
                  className="mt-1 border-2 border-blue-400 bg-blue-100 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 data-[state=unchecked]:bg-blue-100 data-[state=unchecked]:border-blue-400"
                />
                <label htmlFor="agreeToTerms" className="text-sm leading-relaxed">
                  I agree to the{" "}
                  <a href="/terms" className="text-accent-security hover:underline" target="_blank" rel="noopener noreferrer">
                    Terms of Use
                  </a>{" "}
                  and understand that this form submission initiates our engagement process. *
                </label>
              </div>
              {errors.agreeToTerms && (
                <p className="text-red-500 text-xs ml-6">{errors.agreeToTerms.message}</p>
              )}

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="privacyConsent"
                  onCheckedChange={(checked) => setValue("privacyConsent", checked as boolean)}
                  className="mt-1 border-2 border-blue-400 bg-blue-100 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 data-[state=unchecked]:bg-blue-100 data-[state=unchecked]:border-blue-400"
                />
                <label htmlFor="privacyConsent" className="text-sm leading-relaxed">
                  I consent to the processing of my personal data as described in the{" "}
                  <a href="/privacy" className="text-accent-security hover:underline" target="_blank" rel="noopener noreferrer">
                    Privacy Policy
                  </a>
                  . I understand that my data will be used for sales and onboarding purposes only. *
                </label>
              </div>
              {errors.privacyConsent && (
                <p className="text-red-500 text-xs ml-6">{errors.privacyConsent.message}</p>
              )}

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="marketingConsent"
                  onCheckedChange={(checked) => setValue("marketingConsent", checked as boolean)}
                  className="mt-1 border-2 border-gray-300 bg-gray-100 data-[state=checked]:bg-gray-600 data-[state=checked]:border-gray-600 data-[state=unchecked]:bg-gray-100 data-[state=unchecked]:border-gray-300"
                />
                <label htmlFor="marketingConsent" className="text-sm leading-relaxed text-gray-600">
                  I would like to receive marketing communications about Hermes Security services and updates. (Optional)
                </label>
              </div>
            </div>
          </div>

          {/* CAPTCHA Status Indicator */}
          {captchaEnabled && (
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 mb-4">
              <Shield className="h-4 w-4" />
              <span>Protected by reCAPTCHA v3</span>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting || isCaptchaVerifying}
            className="w-full bg-accent-security hover:bg-accent-security/90 text-accent-security-foreground h-12 text-base"
          >
            {isSubmitting || isCaptchaVerifying ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                {isCaptchaVerifying ? 'Verifying security...' : 'Submitting...'}
              </>
            ) : (
              <>
                {captchaEnabled ? (
                  <Shield className="mr-2 h-5 w-5" />
                ) : (
                  <CheckCircle className="mr-2 h-5 w-5" />
                )}
                Submit Contact Request
              </>
            )}
          </Button>

          {/* CAPTCHA Error Alert */}
          {captchaError && (
            <Alert variant="destructive">
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Security verification failed: {captchaError}
              </AlertDescription>
            </Alert>
          )}

          {/* General Error Alert */}
          {submitError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{submitError}</AlertDescription>
            </Alert>
          )}

        </form>
      </CardContent>
    </Card>
  );
}
