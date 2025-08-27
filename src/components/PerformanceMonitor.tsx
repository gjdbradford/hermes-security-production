import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  animationStatus: {
    heroBackgroundAnimation: boolean;
    logoHoverAnimation: boolean;
    subtleFloatAnimation: boolean;
  };
}

const PerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);

  useEffect(() => {
    const measurePerformance = () => {
      if ('performance' in window && 'getEntriesByType' in performance) {
        const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const paintEntries = performance.getEntriesByType('paint');
        const layoutShiftEntries = performance.getEntriesByType('layout-shift');

        const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
        const lcp = performance.getEntriesByType('largest-contentful-paint')[0] as PerformanceEntry;
        const cls = layoutShiftEntries.reduce((sum, entry) => sum + (entry as any).value, 0);

        // Test animation status
        const testAnimations = () => {
          const heroBackground = document.querySelector('.animate-subtle-float');
          const logo = document.querySelector('img[src="/images/logos/logo.svg"]');
          
          return {
            heroBackgroundAnimation: !!heroBackground,
            logoHoverAnimation: !!logo && logo.classList.contains('hover:scale-110'),
            subtleFloatAnimation: !!heroBackground && getComputedStyle(heroBackground).animationName !== 'none'
          };
        };

        const metrics: PerformanceMetrics = {
          loadTime: navigationEntry.loadEventEnd - navigationEntry.loadEventStart,
          firstContentfulPaint: fcp ? fcp.startTime : 0,
          largestContentfulPaint: lcp ? lcp.startTime : 0,
          cumulativeLayoutShift: cls,
          firstInputDelay: 0, // Would need to be measured with user interactions
          animationStatus: testAnimations()
        };

        setMetrics(metrics);

        // Log performance issues to console for debugging
        if (metrics.loadTime > 3000) {
          console.warn('Performance Warning: Page load time is slow:', metrics.loadTime + 'ms');
        }
        if (metrics.firstContentfulPaint > 1800) {
          console.warn('Performance Warning: First Contentful Paint is slow:', metrics.firstContentfulPaint + 'ms');
        }
        if (metrics.cumulativeLayoutShift > 0.1) {
          console.warn('Performance Warning: High Cumulative Layout Shift:', metrics.cumulativeLayoutShift);
        }

        // Log animation status
        console.group('🎨 ANIMATION STATUS CHECK');
        console.log('Hero Background Animation:', metrics.animationStatus.heroBackgroundAnimation ? '✅ Active' : '❌ Not Found');
        console.log('Logo Hover Animation:', metrics.animationStatus.logoHoverAnimation ? '✅ Active' : '❌ Not Found');
        console.log('Subtle Float Animation:', metrics.animationStatus.subtleFloatAnimation ? '✅ Active' : '❌ Not Found');
        
        if (!metrics.animationStatus.heroBackgroundAnimation) {
          console.warn('⚠️ Hero background animation element not found. Check if .animate-subtle-float class is applied.');
        }
        if (!metrics.animationStatus.subtleFloatAnimation) {
          console.warn('⚠️ Subtle float animation not running. Check CSS animation definition.');
        }
        console.groupEnd();
      }
    };

    // Measure performance after page load
    if (document.readyState === 'complete') {
      measurePerformance();
    } else {
      window.addEventListener('load', measurePerformance);
    }

    // Additional animation test after a delay
    const animationTestTimeout = setTimeout(() => {
      const heroBackground = document.querySelector('.animate-subtle-float');
      if (heroBackground) {
        const computedStyle = getComputedStyle(heroBackground);
        const animationName = computedStyle.animationName;
        const animationDuration = computedStyle.animationDuration;
        
        console.group('🎬 DETAILED ANIMATION TEST');
        console.log('Animation Name:', animationName);
        console.log('Animation Duration:', animationDuration);
        console.log('Animation State:', heroBackground.getAnimations().length > 0 ? '✅ Running' : '❌ Not Running');
        
        if (heroBackground.getAnimations().length === 0) {
          console.error('❌ No animations found on hero background element');
          console.log('Element classes:', heroBackground.className);
          console.log('Computed styles:', {
            animation: computedStyle.animation,
            animationName: computedStyle.animationName,
            animationDuration: computedStyle.animationDuration,
            animationTimingFunction: computedStyle.animationTimingFunction
          });
        }
        console.groupEnd();
      } else {
        console.error('❌ Hero background element with .animate-subtle-float class not found');
      }
    }, 2000); // Test after 2 seconds

    return () => {
      window.removeEventListener('load', measurePerformance);
      clearTimeout(animationTestTimeout);
    };
  }, []);

  // This component doesn't render anything visible
  // It just monitors performance in the background
  return null;
};

export default PerformanceMonitor;
