import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Declare Crisp global variable
declare global {
  interface Window {
    $crisp: any[];
  }
}
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { submitContactForm, ContactFormData } from "@/services/contactApi";

// Simple European countries list
const europeanCountries = [
  { code: 'GB', name: 'United Kingdom' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'IT', name: 'Italy' },
  { code: 'ES', name: 'Spain' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'BE', name: 'Belgium' },
  { code: 'AT', name: 'Austria' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'SE', name: 'Sweden' },
  { code: 'NO', name: 'Norway' },
  { code: 'DK', name: 'Denmark' },
  { code: 'FI', name: 'Finland' },
  { code: 'PL', name: 'Poland' },
  { code: 'CZ', name: 'Czech Republic' },
  { code: 'HU', name: 'Hungary' },
  { code: 'RO', name: 'Romania' },
  { code: 'BG', name: 'Bulgaria' },
  { code: 'HR', name: 'Croatia' },
  { code: 'SI', name: 'Slovenia' },
  { code: 'SK', name: 'Slovakia' },
  { code: 'LT', name: 'Lithuania' },
  { code: 'LV', name: 'Latvia' },
  { code: 'EE', name: 'Estonia' },
  { code: 'IE', name: 'Ireland' },
  { code: 'PT', name: 'Portugal' },
  { code: 'GR', name: 'Greece' },
  { code: 'CY', name: 'Cyprus' },
  { code: 'MT', name: 'Malta' },
  { code: 'LU', name: 'Luxembourg' },
  { code: 'IS', name: 'Iceland' }
];

// Form validation schema
const contactFormSchema = z.object({
  firstName: z.string().min(3, "First name must be at least 3 characters"),
  lastName: z.string().min(3, "Last name must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  country: z.string().min(1, "Please select your country"),
  mobileNumber: z.string().min(1, "Mobile number is required"),
  problemDescription: z.string().min(20, "Please provide a brief description (at least 20 characters)"),
  companyName: z.string().min(1, "Company name is required"),
  companySize: z.string().min(1, "Please select company size"),
  serviceUrgency: z.string().min(1, "Please select service urgency"),
  agreeToTerms: z.boolean().refine(val => val === true, "You must agree to the terms of use")
});

interface ContactFormProps {
  onSuccess: (data: ContactFormData) => void;
}

export default function ContactForm({ onSuccess }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      country: '',
      mobileNumber: '',
      problemDescription: '',
      companyName: '',
      companySize: '',
      serviceUrgency: '',
      agreeToTerms: false
    }
  });

  const handleTermsChange = (checked: boolean) => {
    setAgreeToTerms(checked);
    setValue("agreeToTerms", checked);
  };

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const result = await submitContactForm(data);
      if (result.success) {
        // Trigger Crisp chat after successful form submission
        if (window.$crisp) {
          window.$crisp.push(["do", "chat:open"]);
        }
        onSuccess(data);
      } else {
        setSubmitError("Failed to submit form. Please try again.");
      }
    } catch (error) {
      console.error('Form submission error:', error);
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
                  <SelectContent>
                    {europeanCountries.map(country => (
                      <SelectItem key={country.code} value={country.code}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.country && (
                  <p className="text-red-500 text-xs mt-2">{errors.country.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="mobileNumber" className="block text-sm font-medium mb-2">
                Mobile Number *
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

          {/* Company Information - Now Mandatory */}
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

          {/* Terms Agreement */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-accent-security">Terms</h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="agreeToTerms"
                  checked={agreeToTerms}
                  onCheckedChange={handleTermsChange}
                  className="mt-1 border-2 border-blue-400 bg-blue-100 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 data-[state=unchecked]:bg-blue-100 data-[state=unchecked]:border-blue-400"
                />
                <label htmlFor="agreeToTerms" className="text-sm leading-relaxed">
                  I agree to the{" "}
                  <a href="/terms" className="text-accent-security hover:underline">
                    Terms of Use
                  </a>{" "}
                  and understand that this form submission initiates our engagement process. *
                </label>
              </div>
              {errors.agreeToTerms && (
                <p className="text-red-500 text-xs ml-6">{errors.agreeToTerms.message}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-accent-security hover:bg-accent-security/90 text-accent-security-foreground h-12 text-base"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-5 w-5" />
                Submit Contact Request
              </>
            )}
          </Button>

          {/* Error Alert */}
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
