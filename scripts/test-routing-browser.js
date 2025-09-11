/**
 * Browser-based routing test
 * 
 * This script can be run in the browser console to test routing functionality
 * Copy and paste this into the browser console on any page
 */

// Test routing functions
function testRouting() {
  console.log('🧪 Testing Routing Functions in Browser\n');
  
  // Test getBasePath
  try {
    const { getBasePath, buildUrl, getEnvironment } = window;
    if (!getBasePath || !buildUrl || !getEnvironment) {
      console.error('❌ Routing functions not available. Make sure you are on the correct page.');
      return false;
    }
    
    console.log('📍 Current Environment Info:');
    console.log('   Hostname:', window.location.hostname);
    console.log('   Pathname:', window.location.pathname);
    console.log('   Hash:', window.location.hash);
    console.log('   Full URL:', window.location.href);
    
    const basePath = getBasePath();
    const environment = getEnvironment();
    
    console.log('   Base Path:', basePath);
    console.log('   Environment:', environment);
    
    // Test buildUrl for different routes
    const routes = ['', 'about', 'contact'];
    console.log('\n🔗 Testing buildUrl() for different routes:');
    
    for (const route of routes) {
      const url = buildUrl(route);
      console.log(`   buildUrl('${route}'): ${url}`);
    }
    
    // Test TriggerHandlers.contactForm
    console.log('\n📞 Testing TriggerHandlers.contactForm:');
    if (window.TriggerHandlers && window.TriggerHandlers.contactForm) {
      console.log('   ✅ TriggerHandlers.contactForm is available');
      console.log('   Testing with CTA source: "Test CTA"');
      
      // Store original location
      const originalHref = window.location.href;
      
      // Test the function (but don't actually navigate)
      try {
        // Mock window.location.href to prevent actual navigation
        let testUrl = '';
        Object.defineProperty(window.location, 'href', {
          get: () => testUrl,
          set: (value) => {
            testUrl = value;
            console.log(`   🧭 Would navigate to: ${value}`);
          }
        });
        
        window.TriggerHandlers.contactForm('Test CTA');
        
        // Restore original location
        Object.defineProperty(window.location, 'href', {
          get: () => originalHref,
          set: (value) => { window.location.href = value; }
        });
        
        console.log('   ✅ TriggerHandlers.contactForm executed successfully');
      } catch (error) {
        console.error('   ❌ Error testing TriggerHandlers.contactForm:', error);
      }
    } else {
      console.log('   ❌ TriggerHandlers.contactForm not available');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error testing routing:', error);
    return false;
  }
}

// Test CTA buttons
function testCTAButtons() {
  console.log('\n🔘 Testing CTA Buttons:');
  
  // Find all buttons with onClick handlers that call TriggerHandlers.contactForm
  const buttons = document.querySelectorAll('button');
  let ctaButtonsFound = 0;
  
  buttons.forEach((button, index) => {
    const onclick = button.getAttribute('onclick');
    const text = button.textContent?.trim();
    
    if (text && (text.includes('Get In Touch') || text.includes('Book') || text.includes('Schedule') || text.includes('Start'))) {
      ctaButtonsFound++;
      console.log(`   Button ${index + 1}: "${text}"`);
      console.log(`   onClick: ${onclick || 'No onclick attribute'}`);
      
      // Check if it has a click handler
      if (button.onclick) {
        console.log(`   ✅ Has click handler`);
      } else {
        console.log(`   ⚠️  No click handler detected`);
      }
    }
  });
  
  console.log(`\n📊 Found ${ctaButtonsFound} potential CTA buttons`);
  
  if (ctaButtonsFound === 0) {
    console.log('   ⚠️  No CTA buttons found. Make sure the page is fully loaded.');
  }
}

// Main test function
function runBrowserTests() {
  console.log('🚦 BROWSER ROUTING TEST SUITE');
  console.log('==============================\n');
  
  const routingTest = testRouting();
  testCTAButtons();
  
  console.log('\n🏁 Test Summary:');
  console.log('================');
  
  if (routingTest) {
    console.log('✅ Routing functions are working');
  } else {
    console.log('❌ Routing functions have issues');
  }
  
  console.log('\n💡 To test a specific CTA button, click it and check the console for logs.');
  console.log('💡 Look for messages starting with 🚀, 💾, 🧭, or 🔄');
}

// Run tests
runBrowserTests();
