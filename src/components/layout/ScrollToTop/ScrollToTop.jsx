import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Handles scroll position on navigation: jumps to the element named by the
 * URL's in-page anchor (for example `/syllabus#priority`) when one exists,
 * otherwise resets to the top so a new page never opens mid-scroll.
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, hash]);

  return null;
}
