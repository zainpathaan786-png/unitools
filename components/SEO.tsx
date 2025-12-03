
import React, { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  keywords?: string;
  image?: string;
  breadcrumbs?: Array<{ name: string; item: string }>;
}

export const SEO: React.FC<SEOProps> = ({ 
  title, 
  description, 
  canonical = 'https://unitools.ai', 
  keywords,
  image = 'https://unitools.ai/og-image.jpg',
  breadcrumbs = []
}) => {
  const siteTitle = "UniTools";
  const fullTitle = title === siteTitle ? title : `${title} - ${siteTitle}`;
  
  // Base WebApplication Schema
  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "UniTools",
    "url": canonical,
    "description": description,
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  // BreadcrumbList Schema
  const breadcrumbSchema = breadcrumbs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.item
    }))
  } : null;

  useEffect(() => {
    // Update Title
    document.title = fullTitle;

    // Helper to update meta tags
    const updateMeta = (name: string, content: string, attribute: 'name' | 'property' = 'name') => {
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Update Standard Meta
    updateMeta('description', description);
    if (keywords) updateMeta('keywords', keywords);

    // Update OG Meta
    updateMeta('og:title', fullTitle, 'property');
    updateMeta('og:description', description, 'property');
    updateMeta('og:url', canonical, 'property');
    updateMeta('og:image', image, 'property');
    updateMeta('og:type', 'website', 'property');

    // Update Twitter Meta
    updateMeta('twitter:card', 'summary_large_image', 'name');
    updateMeta('twitter:title', fullTitle, 'name');
    updateMeta('twitter:description', description, 'name');
    updateMeta('twitter:image', image, 'name');

    // Update Canonical Link
    let link = document.querySelector("link[rel='canonical']");
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', canonical);

    // Update Structured Data (Web App)
    let scriptApp = document.getElementById('schema-webapp');
    if (!scriptApp) {
        scriptApp = document.createElement('script');
        scriptApp.id = 'schema-webapp';
        scriptApp.setAttribute('type', 'application/ld+json');
        document.head.appendChild(scriptApp);
    }
    scriptApp.textContent = JSON.stringify(webAppSchema);

    // Update Structured Data (Breadcrumbs)
    if (breadcrumbSchema) {
        let scriptBread = document.getElementById('schema-breadcrumbs');
        if (!scriptBread) {
            scriptBread = document.createElement('script');
            scriptBread.id = 'schema-breadcrumbs';
            scriptBread.setAttribute('type', 'application/ld+json');
            document.head.appendChild(scriptBread);
        }
        scriptBread.textContent = JSON.stringify(breadcrumbSchema);
    }

  }, [fullTitle, description, keywords, canonical, image, webAppSchema, breadcrumbSchema]);

  return null;
};
