import { useEffect, useState } from 'react';

interface BrowserInfo {
  name: string;
  version: string;
  userAgent: string;
  platform: string;
  language: string;
  cookieEnabled: boolean;
  onLine: boolean;
  javaEnabled: boolean;
  screenResolution: string;
  colorDepth: number;
  pixelDepth: number;
  viewportSize: string;
  windowSize: string;
}

interface FeatureSupport {
  es6: boolean;
  es2017: boolean;
  es2020: boolean;
  webp: boolean;
  webgl: boolean;
  canvas: boolean;
  localStorage: boolean;
  sessionStorage: boolean;
  indexedDB: boolean;
  serviceWorker: boolean;
  pushManager: boolean;
  geolocation: boolean;
  notifications: boolean;
  webAudio: boolean;
  webRTC: boolean;
  webAssembly: boolean;
  intersectionObserver: boolean;
  resizeObserver: boolean;
  mutationObserver: boolean;
  performanceObserver: boolean;
}

interface CrossBrowserReport {
  timestamp: string;
  browser: BrowserInfo;
  features: FeatureSupport;
  compatibility: {
    score: number;
    issues: string[];
    recommendations: string[];
  };
}

const CrossBrowserTester = () => {
  const [report, setReport] = useState<CrossBrowserReport | null>(null);

  useEffect(() => {
    // Only run in development
    if (process.env.NODE_ENV !== 'development') return;

    const detectBrowser = (): BrowserInfo => {
      const userAgent = navigator.userAgent;
      let browserName = 'Unknown';
      let browserVersion = 'Unknown';

      // Detect browser
      if (userAgent.includes('Chrome')) {
        browserName = 'Chrome';
        browserVersion = userAgent.match(/Chrome\/(\d+)/)?.[1] || 'Unknown';
      } else if (userAgent.includes('Firefox')) {
        browserName = 'Firefox';
        browserVersion = userAgent.match(/Firefox\/(\d+)/)?.[1] || 'Unknown';
      } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
        browserName = 'Safari';
        browserVersion = userAgent.match(/Version\/(\d+)/)?.[1] || 'Unknown';
      } else if (userAgent.includes('Edge')) {
        browserName = 'Edge';
        browserVersion = userAgent.match(/Edge\/(\d+)/)?.[1] || 'Unknown';
      } else if (userAgent.includes('MSIE') || userAgent.includes('Trident/')) {
        browserName = 'Internet Explorer';
        browserVersion = userAgent.match(/MSIE (\d+)/)?.[1] || userAgent.match(/rv:(\d+)/)?.[1] || 'Unknown';
      }

      return {
        name: browserName,
        version: browserVersion,
        userAgent: userAgent,
        platform: navigator.platform,
        language: navigator.language,
        cookieEnabled: navigator.cookieEnabled,
        onLine: navigator.onLine,
        javaEnabled: navigator.javaEnabled ? navigator.javaEnabled() : false,
        screenResolution: `${screen.width}x${screen.height}`,
        colorDepth: screen.colorDepth,
        pixelDepth: screen.pixelDepth,
        viewportSize: `${window.innerWidth}x${window.innerHeight}`,
        windowSize: `${window.outerWidth}x${window.outerHeight}`,
      };
    };

    const testFeatureSupport = (): FeatureSupport => {
      return {
        // ES6+ Features
        es6: typeof Promise !== 'undefined' && typeof Map !== 'undefined' && typeof Set !== 'undefined',
        es2017: typeof Object.entries !== 'undefined' && typeof Object.values !== 'undefined',
        es2020: typeof BigInt !== 'undefined' && typeof globalThis !== 'undefined',
        
        // Web APIs
        webp: (() => {
          const canvas = document.createElement('canvas');
          canvas.width = 1;
          canvas.height = 1;
          return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
        })(),
        webgl: (() => {
          try {
            const canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
          } catch (e) {
            return false;
          }
        })(),
        canvas: (() => {
          const canvas = document.createElement('canvas');
          return !!(canvas.getContext && canvas.getContext('2d'));
        })(),
        
        // Storage APIs
        localStorage: (() => {
          try {
            const test = 'test';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
          } catch (e) {
            return false;
          }
        })(),
        sessionStorage: (() => {
          try {
            const test = 'test';
            sessionStorage.setItem(test, test);
            sessionStorage.removeItem(test);
            return true;
          } catch (e) {
            return false;
          }
        })(),
        indexedDB: typeof window.indexedDB !== 'undefined',
        
        // Service Worker APIs
        serviceWorker: 'serviceWorker' in navigator,
        pushManager: 'PushManager' in window,
        
        // Other APIs
        geolocation: 'geolocation' in navigator,
        notifications: 'Notification' in window,
        webAudio: typeof window.AudioContext !== 'undefined' || typeof (window as any).webkitAudioContext !== 'undefined',
        webRTC: typeof window.RTCPeerConnection !== 'undefined',
        webAssembly: typeof WebAssembly !== 'undefined',
        
        // Observer APIs
        intersectionObserver: 'IntersectionObserver' in window,
        resizeObserver: 'ResizeObserver' in window,
        mutationObserver: 'MutationObserver' in window,
        performanceObserver: 'PerformanceObserver' in window,
      };
    };

    const calculateCompatibilityScore = (features: FeatureSupport): { score: number; issues: string[]; recommendations: string[] } => {
      const featureCount = Object.keys(features).length;
      const supportedFeatures = Object.values(features).filter(Boolean).length;
      const score = Math.round((supportedFeatures / featureCount) * 100);

      const issues: string[] = [];
      const recommendations: string[] = [];

      // Check critical features
      if (!features.es6) {
        issues.push('ES6 features not supported');
        recommendations.push('Consider using a polyfill for ES6 features');
      }

      if (!features.localStorage) {
        issues.push('LocalStorage not supported');
        recommendations.push('Consider using alternative storage methods');
      }

      if (!features.canvas) {
        issues.push('Canvas API not supported');
        recommendations.push('Consider using alternative rendering methods');
      }

      if (!features.webgl) {
        issues.push('WebGL not supported');
        recommendations.push('Consider using alternative graphics methods');
      }

      if (!features.intersectionObserver) {
        issues.push('IntersectionObserver not supported');
        recommendations.push('Consider using scroll event listeners as fallback');
      }

      return { score, issues, recommendations };
    };

    const generateReport = (): CrossBrowserReport => {
      const browser = detectBrowser();
      const features = testFeatureSupport();
      const compatibility = calculateCompatibilityScore(features);

      return {
        timestamp: new Date().toISOString(),
        browser,
        features,
        compatibility,
      };
    };

    const report = generateReport();
    setReport(report);

    // Log results
    console.group('🌐 CROSS-BROWSER COMPATIBILITY REPORT');
    console.log('📊 Browser Info:', report.browser);
    console.log('🔧 Feature Support:', report.features);
    console.log('📈 Compatibility Score:', `${report.compatibility.score}%`);
    
    if (report.compatibility.issues.length > 0) {
      console.group('⚠️ Compatibility Issues:');
      report.compatibility.issues.forEach((issue, index) => {
        console.log(`${index + 1}. ${issue}`);
      });
      console.groupEnd();
    }

    if (report.compatibility.recommendations.length > 0) {
      console.group('💡 Recommendations:');
      report.compatibility.recommendations.forEach((rec, index) => {
        console.log(`${index + 1}. ${rec}`);
      });
      console.groupEnd();
    }

    console.groupEnd();

    // Store report for later analysis
    localStorage.setItem('crossBrowserReport', JSON.stringify(report));

  }, []);

  return null; // This component doesn't render anything
};

export default CrossBrowserTester;

