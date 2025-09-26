import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '../components/ui/progress';
import { submitNeedsAssessment } from '../services/needsAssessmentService';
import type { NeedsAssessmentData } from '../services/needsAssessmentService';
import { useCaptchaVerification } from '@/components/CaptchaVerification';
import { isCaptchaEnabled, isCaptchaDebugMode } from '@/config/captcha';
import {
  ChevronLeft,
  ChevronRight,
  Check,
  AlertTriangle,
  FileText,
  CheckSquare,
  Globe,
  Smartphone,
  Code,
  Network,
  Server,
  CheckCircle,
  Clock,
  Loader2,
  Shield,
  Mail,
} from 'lucide-react';

// Step definitions
const STEPS = [
  { id: 1, title: 'Basic Information', icon: FileText },
  { id: 2, title: 'Service Selection', icon: CheckSquare },
  { id: 3, title: 'Web Applications', icon: Globe, condition: 'website' },
  { id: 4, title: 'Mobile Applications', icon: Smartphone, condition: 'mobile' },
  { id: 5, title: 'API Endpoints', icon: Code, condition: 'api' },
  { id: 6, title: 'Network', icon: Network, condition: 'network' },
  { id: 7, title: 'Infrastructure', icon: Network, condition: 'infrastructure' },
  { id: 8, title: 'Summary', icon: CheckCircle },
];

// Using NeedsAssessmentData interface from service

const NeedsAssessment = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState<string | null>(null);
  const [emailFromUrl, setEmailFromUrl] = useState<string>('');
  const [localEmail, setLocalEmail] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [selectedPentestType, setSelectedPentestType] = useState<string>('');
  const [selectedProductionEnvironment, setSelectedProductionEnvironment] =
    useState<boolean>(false);
  const [selectedStagingEnvironment, setSelectedStagingEnvironment] = useState<boolean>(false);
  const [selectedPreferredTime, setSelectedPreferredTime] = useState<string>('');
  const [selectedTimezone, setSelectedTimezone] = useState<string>('');

  // Refs for uncontrolled textarea components
  const additionalInfoRef = useRef<HTMLTextAreaElement>(null);
  const webConcernsRef = useRef<HTMLTextAreaElement>(null);
  const mobileConcernsRef = useRef<HTMLTextAreaElement>(null);
  const apiConcernsRef = useRef<HTMLTextAreaElement>(null);
  const networkConcernsRef = useRef<HTMLTextAreaElement>(null);
  const infrastructureConcernsRef = useRef<HTMLTextAreaElement>(null);

  // Store textarea values that persist across steps
  const [textareaValues, setTextareaValues] = useState({
    additionalInfo: '',
    webConcerns: '',
    mobileConcerns: '',
    apiConcerns: '',
    network_concerns: '',
    infrastructure_concerns: '',
  });

  // Function to capture textarea values
  const captureTextareaValue = (field: string, value: string) => {
    console.log(`🔍 Capturing textarea value for ${field}:`, value);
    setTextareaValues(prev => {
      const newValues = {
        ...prev,
        [field]: value,
      };
      console.log('🔍 Updated textarea values:', newValues);
      return newValues;
    });
  };

  const [selectedWebTechnologies, setSelectedWebTechnologies] = useState<string[]>([]);
  const [selectedWebCount, setSelectedWebCount] = useState<string>('');
  const [selectedWebVulnerabilities, setSelectedWebVulnerabilities] = useState<string[]>([]);

  // Mobile Applications state
  const [selectedMobilePlatforms, setSelectedMobilePlatforms] = useState<string[]>([]);
  const [selectedMobileCount, setSelectedMobileCount] = useState<string>('');
  const [selectedMobileFrameworks, setSelectedMobileFrameworks] = useState<string[]>([]);
  const [selectedMobileFeatures, setSelectedMobileFeatures] = useState<string[]>([]);

  // API Endpoints state
  const [selectedApiTypes, setSelectedApiTypes] = useState<string[]>([]);
  const [selectedApiCount, setSelectedApiCount] = useState<string>('');
  const [selectedApiAuthMethods, setSelectedApiAuthMethods] = useState<string[]>([]);
  const [selectedApiSensitiveData, setSelectedApiSensitiveData] = useState<string[]>([]);

  // Network state
  const [selectedNetworkComponents, setSelectedNetworkComponents] = useState<string[]>([]);
  const [selectedNetworkProtocols, setSelectedNetworkProtocols] = useState<string[]>([]);

  // Infrastructure state
  const [selectedInfrastructureComponents, setSelectedInfrastructureComponents] = useState<
    string[]
  >([]);
  const [selectedCloudPlatforms, setSelectedCloudPlatforms] = useState<string[]>([]);
  const [selectedOperatingSystems, setSelectedOperatingSystems] = useState<string[]>([]);

  // CAPTCHA verification hook
  const { verifyCaptcha, isVerifying: isCaptchaVerifying } =
    useCaptchaVerification('needs_assessment_submit');
  const captchaEnabled = isCaptchaEnabled();

  // Debug logging for CAPTCHA status (only once)
  useEffect(() => {
    if (!window.contactFormCaptchaLogged) {
      // console.log('🔐 NeedsAssessment CAPTCHA Status:', {
      //   enabled: captchaEnabled,
      //   isVerifying: isCaptchaVerifying,
      //   environment: window.location.hostname
      // });
      window.contactFormCaptchaLogged = true;
    }
  }, [captchaEnabled, isCaptchaVerifying]);

  // Edit mode state
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [_editTargetStep, setEditTargetStep] = useState<number | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState<boolean>(false);

  // Get email from URL parameter
  const getEmailFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('email') || '';
  };

  // Email validation function
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim()) && !email.includes(' ');
  };

  // Check if email is provided via URL
  const hasEmailFromUrl = emailFromUrl.length > 0 && isValidEmail(emailFromUrl);

  // Removed react-hook-form completely

  // Initialize email from URL
  useEffect(() => {
    const urlEmail = getEmailFromUrl();
    setEmailFromUrl(urlEmail);
    setLocalEmail(urlEmail);
  }, []);

  // Auto-navigate to next enabled step when services change
  useEffect(() => {
    // If current step is disabled, find the next enabled step
    if (!isStepEnabled(currentStep)) {
      const nextEnabled = findNextEnabledStep(currentStep);
      const prevEnabled = findPreviousEnabledStep(currentStep);

      if (nextEnabled) {
        setCurrentStep(nextEnabled);
      } else if (prevEnabled) {
        setCurrentStep(prevEnabled);
      }
    }
  }, [selectedServices, currentStep]);

  // Debug API state changes
  useEffect(() => {
    console.log('API state updated:', {
      selectedApiTypes,
      selectedApiCount,
      selectedApiAuthMethods,
      selectedApiSensitiveData,
    });
  }, [selectedApiTypes, selectedApiCount, selectedApiAuthMethods, selectedApiSensitiveData]);

  // Handle new service additions - reset progress when new services are added
  useEffect(() => {
    // This will trigger a re-render of the progress bar when services change
    console.log('Services updated:', selectedServices);
  }, [selectedServices]);

  // Simple email validation
  const _handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalEmail(e.target.value);
    // Clear error when user starts typing
    if (emailError) {
      setEmailError('');
    }
  };

  // Removed formValues - using individual state variables instead
  // Calculate dynamic progress based on selected services and their completion
  const calculateDynamicProgress = () => {
    // Always include basic steps (1, 2, 8)
    const basicSteps = [1, 2, 8];
    const selectedServiceSteps = [];

    // Add service-specific steps based on selection
    if (selectedServices.includes('website')) selectedServiceSteps.push(3);
    if (selectedServices.includes('mobile')) selectedServiceSteps.push(4);
    if (selectedServices.includes('api')) selectedServiceSteps.push(5);
    if (selectedServices.includes('network')) selectedServiceSteps.push(6);
    if (selectedServices.includes('infrastructure')) selectedServiceSteps.push(7);

    const totalSteps = basicSteps.length + selectedServiceSteps.length;
    const completedCount = completedSteps.size;

    return totalSteps > 0 ? (completedCount / totalSteps) * 100 : 0;
  };

  const progress = calculateDynamicProgress();

  // Calculate dynamic steps based on selected services
  const calculateDynamicSteps = (services: string[]) => {
    const serviceSteps = {
      website: 3,
      mobile: 4,
      api: 5,
      network: 6,
      infrastructure: 7,
    };
    return services.map(service => serviceSteps[service]).sort();
  };

  const _dynamicSteps = calculateDynamicSteps(selectedServices);
  const _allSteps = [1, 2, ..._dynamicSteps, 8];

  // Step validation - simplified to prevent cursor issues
  const isStepValid = useCallback(
    (step: number) => {
      // Email validation - required for all steps
      const _emailValid =
        hasEmailFromUrl || (localEmail && !emailError && isValidEmail(localEmail));

      // Check if this step is enabled based on service selection
      const stepConfig = STEPS.find(s => s.id === step);
      let isStepEnabled = true;
      if (stepConfig?.condition) {
        isStepEnabled = selectedServices.includes(stepConfig.condition);
      }

      // If step is disabled, consider it valid (skip validation)
      if (!isStepEnabled) {
        return true;
      }

      switch (step) {
        case 1:
          return (
            !!selectedPentestType &&
            (selectedProductionEnvironment || selectedStagingEnvironment) &&
            !!selectedPreferredTime &&
            !!selectedTimezone
          );
        case 2:
          return selectedServices.length > 0;
        case 3:
          return (
            !!selectedWebCount &&
            selectedWebTechnologies.length > 0 &&
            selectedWebVulnerabilities.length > 0
          );
        case 4:
          return (
            selectedMobilePlatforms.length > 0 &&
            !!selectedMobileCount &&
            selectedMobileFrameworks.length > 0 &&
            selectedMobileFeatures.length > 0
          );
        case 5:
          return (
            selectedApiTypes.length > 0 &&
            !!selectedApiCount &&
            selectedApiAuthMethods.length > 0 &&
            selectedApiSensitiveData.length > 0
          );
        case 6:
          return selectedNetworkComponents.length > 0 && selectedNetworkProtocols.length > 0;
        case 7:
          return (
            selectedInfrastructureComponents.length > 0 &&
            selectedCloudPlatforms.length > 0 &&
            selectedOperatingSystems.length > 0
          );
        case 8:
          return true;
        default:
          return true;
      }
    },
    [
      selectedPentestType,
      selectedProductionEnvironment,
      selectedStagingEnvironment,
      selectedPreferredTime,
      selectedTimezone,
      selectedServices,
      selectedWebCount,
      selectedWebTechnologies,
      selectedWebVulnerabilities,
      selectedMobilePlatforms,
      selectedMobileCount,
      selectedMobileFrameworks,
      selectedMobileFeatures,
      selectedApiTypes,
      selectedApiCount,
      selectedApiAuthMethods,
      selectedApiSensitiveData,
      selectedNetworkComponents,
      selectedNetworkProtocols,
      selectedInfrastructureComponents,
      selectedCloudPlatforms,
      selectedOperatingSystems,
    ]
  );

  // Helper function to check if a step is enabled
  const isStepEnabled = (stepNumber: number) => {
    const stepConfig = STEPS.find(s => s.id === stepNumber);
    if (!stepConfig?.condition) return true; // Basic steps (1, 2, 8) are always enabled
    return selectedServices.includes(stepConfig.condition);
  };

  // Helper function to find next enabled step
  const findNextEnabledStep = (fromStep: number) => {
    for (let i = fromStep + 1; i <= STEPS.length; i++) {
      if (isStepEnabled(i)) {
        return i;
      }
    }
    return null; // No next enabled step found
  };

  // Helper function to find previous enabled step
  const findPreviousEnabledStep = (fromStep: number) => {
    for (let i = fromStep - 1; i >= 1; i--) {
      if (isStepEnabled(i)) {
        return i;
      }
    }
    return null; // No previous enabled step found
  };

  // Function to navigate to a specific step for editing
  const navigateToStepForEdit = (stepNumber: number) => {
    setIsEditMode(true);
    setEditTargetStep(stepNumber);
    setCurrentStep(stepNumber);
    setUpdateSuccess(false);
    // Scroll to top when navigating
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  // Function to handle update when in edit mode
  const handleUpdateStep = () => {
    if (canProceedToNext()) {
      setUpdateSuccess(true);
      // Reset update success after 2 seconds
      setTimeout(() => {
        setUpdateSuccess(false);
        setIsEditMode(false);
        setEditTargetStep(null);
        // Navigate back to summary
        setCurrentStep(8); // Summary step
      }, 2000);
    }
  };

  const canProceedToNext = () => {
    // Email validation - required for all steps
    const emailValid = hasEmailFromUrl || (localEmail && !emailError && isValidEmail(localEmail));
    const stepValid = isStepValid(currentStep);
    const isValid = emailValid && stepValid;

    console.log('Step validation:', {
      currentStep,
      selectedPentestType,
      selectedProductionEnvironment,
      selectedStagingEnvironment,
      selectedPreferredTime,
      selectedWebCount,
      selectedWebTechnologies,
      selectedWebVulnerabilities,
      selectedMobilePlatforms,
      selectedMobileCount,
      selectedMobileFrameworks,
      selectedMobileFeatures,
      selectedApiTypes,
      selectedApiCount,
      selectedApiAuthMethods,
      selectedApiSensitiveData,
      selectedNetworkComponents,
      selectedNetworkProtocols,
      selectedInfrastructureComponents,
      selectedCloudPlatforms,
      selectedOperatingSystems,
      hasEmailFromUrl,
      localEmail,
      emailValid,
      stepValid,
      isValid,
    });
    return isValid;
  };

  const nextStep = () => {
    if (canProceedToNext()) {
      markStepCompleted(currentStep);

      // If in edit mode, handle update instead of navigation
      if (isEditMode) {
        handleUpdateStep();
        return;
      }

      const nextStepNumber = findNextEnabledStep(currentStep);
      if (nextStepNumber) {
        setCurrentStep(nextStepNumber);
        // Only scroll to top when actually changing steps
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
      }
    }
  };

  const prevStep = () => {
    const prevStepNumber = findPreviousEnabledStep(currentStep);
    if (prevStepNumber) {
      setCurrentStep(prevStepNumber);
      // Only scroll to top when actually changing steps
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  };

  const markStepCompleted = (step: number) => {
    if (isStepValid(step)) {
      setCompletedSteps(prev => new Set([...prev, step]));
    }
  };

  const isStepCompleted = (step: number) => {
    return completedSteps.has(step);
  };

  // Handle service selection
  const handleServiceSelection = (service: string, checked: boolean) => {
    if (checked) {
      setSelectedServices(prev => [...prev, service]);
    } else {
      setSelectedServices(prev => prev.filter(s => s !== service));
    }
  };

  // Form submission
  const onSubmit = async () => {
    setIsSubmitting(true);
    setCaptchaError(null);

    try {
      // Verify CAPTCHA if enabled
      let captchaTokenToUse = null;
      if (captchaEnabled) {
        if (isCaptchaDebugMode()) {
          console.log('🔐 CAPTCHA verification required for needs assessment');
        }

        const captchaResult = await verifyCaptcha();
        if (!captchaResult.success) {
          setCaptchaError(captchaResult.error || 'CAPTCHA verification failed');
          return;
        }

        captchaTokenToUse = captchaResult.token || null;
        if (isCaptchaDebugMode()) {
          console.log('🔐 CAPTCHA verification successful for needs assessment');
        }
      }

      // Get textarea values from stored state
      const additionalInfoValue = textareaValues.additionalInfo;
      const webConcernsValue = textareaValues.webConcerns;
      const mobileConcernsValue = textareaValues.mobileConcerns;
      const apiConcernsValue = textareaValues.apiConcerns;
      const networkConcernsValue = textareaValues.network_concerns;
      const infrastructureConcernsValue = textareaValues.infrastructure_concerns;

      // Debug logging for textarea values
      console.log('🔍 Textarea Debug Info:');
      console.log('additionalInfo value:', additionalInfoValue);
      console.log('webConcerns value:', webConcernsValue);
      console.log('mobileConcerns value:', mobileConcernsValue);
      console.log('apiConcerns value:', apiConcernsValue);
      console.log('networkConcerns value:', networkConcernsValue);
      console.log('infrastructureConcerns value:', infrastructureConcernsValue);

      // Build comprehensive data from all state variables
      const assessmentData: NeedsAssessmentData = {
        email: hasEmailFromUrl ? emailFromUrl : localEmail,
        pentestType: selectedPentestType,
        productionEnvironment: selectedProductionEnvironment ? 'Yes' : 'No',
        stagingEnvironment: selectedStagingEnvironment ? 'Yes' : 'No',
        preferredTime: selectedPreferredTime,
        timezone: selectedTimezone,
        additionalInfo: additionalInfoValue,
        selectedServices,

        // Web Applications
        selectedWebCount,
        selectedWebTechnologies,
        selectedWebVulnerabilities,
        webConcernsText: webConcernsValue,

        // Mobile Applications
        selectedMobileCount,
        selectedMobilePlatforms,
        selectedMobileFrameworks,
        selectedMobileFeatures,
        mobileConcernsText: mobileConcernsValue,

        // API Endpoints
        selectedApiCount,
        selectedApiTypes,
        selectedApiAuthMethods,
        selectedApiSensitiveData,
        apiConcernsText: apiConcernsValue,

        // Network
        selectedNetworkComponents,
        selectedNetworkProtocols,
        network_concerns: networkConcernsValue,

        // Infrastructure
        selectedInfrastructureComponents,
        selectedCloudPlatforms,
        selectedOperatingSystems,
        infrastructure_concerns: infrastructureConcernsValue,

        // Security and metadata
        captchaToken: captchaTokenToUse,
        assessmentId: `HERMES-${Date.now()}`,
        submittedAt: new Date().toISOString(),
      };

      console.log('Submitting needs assessment to 8n8 webhook:', assessmentData);

      // Submit to 8n8 webhook
      const result = await submitNeedsAssessment(assessmentData);

      if (result.success) {
        setIsSubmitted(true);
        console.log('✅ Needs assessment submitted successfully:', result.assessmentId);
      } else {
        setError(result.message || 'Failed to submit assessment');
      }
    } catch (error) {
      console.error('❌ Needs assessment submission error:', error);
      setError(error instanceof Error ? error.message : 'Failed to submit assessment');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 1: Basic Questions
  const BasicQuestionsStep = () => (
    <div className='space-y-8'>
      <div className='text-center mb-6'>
        <h3 className='text-2xl font-bold text-primary mb-2'>Basic Pentest Information</h3>
        <p className='text-muted-foreground'>
          Let's start with some basic information about your penetration testing needs
        </p>
      </div>

      <div className='space-y-6'>
        <div>
          <label className='text-lg font-semibold block mb-3'>
            * What type of pentest would you like to conduct?
          </label>
          <div className='grid gap-3'>
            {[
              {
                value: 'white-box',
                label: 'White Box Pentest',
                description: 'Full knowledge of system architecture and code',
              },
              {
                value: 'gray-box',
                label: 'Gray Box Pentest',
                description: 'Partial knowledge of system architecture',
              },
              {
                value: 'black-box',
                label: 'Black Box Pentest',
                description: 'No prior knowledge of system architecture',
              },
              { value: 'all', label: 'All Types', description: 'Comprehensive testing approach' },
            ].map(option => (
              <Card
                key={option.value}
                className='cursor-pointer transition-all hover:shadow-md hover:bg-muted/50'
                onClick={() => {
                  setSelectedPentestType(option.value);
                }}
              >
                <CardContent className='p-4'>
                  <div className='flex items-center space-x-3'>
                    <input
                      type='radio'
                      name='pentestType'
                      value={option.value}
                      checked={selectedPentestType === option.value}
                      onChange={() => setSelectedPentestType(option.value)}
                      className='w-4 h-4 pointer-events-none'
                      tabIndex={-1}
                    />
                    <div className='flex-1'>
                      <h4 className='font-semibold'>{option.label}</h4>
                      <p className='text-sm text-muted-foreground'>{option.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <label className='text-lg font-semibold block mb-3'>
            * Will this testing be done in a production environment?
          </label>
          <div className='space-y-3'>
            <div className='flex items-center space-x-2'>
              <input
                type='checkbox'
                id='productionEnvironment'
                checked={selectedProductionEnvironment}
                onChange={e => setSelectedProductionEnvironment(e.target.checked)}
                className='w-4 h-4'
              />
              <label htmlFor='productionEnvironment'>
                Testing will be done in production environment
              </label>
            </div>
            <div className='flex items-center space-x-2'>
              <input
                type='checkbox'
                id='stagingEnvironment'
                checked={selectedStagingEnvironment}
                onChange={e => setSelectedStagingEnvironment(e.target.checked)}
                className='w-4 h-4'
              />
              <label htmlFor='stagingEnvironment'>
                Similar staging/development environment exists
              </label>
            </div>
          </div>
        </div>

        <div>
          <label className='text-lg font-semibold block mb-3'>
            * At what time do you want these tests to be performed?
          </label>
          <select
            value={selectedPreferredTime}
            onChange={e => setSelectedPreferredTime(e.target.value)}
            className='w-full p-3 border rounded-lg'
          >
            <option value=''>Select preferred time</option>
            <option value='business-hours'>Business Hours (9 AM - 5 PM)</option>
            <option value='after-hours'>After Hours (5 PM - 9 AM)</option>
            <option value='weekends'>Weekends</option>
            <option value='flexible'>Flexible</option>
          </select>
        </div>

        <div>
          <label className='text-lg font-semibold block mb-3'>* What is your timezone?</label>
          <select
            value={selectedTimezone}
            onChange={e => setSelectedTimezone(e.target.value)}
            className='w-full p-3 border rounded-lg'
            required
          >
            <option value=''>Select your timezone</option>
            <option value='UTC-12'>UTC-12 (Baker Island)</option>
            <option value='UTC-11'>UTC-11 (American Samoa)</option>
            <option value='UTC-10'>UTC-10 (Hawaii)</option>
            <option value='UTC-9'>UTC-9 (Alaska)</option>
            <option value='UTC-8'>UTC-8 (Pacific Time - US/Canada)</option>
            <option value='UTC-7'>UTC-7 (Mountain Time - US/Canada)</option>
            <option value='UTC-6'>UTC-6 (Central Time - US/Canada)</option>
            <option value='UTC-5'>UTC-5 (Eastern Time - US/Canada)</option>
            <option value='UTC-4'>UTC-4 (Atlantic Time - Canada)</option>
            <option value='UTC-3'>UTC-3 (Brazil, Argentina)</option>
            <option value='UTC-2'>UTC-2 (Mid-Atlantic)</option>
            <option value='UTC-1'>UTC-1 (Azores)</option>
            <option value='UTC+0'>UTC+0 (Greenwich Mean Time - London)</option>
            <option value='UTC+1'>UTC+1 (Central European Time - Paris, Berlin)</option>
            <option value='UTC+2'>UTC+2 (Eastern European Time - Athens, Cairo)</option>
            <option value='UTC+3'>UTC+3 (Moscow, Istanbul)</option>
            <option value='UTC+4'>UTC+4 (Dubai, Moscow)</option>
            <option value='UTC+5'>UTC+5 (Pakistan, India)</option>
            <option value='UTC+6'>UTC+6 (Bangladesh, Kazakhstan)</option>
            <option value='UTC+7'>UTC+7 (Thailand, Vietnam)</option>
            <option value='UTC+8'>UTC+8 (China, Singapore, Philippines)</option>
            <option value='UTC+9'>UTC+9 (Japan, South Korea)</option>
            <option value='UTC+10'>UTC+10 (Australia Eastern)</option>
            <option value='UTC+11'>UTC+11 (Solomon Islands)</option>
            <option value='UTC+12'>UTC+12 (New Zealand, Fiji)</option>
            <option value='UTC+13'>UTC+13 (Tonga)</option>
            <option value='UTC+14'>UTC+14 (Line Islands)</option>
          </select>
        </div>

        <div>
          <label className='text-lg font-semibold block mb-3'>
            Does your company use any monitoring and/or intrusion protection/detection systems?
          </label>
          <div className='flex items-center space-x-2'>
            <input type='checkbox' id='monitoringSystems' className='w-4 h-4' />
            <label htmlFor='monitoringSystems'>Yes, we have monitoring/IDS systems in place</label>
          </div>
        </div>

        <div>
          <label className='text-lg font-semibold block mb-3'>Additional information?</label>
          <textarea
            ref={additionalInfoRef}
            name='additionalInfo'
            placeholder='Any additional information about your testing requirements...'
            rows={4}
            onBlur={e => captureTextareaValue('additionalInfo', e.target.value)}
            className='w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
          />
        </div>
      </div>
    </div>
  );

  // Step 2: Service Selection
  const ServiceSelectionStep = () => (
    <div className='space-y-8'>
      <div className='text-center mb-6'>
        <h3 className='text-2xl font-bold text-primary mb-2'>
          What is the scope of the Penetration test?
        </h3>
        <p className='text-muted-foreground'>Select all areas that need to be tested</p>
      </div>

      <div className='grid gap-4'>
        {[
          {
            id: 'website',
            label: 'Web Applications',
            description: 'Web applications, websites, and web services',
          },
          {
            id: 'mobile',
            label: 'Mobile Applications',
            description: 'iOS and Android mobile applications',
          },
          {
            id: 'api',
            label: 'API Endpoints',
            description: 'REST APIs, GraphQL, and web services',
          },
          {
            id: 'network',
            label: 'Network Infrastructure',
            description: 'Network devices, firewalls, and network security',
          },
          {
            id: 'infrastructure',
            label: 'Infrastructure',
            description: 'Servers, cloud infrastructure, and system security',
          },
        ].map(service => (
          <Card
            key={service.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedServices.includes(service.id)
                ? 'ring-2 ring-primary bg-primary/5'
                : 'hover:bg-muted/50'
            }`}
            onClick={() =>
              handleServiceSelection(service.id, !selectedServices.includes(service.id))
            }
          >
            <CardContent className='p-6'>
              <div className='flex items-center space-x-3'>
                <input
                  type='checkbox'
                  id={service.id}
                  checked={selectedServices.includes(service.id)}
                  onChange={e => handleServiceSelection(service.id, e.target.checked)}
                  className='w-4 h-4 pointer-events-none'
                  tabIndex={-1}
                />
                <div className='flex-1'>
                  <h4 className='font-semibold text-lg'>{service.label}</h4>
                  <p className='text-sm text-muted-foreground'>{service.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  // Step 3: Web Applications
  const WebQuestionsStep = () => (
    <div className='space-y-8'>
      <div className='text-center mb-6'>
        <h3 className='text-2xl font-bold text-primary mb-2'>Web Applications</h3>
        <p className='text-muted-foreground'>
          Tell us about your web applications that need testing
        </p>
      </div>

      <div className='space-y-6'>
        <div>
          <label className='text-lg font-semibold block mb-3'>
            * How many web applications need to be tested?
          </label>
          <select
            value={selectedWebCount}
            onChange={e => setSelectedWebCount(e.target.value)}
            className='w-full p-3 border rounded-lg'
          >
            <option value=''>Select number of applications</option>
            <option value='1'>1 Application</option>
            <option value='2-3'>2-3 Applications</option>
            <option value='4-5'>4-5 Applications</option>
            <option value='6-10'>6-10 Applications</option>
            <option value='10+'>10+ Applications</option>
          </select>
        </div>

        <div>
          <label className='text-lg font-semibold block mb-3'>
            * What technologies are used in your web applications?
          </label>
          <div className='grid grid-cols-2 gap-3'>
            {[
              'React',
              'Vue.js',
              'Angular',
              'PHP',
              'Node.js',
              'Python/Django',
              'Ruby on Rails',
              'ASP.NET',
              'Java/Spring',
              'WordPress',
              'Drupal',
              'Other',
            ].map(tech => (
              <div key={tech} className='flex items-center space-x-2'>
                <input
                  type='checkbox'
                  id={`web-tech-${tech}`}
                  checked={selectedWebTechnologies.includes(tech)}
                  onChange={e => {
                    if (e.target.checked) {
                      setSelectedWebTechnologies(prev => [...prev, tech]);
                    } else {
                      setSelectedWebTechnologies(prev => prev.filter(t => t !== tech));
                    }
                  }}
                  className='w-4 h-4'
                />
                <label htmlFor={`web-tech-${tech}`} className='text-sm'>
                  {tech}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className='text-lg font-semibold block mb-3'>
            * What types of vulnerabilities are you most concerned about?
          </label>
          <div className='space-y-3'>
            {[
              { value: 'sql-injection', label: 'SQL Injection' },
              { value: 'xss', label: 'Cross-Site Scripting (XSS)' },
              { value: 'csrf', label: 'Cross-Site Request Forgery (CSRF)' },
              { value: 'authentication', label: 'Authentication & Session Management' },
              { value: 'authorization', label: 'Authorization & Access Control' },
              { value: 'file-upload', label: 'File Upload Vulnerabilities' },
              { value: 'business-logic', label: 'Business Logic Flaws' },
              { value: 'all', label: 'All Common Vulnerabilities' },
            ].map(vuln => (
              <div key={vuln.value} className='flex items-center space-x-2'>
                <input
                  type='checkbox'
                  id={`web-vuln-${vuln.value}`}
                  checked={selectedWebVulnerabilities.includes(vuln.value)}
                  onChange={e => {
                    if (e.target.checked) {
                      setSelectedWebVulnerabilities(prev => [...prev, vuln.value]);
                    } else {
                      setSelectedWebVulnerabilities(prev => prev.filter(v => v !== vuln.value));
                    }
                  }}
                  className='w-4 h-4'
                />
                <label htmlFor={`web-vuln-${vuln.value}`} className='text-sm'>
                  {vuln.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className='text-lg font-semibold block mb-3'>
            Do you have any specific areas of concern or known issues?
          </label>
          <textarea
            ref={webConcernsRef}
            name='webConcerns'
            placeholder='Describe any specific security concerns or known issues...'
            rows={4}
            defaultValue={textareaValues.webConcerns}
            onBlur={e => captureTextareaValue('webConcerns', e.target.value)}
            className='w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
          />
        </div>
      </div>
    </div>
  );

  // Step 4: Mobile Applications
  const MobileQuestionsStep = () => (
    <div className='space-y-8'>
      <div className='text-center mb-6'>
        <h3 className='text-2xl font-bold text-primary mb-2'>Mobile Applications</h3>
        <p className='text-muted-foreground'>
          Tell us about your mobile applications that need testing
        </p>
      </div>

      <div className='space-y-6'>
        <div>
          <label className='text-lg font-semibold block mb-3'>
            * What platforms do your mobile apps target?
          </label>
          <div className='grid grid-cols-2 gap-3'>
            <div className='flex items-center space-x-2'>
              <input
                type='checkbox'
                id='mobile-ios'
                checked={selectedMobilePlatforms.includes('iOS')}
                onChange={e => {
                  if (e.target.checked) {
                    setSelectedMobilePlatforms(prev => [...prev, 'iOS']);
                  } else {
                    setSelectedMobilePlatforms(prev => prev.filter(p => p !== 'iOS'));
                  }
                }}
                className='w-4 h-4'
              />
              <label htmlFor='mobile-ios' className='text-sm'>
                iOS
              </label>
            </div>
            <div className='flex items-center space-x-2'>
              <input
                type='checkbox'
                id='mobile-android'
                checked={selectedMobilePlatforms.includes('Android')}
                onChange={e => {
                  if (e.target.checked) {
                    setSelectedMobilePlatforms(prev => [...prev, 'Android']);
                  } else {
                    setSelectedMobilePlatforms(prev => prev.filter(p => p !== 'Android'));
                  }
                }}
                className='w-4 h-4'
              />
              <label htmlFor='mobile-android' className='text-sm'>
                Android
              </label>
            </div>
          </div>
        </div>

        <div>
          <label className='text-lg font-semibold block mb-3'>
            * How many mobile applications need testing?
          </label>
          <select
            value={selectedMobileCount}
            onChange={e => setSelectedMobileCount(e.target.value)}
            className='w-full p-3 border rounded-lg'
          >
            <option value=''>Select number of applications</option>
            <option value='1'>1 Application</option>
            <option value='2-3'>2-3 Applications</option>
            <option value='4-5'>4-5 Applications</option>
            <option value='6+'>6+ Applications</option>
          </select>
        </div>

        <div>
          <label className='text-lg font-semibold block mb-3'>
            * What development frameworks are used?
          </label>
          <div className='grid grid-cols-2 gap-3'>
            {[
              'Native iOS',
              'Native Android',
              'React Native',
              'Flutter',
              'Xamarin',
              'Ionic',
              'Cordova/PhoneGap',
              'Other',
            ].map(framework => (
              <div key={framework} className='flex items-center space-x-2'>
                <input
                  type='checkbox'
                  id={`mobile-framework-${framework}`}
                  checked={selectedMobileFrameworks.includes(framework)}
                  onChange={e => {
                    if (e.target.checked) {
                      setSelectedMobileFrameworks(prev => [...prev, framework]);
                    } else {
                      setSelectedMobileFrameworks(prev => prev.filter(f => f !== framework));
                    }
                  }}
                  className='w-4 h-4'
                />
                <label htmlFor={`mobile-framework-${framework}`} className='text-sm'>
                  {framework}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className='text-lg font-semibold block mb-3'>
            * Do your mobile apps use any of these features?
          </label>
          <div className='space-y-3'>
            {[
              { value: 'biometric-auth', label: 'Biometric Authentication' },
              { value: 'push-notifications', label: 'Push Notifications' },
              { value: 'location-services', label: 'Location Services' },
              { value: 'camera', label: 'Camera Access' },
              { value: 'file-storage', label: 'Local File Storage' },
              { value: 'api-integration', label: 'API Integration' },
              { value: 'offline-mode', label: 'Offline Functionality' },
              { value: 'payment', label: 'Payment Processing' },
            ].map(feature => (
              <div key={feature.value} className='flex items-center space-x-2'>
                <input
                  type='checkbox'
                  id={`mobile-feature-${feature.value}`}
                  checked={selectedMobileFeatures.includes(feature.value)}
                  onChange={e => {
                    if (e.target.checked) {
                      setSelectedMobileFeatures(prev => [...prev, feature.value]);
                    } else {
                      setSelectedMobileFeatures(prev => prev.filter(f => f !== feature.value));
                    }
                  }}
                  className='w-4 h-4'
                />
                <label htmlFor={`mobile-feature-${feature.value}`} className='text-sm'>
                  {feature.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className='text-lg font-semibold block mb-3'>
            Do you have any specific mobile security concerns?
          </label>
          <textarea
            ref={mobileConcernsRef}
            name='mobileConcerns'
            placeholder='Describe any specific mobile security concerns, recent incidents, or areas of focus...'
            rows={4}
            defaultValue={textareaValues.mobileConcerns}
            onBlur={e => captureTextareaValue('mobileConcerns', e.target.value)}
            className='w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
          />
        </div>
      </div>
    </div>
  );

  // Step 5: API Endpoints
  const APIQuestionsStep = () => (
    <div className='space-y-8'>
      <div className='text-center mb-6'>
        <h3 className='text-2xl font-bold text-primary mb-2'>API Endpoints</h3>
        <p className='text-muted-foreground'>Tell us about your APIs that need security testing</p>
      </div>

      <div className='space-y-6'>
        <div>
          <label className='text-lg font-semibold block mb-3'>
            * What types of APIs do you have?
          </label>
          <div className='grid grid-cols-2 gap-3'>
            {[
              { value: 'rest', label: 'REST APIs' },
              { value: 'graphql', label: 'GraphQL' },
              { value: 'soap', label: 'SOAP APIs' },
              { value: 'grpc', label: 'gRPC' },
              { value: 'webhook', label: 'Webhooks' },
              { value: 'microservices', label: 'Microservices APIs' },
            ].map(apiType => (
              <div key={apiType.value} className='flex items-center space-x-2'>
                <input
                  type='checkbox'
                  id={`api-type-${apiType.value}`}
                  checked={selectedApiTypes.includes(apiType.value)}
                  onChange={e => {
                    console.log('API type checkbox changed:', apiType.value, e.target.checked);
                    if (e.target.checked) {
                      setSelectedApiTypes(prev => [...prev, apiType.value]);
                    } else {
                      setSelectedApiTypes(prev => prev.filter(t => t !== apiType.value));
                    }
                  }}
                  className='w-4 h-4'
                />
                <label htmlFor={`api-type-${apiType.value}`} className='text-sm'>
                  {apiType.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className='text-lg font-semibold block mb-3'>
            * How many API endpoints need testing?
          </label>
          <select
            value={selectedApiCount}
            onChange={e => setSelectedApiCount(e.target.value)}
            className='w-full p-3 border rounded-lg'
          >
            <option value=''>Select number of endpoints</option>
            <option value='1-10'>1-10 Endpoints</option>
            <option value='11-25'>11-25 Endpoints</option>
            <option value='26-50'>26-50 Endpoints</option>
            <option value='51-100'>51-100 Endpoints</option>
            <option value='100+'>100+ Endpoints</option>
          </select>
        </div>

        <div>
          <label className='text-lg font-semibold block mb-3'>
            * What authentication methods do your APIs use?
          </label>
          <div className='space-y-3'>
            {[
              { value: 'api-key', label: 'API Keys' },
              { value: 'oauth2', label: 'OAuth 2.0' },
              { value: 'jwt', label: 'JWT Tokens' },
              { value: 'basic-auth', label: 'Basic Authentication' },
              { value: 'bearer-token', label: 'Bearer Tokens' },
              { value: 'certificate', label: 'Client Certificates' },
              { value: 'custom', label: 'Custom Authentication' },
              { value: 'none', label: 'No Authentication' },
            ].map(auth => (
              <div key={auth.value} className='flex items-center space-x-2'>
                <input
                  type='checkbox'
                  id={`api-auth-${auth.value}`}
                  checked={selectedApiAuthMethods.includes(auth.value)}
                  onChange={e => {
                    console.log('API auth checkbox changed:', auth.value, e.target.checked);
                    if (e.target.checked) {
                      setSelectedApiAuthMethods(prev => [...prev, auth.value]);
                    } else {
                      setSelectedApiAuthMethods(prev => prev.filter(a => a !== auth.value));
                    }
                  }}
                  className='w-4 h-4'
                />
                <label htmlFor={`api-auth-${auth.value}`} className='text-sm'>
                  {auth.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className='text-lg font-semibold block mb-3'>
            * What sensitive data do your APIs handle?
          </label>
          <div className='space-y-3'>
            {[
              { value: 'pii', label: 'Personal Identifiable Information (PII)' },
              { value: 'financial', label: 'Financial Data' },
              { value: 'health', label: 'Health Information' },
              { value: 'credentials', label: 'User Credentials' },
              { value: 'business', label: 'Business Data' },
              { value: 'none', label: 'No Sensitive Data' },
            ].map(data => (
              <div key={data.value} className='flex items-center space-x-2'>
                <input
                  type='checkbox'
                  id={`api-data-${data.value}`}
                  checked={selectedApiSensitiveData.includes(data.value)}
                  onChange={e => {
                    console.log(
                      'API sensitive data checkbox changed:',
                      data.value,
                      e.target.checked
                    );
                    if (e.target.checked) {
                      setSelectedApiSensitiveData(prev => [...prev, data.value]);
                    } else {
                      setSelectedApiSensitiveData(prev => prev.filter(d => d !== data.value));
                    }
                  }}
                  className='w-4 h-4'
                />
                <label htmlFor={`api-data-${data.value}`} className='text-sm'>
                  {data.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className='text-lg font-semibold block mb-3'>
            Do you have any specific API security concerns?
          </label>
          <textarea
            ref={apiConcernsRef}
            name='apiConcerns'
            placeholder='Describe any specific API security concerns, recent incidents, or areas of focus...'
            rows={4}
            defaultValue={textareaValues.apiConcerns}
            onBlur={e => captureTextareaValue('apiConcerns', e.target.value)}
            className='w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
          />
        </div>
      </div>
    </div>
  );

  // Step 6: Network
  const NetworkStep = () => (
    <div className='space-y-8'>
      <div className='text-center mb-6'>
        <h3 className='text-2xl font-bold text-primary mb-2'>Network</h3>
        <p className='text-muted-foreground'>Tell us about your network that needs testing</p>
      </div>

      <div className='space-y-6'>
        <div>
          <label className='text-lg font-semibold block mb-3'>
            * What network components need testing?
          </label>
          <div className='grid grid-cols-2 gap-3'>
            {[
              { value: 'network-devices', label: 'Network Devices' },
              { value: 'firewalls', label: 'Firewalls' },
              { value: 'routers', label: 'Routers & Switches' },
              { value: 'wireless', label: 'Wireless Networks' },
              { value: 'vpn', label: 'VPN Gateways' },
              { value: 'load-balancers', label: 'Load Balancers' },
              { value: 'network-monitoring', label: 'Network Monitoring Systems' },
              { value: 'network-security', label: 'Network Security Appliances' },
            ].map(component => (
              <div key={component.value} className='flex items-center space-x-2'>
                <input
                  type='checkbox'
                  id={`network-${component.value}`}
                  checked={selectedNetworkComponents.includes(component.value)}
                  onChange={e => {
                    console.log('Network component selected:', component.value, e.target.checked);
                    if (e.target.checked) {
                      setSelectedNetworkComponents(prev => [...prev, component.value]);
                    } else {
                      setSelectedNetworkComponents(prev => prev.filter(c => c !== component.value));
                    }
                  }}
                  className='w-4 h-4'
                />
                <label htmlFor={`network-${component.value}`} className='text-sm'>
                  {component.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className='text-lg font-semibold block mb-3'>
            * What network protocols are in use?
          </label>
          <div className='grid grid-cols-2 gap-3'>
            {[
              'TCP/IP',
              'HTTP/HTTPS',
              'SSH',
              'Telnet',
              'SNMP',
              'FTP/SFTP',
              'DNS',
              'DHCP',
              'LDAP',
              'Other',
            ].map(protocol => (
              <div key={protocol} className='flex items-center space-x-2'>
                <input
                  type='checkbox'
                  id={`protocol-${protocol}`}
                  checked={selectedNetworkProtocols.includes(protocol)}
                  onChange={e => {
                    console.log('Network protocol selected:', protocol, e.target.checked);
                    if (e.target.checked) {
                      setSelectedNetworkProtocols(prev => [...prev, protocol]);
                    } else {
                      setSelectedNetworkProtocols(prev => prev.filter(p => p !== protocol));
                    }
                  }}
                  className='w-4 h-4'
                />
                <label htmlFor={`protocol-${protocol}`} className='text-sm'>
                  {protocol}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className='text-lg font-semibold block mb-3'>
            Do you have any specific network security concerns?
          </label>
          <textarea
            ref={networkConcernsRef}
            name='network_concerns'
            placeholder='Describe any specific network security concerns, recent incidents, or areas of focus...'
            rows={4}
            defaultValue={textareaValues.network_concerns}
            onBlur={e => captureTextareaValue('network_concerns', e.target.value)}
            className='w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
          />
        </div>
      </div>
    </div>
  );

  // Step 7: Infrastructure
  const InfrastructureStep = () => (
    <div className='space-y-8'>
      <div className='text-center mb-6'>
        <h3 className='text-2xl font-bold text-primary mb-2'>Infrastructure</h3>
        <p className='text-muted-foreground'>
          Tell us about your infrastructure that needs testing
        </p>
      </div>

      <div className='space-y-6'>
        <div>
          <label className='text-lg font-semibold block mb-3'>
            * What infrastructure components need testing?
          </label>
          <div className='grid grid-cols-2 gap-3'>
            {[
              { value: 'servers', label: 'Servers' },
              { value: 'cloud', label: 'Cloud Infrastructure' },
              { value: 'containers', label: 'Containers/Docker' },
              { value: 'databases', label: 'Database Servers' },
              { value: 'storage', label: 'Storage Systems' },
              { value: 'virtualization', label: 'Virtualization Platforms' },
              { value: 'backup', label: 'Backup Systems' },
              { value: 'monitoring', label: 'Infrastructure Monitoring' },
            ].map(component => (
              <div key={component.value} className='flex items-center space-x-2'>
                <input
                  type='checkbox'
                  id={`infra-${component.value}`}
                  checked={selectedInfrastructureComponents.includes(component.value)}
                  onChange={e => {
                    console.log(
                      'Infrastructure component selected:',
                      component.value,
                      e.target.checked
                    );
                    if (e.target.checked) {
                      setSelectedInfrastructureComponents(prev => [...prev, component.value]);
                    } else {
                      setSelectedInfrastructureComponents(prev =>
                        prev.filter(c => c !== component.value)
                      );
                    }
                  }}
                  className='w-4 h-4'
                />
                <label htmlFor={`infra-${component.value}`} className='text-sm'>
                  {component.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className='text-lg font-semibold block mb-3'>
            * What cloud platforms do you use?
          </label>
          <div className='grid grid-cols-2 gap-3'>
            {[
              { value: 'aws', label: 'Amazon Web Services (AWS)' },
              { value: 'azure', label: 'Microsoft Azure' },
              { value: 'gcp', label: 'Google Cloud Platform' },
              { value: 'on-premise', label: 'On-Premise Infrastructure' },
              { value: 'hybrid', label: 'Hybrid Cloud' },
              { value: 'none', label: 'No Cloud Services' },
            ].map(cloud => (
              <div key={cloud.value} className='flex items-center space-x-2'>
                <input
                  type='checkbox'
                  id={`cloud-${cloud.value}`}
                  checked={selectedCloudPlatforms.includes(cloud.value)}
                  onChange={e => {
                    console.log('Cloud platform selected:', cloud.value, e.target.checked);
                    if (e.target.checked) {
                      setSelectedCloudPlatforms(prev => [...prev, cloud.value]);
                    } else {
                      setSelectedCloudPlatforms(prev => prev.filter(c => c !== cloud.value));
                    }
                  }}
                  className='w-4 h-4'
                />
                <label htmlFor={`cloud-${cloud.value}`} className='text-sm'>
                  {cloud.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className='text-lg font-semibold block mb-3'>
            * What operating systems are in use?
          </label>
          <div className='grid grid-cols-2 gap-3'>
            {[
              'Windows Server',
              'Linux (Ubuntu)',
              'Linux (CentOS/RHEL)',
              'Linux (Debian)',
              'macOS Server',
              'FreeBSD',
              'VMware ESXi',
              'Other',
            ].map(os => (
              <div key={os} className='flex items-center space-x-2'>
                <input
                  type='checkbox'
                  id={`os-${os}`}
                  checked={selectedOperatingSystems.includes(os)}
                  onChange={e => {
                    console.log('Operating system selected:', os, e.target.checked);
                    if (e.target.checked) {
                      setSelectedOperatingSystems(prev => [...prev, os]);
                    } else {
                      setSelectedOperatingSystems(prev => prev.filter(o => o !== os));
                    }
                  }}
                  className='w-4 h-4'
                />
                <label htmlFor={`os-${os}`} className='text-sm'>
                  {os}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className='text-lg font-semibold block mb-3'>
            Do you have any specific infrastructure security concerns?
          </label>
          <textarea
            ref={infrastructureConcernsRef}
            name='infrastructure_concerns'
            placeholder='Describe any specific infrastructure security concerns, recent incidents, or areas of focus...'
            rows={4}
            defaultValue={textareaValues.infrastructure_concerns}
            onBlur={e => captureTextareaValue('infrastructure_concerns', e.target.value)}
            className='w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
          />
        </div>
      </div>
    </div>
  );

  const SummaryStep = () => {
    // Use stored values for display
    const additionalInfoText = textareaValues.additionalInfo;
    const webConcernsText = textareaValues.webConcerns;
    const mobileConcernsText = textareaValues.mobileConcerns;
    const apiConcernsText = textareaValues.apiConcerns;
    const networkConcernsText = textareaValues.network_concerns;
    const infrastructureConcernsText = textareaValues.infrastructure_concerns;

    return (
      <div className='space-y-6'>
        <div className='text-center mb-6'>
          <h3 className='text-2xl font-bold text-primary mb-2'>Assessment Summary</h3>
          <p className='text-muted-foreground'>
            Review your information before submitting the assessment
          </p>
        </div>

        <div className='space-y-6'>
          {/* Basic Information */}
          <Card
            className='cursor-pointer hover:shadow-md transition-shadow'
            onClick={() => navigateToStepForEdit(1)}
          >
            <CardHeader>
              <CardTitle className='flex items-center space-x-2'>
                <FileText className='h-5 w-5' />
                <span>Basic Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-2'>
              <p>
                <strong>Email:</strong> {hasEmailFromUrl ? emailFromUrl : localEmail}
              </p>
              <p>
                <strong>Pentest Type:</strong> {selectedPentestType}
              </p>
              <p>
                <strong>Preferred Time:</strong> {selectedPreferredTime}
              </p>
              <p>
                <strong>Timezone:</strong> {selectedTimezone}
              </p>
              <p>
                <strong>Production Environment:</strong>{' '}
                {selectedProductionEnvironment ? 'Yes' : 'No'}
              </p>
              {additionalInfoText && (
                <div className='mt-4'>
                  <p className='font-semibold mb-2'>Additional Information:</p>
                  <p className='text-sm text-muted-foreground bg-gray-50 p-3 rounded-lg whitespace-pre-wrap'>
                    {additionalInfoText}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Selected Services */}
          <Card
            className='cursor-pointer hover:shadow-md transition-shadow'
            onClick={() => navigateToStepForEdit(2)}
          >
            <CardHeader>
              <CardTitle className='flex items-center space-x-2'>
                <CheckSquare className='h-5 w-5' />
                <span>Selected Services</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex flex-wrap gap-2'>
                {selectedServices.map(service => (
                  <Badge key={service} variant='secondary'>
                    {service.charAt(0).toUpperCase() + service.slice(1)}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Web Applications */}
          {selectedServices.includes('website') && (
            <Card
              className='cursor-pointer hover:shadow-md transition-shadow'
              onClick={() => navigateToStepForEdit(3)}
            >
              <CardHeader>
                <CardTitle className='flex items-center space-x-2'>
                  <Globe className='h-5 w-5' />
                  <span>Web Applications</span>
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-3'>
                <p>
                  <strong>Number of Applications:</strong> {selectedWebCount}
                </p>

                {selectedWebTechnologies.length > 0 && (
                  <div>
                    <p className='font-semibold mb-2'>Technologies:</p>
                    <div className='flex flex-wrap gap-2'>
                      {selectedWebTechnologies.map(tech => (
                        <Badge key={tech} variant='secondary' className='text-xs'>
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selectedWebVulnerabilities.length > 0 && (
                  <div>
                    <p className='font-semibold mb-2'>Vulnerability Concerns:</p>
                    <div className='flex flex-wrap gap-2'>
                      {selectedWebVulnerabilities.map(vuln => (
                        <Badge key={vuln} variant='outline' className='text-xs'>
                          {vuln === 'sql-injection'
                            ? 'SQL Injection'
                            : vuln === 'xss'
                              ? 'Cross-Site Scripting (XSS)'
                              : vuln === 'csrf'
                                ? 'Cross-Site Request Forgery (CSRF)'
                                : vuln === 'authentication'
                                  ? 'Authentication & Session Management'
                                  : vuln === 'authorization'
                                    ? 'Authorization & Access Control'
                                    : vuln === 'file-upload'
                                      ? 'File Upload Vulnerabilities'
                                      : vuln === 'business-logic'
                                        ? 'Business Logic Flaws'
                                        : vuln === 'all'
                                          ? 'All Common Vulnerabilities'
                                          : vuln}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {webConcernsText && (
                  <div>
                    <p className='font-semibold mb-2'>Concerns:</p>
                    <p className='text-sm text-muted-foreground bg-gray-50 p-3 rounded-lg whitespace-pre-wrap'>
                      {webConcernsText}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Mobile Applications */}
          {selectedServices.includes('mobile') && (
            <Card
              className='cursor-pointer hover:shadow-md transition-shadow'
              onClick={() => navigateToStepForEdit(4)}
            >
              <CardHeader>
                <CardTitle className='flex items-center space-x-2'>
                  <Smartphone className='h-5 w-5' />
                  <span>Mobile Applications</span>
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-3'>
                <p>
                  <strong>Number of Applications:</strong> {selectedMobileCount}
                </p>

                {selectedMobilePlatforms.length > 0 && (
                  <div>
                    <p className='font-semibold mb-2'>Platforms:</p>
                    <div className='flex flex-wrap gap-2'>
                      {selectedMobilePlatforms.map(platform => (
                        <Badge key={platform} variant='secondary' className='text-xs'>
                          {platform}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selectedMobileFrameworks.length > 0 && (
                  <div>
                    <p className='font-semibold mb-2'>Development Frameworks:</p>
                    <div className='flex flex-wrap gap-2'>
                      {selectedMobileFrameworks.map(framework => (
                        <Badge key={framework} variant='outline' className='text-xs'>
                          {framework}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selectedMobileFeatures.length > 0 && (
                  <div>
                    <p className='font-semibold mb-2'>App Features:</p>
                    <div className='flex flex-wrap gap-2'>
                      {selectedMobileFeatures.map(feature => (
                        <Badge key={feature} variant='outline' className='text-xs'>
                          {feature === 'biometric-auth'
                            ? 'Biometric Authentication'
                            : feature === 'push-notifications'
                              ? 'Push Notifications'
                              : feature === 'location-services'
                                ? 'Location Services'
                                : feature === 'camera'
                                  ? 'Camera Access'
                                  : feature === 'file-storage'
                                    ? 'Local File Storage'
                                    : feature === 'api-integration'
                                      ? 'API Integration'
                                      : feature === 'offline-mode'
                                        ? 'Offline Functionality'
                                        : feature === 'payment'
                                          ? 'Payment Processing'
                                          : feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {mobileConcernsText && (
                  <div>
                    <p className='font-semibold mb-2'>Concerns:</p>
                    <p className='text-sm text-muted-foreground bg-gray-50 p-3 rounded-lg whitespace-pre-wrap'>
                      {mobileConcernsText}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* API Endpoints */}
          {selectedServices.includes('api') && (
            <Card
              className='cursor-pointer hover:shadow-md transition-shadow'
              onClick={() => navigateToStepForEdit(5)}
            >
              <CardHeader>
                <CardTitle className='flex items-center space-x-2'>
                  <Code className='h-5 w-5' />
                  <span>API Endpoints</span>
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-3'>
                <p>
                  <strong>Number of Endpoints:</strong> {selectedApiCount}
                </p>

                {selectedApiTypes.length > 0 && (
                  <div>
                    <p className='font-semibold mb-2'>API Types:</p>
                    <div className='flex flex-wrap gap-2'>
                      {selectedApiTypes.map(type => (
                        <Badge key={type} variant='secondary' className='text-xs'>
                          {type === 'rest'
                            ? 'REST APIs'
                            : type === 'graphql'
                              ? 'GraphQL'
                              : type === 'soap'
                                ? 'SOAP APIs'
                                : type === 'grpc'
                                  ? 'gRPC'
                                  : type === 'webhook'
                                    ? 'Webhooks'
                                    : type === 'microservices'
                                      ? 'Microservices APIs'
                                      : type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selectedApiAuthMethods.length > 0 && (
                  <div>
                    <p className='font-semibold mb-2'>Authentication Methods:</p>
                    <div className='flex flex-wrap gap-2'>
                      {selectedApiAuthMethods.map(auth => (
                        <Badge key={auth} variant='outline' className='text-xs'>
                          {auth === 'api-key'
                            ? 'API Keys'
                            : auth === 'oauth2'
                              ? 'OAuth 2.0'
                              : auth === 'jwt'
                                ? 'JWT Tokens'
                                : auth === 'basic-auth'
                                  ? 'Basic Authentication'
                                  : auth === 'bearer-token'
                                    ? 'Bearer Tokens'
                                    : auth === 'certificate'
                                      ? 'Client Certificates'
                                      : auth === 'custom'
                                        ? 'Custom Authentication'
                                        : auth === 'none'
                                          ? 'No Authentication'
                                          : auth}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selectedApiSensitiveData.length > 0 && (
                  <div>
                    <p className='font-semibold mb-2'>Sensitive Data:</p>
                    <div className='flex flex-wrap gap-2'>
                      {selectedApiSensitiveData.map(data => (
                        <Badge key={data} variant='outline' className='text-xs'>
                          {data === 'pii'
                            ? 'Personal Identifiable Information (PII)'
                            : data === 'financial'
                              ? 'Financial Data'
                              : data === 'health'
                                ? 'Health Information'
                                : data === 'credentials'
                                  ? 'User Credentials'
                                  : data === 'business'
                                    ? 'Business Data'
                                    : data === 'none'
                                      ? 'No Sensitive Data'
                                      : data}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {apiConcernsText && (
                  <div>
                    <p className='font-semibold mb-2'>Concerns:</p>
                    <p className='text-sm text-muted-foreground bg-gray-50 p-3 rounded-lg whitespace-pre-wrap'>
                      {apiConcernsText}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Network */}
          {selectedServices.includes('network') && (
            <Card
              className='cursor-pointer hover:shadow-md transition-shadow'
              onClick={() => navigateToStepForEdit(6)}
            >
              <CardHeader>
                <CardTitle className='flex items-center space-x-2'>
                  <Network className='h-5 w-5' />
                  <span>Network</span>
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-3'>
                {selectedNetworkComponents.length > 0 && (
                  <div>
                    <p className='font-semibold mb-2'>Network Components:</p>
                    <div className='flex flex-wrap gap-2'>
                      {selectedNetworkComponents.map(component => (
                        <Badge key={component} variant='secondary' className='text-xs'>
                          {component === 'network-devices'
                            ? 'Network Devices'
                            : component === 'firewalls'
                              ? 'Firewalls'
                              : component === 'routers'
                                ? 'Routers & Switches'
                                : component === 'wireless'
                                  ? 'Wireless Networks'
                                  : component === 'vpn'
                                    ? 'VPN Gateways'
                                    : component === 'load-balancers'
                                      ? 'Load Balancers'
                                      : component === 'network-monitoring'
                                        ? 'Network Monitoring Systems'
                                        : component === 'network-security'
                                          ? 'Network Security Appliances'
                                          : component}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selectedNetworkProtocols.length > 0 && (
                  <div>
                    <p className='font-semibold mb-2'>Network Protocols:</p>
                    <div className='flex flex-wrap gap-2'>
                      {selectedNetworkProtocols.map(protocol => (
                        <Badge key={protocol} variant='outline' className='text-xs'>
                          {protocol}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {networkConcernsText && (
                  <div>
                    <p className='font-semibold mb-2'>Concerns:</p>
                    <p className='text-sm text-muted-foreground bg-gray-50 p-3 rounded-lg whitespace-pre-wrap'>
                      {networkConcernsText}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Infrastructure */}
          {selectedServices.includes('infrastructure') && (
            <Card
              className='cursor-pointer hover:shadow-md transition-shadow'
              onClick={() => navigateToStepForEdit(7)}
            >
              <CardHeader>
                <CardTitle className='flex items-center space-x-2'>
                  <Server className='h-5 w-5' />
                  <span>Infrastructure</span>
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-3'>
                {selectedInfrastructureComponents.length > 0 && (
                  <div>
                    <p className='font-semibold mb-2'>Infrastructure Components:</p>
                    <div className='flex flex-wrap gap-2'>
                      {selectedInfrastructureComponents.map(component => (
                        <Badge key={component} variant='secondary' className='text-xs'>
                          {component === 'servers'
                            ? 'Servers'
                            : component === 'cloud'
                              ? 'Cloud Infrastructure'
                              : component === 'containers'
                                ? 'Containers/Docker'
                                : component === 'databases'
                                  ? 'Database Servers'
                                  : component === 'storage'
                                    ? 'Storage Systems'
                                    : component === 'virtualization'
                                      ? 'Virtualization Platforms'
                                      : component === 'backup'
                                        ? 'Backup Systems'
                                        : component === 'monitoring'
                                          ? 'Infrastructure Monitoring'
                                          : component}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selectedCloudPlatforms.length > 0 && (
                  <div>
                    <p className='font-semibold mb-2'>Cloud Platforms:</p>
                    <div className='flex flex-wrap gap-2'>
                      {selectedCloudPlatforms.map(platform => (
                        <Badge key={platform} variant='outline' className='text-xs'>
                          {platform === 'aws'
                            ? 'Amazon Web Services (AWS)'
                            : platform === 'azure'
                              ? 'Microsoft Azure'
                              : platform === 'gcp'
                                ? 'Google Cloud Platform'
                                : platform === 'on-premise'
                                  ? 'On-Premise Infrastructure'
                                  : platform === 'hybrid'
                                    ? 'Hybrid Cloud'
                                    : platform === 'none'
                                      ? 'No Cloud Services'
                                      : platform}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selectedOperatingSystems.length > 0 && (
                  <div>
                    <p className='font-semibold mb-2'>Operating Systems:</p>
                    <div className='flex flex-wrap gap-2'>
                      {selectedOperatingSystems.map(os => (
                        <Badge key={os} variant='outline' className='text-xs'>
                          {os}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {infrastructureConcernsText && (
                  <div>
                    <p className='font-semibold mb-2'>Concerns:</p>
                    <p className='text-sm text-muted-foreground bg-gray-50 p-3 rounded-lg whitespace-pre-wrap'>
                      {infrastructureConcernsText}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Assessment ID */}
          <Card>
            <CardContent className='pt-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-muted-foreground'>Assessment ID</p>
                  <p className='font-mono text-lg font-semibold'>HERMES-{Date.now()}</p>
                </div>
                <Badge variant='outline'>
                  <Clock className='h-3 w-3 mr-1' />
                  {new Date().toLocaleDateString()}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const SuccessPage = () => (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-green-50'>
      <Card className='max-w-2xl mx-auto'>
        <CardContent className='p-12 text-center'>
          <div className='w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6'>
            <CheckCircle className='h-10 w-10 text-white' />
          </div>
          <h1 className='text-3xl font-bold text-primary mb-4'>
            Assessment Submitted Successfully!
          </h1>
          <p className='text-lg text-muted-foreground mb-8'>
            Thank you for completing the needs assessment. Our team will review your requirements
            and get back to you ASAP.
          </p>
          <Button asChild>
            <a href='/'>Return to Home</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <BasicQuestionsStep />;
      case 2:
        return <ServiceSelectionStep />;
      case 3:
        return selectedServices.includes('website') ? <WebQuestionsStep /> : null;
      case 4:
        return selectedServices.includes('mobile') ? <MobileQuestionsStep /> : null;
      case 5:
        return selectedServices.includes('api') ? <APIQuestionsStep /> : null;
      case 6:
        return selectedServices.includes('network') ? <NetworkStep /> : null;
      case 7:
        return selectedServices.includes('infrastructure') ? <InfrastructureStep /> : null;
      case 8:
        return <SummaryStep />;
      default:
        return null;
    }
  };

  // Show success page if submitted
  if (isSubmitted) {
    return <SuccessPage />;
  }

  return (
    <section className='py-20 bg-background min-h-screen'>
      <div className='container mx-auto px-4 max-w-4xl'>
        {/* Email Banner - always show */}
        {hasEmailFromUrl || (localEmail && !emailError && isValidEmail(localEmail)) ? (
          <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6'>
            <div className='flex items-center space-x-2'>
              <Mail className='h-5 w-5 text-blue-600' />
              <span className='font-semibold text-blue-900'>
                Assessment for: {hasEmailFromUrl ? emailFromUrl : localEmail}
              </span>
            </div>
            <p className='text-sm text-blue-700 mt-1'>
              This assessment will be linked to your contact information
            </p>
          </div>
        ) : (
          <div className='bg-red-50 border border-red-200 rounded-lg p-4 mb-6'>
            <div className='flex items-center space-x-2'>
              <AlertTriangle className='h-5 w-5 text-red-600' />
              <span className='font-semibold text-red-900'>Email Address Required</span>
            </div>
            <p className='text-sm text-red-700 mt-1'>
              Please provide a valid email address to continue with the assessment
            </p>
          </div>
        )}

        {/* Edit Mode Banner */}
        {isEditMode && (
          <div className='bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6'>
            <div className='flex items-center space-x-2'>
              <AlertTriangle className='h-5 w-5 text-orange-600' />
              <span className='font-semibold text-orange-900'>Edit Mode</span>
            </div>
            <p className='text-sm text-orange-700 mt-1'>
              You are editing your assessment. Click "Update" to save changes and return to the
              summary.
            </p>
          </div>
        )}

        {/* Progress Header */}
        <div className='mb-8'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-3xl font-bold text-primary'>Needs Assessment</h2>
            <Badge variant='outline' className='text-sm'>
              {isEditMode ? 'Edit Mode' : `Step ${currentStep} of ${STEPS.length}`}
            </Badge>
          </div>

          <div className='mb-6'>
            <Progress
              value={progress}
              className={`mb-2 ${progress === 100 ? 'progress-complete' : ''}`}
            />
            {progress === 100 && currentStep === 8 && (
              <div className='text-center'>
                <div className='inline-flex items-center space-x-2 text-green-600 font-semibold'>
                  <CheckCircle className='h-4 w-4' />
                  <span className='text-sm'>Assessment Complete!</span>
                </div>
              </div>
            )}
          </div>

          <div className='flex items-center justify-between text-sm'>
            {STEPS.map(step => {
              const Icon = step.icon;
              const isCompleted = isStepCompleted(step.id);
              const isCurrentStep = step.id === currentStep;
              const isFutureStep = step.id > currentStep;

              // Check if this step is enabled based on service selection
              let isStepEnabled = true;
              if (step.condition) {
                isStepEnabled = selectedServices.includes(step.condition);
              }

              // For service steps, show as active (not disabled) if service is selected
              const isServiceStep = step.condition !== undefined;
              const isServiceSelected = isServiceStep
                ? selectedServices.includes(step.condition)
                : true;

              // Determine the visual state
              let stepState = 'disabled';
              if (isStepEnabled && isCompleted) {
                stepState = 'completed';
              } else if (isStepEnabled && isCurrentStep) {
                stepState = 'current';
              } else if (isStepEnabled && isFutureStep) {
                stepState = 'future';
              } else if (isServiceStep && isServiceSelected) {
                stepState = 'active';
              }

              return (
                <div
                  key={step.id}
                  className={`flex flex-col items-center space-y-1 ${
                    stepState === 'disabled'
                      ? 'text-gray-400 opacity-50'
                      : stepState === 'completed'
                        ? 'text-green-600'
                        : stepState === 'current'
                          ? 'text-primary'
                          : stepState === 'future'
                            ? 'text-primary'
                            : stepState === 'active'
                              ? 'text-primary'
                              : 'text-muted-foreground'
                  } ${
                    (stepState === 'active' || stepState === 'completed') && currentStep === 8
                      ? 'cursor-pointer hover:text-primary transition-colors'
                      : ''
                  }`}
                  onClick={() => {
                    // Only allow clicking when on summary step and step is active/completed
                    if (
                      currentStep === 8 &&
                      (stepState === 'active' || stepState === 'completed')
                    ) {
                      navigateToStepForEdit(step.id);
                    }
                  }}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      stepState === 'disabled'
                        ? 'bg-gray-200 text-gray-400'
                        : stepState === 'completed'
                          ? 'bg-green-600 text-white'
                          : stepState === 'current'
                            ? 'bg-primary text-white'
                            : stepState === 'future'
                              ? 'bg-primary/20 text-primary border-2 border-primary'
                              : stepState === 'active'
                                ? 'bg-primary/20 text-primary border-2 border-primary'
                                : 'bg-muted'
                    } ${
                      (stepState === 'active' || stepState === 'completed') && currentStep === 8
                        ? 'hover:bg-primary/20 hover:border-primary hover:border-2 transition-all'
                        : ''
                    }`}
                  >
                    {stepState === 'completed' ? (
                      <Check className='h-4 w-4' />
                    ) : (
                      <Icon className='h-4 w-4' />
                    )}
                  </div>
                  <span className='hidden md:block text-xs text-center max-w-16'>{step.title}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <Card className='mb-8'>
          <CardContent className='p-8'>{renderStepContent()}</CardContent>
        </Card>

        {/* Navigation */}
        <div className='flex justify-between'>
          <Button
            variant='outline'
            onClick={prevStep}
            disabled={!findPreviousEnabledStep(currentStep)}
            className='flex items-center space-x-2'
          >
            <ChevronLeft className='h-4 w-4' />
            <span>Previous</span>
          </Button>

          {findNextEnabledStep(currentStep) ? (
            <Button
              onClick={nextStep}
              disabled={!canProceedToNext()}
              className={`flex items-center space-x-2 ${
                updateSuccess ? 'bg-green-600 hover:bg-green-700' : ''
              }`}
            >
              {updateSuccess ? (
                <>
                  <Check className='h-4 w-4' />
                  <span>Updated!</span>
                </>
              ) : isEditMode ? (
                <>
                  <span>Update</span>
                  <Check className='h-4 w-4' />
                </>
              ) : (
                <>
                  <span>Next</span>
                  <ChevronRight className='h-4 w-4' />
                </>
              )}
            </Button>
          ) : (
            <div className='space-y-4'>
              {/* CAPTCHA Status Indicator */}
              {captchaEnabled && (
                <div className='flex items-center justify-center space-x-2 text-sm text-gray-600 mb-4'>
                  <Shield className='h-4 w-4' />
                  <span>Protected by reCAPTCHA v3</span>
                </div>
              )}

              {/* CAPTCHA Error Alert */}
              {captchaError && (
                <Alert variant='destructive'>
                  <Shield className='h-4 w-4' />
                  <AlertDescription>Security verification failed: {captchaError}</AlertDescription>
                </Alert>
              )}

              {/* General Error Alert */}
              {error && (
                <div className='bg-red-50 border border-red-200 rounded-lg p-3'>
                  <div className='flex items-center space-x-2 text-red-800'>
                    <AlertTriangle className='h-4 w-4' />
                    <span className='font-medium'>Submission Error:</span>
                  </div>
                  <p className='text-red-700 text-sm mt-1'>{error}</p>
                </div>
              )}

              <Button
                onClick={onSubmit}
                disabled={!canProceedToNext() || isSubmitting || isCaptchaVerifying}
                className='flex items-center space-x-2 w-full'
                size='lg'
              >
                {isSubmitting || isCaptchaVerifying ? (
                  <>
                    <Loader2 className='h-4 w-4 animate-spin' />
                    <span>{isCaptchaVerifying ? 'Verifying security...' : 'Submitting...'}</span>
                  </>
                ) : (
                  <>
                    {captchaEnabled ? (
                      <Shield className='mr-2 h-5 w-5' />
                    ) : (
                      <CheckCircle className='mr-2 h-5 w-5' />
                    )}
                    <span>Submit Assessment</span>
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default NeedsAssessment;
