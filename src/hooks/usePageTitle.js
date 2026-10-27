import { useEffect } from 'react';

const BASE_TITLE = 'AWS SAA-C03 Prep Suite';

/**
 * Sets the browser tab title for the current page and restores the base
 * title when the page unmounts.
 *
 * @param {string} [title] - page-specific title; omit for the base title
 */
export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | ${BASE_TITLE}` : BASE_TITLE;
    return () => {
      document.title = BASE_TITLE;
    };
  }, [title]);
}
