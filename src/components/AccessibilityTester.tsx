import { useEffect } from 'react';

interface AccessibilityViolation {
  id: string;
  impact: 'minor' | 'moderate' | 'serious' | 'critical';
  tags: string[];
  description: string;
  help: string;
  helpUrl: string;
  nodes: Array<{
    html: string;
    target: string[];
    failureSummary: string;
  }>;
}

interface AccessibilityReport {
  timestamp: string;
  violations: AccessibilityViolation[];
  passes: number;
  incomplete: number;
  inapplicable: number;
  totalChecks: number;
}

const AccessibilityTester = () => {
  useEffect(() => {
    // Only run in development
    if (process.env.NODE_ENV !== 'development') return;

    const runAccessibilityTest = async () => {
      try {
        // Import axe-core dynamically
        const axe = await import('axe-core');
        
        // Run accessibility analysis
        const results = await axe.run();
        
        const report: AccessibilityReport = {
          timestamp: new Date().toISOString(),
          violations: results.violations as AccessibilityViolation[],
          passes: results.passes.length,
          incomplete: results.incomplete.length,
          inapplicable: results.inapplicable.length,
          totalChecks: results.violations.length + results.passes.length + results.incomplete.length + results.inapplicable.length
        };

        // Log results
        console.group('🔍 ACCESSIBILITY AUDIT RESULTS');
        console.log('📊 Summary:', {
          violations: report.violations.length,
          passes: report.passes,
          incomplete: report.incomplete,
          inapplicable: report.inapplicable,
          totalChecks: report.totalChecks
        });

        if (report.violations.length === 0) {
          console.log('✅ No accessibility violations found!');
        } else {
          console.group('❌ Accessibility Violations:');
          report.violations.forEach((violation, index) => {
            console.group(`Violation ${index + 1}: ${violation.id}`);
            console.log('Impact:', violation.impact);
            console.log('Description:', violation.description);
            console.log('Help:', violation.help);
            console.log('Help URL:', violation.helpUrl);
            console.log('Tags:', violation.tags);
            console.log('Affected Elements:', violation.nodes.length);
            violation.nodes.forEach((node, nodeIndex) => {
              console.log(`  Node ${nodeIndex + 1}:`, node.html);
              console.log(`  Target:`, node.target);
              console.log(`  Failure:`, node.failureSummary);
            });
            console.groupEnd();
          });
          console.groupEnd();
        }

        console.groupEnd();

        // Store report for later analysis
        localStorage.setItem('accessibilityReport', JSON.stringify(report));

      } catch (error) {
        console.error('Accessibility test failed:', error);
      }
    };

    // Run test after page load
    const timer = setTimeout(runAccessibilityTest, 2000);

    return () => clearTimeout(timer);
  }, []);

  return null; // This component doesn't render anything
};

export default AccessibilityTester;
