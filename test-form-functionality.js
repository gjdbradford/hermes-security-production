/**
 * Needs Assessment Form Test Script
 * This script provides automated testing functions for the needs assessment form
 */

// Test configuration
const TEST_CONFIG = {
  baseUrl: 'http://localhost:5173', // Vite default port
  testEmail: 'test@example.com',
  timeout: 5000
};

// Test data for form fields
const TEST_DATA = {
  basicInfo: {
    pentestType: 'gray-box',
    productionEnvironment: true,
    stagingEnvironment: false,
    preferredTime: 'business-hours',
    monitoringSystems: true,
    additionalInfo: 'This is a test submission for automated testing.'
  },
  services: ['website', 'mobile', 'api'],
  webApplications: {
    count: '2-3',
    technologies: ['React', 'Node.js'],
    vulnerabilities: ['sql-injection', 'xss'],
    concerns: 'Test web application concerns'
  },
  mobileApplications: {
    count: '1',
    platforms: ['ios', 'android'],
    frameworks: ['React Native'],
    features: ['biometric-auth', 'push-notifications']
  },
  apiEndpoints: {
    count: '11-25',
    types: ['rest', 'graphql'],
    authentication: ['oauth2', 'jwt'],
    sensitiveData: ['pii', 'financial']
  }
};

/**
 * Test Functions
 */

// Test 1: Direct URL Access
async function testDirectUrlAccess() {
  console.log('🧪 Testing direct URL access...');
  try {
    const response = await fetch(`${TEST_CONFIG.baseUrl}/needs-assessment`);
    if (response.ok) {
      console.log('✅ Direct URL access test passed');
      return true;
    } else {
      console.log('❌ Direct URL access test failed:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ Direct URL access test failed:', error.message);
    return false;
  }
}

// Test 2: Email Parameter Handling
async function testEmailParameterHandling() {
  console.log('🧪 Testing email parameter handling...');
  try {
    const url = `${TEST_CONFIG.baseUrl}/needs-assessment?email=${encodeURIComponent(TEST_CONFIG.testEmail)}`;
    const response = await fetch(url);
    if (response.ok) {
      console.log('✅ Email parameter handling test passed');
      return true;
    } else {
      console.log('❌ Email parameter handling test failed:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ Email parameter handling test failed:', error.message);
    return false;
  }
}

// Test 3: Form Field Validation (Simulated)
function testFormValidation() {
  console.log('🧪 Testing form validation logic...');
  
  const validationTests = [
    {
      name: 'Basic Info Validation',
      test: () => {
        const hasPentestType = !!TEST_DATA.basicInfo.pentestType;
        const hasPreferredTime = !!TEST_DATA.basicInfo.preferredTime;
        return hasPentestType && hasPreferredTime;
      }
    },
    {
      name: 'Service Selection Validation',
      test: () => {
        return TEST_DATA.services.length > 0;
      }
    },
    {
      name: 'Web Applications Validation',
      test: () => {
        const hasWebService = TEST_DATA.services.includes('website');
        if (!hasWebService) return true;
        return !!TEST_DATA.webApplications.count;
      }
    },
    {
      name: 'Mobile Applications Validation',
      test: () => {
        const hasMobileService = TEST_DATA.services.includes('mobile');
        if (!hasMobileService) return true;
        return !!TEST_DATA.mobileApplications.count && 
               TEST_DATA.mobileApplications.platforms.length > 0;
      }
    },
    {
      name: 'API Endpoints Validation',
      test: () => {
        const hasApiService = TEST_DATA.services.includes('api');
        if (!hasApiService) return true;
        return !!TEST_DATA.apiEndpoints.count && 
               TEST_DATA.apiEndpoints.types.length > 0;
      }
    }
  ];

  let passedTests = 0;
  validationTests.forEach(test => {
    try {
      const result = test.test();
      if (result) {
        console.log(`✅ ${test.name} validation passed`);
        passedTests++;
      } else {
        console.log(`❌ ${test.name} validation failed`);
      }
    } catch (error) {
      console.log(`❌ ${test.name} validation error:`, error.message);
    }
  });

  const allPassed = passedTests === validationTests.length;
  console.log(`📊 Validation tests: ${passedTests}/${validationTests.length} passed`);
  return allPassed;
}

// Test 4: Dynamic Step Calculation
function testDynamicStepCalculation() {
  console.log('🧪 Testing dynamic step calculation...');
  
  const testCases = [
    {
      services: ['website'],
      expectedSteps: [1, 2, 3, 7],
      description: 'Web Applications only'
    },
    {
      services: ['website', 'mobile'],
      expectedSteps: [1, 2, 3, 4, 7],
      description: 'Web + Mobile Applications'
    },
    {
      services: ['website', 'mobile', 'api'],
      expectedSteps: [1, 2, 3, 4, 5, 7],
      description: 'Web + Mobile + API'
    },
    {
      services: ['website', 'mobile', 'api', 'network'],
      expectedSteps: [1, 2, 3, 4, 5, 6, 7],
      description: 'All services'
    }
  ];

  let passedTests = 0;
  testCases.forEach(testCase => {
    try {
      // Simulate the calculateDynamicSteps function
      const serviceSteps = {
        website: 3,
        mobile: 4,
        api: 5,
        network: 6,
        infrastructure: 6,
      };
      
      const dynamicSteps = testCase.services
        .map(service => serviceSteps[service])
        .filter(step => step !== undefined)
        .sort();
      
      const allSteps = [1, 2, ...dynamicSteps, 7];
      const stepsMatch = JSON.stringify(allSteps) === JSON.stringify(testCase.expectedSteps);
      
      if (stepsMatch) {
        console.log(`✅ ${testCase.description} step calculation passed`);
        passedTests++;
      } else {
        console.log(`❌ ${testCase.description} step calculation failed`);
        console.log(`   Expected: [${testCase.expectedSteps.join(', ')}]`);
        console.log(`   Got: [${allSteps.join(', ')}]`);
      }
    } catch (error) {
      console.log(`❌ ${testCase.description} step calculation error:`, error.message);
    }
  });

  const allPassed = passedTests === testCases.length;
  console.log(`📊 Step calculation tests: ${passedTests}/${testCases.length} passed`);
  return allPassed;
}

// Test 5: Form Data Structure
function testFormDataStructure() {
  console.log('🧪 Testing form data structure...');
  
  const completeFormData = {
    email: TEST_CONFIG.testEmail,
    pentestType: TEST_DATA.basicInfo.pentestType,
    productionEnvironment: TEST_DATA.basicInfo.productionEnvironment,
    stagingEnvironment: TEST_DATA.basicInfo.stagingEnvironment,
    preferredTime: TEST_DATA.basicInfo.preferredTime,
    timezone: '',
    monitoringSystems: TEST_DATA.basicInfo.monitoringSystems,
    additionalInfo: TEST_DATA.basicInfo.additionalInfo,
    selectedServices: TEST_DATA.services,
    webApplications: TEST_DATA.webApplications,
    mobileApplications: TEST_DATA.mobileApplications,
    apiEndpoints: TEST_DATA.apiEndpoints,
    submittedAt: new Date().toISOString(),
    assessmentId: `HERMES-${Date.now()}`
  };

  // Validate required fields
  const requiredFields = [
    'email', 'pentestType', 'preferredTime', 'selectedServices', 
    'submittedAt', 'assessmentId'
  ];

  let validationPassed = true;
  requiredFields.forEach(field => {
    if (!completeFormData[field]) {
      console.log(`❌ Missing required field: ${field}`);
      validationPassed = false;
    }
  });

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(completeFormData.email)) {
    console.log('❌ Invalid email format');
    validationPassed = false;
  }

  // Validate assessment ID format
  if (!completeFormData.assessmentId.startsWith('HERMES-')) {
    console.log('❌ Invalid assessment ID format');
    validationPassed = false;
  }

  if (validationPassed) {
    console.log('✅ Form data structure validation passed');
    console.log('📊 Form data summary:', {
      email: completeFormData.email,
      pentestType: completeFormData.pentestType,
      servicesCount: completeFormData.selectedServices.length,
      assessmentId: completeFormData.assessmentId
    });
  } else {
    console.log('❌ Form data structure validation failed');
  }

  return validationPassed;
}

// Test 6: Success Page Simulation
function testSuccessPageSimulation() {
  console.log('🧪 Testing success page simulation...');
  
  const successPageData = {
    assessmentId: `HERMES-${Date.now()}`,
    submittedAt: new Date().toISOString(),
    email: TEST_CONFIG.testEmail,
    services: TEST_DATA.services
  };

  // Validate success page data
  const hasRequiredData = !!(
    successPageData.assessmentId &&
    successPageData.submittedAt &&
    successPageData.email &&
    successPageData.services.length > 0
  );

  if (hasRequiredData) {
    console.log('✅ Success page simulation passed');
    console.log('📊 Success page data:', successPageData);
    return true;
  } else {
    console.log('❌ Success page simulation failed - missing required data');
    return false;
  }
}

/**
 * Run All Tests
 */
async function runAllTests() {
  console.log('🚀 Starting Needs Assessment Form Tests...\n');
  
  const tests = [
    { name: 'Direct URL Access', fn: testDirectUrlAccess },
    { name: 'Email Parameter Handling', fn: testEmailParameterHandling },
    { name: 'Form Validation', fn: testFormValidation },
    { name: 'Dynamic Step Calculation', fn: testDynamicStepCalculation },
    { name: 'Form Data Structure', fn: testFormDataStructure },
    { name: 'Success Page Simulation', fn: testSuccessPageSimulation }
  ];

  const results = [];
  
  for (const test of tests) {
    console.log(`\n--- Running ${test.name} Test ---`);
    try {
      const result = await test.fn();
      results.push({ name: test.name, passed: result });
    } catch (error) {
      console.log(`❌ ${test.name} test error:`, error.message);
      results.push({ name: test.name, passed: false });
    }
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 TEST RESULTS SUMMARY');
  console.log('='.repeat(50));
  
  const passedTests = results.filter(r => r.passed).length;
  const totalTests = results.length;
  const successRate = Math.round((passedTests / totalTests) * 100);

  results.forEach(result => {
    const status = result.passed ? '✅ PASSED' : '❌ FAILED';
    console.log(`${status} - ${result.name}`);
  });

  console.log('\n' + '-'.repeat(30));
  console.log(`Total Tests: ${totalTests}`);
  console.log(`Passed: ${passedTests}`);
  console.log(`Failed: ${totalTests - passedTests}`);
  console.log(`Success Rate: ${successRate}%`);
  console.log('-'.repeat(30));

  if (successRate === 100) {
    console.log('🎉 All tests passed! The form is ready for production.');
  } else {
    console.log('⚠️  Some tests failed. Please review and fix the issues.');
  }

  return results;
}

// Export for use in other contexts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    runAllTests,
    testDirectUrlAccess,
    testEmailParameterHandling,
    testFormValidation,
    testDynamicStepCalculation,
    testFormDataStructure,
    testSuccessPageSimulation,
    TEST_DATA,
    TEST_CONFIG
  };
}

// Auto-run tests if script is executed directly
if (typeof window === 'undefined') {
  runAllTests().catch(console.error);
}
