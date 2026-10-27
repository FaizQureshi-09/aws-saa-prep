import './Badge.css';

const SOURCE_LABELS = {
  official: 'Official AWS sample',
  mock: 'Mock (original)',
};

/**
 * Badge stating where a practice question came from, so students always
 * know whether it is an AWS-authored sample or an original mock question.
 *
 * @param {object} props
 * @param {'official'|'mock'} props.source
 */
export function SourceBadge({ source }) {
  return <span className={`badge badge--source-${source}`}>{SOURCE_LABELS[source] ?? source}</span>;
}
