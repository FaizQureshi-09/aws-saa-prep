import { FaExternalLinkAlt } from 'react-icons/fa';
import './SourceList.css';

/**
 * List of external references. Every link opens in a new tab with
 * `noopener noreferrer`.
 *
 * @param {object} props
 * @param {{ title: string, url: string }[]} props.sources
 */
export function SourceList({ sources }) {
  return (
    <ul className="source-list">
      {sources.map((source) => (
        <li key={source.url}>
          <a href={source.url} target="_blank" rel="noopener noreferrer" className="source-list__link">
            <span>{source.title}</span>
            <FaExternalLinkAlt aria-hidden="true" className="source-list__icon" />
          </a>
        </li>
      ))}
    </ul>
  );
}
