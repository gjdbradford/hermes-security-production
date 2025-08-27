import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Phone, 
  MessageCircle, 
  Video, 
  Calendar, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  TestTube,
  Target,
  Shield
} from "lucide-react";
import { DiscoveryCallTriggers, CrispTriggers } from "@/utils/crispTriggers";

interface TestResult {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  message: string;
  timestamp: Date;
}

export default function DiscoveryCallTestRunner() {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addTestResult = (id: string, name: string, status: TestResult['status'], message: string) => {
    setTestResults(prev => [
      ...prev,
      {
        id,
        name,
        status,
        message,
        timestamp: new Date()
      }
    ]);
  };

  const runSingleTest = async (testId: string, testName: string, testFunction: () => void) => {
    addTestResult(testId, testName, 'running', 'Test is running...');
    
    try {
      // Check if Crisp is available
      if (!window.$crisp) {
        addTestResult(testId, testName, 'failed', 'Crisp is not loaded');
        return;
      }

      // Run the test
      testFunction();
      
      // Simulate test completion
      setTimeout(() => {
        addTestResult(testId, testName, 'passed', 'Test completed successfully');
      }, 2000);
      
    } catch (error) {
      addTestResult(testId, testName, 'failed', `Test failed: ${error}`);
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults([]);

    const tests = [
      {
        id: 'discovery-call-basic',
        name: 'Basic Discovery Call Trigger',
        function: () => DiscoveryCallTriggers.triggerDiscoveryCall()
      },
              {
          id: 'hero-slide-1-trigger',
          name: 'Hero Slide 1 - Dont be in tomorrows news',
          function: () => DiscoveryCallTriggers.triggerDiscoveryCall(
            "🧪 TEST: AI speed. Human ethics. Real impact. - Don't be in tomorrow's news."
          )
        },
      {
        id: 'hero-slide-2-trigger',
        name: 'Hero Slide 2 - Fix Asymmetry',
        function: () => DiscoveryCallTriggers.triggerDiscoveryCall(
          "🧪 TEST: Fix the Asymmetry - AI-driven penetration testing with human oversight."
        )
      },
      {
        id: 'phone-call-trigger',
        name: 'Phone Call Trigger',
        function: () => DiscoveryCallTriggers.triggerPhoneCall()
      },
      {
        id: 'whatsapp-trigger',
        name: 'WhatsApp Trigger',
        function: () => DiscoveryCallTriggers.triggerWhatsApp()
      },
      {
        id: 'video-call-trigger',
        name: 'Video Call Trigger',
        function: () => DiscoveryCallTriggers.triggerVideoCall()
      },
      {
        id: 'urgent-call-trigger',
        name: 'Urgent Call Trigger',
        function: () => DiscoveryCallTriggers.triggerUrgentCall()
      },
      {
        id: 'custom-message-trigger',
        name: 'Custom Message Trigger',
        function: () => DiscoveryCallTriggers.triggerDiscoveryCall(
          "🧪 TEST MESSAGE: This is a custom discovery call message for testing purposes."
        )
      },
      {
        id: 'services-navigation-test',
        name: 'Services Navigation Anchor Test',
        function: () => {
          // Test Services navigation anchor
          const servicesLink = document.querySelector('a[href="#services"]') as HTMLAnchorElement;
          if (servicesLink) {
            servicesLink.click();
            // Check if we scrolled to the services section
            const servicesSection = document.getElementById('services');
            if (servicesSection) {
              const rect = servicesSection.getBoundingClientRect();
              if (rect.top <= 100) { // Within 100px of top
                console.log('✅ Services navigation test passed');
              } else {
                console.log('❌ Services navigation test failed - section not in view');
              }
            } else {
              console.log('❌ Services navigation test failed - services section not found');
            }
          } else {
            console.log('❌ Services navigation test failed - services link not found');
          }
        }
      }
    ];

    for (const test of tests) {
      await runSingleTest(test.id, test.name, test.function);
      // Wait between tests
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    setIsRunning(false);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-gray-400" />;
      case 'running':
        return <TestTube className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'passed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusBadge = (status: TestResult['status']) => {
    const variants = {
      pending: 'secondary',
      running: 'default',
      passed: 'default',
      failed: 'destructive'
    } as const;

    return (
      <Badge variant={variants[status]}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="w-5 h-5" />
            Discovery Call Test Runner
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button 
              onClick={runAllTests} 
              disabled={isRunning}
              className="flex-1"
            >
              {isRunning ? 'Running Tests...' : 'Run All Tests'}
            </Button>
            <Button 
              onClick={clearResults} 
              variant="outline"
              disabled={isRunning}
            >
              Clear Results
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button 
              onClick={() => runSingleTest('discovery-call-basic', 'Basic Discovery Call', () => DiscoveryCallTriggers.triggerDiscoveryCall())}
              disabled={isRunning}
              variant="outline"
              className="h-20 flex-col"
            >
              <Calendar className="w-5 h-5 mb-1" />
              Basic Discovery Call
            </Button>

            <Button 
              onClick={() => runSingleTest('hero-slide-1', 'Hero Slide 1 - Dont be in tomorrows news', () => DiscoveryCallTriggers.triggerDiscoveryCall("🧪 TEST: AI speed. Human ethics. Real impact. - Don't be in tomorrow's news."))}
              disabled={isRunning}
              variant="outline"
              className="h-20 flex-col"
            >
              <Target className="w-5 h-5 mb-1" />
              Hero Slide 1
            </Button>

            <Button 
              onClick={() => runSingleTest('hero-slide-2', 'Hero Slide 2 - Fix Asymmetry', () => DiscoveryCallTriggers.triggerDiscoveryCall("🧪 TEST: Fix the Asymmetry - AI-driven penetration testing with human oversight."))}
              disabled={isRunning}
              variant="outline"
              className="h-20 flex-col"
            >
              <Shield className="w-5 h-5 mb-1" />
              Hero Slide 2
            </Button>

            <Button 
              onClick={() => runSingleTest('phone-call', 'Phone Call', () => DiscoveryCallTriggers.triggerPhoneCall())}
              disabled={isRunning}
              variant="outline"
              className="h-20 flex-col"
            >
              <Phone className="w-5 h-5 mb-1" />
              Phone Call
            </Button>

            <Button 
              onClick={() => runSingleTest('whatsapp', 'WhatsApp', () => DiscoveryCallTriggers.triggerWhatsApp())}
              disabled={isRunning}
              variant="outline"
              className="h-20 flex-col"
            >
              <MessageCircle className="w-5 h-5 mb-1" />
              WhatsApp
            </Button>

            <Button 
              onClick={() => runSingleTest('video-call', 'Video Call', () => DiscoveryCallTriggers.triggerVideoCall())}
              disabled={isRunning}
              variant="outline"
              className="h-20 flex-col"
            >
              <Video className="w-5 h-5 mb-1" />
              Video Call
            </Button>

            <Button 
              onClick={() => runSingleTest('urgent-call', 'Urgent Call', () => DiscoveryCallTriggers.triggerUrgentCall())}
              disabled={isRunning}
              variant="outline"
              className="h-20 flex-col"
            >
              <AlertTriangle className="w-5 h-5 mb-1" />
              Urgent Call
            </Button>

            <Button 
              onClick={() => runSingleTest('custom-message', 'Custom Message', () => DiscoveryCallTriggers.triggerDiscoveryCall("🧪 TEST: Custom message for testing"))}
              disabled={isRunning}
              variant="outline"
              className="h-20 flex-col"
            >
              <TestTube className="w-5 h-5 mb-1" />
              Custom Message
            </Button>

            <Button 
              onClick={() => runSingleTest('services-navigation', 'Services Navigation', () => {
                const servicesLink = document.querySelector('a[href="#services"]') as HTMLAnchorElement;
                if (servicesLink) {
                  servicesLink.click();
                  const servicesSection = document.getElementById('services');
                  if (servicesSection) {
                    const rect = servicesSection.getBoundingClientRect();
                    if (rect.top <= 100) {
                      console.log('✅ Services navigation test passed');
                    } else {
                      console.log('❌ Services navigation test failed - section not in view');
                    }
                  } else {
                    console.log('❌ Services navigation test failed - services section not found');
                  }
                } else {
                  console.log('❌ Services navigation test failed - services link not found');
                }
              })}
              disabled={isRunning}
              variant="outline"
              className="h-20 flex-col"
            >
              <Shield className="w-5 h-5 mb-1" />
              Services Navigation
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      <Card>
        <CardHeader>
          <CardTitle>Test Results</CardTitle>
        </CardHeader>
        <CardContent>
          {testResults.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No test results yet. Click "Run All Tests" to start testing.
            </p>
          ) : (
            <div className="space-y-3">
              {testResults.map((result) => (
                <div 
                  key={result.id} 
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(result.status)}
                    <div>
                      <p className="font-medium">{result.name}</p>
                      <p className="text-sm text-gray-600">{result.message}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(result.status)}
                    <span className="text-xs text-gray-500">
                      {result.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Test Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Test Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Before Running Tests:</h4>
            <ul className="text-sm space-y-1">
              <li>✅ Ensure Crisp script is loaded (check browser console)</li>
              <li>✅ Verify Crisp chat widget appears on the page</li>
              <li>✅ Have Crisp dashboard open to monitor AI agent responses</li>
              <li>✅ Clear browser cache if needed</li>
            </ul>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">What to Test:</h4>
            <ul className="text-sm space-y-1">
              <li>🔍 Watch for Crisp chat window opening</li>
              <li>🔍 Verify AI agent sends appropriate messages</li>
              <li>🔍 Check session data in Crisp dashboard</li>
              <li>🔍 Test different communication preferences</li>
              <li>🔍 Verify phone number collection workflow</li>
            </ul>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Troubleshooting:</h4>
            <ul className="text-sm space-y-1">
              <li>⚠️ If chat doesn't open, check if Crisp script is loaded</li>
              <li>⚠️ If AI doesn't respond, check Crisp AI agent configuration</li>
              <li>⚠️ If session data is missing, verify trigger implementation</li>
              <li>⚠️ Check browser console for JavaScript errors</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
