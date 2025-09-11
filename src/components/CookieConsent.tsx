import { useState, useEffect } from 'react';
import { Cookie, Settings, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

interface CookieConsentProps {
  onAccept?: (preferences: CookiePreferences) => void;
  onDecline?: () => void;
}

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

const CookieConsent = ({ onAccept, onDecline }: CookieConsentProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true, // Always true, can't be disabled
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('hermes-cookie-consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      essential: true,
      analytics: true,
      marketing: true,
    };
    localStorage.setItem('hermes-cookie-consent', JSON.stringify(allAccepted));
    setIsVisible(false);
    onAccept?.(allAccepted);
  };

  const handleAcceptSelected = () => {
    localStorage.setItem('hermes-cookie-consent', JSON.stringify(preferences));
    setIsVisible(false);
    onAccept?.(preferences);
  };

  const handleDecline = () => {
    const declined = {
      essential: true,
      analytics: false,
      marketing: false,
    };
    localStorage.setItem('hermes-cookie-consent', JSON.stringify(declined));
    setIsVisible(false);
    onDecline?.();
  };

  const handlePreferenceChange = (key: keyof CookiePreferences, checked: boolean) => {
    if (key === 'essential') return; // Essential cookies can't be disabled
    setPreferences(prev => ({ ...prev, [key]: checked }));
  };

  if (!isVisible) return null;

  return (
    <div className='fixed bottom-0 left-0 right-0 z-50 p-4 bg-black/50 backdrop-blur-sm'>
      <div className='max-w-4xl mx-auto'>
        <Card className='border-2 border-blue-200 shadow-2xl'>
          <CardHeader className='pb-4'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-3'>
                <div className='p-2 bg-blue-100 rounded-full'>
                  <Cookie className='w-6 h-6 text-blue-600' />
                </div>
                <div>
                  <CardTitle className='text-lg text-gray-900'>Cookie Preferences</CardTitle>
                  <p className='text-sm text-gray-600 mt-1'>
                    We use cookies to enhance your experience and analyze site usage
                  </p>
                </div>
              </div>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setShowDetails(!showDetails)}
                className='text-gray-500 hover:text-gray-700'
              >
                <Settings className='w-4 h-4' />
              </Button>
            </div>
          </CardHeader>

          <CardContent className='space-y-4'>
            {!showDetails ? (
              // Simple view
              <div className='space-y-4'>
                <p className='text-sm text-gray-700'>
                  We use essential cookies to make our site work. We'd also like to set analytics
                  cookies to help us improve it. We won't set optional cookies unless you enable
                  them.
                </p>
                <div className='flex flex-col sm:flex-row gap-3'>
                  <Button
                    onClick={handleAcceptAll}
                    className='bg-blue-600 hover:bg-blue-700 text-white'
                  >
                    <Check className='w-4 h-4 mr-2' />
                    Accept All Cookies
                  </Button>
                  <Button
                    onClick={handleDecline}
                    variant='outline'
                    className='border-gray-300 text-gray-700 hover:bg-gray-50'
                  >
                    Essential Only
                  </Button>
                  <Button
                    onClick={() => setShowDetails(true)}
                    variant='ghost'
                    className='text-blue-600 hover:text-blue-700'
                  >
                    Customize
                  </Button>
                </div>
              </div>
            ) : (
              // Detailed view
              <div className='space-y-6'>
                <div className='space-y-4'>
                  <div className='flex items-start space-x-3 p-3 bg-gray-50 rounded-lg'>
                    <Checkbox
                      id='essential'
                      checked={preferences.essential}
                      disabled
                      className='mt-1'
                    />
                    <div className='flex-1'>
                      <label htmlFor='essential' className='font-medium text-gray-900'>
                        Essential Cookies
                      </label>
                      <p className='text-sm text-gray-600 mt-1'>
                        Required for the website to function properly. These cannot be disabled.
                      </p>
                    </div>
                  </div>

                  <div className='flex items-start space-x-3 p-3 bg-gray-50 rounded-lg'>
                    <Checkbox
                      id='analytics'
                      checked={preferences.analytics}
                      onCheckedChange={checked =>
                        handlePreferenceChange('analytics', checked as boolean)
                      }
                      className='mt-1'
                    />
                    <div className='flex-1'>
                      <label htmlFor='analytics' className='font-medium text-gray-900'>
                        Analytics Cookies
                      </label>
                      <p className='text-sm text-gray-600 mt-1'>
                        Help us understand how visitors interact with our website by collecting and
                        reporting information anonymously.
                      </p>
                    </div>
                  </div>

                  <div className='flex items-start space-x-3 p-3 bg-gray-50 rounded-lg'>
                    <Checkbox
                      id='marketing'
                      checked={preferences.marketing}
                      onCheckedChange={checked =>
                        handlePreferenceChange('marketing', checked as boolean)
                      }
                      className='mt-1'
                    />
                    <div className='flex-1'>
                      <label htmlFor='marketing' className='font-medium text-gray-900'>
                        Marketing Cookies
                      </label>
                      <p className='text-sm text-gray-600 mt-1'>
                        Used to track visitors across websites to display relevant and engaging
                        advertisements.
                      </p>
                    </div>
                  </div>
                </div>

                <div className='border-t pt-4'>
                  <p className='text-xs text-gray-500 mb-4'>
                    For more information about how we use cookies, please read our{' '}
                    <a
                      href='/#/privacy'
                      className='text-blue-600 hover:underline'
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      Privacy Policy
                    </a>{' '}
                    and{' '}
                    <a
                      href='/#/terms'
                      className='text-blue-600 hover:underline'
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      Terms of Use
                    </a>
                    .
                  </p>

                  <div className='flex flex-col sm:flex-row gap-3'>
                    <Button
                      onClick={handleAcceptSelected}
                      className='bg-blue-600 hover:bg-blue-700 text-white'
                    >
                      <Check className='w-4 h-4 mr-2' />
                      Save Preferences
                    </Button>
                    <Button
                      onClick={handleAcceptAll}
                      variant='outline'
                      className='border-blue-300 text-blue-600 hover:bg-blue-50'
                    >
                      Accept All
                    </Button>
                    <Button
                      onClick={handleDecline}
                      variant='ghost'
                      className='text-gray-600 hover:text-gray-700'
                    >
                      Essential Only
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CookieConsent;
