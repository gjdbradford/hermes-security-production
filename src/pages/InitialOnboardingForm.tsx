import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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
} from '@/types/onboarding';

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
  const [error, setError] = useState<string | null>(null);
  const [emailFromUrl, setEmailFromUrl] = useState<string>('');
  const [localEmail, setLocalEmail] = useState<string>('');

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
      case 4: // Decision Process - projectLead and decisionFactors are mandatory
        return formData.projectLead !== '' && formData.decisionFactors.length > 0;
      case 5: // Source - howDidYouHear is mandatory
        return formData.howDidYouHear !== '';
      case 6: // Summary
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (isStepValid(currentStep)) {
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

  const handleEditStep = (step: number) => {
    setCurrentStep(step);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // For now, just log the data
      console.log('Form submission data:', JSON.stringify(formData, null, 2));

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Here you would typically send the data to your API
      console.log('Form submitted successfully! Check console for data.');
    } catch (_err) {
      setError('Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStepTitle = (step: number) => {
    return STEPS.find(s => s.id === step)?.title || 'Unknown';
  };

  const getStepIcon = (step: number) => {
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
                updateFormData('serviceType', option.value);
              }}
            >
              <CardContent className='p-4'>
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
        <Label className='text-lg font-semibold mb-4 block'>
          * What outcomes are you expecting from our penetration testing/security services?
        </Label>
        <div className='space-y-3'>
          {EXPECTED_OUTCOMES.map(option => (
            <div key={option.value} className='flex items-center space-x-2'>
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
                className='w-4 h-4'
              />
              <label htmlFor={option.value} className='text-base'>
                {option.label}
              </label>
            </div>
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
    </motion.div>
  );

  const renderTimingStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className='space-y-6'
    >
      <div>
        <Label className='text-lg font-semibold mb-4 block'>
          * When do you need our services to start?
        </Label>
        <RadioGroup
          value={formData.serviceStartTimeline}
          onValueChange={value => updateFormData('serviceStartTimeline', value)}
          className='space-y-3'
        >
          {TIMELINE_OPTIONS.map(option => (
            <div
              key={option.value}
              className='flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 transition-colors'
            >
              <RadioGroupItem value={option.value} id={option.value} />
              <Label htmlFor={option.value} className='text-base cursor-pointer flex-1'>
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div>
        <Label className='text-lg font-semibold mb-4 block'>
          * What is your timeframe for making a decision?
        </Label>
        <RadioGroup
          value={formData.decisionTimeline}
          onValueChange={value => updateFormData('decisionTimeline', value)}
          className='space-y-3'
        >
          {DECISION_TIMELINE_OPTIONS.map(option => (
            <div
              key={option.value}
              className='flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 transition-colors'
            >
              <RadioGroupItem value={option.value} id={option.value} />
              <Label htmlFor={option.value} className='text-base cursor-pointer flex-1'>
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </motion.div>
  );

  const renderBudgetStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className='space-y-6'
    >
      <div>
        <Label className='text-lg font-semibold mb-4 block'>
          * Do you have a budget allocated?
        </Label>
        <RadioGroup
          value={formData.hasBudget ? 'yes' : 'no'}
          onValueChange={value => updateFormData('hasBudget', value === 'yes')}
          className='space-y-3'
        >
          <div className='flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 transition-colors'>
            <RadioGroupItem value='yes' id='budget-yes' />
            <Label htmlFor='budget-yes' className='text-base cursor-pointer flex-1'>
              Yes
            </Label>
          </div>
          <div className='flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 transition-colors'>
            <RadioGroupItem value='no' id='budget-no' />
            <Label htmlFor='budget-no' className='text-base cursor-pointer flex-1'>
              No
            </Label>
          </div>
        </RadioGroup>
      </div>

      {formData.hasBudget && (
        <>
          <div>
            <Label className='text-lg font-semibold mb-4 block'>Currency</Label>
            <Select
              value={formData.currency}
              onValueChange={value => updateFormData('currency', value)}
            >
              <SelectTrigger>
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

          <div>
            <Label className='text-lg font-semibold mb-4 block'>* Budget Range</Label>
            <RadioGroup
              value={formData.budgetRange}
              onValueChange={value => updateFormData('budgetRange', value)}
              className='space-y-3'
            >
              {BUDGET_RANGES.map(option => (
                <div
                  key={option.value}
                  className='flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 transition-colors'
                >
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value} className='text-base cursor-pointer flex-1'>
                    {option.label}{' '}
                    {formData.currency &&
                      CURRENCY_OPTIONS.find(c => c.value === formData.currency)?.symbol}
                  </Label>
                </div>
              ))}
            </RadioGroup>
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
      <div>
        <Label htmlFor='projectLead' className='text-lg font-semibold mb-4 block'>
          * Who is the lead on this project?
        </Label>
        <Input
          id='projectLead'
          placeholder='Enter project lead name...'
          value={formData.projectLead}
          onChange={e => updateFormData('projectLead', e.target.value)}
        />
      </div>

      <div>
        <Label className='text-lg font-semibold mb-4 block'>
          * What factors are most important in your decision?
        </Label>
        <div className='space-y-3'>
          {DECISION_FACTORS.map(option => (
            <div key={option.value} className='flex items-center space-x-2'>
              <input
                type='checkbox'
                id={option.value}
                checked={formData.decisionFactors.includes(option.value)}
                onChange={e => {
                  if (e.target.checked) {
                    updateFormData('decisionFactors', [...formData.decisionFactors, option.value]);
                  } else {
                    updateFormData(
                      'decisionFactors',
                      formData.decisionFactors.filter(item => item !== option.value)
                    );
                  }
                }}
                className='w-4 h-4'
              />
              <label htmlFor={option.value} className='text-base'>
                {option.label}
              </label>
            </div>
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
      className='space-y-6'
    >
      <div>
        <Label className='text-lg font-semibold mb-4 block'>* How did you hear about us?</Label>
        <RadioGroup
          value={formData.howDidYouHear}
          onValueChange={value => updateFormData('howDidYouHear', value)}
          className='space-y-3'
        >
          {SOURCE_OPTIONS.map(option => (
            <div
              key={option.value}
              className='flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 transition-colors'
            >
              <RadioGroupItem value={option.value} id={option.value} />
              <Label htmlFor={option.value} className='text-base cursor-pointer flex-1'>
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
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

  const renderSummaryStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className='space-y-6'
    >
      <div className='text-center mb-8'>
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
              onClick={() => handleEditStep(1)}
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
              onClick={() => handleEditStep(2)}
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
              onClick={() => handleEditStep(3)}
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
              onClick={() => handleEditStep(4)}
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
              onClick={() => handleEditStep(5)}
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
              <h2 className='text-3xl font-bold text-primary'>Initial Onboarding Form</h2>
              <Badge variant='outline' className='text-sm'>
                Step {currentStep} of {TOTAL_STEPS}
              </Badge>
            </div>
            <div className='mb-6'>
              <Progress
                value={progressPercentage}
                className={`mb-2 ${progressPercentage === 100 ? 'progress-complete' : ''}`}
              />
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert className='mb-6' variant='destructive'>
              <AlertCircle className='h-4 w-4' />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Form Content */}
          <Card className='mb-8'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                {React.createElement(getStepIcon(currentStep), { className: 'h-5 w-5' })}
                {getStepTitle(currentStep)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode='wait'>{renderCurrentStep()}</AnimatePresence>
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
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
                className='flex items-center gap-2'
              >
                Next
                <ChevronRight className='h-4 w-4' />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className='flex items-center gap-2'
              >
                {isSubmitting ? (
                  <>
                    <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                    Submitting...
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
        </div>
      </div>
    </div>
  );
};

export default InitialOnboardingForm;
