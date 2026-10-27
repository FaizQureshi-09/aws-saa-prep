import { useActiveSection } from '../../hooks/useActiveSection';

/** Ordered sections of a service page, matching the numbering used in the headings. */
export const serviceSections = [
  { id: 'introduction', number: 1, label: 'Introduction' },
  { id: 'use-cases', number: 2, label: 'Use cases' },
  { id: 'importance', number: 3, label: 'Importance' },
  { id: 'cli', number: 4, label: 'CLI commands' },
  { id: 'sdk', number: 5, label: 'SDK' },
  { id: 'examples', number: 6, label: 'Examples' },
  { id: 'flow-diagram', number: 7, label: 'Flow diagram' },
  { id: 'question-types', number: 8, label: 'Question types' },
  { id: 'questions', number: 9, label: 'Practice questions' },
  { id: 'cheat-sheet', number: 10, label: 'Key facts & traps' },
  { id: 'related', number: 11, label: 'Related services' },
  { id: 'sources', number: 12, label: 'Sources' },
  { id: 'answer-key', number: 13, label: 'Answer key' },
];

/**
 * Sticky table of contents for a service page with scroll-spy highlighting.
 * @param {{ contentKey: string }} props - service id, used to re-attach the observer on navigation
 */
export function ServiceToc({ contentKey }) {
  const activeId = useActiveSection(
    serviceSections.map((section) => section.id),
    contentKey
  );

  return (
    <nav className="service-toc no-print" aria-label="On this page">
      <p className="service-toc__title">On this page</p>
      <ol className="service-toc__list">
        {serviceSections.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className={`service-toc__link ${activeId === section.id ? 'service-toc__link--active' : ''}`}
              onClick={(event) => {
                // HashRouter owns the URL hash, so scroll manually instead of changing it.
                event.preventDefault();
                document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            >
              <span>{section.number}</span>
              {section.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
