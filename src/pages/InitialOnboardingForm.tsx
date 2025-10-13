import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import NeedsAssessmentHeader from '@/components/NeedsAssessmentHeader';
import {
  ChevronLeft,
  ChevronRight,
  Edit,
  User,
  DollarSign,
  Clock,
  Target,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Mail,
  AlertTriangle,
} from 'lucide-react';
import type { OnboardingFormData } from '@/types/onboarding';
import {
  SERVICE_TYPES,
  EXPECTED_OUTCOMES,
  TIMELINE_OPTIONS,
  DECISION_TIMELINE_OPTIONS,
  CURRENCY_OPTIONS,
  BUDGET_RANGES,
  DECISION_FACTORS,
  SOURCE_OPTIONS,
  ROLE_OPTIONS,
} from '@/types/onboarding';
import {
  submitOnboardingForm,
  OnboardingFormData as ServiceOnboardingData,
} from '@/services/onboardingService';
import { useCaptchaVerification } from '@/components/CaptchaVerification';
import { isCaptchaEnabled, isCaptchaDebugMode } from '@/config/captcha';
import { navigateToNeedsAssessment, navigateToHome } from '@/utils/routingUtils';

const TOTAL_STEPS = 6;

// Step definitions with icons and names
const STEPS = [
  { id: 1, title: 'Service Needs', icon: Target },
  { id: 2, title: 'Timing & Urgency', icon: Clock },
  { id: 3, title: 'Budget', icon: DollarSign },
  { id: 4, title: 'Decision Process', icon: User },
  { id: 5, title: 'Source', icon: MessageSquare },
  { id: 6, title: 'Summary', icon: CheckCircle },
];

const InitialOnboardingForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailFromUrl, setEmailFromUrl] = useState<string>('');
  const [localEmail, setLocalEmail] = useState<string>('');
  const [captchaError, setCaptchaError] = useState<string | null>(null);

  // Edit mode state
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [_editTargetStep, setEditTargetStep] = useState<number | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState<boolean>(false);

  // CAPTCHA verification hook
  const { verifyCaptcha, isVerifying: isCaptchaVerifying } = useCaptchaVerification(
    'client_introduction_submit'
  );
  const captchaEnabled = isCaptchaEnabled();

  // Form data state
  const [formData, setFormData] = useState<OnboardingFormData>({
    serviceType: '',
    expectedOutcomes: [],
    currentChallenges: '',
    serviceStartTimeline: '',
    decisionTimeline: '',
    hasBudget: false,
    currency: 'USD',
    budgetRange: '',
    projectLead: '',
    projectLeadRole: '',
    projectLeadRoleOther: '',
    decisionFactors: [],
    howDidYouHear: '',
    howDidYouHearOther: '',
    email: '',
    country: '',
  });

  // Extract email and country from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email') || '';
    const country = urlParams.get('country') || '';

    setEmailFromUrl(email);
    setLocalEmail(email);

    // Auto-detect currency based on country
    const currency = getCurrencyFromCountry(country);

    setFormData(prev => ({
      ...prev,
      email,
      country,
      currency,
    }));
  }, []);

  // Email validation function
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const hasEmailFromUrl = emailFromUrl && isValidEmail(emailFromUrl);
  const hasValidEmail = hasEmailFromUrl || (localEmail && isValidEmail(localEmail));

  const getCurrencyFromCountry = (country: string): string => {
    const currencyMap: Record<string, string> = {
      US: 'USD',
      CA: 'USD',
      AU: 'USD',
      GB: 'GBP',
      DE: 'EUR',
      FR: 'EUR',
      IT: 'EUR',
      ES: 'EUR',
      NL: 'EUR',
      BE: 'EUR',
      AT: 'EUR',
      IE: 'EUR',
      PT: 'EUR',
      FI: 'EUR',
      LU: 'EUR',
      MT: 'EUR',
      CY: 'EUR',
      SK: 'EUR',
      SI: 'EUR',
      EE: 'EUR',
      LV: 'EUR',
      LT: 'EUR',
      ZA: 'ZAR',
    };

    return currencyMap[country] || 'USD';
  };

  const updateFormData = (field: keyof OnboardingFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1: // Service Needs - serviceType and expectedOutcomes are mandatory
        return formData.serviceType !== '' && formData.expectedOutcomes.length > 0;
      case 2: // Timing & Urgency - both timelines are mandatory
        return formData.serviceStartTimeline !== '' && formData.decisionTimeline !== '';
      case 3: // Budget - if hasBudget is true, budgetRange is mandatory
        return formData.hasBudget ? formData.budgetRange !== '' : true;
      case 4: {
        // Decision Process - projectLead, projectLeadRole and decisionFactors are mandatory
        const roleValid = formData.projectLeadRole !== '';
        const roleOtherValid =
          formData.projectLeadRole !== 'other' || formData.projectLeadRoleOther !== '';
        return (
          formData.projectLead !== '' &&
          roleValid &&
          roleOtherValid &&
          formData.decisionFactors.length > 0
        );
      }
      case 5: // Source - howDidYouHear is mandatory
        return formData.howDidYouHear !== '';
      case 6: // Summary
        return true;
      default:
        return false;
    }
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
    if (isStepValid(currentStep)) {
      setUpdateSuccess(true);
      // Reset update success after 2 seconds
      setTimeout(() => {
        setUpdateSuccess(false);
        setIsEditMode(false);
        setEditTargetStep(null);
        // Navigate back to summary
        setCurrentStep(6); // Summary step
      }, 2000);
    }
  };

  const handleNext = () => {
    if (isStepValid(currentStep)) {
      // If in edit mode, handle update instead of navigation
      if (isEditMode) {
        handleUpdateStep();
        return;
      }

      setCurrentStep(prev => Math.min(prev + 1, TOTAL_STEPS));
      setError(null);
    } else {
      setError('Please complete all required fields before proceeding.');
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setError(null);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    setCaptchaError(null);

    try {
      // Verify CAPTCHA if enabled
      let captchaTokenToUse = null;
      if (captchaEnabled) {
        if (isCaptchaDebugMode()) {
          console.log('🔐 CAPTCHA verification required for client introduction');
        }

        const captchaResult = await verifyCaptcha();
        if (!captchaResult.success) {
          setCaptchaError(captchaResult.error || 'CAPTCHA verification failed');
          setIsSubmitting(false);
          return;
        }

        captchaTokenToUse = captchaResult.token || null;
        if (isCaptchaDebugMode()) {
          console.log('🔐 CAPTCHA verification successful for client introduction');
        }
      }

      // Prepare data for 8n8 webhook
      const onboardingData: ServiceOnboardingData = {
        ...formData,
        captchaToken: captchaTokenToUse,
        onboardingId: `onboarding_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        submittedAt: new Date().toISOString(),
      };

      console.log('🚀 Submitting client introduction form:', onboardingData);

      const result = await submitOnboardingForm(onboardingData);
      console.log('📡 8n8 webhook response:', result);

      if (result.success) {
        console.log('✅ Client introduction form submitted successfully!');
        setIsSubmitted(true);
      } else {
        console.log('❌ 8n8 webhook failed:', result);
        setError(result.message || 'Failed to submit form. Please try again.');
      }
    } catch (error) {
      console.error('❌ Form submission error:', error);
      setError('An error occurred while submitting the form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const _getStepTitle = (step: number) => {
    return STEPS.find(s => s.id === step)?.title || 'Unknown';
  };

  const _getStepIcon = (step: number) => {
    return STEPS.find(s => s.id === step)?.icon || CheckCircle;
  };

  const renderServiceNeedsStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className='space-y-6'
    >
      <div className='space-y-8'>
        <div className='text-center mb-6 pt-6'>
          <h3 className='text-2xl font-bold text-primary mb-2'>Service Needs</h3>
          <p className='text-muted-foreground'>Tell us about your service requirements</p>
        </div>

        <div>
          <label className='text-lg font-semibold block mb-3'>
            * What type of pentest would you like to conduct?
          </label>
          <div className='grid gap-4'>
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
                className={`cursor-pointer transition-all hover:shadow-md ${
                  formData.serviceType === option.value
                    ? 'ring-2 ring-primary bg-primary/5'
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => {
                  updateFormData('serviceType', option.value);
                }}
              >
                <CardContent className='p-6'>
                  <div className='flex items-center space-x-3'>
                    <input
                      type='radio'
                      name='serviceType'
                      value={option.value}
                      checked={formData.serviceType === option.value}
                      onChange={() => updateFormData('serviceType', option.value)}
                      className='w-4 h-4 pointer-events-none'
                      tabIndex={-1}
                    />
                    <div className='flex-1'>
                      <h4 className='font-semibold text-lg'>{option.label}</h4>
                      <p className='text-sm text-muted-foreground'>{option.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className='space-y-8'>
          <div className='text-center mb-6 pt-6'>
            <h3 className='text-2xl font-bold text-primary mb-2'>
              * What outcomes are you expecting from our penetration testing/security services?
            </h3>
            <p className='text-muted-foreground'>Select all outcomes that apply to your needs</p>
          </div>

          <div className='grid gap-4'>
            {EXPECTED_OUTCOMES.map(option => (
              <Card
                key={option.value}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  formData.expectedOutcomes.includes(option.value)
                    ? 'ring-2 ring-primary bg-primary/5'
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => {
                  const isSelected = formData.expectedOutcomes.includes(option.value);
                  if (isSelected) {
                    updateFormData(
                      'expectedOutcomes',
                      formData.expectedOutcomes.filter(item => item !== option.value)
                    );
                  } else {
                    updateFormData('expectedOutcomes', [
                      ...formData.expectedOutcomes,
                      option.value,
                    ]);
                  }
                }}
              >
                <CardContent className='p-6'>
                  <div className='flex items-center space-x-3'>
                    <input
                      type='checkbox'
                      id={option.value}
                      checked={formData.expectedOutcomes.includes(option.value)}
                      onChange={e => {
                        if (e.target.checked) {
                          updateFormData('expectedOutcomes', [
                            ...formData.expectedOutcomes,
                            option.value,
                          ]);
                        } else {
                          updateFormData(
                            'expectedOutcomes',
                            formData.expectedOutcomes.filter(item => item !== option.value)
                          );
                        }
                      }}
                      className='w-4 h-4 pointer-events-none'
                      tabIndex={-1}
                    />
                    <div className='flex-1'>
                      <h4 className='font-semibold text-lg'>{option.label}</h4>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {formData.expectedOutcomes.includes('other') && (
            <Input
              placeholder='Please specify other outcomes...'
              value={formData.howDidYouHearOther || ''}
              onChange={e => updateFormData('howDidYouHearOther', e.target.value)}
              className='mt-3'
            />
          )}
        </div>

        <div>
          <Label htmlFor='challenges' className='text-lg font-semibold mb-4 block'>
            What challenges or problems are you currently facing? (Optional)
          </Label>
          <Textarea
            id='challenges'
            placeholder='Describe your current security challenges...'
            value={formData.currentChallenges}
            onChange={e => updateFormData('currentChallenges', e.target.value)}
            rows={4}
            className='resize-none'
          />
        </div>
      </div>
    </motion.div>
  );

  const renderTimingStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className='space-y-8'
    >
      <div className='space-y-8'>
        <div className='text-center mb-6 pt-6'>
          <h3 className='text-2xl font-bold text-primary mb-2'>Timing & Urgency</h3>
          <p className='text-muted-foreground'>Tell us about your timeline requirements</p>
        </div>

        <div>
          <label className='text-lg font-semibold block mb-3'>
            * When do you need our services to start?
          </label>
          <div className='grid gap-4'>
            {TIMELINE_OPTIONS.map(option => (
              <Card
                key={option.value}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  formData.serviceStartTimeline === option.value
                    ? 'ring-2 ring-primary bg-primary/5'
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => {
                  updateFormData('serviceStartTimeline', option.value);
                }}
              >
                <CardContent className='p-6'>
                  <div className='flex items-center space-x-3'>
                    <input
                      type='radio'
                      name='serviceStartTimeline'
                      value={option.value}
                      checked={formData.serviceStartTimeline === option.value}
                      onChange={() => updateFormData('serviceStartTimeline', option.value)}
                      className='w-4 h-4 pointer-events-none'
                      tabIndex={-1}
                    />
                    <div className='flex-1'>
                      <h4 className='font-semibold text-lg'>{option.label}</h4>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <label className='text-lg font-semibold block mb-3'>
            * What is your timeframe for making a decision?
          </label>
          <div className='grid gap-4'>
            {DECISION_TIMELINE_OPTIONS.map(option => (
              <Card
                key={option.value}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  formData.decisionTimeline === option.value
                    ? 'ring-2 ring-primary bg-primary/5'
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => {
                  updateFormData('decisionTimeline', option.value);
                }}
              >
                <CardContent className='p-6'>
                  <div className='flex items-center space-x-3'>
                    <input
                      type='radio'
                      name='decisionTimeline'
                      value={option.value}
                      checked={formData.decisionTimeline === option.value}
                      onChange={() => updateFormData('decisionTimeline', option.value)}
                      className='w-4 h-4 pointer-events-none'
                      tabIndex={-1}
                    />
                    <div className='flex-1'>
                      <h4 className='font-semibold text-lg'>{option.label}</h4>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderBudgetStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className='space-y-8'
    >
      <div className='space-y-8'>
        <div className='text-center mb-6 pt-6'>
          <h3 className='text-2xl font-bold text-primary mb-2'>
            * Do you have a budget allocated?
          </h3>
          <p className='text-muted-foreground'>Select whether you have a budget for this project</p>
        </div>

        <div className='grid gap-4'>
          <Card
            className={`cursor-pointer transition-all hover:shadow-md ${
              formData.hasBudget === true ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-muted/50'
            }`}
            onClick={() => {
              updateFormData('hasBudget', true);
            }}
          >
            <CardContent className='p-6'>
              <div className='flex items-center space-x-3'>
                <input
                  type='radio'
                  name='hasBudget'
                  value='yes'
                  checked={formData.hasBudget === true}
                  onChange={() => updateFormData('hasBudget', true)}
                  className='w-4 h-4 pointer-events-none'
                  tabIndex={-1}
                />
                <div className='flex-1'>
                  <h4 className='font-semibold text-lg'>Yes</h4>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all hover:shadow-md ${
              formData.hasBudget === false
                ? 'ring-2 ring-primary bg-primary/5'
                : 'hover:bg-muted/50'
            }`}
            onClick={() => {
              updateFormData('hasBudget', false);
            }}
          >
            <CardContent className='p-6'>
              <div className='flex items-center space-x-3'>
                <input
                  type='radio'
                  name='hasBudget'
                  value='no'
                  checked={formData.hasBudget === false}
                  onChange={() => updateFormData('hasBudget', false)}
                  className='w-4 h-4 pointer-events-none'
                  tabIndex={-1}
                />
                <div className='flex-1'>
                  <h4 className='font-semibold text-lg'>No</h4>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {formData.hasBudget && (
        <>
          <div>
            <Label className='text-lg font-semibold mb-4 block'>Currency</Label>
            <Select
              value={formData.currency}
              onValueChange={value => updateFormData('currency', value)}
            >
              <SelectTrigger className='!border-2 !border-gray-300 focus:!border-primary focus:!ring-2 focus:!ring-primary/20'>
                <SelectValue placeholder='Select currency' />
              </SelectTrigger>
              <SelectContent>
                {CURRENCY_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-8'>
            <div className='text-center mb-6 pt-6'>
              <h3 className='text-2xl font-bold text-primary mb-2'>* Budget Range</h3>
              <p className='text-muted-foreground'>Select your budget range for this project</p>
            </div>

            <div className='grid gap-4'>
              {BUDGET_RANGES.map(option => (
                <Card
                  key={option.value}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    formData.budgetRange === option.value
                      ? 'ring-2 ring-primary bg-primary/5'
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => {
                    updateFormData('budgetRange', option.value);
                  }}
                >
                  <CardContent className='p-6'>
                    <div className='flex items-center space-x-3'>
                      <input
                        type='radio'
                        name='budgetRange'
                        value={option.value}
                        checked={formData.budgetRange === option.value}
                        onChange={() => updateFormData('budgetRange', option.value)}
                        className='w-4 h-4 pointer-events-none'
                        tabIndex={-1}
                      />
                      <div className='flex-1'>
                        <h4 className='font-semibold text-lg'>
                          {option.label}{' '}
                          {formData.currency &&
                            CURRENCY_OPTIONS.find(c => c.value === formData.currency)?.symbol}
                        </h4>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </>
      )}
    </motion.div>
  );

  const renderDecisionProcessStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className='space-y-6'
    >
      <div className='text-center mb-6 pt-6'>
        <h3 className='text-2xl font-bold text-primary mb-2'>Decision Process</h3>
        <p className='text-muted-foreground'>Tell us about your decision-making process</p>
      </div>

      <div>
        <label className='text-lg font-semibold block mb-3'>
          * Who is the lead on this project?
        </label>
        <Input
          id='projectLead'
          placeholder='Enter project lead name...'
          value={formData.projectLead}
          onChange={e => updateFormData('projectLead', e.target.value)}
        />
      </div>

      <div>
        <label className='text-lg font-semibold block mb-3'>* Their role</label>
        <Select
          value={formData.projectLeadRole}
          onValueChange={value => updateFormData('projectLeadRole', value)}
        >
          <SelectTrigger className='!border-2 !border-gray-300 focus:!border-primary focus:!ring-2 focus:!ring-primary/20'>
            <SelectValue placeholder='Select your role' />
          </SelectTrigger>
          <SelectContent>
            {ROLE_OPTIONS.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {formData.projectLeadRole === 'other' && (
          <Input
            placeholder='Please specify *'
            value={formData.projectLeadRoleOther}
            onChange={e => updateFormData('projectLeadRoleOther', e.target.value)}
            className='mt-3'
          />
        )}
      </div>

      <div className='space-y-8'>
        <div className='text-center mb-6 pt-6'>
          <h3 className='text-2xl font-bold text-primary mb-2'>
            * What factors are most important in your decision?
          </h3>
          <p className='text-muted-foreground'>Select all factors that influence your decision</p>
        </div>

        <div className='grid gap-4'>
          {DECISION_FACTORS.map(option => (
            <Card
              key={option.value}
              className={`cursor-pointer transition-all hover:shadow-md ${
                formData.decisionFactors.includes(option.value)
                  ? 'ring-2 ring-primary bg-primary/5'
                  : 'hover:bg-muted/50'
              }`}
              onClick={() => {
                const isSelected = formData.decisionFactors.includes(option.value);
                if (isSelected) {
                  updateFormData(
                    'decisionFactors',
                    formData.decisionFactors.filter(item => item !== option.value)
                  );
                } else {
                  updateFormData('decisionFactors', [...formData.decisionFactors, option.value]);
                }
              }}
            >
              <CardContent className='p-6'>
                <div className='flex items-center space-x-3'>
                  <input
                    type='checkbox'
                    id={option.value}
                    checked={formData.decisionFactors.includes(option.value)}
                    onChange={e => {
                      if (e.target.checked) {
                        updateFormData('decisionFactors', [
                          ...formData.decisionFactors,
                          option.value,
                        ]);
                      } else {
                        updateFormData(
                          'decisionFactors',
                          formData.decisionFactors.filter(item => item !== option.value)
                        );
                      }
                    }}
                    className='w-4 h-4 pointer-events-none'
                    tabIndex={-1}
                  />
                  <div className='flex-1'>
                    <h4 className='font-semibold text-lg'>{option.label}</h4>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {formData.decisionFactors.includes('other') && (
          <Input
            placeholder='Please specify other factors...'
            value={formData.howDidYouHearOther || ''}
            onChange={e => updateFormData('howDidYouHearOther', e.target.value)}
            className='mt-3'
          />
        )}
      </div>
    </motion.div>
  );

  const renderSourceStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className='space-y-8'
    >
      <div className='space-y-8'>
        <div className='text-center mb-6 pt-6'>
          <h3 className='text-2xl font-bold text-primary mb-2'>* How did you hear about us?</h3>
          <p className='text-muted-foreground'>Select how you discovered our services</p>
        </div>

        <div className='grid gap-4'>
          {SOURCE_OPTIONS.map(option => (
            <Card
              key={option.value}
              className={`cursor-pointer transition-all hover:shadow-md ${
                formData.howDidYouHear === option.value
                  ? 'ring-2 ring-primary bg-primary/5'
                  : 'hover:bg-muted/50'
              }`}
              onClick={() => {
                updateFormData('howDidYouHear', option.value);
              }}
            >
              <CardContent className='p-6'>
                <div className='flex items-center space-x-3'>
                  <input
                    type='radio'
                    name='howDidYouHear'
                    value={option.value}
                    checked={formData.howDidYouHear === option.value}
                    onChange={() => updateFormData('howDidYouHear', option.value)}
                    className='w-4 h-4 pointer-events-none'
                    tabIndex={-1}
                  />
                  <div className='flex-1'>
                    <h4 className='font-semibold text-lg'>{option.label}</h4>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {formData.howDidYouHear === 'other' && (
          <Input
            placeholder='Please specify how you heard about us...'
            value={formData.howDidYouHearOther || ''}
            onChange={e => updateFormData('howDidYouHearOther', e.target.value)}
            className='mt-3'
          />
        )}
      </div>
    </motion.div>
  );

  const renderThankYouMessage = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='text-center space-y-8'
    >
      <div className='bg-green-50 border border-green-200 rounded-lg p-8'>
        <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6'>
          <CheckCircle className='h-8 w-8 text-green-600' />
        </div>
        <h2 className='text-3xl font-bold text-green-900 mb-4'>Thank You!</h2>
        <p className='text-lg text-green-800 mb-6'>
          Thank you for letting us know your initial requirements. To help us process you quicker
          and provide an excellent service, please feel free to complete the entire needs assessment
          form. This won't take more than 5 minutes.
        </p>
        <div className='space-y-4'>
          <Button
            onClick={() => navigateToNeedsAssessment(formData.email)}
            className='bg-accent-security hover:bg-accent-security/90 text-white px-8 py-3 text-lg'
          >
            Complete Needs Assessment Form
          </Button>
          <div>
            <Button
              variant='outline'
              onClick={() => navigateToHome()}
              className='text-gray-600 hover:text-gray-800'
            >
              Go back to home
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderSummaryStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className='space-y-6'
    >
      <div className='text-center mb-8 pt-6'>
        <h2 className='text-2xl font-bold text-gray-900 mb-2'>Review Your Information</h2>
        <p className='text-gray-600'>Please review your responses before submitting.</p>
      </div>

      <div className='grid gap-4'>
        {/* Service Needs Summary */}
        <Card>
          <CardHeader className='flex flex-row items-center justify-between'>
            <CardTitle className='text-lg'>Service Needs</CardTitle>
            <Button
              variant='outline'
              size='sm'
              onClick={() => navigateToStepForEdit(1)}
              className='flex items-center gap-2'
            >
              <Edit className='h-4 w-4' />
              Edit
            </Button>
          </CardHeader>
          <CardContent className='space-y-2'>
            <div>
              <span className='font-medium'>Service Type:</span>{' '}
              {SERVICE_TYPES.find(s => s.value === formData.serviceType)?.label}
            </div>
            <div>
              <span className='font-medium'>Expected Outcomes:</span>
              <ul className='list-disc list-inside ml-4 mt-1'>
                {formData.expectedOutcomes.map(outcome => (
                  <li key={outcome}>{EXPECTED_OUTCOMES.find(e => e.value === outcome)?.label}</li>
                ))}
              </ul>
            </div>
            {formData.currentChallenges && (
              <div>
                <span className='font-medium'>Current Challenges:</span>
                <p className='mt-1 text-sm text-gray-600'>{formData.currentChallenges}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Timing Summary */}
        <Card>
          <CardHeader className='flex flex-row items-center justify-between'>
            <CardTitle className='text-lg'>Timing & Urgency</CardTitle>
            <Button
              variant='outline'
              size='sm'
              onClick={() => navigateToStepForEdit(2)}
              className='flex items-center gap-2'
            >
              <Edit className='h-4 w-4' />
              Edit
            </Button>
          </CardHeader>
          <CardContent className='space-y-2'>
            <div>
              <span className='font-medium'>Service Start:</span>{' '}
              {TIMELINE_OPTIONS.find(t => t.value === formData.serviceStartTimeline)?.label}
            </div>
            <div>
              <span className='font-medium'>Decision Timeline:</span>{' '}
              {DECISION_TIMELINE_OPTIONS.find(t => t.value === formData.decisionTimeline)?.label}
            </div>
          </CardContent>
        </Card>

        {/* Budget Summary */}
        <Card>
          <CardHeader className='flex flex-row items-center justify-between'>
            <CardTitle className='text-lg'>Budget</CardTitle>
            <Button
              variant='outline'
              size='sm'
              onClick={() => navigateToStepForEdit(3)}
              className='flex items-center gap-2'
            >
              <Edit className='h-4 w-4' />
              Edit
            </Button>
          </CardHeader>
          <CardContent>
            <div>
              <span className='font-medium'>Has Budget:</span> {formData.hasBudget ? 'Yes' : 'No'}
            </div>
            {formData.hasBudget && (
              <>
                <div>
                  <span className='font-medium'>Currency:</span>{' '}
                  {CURRENCY_OPTIONS.find(c => c.value === formData.currency)?.label}
                </div>
                <div>
                  <span className='font-medium'>Budget Range:</span>{' '}
                  {BUDGET_RANGES.find(b => b.value === formData.budgetRange)?.label}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Decision Process Summary */}
        <Card>
          <CardHeader className='flex flex-row items-center justify-between'>
            <CardTitle className='text-lg'>Decision Process</CardTitle>
            <Button
              variant='outline'
              size='sm'
              onClick={() => navigateToStepForEdit(4)}
              className='flex items-center gap-2'
            >
              <Edit className='h-4 w-4' />
              Edit
            </Button>
          </CardHeader>
          <CardContent className='space-y-2'>
            <div>
              <span className='font-medium'>Project Lead:</span> {formData.projectLead}
            </div>
            <div>
              <span className='font-medium'>Role:</span>{' '}
              {ROLE_OPTIONS.find(r => r.value === formData.projectLeadRole)?.label}
              {formData.projectLeadRole === 'other' && formData.projectLeadRoleOther && (
                <span> - {formData.projectLeadRoleOther}</span>
              )}
            </div>
            <div>
              <span className='font-medium'>Decision Factors:</span>
              <ul className='list-disc list-inside ml-4 mt-1'>
                {formData.decisionFactors.map(factor => (
                  <li key={factor}>{DECISION_FACTORS.find(f => f.value === factor)?.label}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Source Summary */}
        <Card>
          <CardHeader className='flex flex-row items-center justify-between'>
            <CardTitle className='text-lg'>Source</CardTitle>
            <Button
              variant='outline'
              size='sm'
              onClick={() => navigateToStepForEdit(5)}
              className='flex items-center gap-2'
            >
              <Edit className='h-4 w-4' />
              Edit
            </Button>
          </CardHeader>
          <CardContent>
            <div>
              <span className='font-medium'>How you heard about us:</span>{' '}
              {SOURCE_OPTIONS.find(s => s.value === formData.howDidYouHear)?.label}
            </div>
            {formData.howDidYouHearOther && (
              <div>
                <span className='font-medium'>Details:</span> {formData.howDidYouHearOther}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderServiceNeedsStep();
      case 2:
        return renderTimingStep();
      case 3:
        return renderBudgetStep();
      case 4:
        return renderDecisionProcessStep();
      case 5:
        return renderSourceStep();
      case 6:
        return renderSummaryStep();
      default:
        return null;
    }
  };

  const progressPercentage = (currentStep / TOTAL_STEPS) * 100;

  return (
    <div className='min-h-screen bg-gray-50'>
      <NeedsAssessmentHeader />

      <div className='pt-20 pb-8'>
        <div className='container mx-auto px-4 max-w-4xl'>
          {/* Email Block */}
          {hasValidEmail ? (
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
                <span className='font-semibold text-red-900'>Email Required</span>
              </div>
              <p className='text-sm text-red-700 mt-1'>
                Please provide a valid email address to continue
              </p>
            </div>
          )}

          {/* Progress Header */}
          <div className='mb-8'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-3xl font-bold text-primary'>Client Introduction</h2>
              <Badge variant='outline' className='text-sm'>
                {isEditMode ? 'Edit Mode' : `Step ${currentStep} of ${TOTAL_STEPS}`}
              </Badge>
            </div>
            <div className='mb-6'>
              <Progress
                value={progressPercentage}
                className={`mb-2 ${progressPercentage === 100 ? 'progress-complete' : ''}`}
              />
            </div>

            {/* Edit Mode Alert */}
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

            {/* Step Icons */}
            <div className='flex items-center justify-between text-sm'>
              {STEPS.map(step => {
                const Icon = step.icon;
                const isCompleted = currentStep > step.id;
                const isCurrentStep = step.id === currentStep;

                // Determine the visual state
                let stepState = 'future';
                if (isCompleted) {
                  stepState = 'completed';
                } else if (isCurrentStep) {
                  stepState = 'current';
                }

                return (
                  <div
                    key={step.id}
                    className={`flex flex-col items-center space-y-1 ${
                      stepState === 'completed'
                        ? 'text-green-600'
                        : stepState === 'current'
                          ? 'text-primary'
                          : 'text-muted-foreground'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        stepState === 'completed'
                          ? 'bg-green-600 text-white'
                          : stepState === 'current'
                            ? 'bg-primary text-white'
                            : 'bg-primary/20 text-primary border-2 border-primary'
                      }`}
                    >
                      {stepState === 'completed' ? (
                        <CheckCircle className='h-4 w-4' />
                      ) : (
                        <Icon className='h-4 w-4' />
                      )}
                    </div>
                    <span className='hidden md:block text-xs text-center max-w-16'>
                      {step.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert className='mb-6' variant='destructive'>
              <AlertCircle className='h-4 w-4' />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* CAPTCHA Error Alert */}
          {captchaError && (
            <Alert className='mb-6' variant='destructive'>
              <AlertCircle className='h-4 w-4' />
              <AlertDescription>Security verification failed: {captchaError}</AlertDescription>
            </Alert>
          )}

          {/* Form Content */}
          <Card className='mb-8'>
            <CardContent>
              <AnimatePresence mode='wait'>
                {isSubmitted ? renderThankYouMessage() : renderCurrentStep()}
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          {!isSubmitted && (
            <div className='flex justify-between'>
              <Button
                variant='outline'
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className='flex items-center gap-2'
              >
                <ChevronLeft className='h-4 w-4' />
                Previous
              </Button>

              {currentStep < TOTAL_STEPS ? (
                <Button
                  onClick={handleNext}
                  disabled={!isStepValid(currentStep)}
                  className={`flex items-center gap-2 ${
                    updateSuccess ? 'bg-green-600 hover:bg-green-700' : ''
                  }`}
                >
                  {updateSuccess ? (
                    <>
                      <CheckCircle className='h-4 w-4' />
                      Updated!
                    </>
                  ) : isEditMode ? (
                    <>
                      Update
                      <CheckCircle className='h-4 w-4' />
                    </>
                  ) : (
                    <>
                      Next
                      <ChevronRight className='h-4 w-4' />
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || isCaptchaVerifying}
                  className='flex items-center gap-2'
                >
                  {isSubmitting || isCaptchaVerifying ? (
                    <>
                      <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                      {isCaptchaVerifying ? 'Verifying security...' : 'Submitting...'}
                    </>
                  ) : (
                    <>
                      <CheckCircle className='h-4 w-4' />
                      Submit Form
                    </>
                  )}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InitialOnboardingForm;
