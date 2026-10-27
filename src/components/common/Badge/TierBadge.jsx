import { tierById } from '../../../data/categoriesData';
import './Badge.css';

/**
 * Colored pill showing a study-priority tier (Critical / High / Medium / Low).
 *
 * @param {object} props
 * @param {'critical'|'high'|'medium'|'low'} props.tier
 */
export function TierBadge({ tier }) {
  const meta = tierById[tier];
  return <span className={`badge badge--tier-${tier}`}>{meta ? meta.label : tier}</span>;
}
