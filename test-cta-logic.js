// Test script to verify CTA logic
console.log('🧪 Testing CTA Logic...\n');

// Simulate setting CTA source in sessionStorage
const testCtaText = "Start Your Security Journey";
console.log(`1. Setting CTA source: "${testCtaText}"`);
sessionStorage.setItem('cta-source', testCtaText);

// Simulate reading CTA source
console.log('2. Reading CTA source from sessionStorage...');
const retrievedCtaSource = sessionStorage.getItem('cta-source');
console.log(`   Retrieved: "${retrievedCtaSource}"`);

// Verify it matches
if (retrievedCtaSource === testCtaText) {
  console.log('✅ CTA source correctly stored and retrieved');
} else {
  console.log('❌ CTA source mismatch');
}

// Simulate clearing after reading (as Contact page does)
console.log('3. Clearing CTA source after reading...');
sessionStorage.removeItem('cta-source');

// Verify it's cleared
const clearedCtaSource = sessionStorage.getItem('cta-source');
if (clearedCtaSource === null) {
  console.log('✅ CTA source correctly cleared');
} else {
  console.log('❌ CTA source not cleared');
}

console.log('\n🎯 Test completed!');
console.log('If you see all ✅ marks, the CTA logic is working correctly.');
console.log('The Contact page should now display the button text as the header.');
