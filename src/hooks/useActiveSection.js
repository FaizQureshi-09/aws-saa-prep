import { useEffect, useState } from 'react';

/**
 * Tracks which in-page section is currently most visible in the viewport
 * using an IntersectionObserver, so a table of contents can highlight the
 * active link as the user scrolls.
 *
 * @param {string[]} sectionIds - ordered list of section element ids to watch
 * @param {unknown} [resetKey] - changes when the page content changes, re-attaching observers
 * @returns {string} id of the currently active section
 */
export function useActiveSection(sectionIds, resetKey) {
  const [activeSectionId, setActiveSectionId] = useState(sectionIds[0] ?? '');
  const idsSignature = sectionIds.join('|');

  useEffect(() => {
    const sectionElements = idsSignature
      .split('|')
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (sectionElements.length === 0) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length === 0) {
          // Scrolled back above the first section: highlight the first link again.
          if (sectionElements[0].getBoundingClientRect().top > window.innerHeight * 0.3) {
            setActiveSectionId(sectionElements[0].id);
          }
          return;
        }

        const topEntry = visibleEntries.reduce((best, entry) =>
          entry.boundingClientRect.top < best.boundingClientRect.top ? entry : best
        );

        setActiveSectionId(topEntry.target.id);
      },
      {
        rootMargin: '-15% 0px -70% 0px',
        threshold: [0, 1],
      }
    );

    sectionElements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [idsSignature, resetKey]);

  return activeSectionId;
}
