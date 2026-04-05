import { useEffect } from 'react';

const useMeta = ({ title, description, imageUrl } = {}) => {
  useEffect(() => {
    if (!title) return;

    document.title = title;

    const setMeta = (attr, value, content) => {
      if (!content) return;
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
    }
    setMeta('property', 'og:title', title);
    if (imageUrl) setMeta('property', 'og:image', imageUrl);
    setMeta('property', 'og:url', window.location.href);

    return () => { document.title = 'Developer Portfolio Evaluator'; };
  }, [title, description, imageUrl]);
};

export default useMeta;
