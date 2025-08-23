import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
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

        const metrics: PerformanceMetrics = {
          loadTime: navigationEntry.loadEventEnd - navigationEntry.loadEventStart,
          firstContentfulPaint: fcp ? fcp.startTime : 0,
          largestContentfulPaint: lcp ? lcp.startTime : 0,
          cumulativeLayoutShift: cls,
          firstInputDelay: 0, // Would need to be measured with user interactions
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
      }
    };

    // Measure performance after page load
    if (document.readyState === 'complete') {
      measurePerformance();
    } else {
      window.addEventListener('load', measurePerformance);
    }

    return () => {
      window.removeEventListener('load', measurePerformance);
    };
  }, []);

  // This component doesn't render anything visible
  // It just monitors performance in the background
  return null;
};

export default PerformanceMonitor;
