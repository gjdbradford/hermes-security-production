import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOData {
  title: string;
  description: string;
  keywords: string;
  canonical: string;
  ogImage: string;
  twitterImage: string;
  structuredData?: object;
}

interface SEOOptimizerProps {
  data: SEOData;
  pageType?: 'home' | 'services' | 'about' | 'contact';
}

const SEOOptimizer = ({ data, pageType = 'home' }: SEOOptimizerProps) => {
  useEffect(() => {
    // Track page view for analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        page_title: data.title,
        page_location: data.canonical,
        custom_map: {
          'custom_dimension1': pageType,
          'custom_dimension2': 'user_region'
        }
      });
    }

    // Track page view event
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: data.title,
        page_location: data.canonical,
        page_type: pageType
      });
    }
  }, [data.title, data.canonical, pageType]);

  const generateStructuredData = () => {
    const baseStructuredData = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": data.title,
      "description": data.description,
      "url": data.canonical,
      "mainEntity": {
        "@type": "Organization",
        "name": "Hermes Security",
        "url": "https://www.hermessecurity.io",
        "logo": "/images/logos/logo.svg",
        "description": "AI-accelerated penetration testing with ethical human oversight for European enterprises",
        "foundingDate": "2024",
        "address": {
          "@type": "PostalAddress",
          "addressRegion": "Europe",
          "addressCountry": "EU"
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "customer service",
          "email": "contact@hermessecurity.io"
        },
        "sameAs": [
          "https://linkedin.com/company/hermes-security",
          "https://twitter.com/hermessecurity"
        ]
      }
    };

    return data.structuredData || baseStructuredData;
  };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{data.title}</title>
      <meta name="title" content={data.title} />
      <meta name="description" content={data.description} />
      <meta name="keywords" content={data.keywords} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={data.canonical} />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={data.canonical} />
      <meta property="og:title" content={data.title} />
      <meta property="og:description" content={data.description} />
      <meta property="og:image" content={data.ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={data.title} />
      <meta property="og:site_name" content="Hermes Security" />
      <meta property="og:locale" content="en_GB" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@hermessecurity" />
      <meta name="twitter:creator" content="@hermessecurity" />
      <meta name="twitter:title" content={data.title} />
      <meta name="twitter:description" content={data.description} />
      <meta name="twitter:image" content={data.twitterImage} />
      <meta name="twitter:image:alt" content={data.title} />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(generateStructuredData())}
      </script>
      
      {/* Additional SEO Meta Tags */}
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      
      {/* Language and Region */}
      <meta name="language" content="English" />
      <meta name="geo.region" content="EU" />
      <meta name="geo.placename" content="Europe" />
      <meta name="geo.position" content="52.3676;4.9041" />
      <meta name="ICBM" content="52.3676, 4.9041" />
    </Helmet>
  );
};

export default SEOOptimizer;

