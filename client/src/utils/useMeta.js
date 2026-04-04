import { useEffect } from 'react';

/**
 * Dynamically updates <title> and OG meta tags for each report page.
 * Since this is a SPA, crawlers won't see these tags unless you add SSR later —
 * but sharing the link directly still works and the title updates in the browser tab.
 */
const useMeta = ({ title, description, imageUrl }) => {
  useEffect(() => {
    // Update document title
    if (!title) return;
    if (title) document.title = title;

    // Helper to set a meta tag by attribute
    const setMeta = (attr, value, content) => {
      let el = document.querySelector(`meta[${attr}="${value}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, value);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    if (description) {
      setMeta('name', 'description', description);
      setMeta('property', 'og:description', description);
      setMeta('name', 'twitter:description', description);
    }

    if (title) {
      setMeta('property', 'og:title', title);
      setMeta('name', 'twitter:title', title);
    }

    if (imageUrl) {
      setMeta('property', 'og:image', imageUrl);
      setMeta('name', 'twitter:image', imageUrl);
    }

    // Set canonical URL
    setMeta('property', 'og:url', window.location.href);

    // Cleanup — reset to defaults when component unmounts
    return () => {
      document.title = 'Developer Portfolio Evaluator';
    };
  }, [title, description, imageUrl]);
};

export default useMeta;
